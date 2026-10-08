---
title: 从踩坑到设计：我给交易系统搭 Spring Security + JWT 认证的全程记录
date: "2026-05-26"  
category: 技术  
description: 交易系统认证模块从搭建到排坑的全过程记录：依赖选型、SecurityConfig 的两个坑、JWT 配合 Redis 的会话设计，以及三类"看不懂的认证失败"的排查与反思。  
draft: false
---

最近在做一个基于 Spring Boot 的数字商业交易平台，认证这块踩了不少坑，也做了几个值得记录的设计决策。这篇文章按时间线把这些整理下来——既是复盘，也希望帮到同样在 Spring Security 6.x 上挣扎的人。

## 一、选型：java-jwt，以及一个认知误区

JWT 库我选了 auth0 的 `java-jwt`，不是更常见的 jjwt。原因很简单：它的 API 直白，`sign` 和 `verify` 就两个核心方法，不用堆一长串 builder。选型这种事，适合自己的就是最好的。

这里有个当时让我踩坑的认知误区：**Spring Security 本身根本不带 JWT 实现**。我一开始以为加个 `spring-security-jwt` 依赖就齐活了，结果它是 Spring 老版本的 JWT 模块，早就停止维护了，跟 `java-jwt` 共存时直接类冲突，启动报 `ClassNotFoundException`。

删掉 `spring-security-jwt`，只留 `com.auth0:java-jwt`，世界清静了。记住这句话：**Spring Security 只负责认证授权的流程框架，Token 的生成和校验逻辑全部要自己写或引第三方库。**

## 二、配置：抽一个 TokenConfig

我把 Token 相关的配置抽成了独立配置类，用 `@ConfigurationProperties` 注入：

```yaml
# application.yml
token:
  header: Authorization      # 前端把 token 放在这个请求头里
  secret: xxxxxxxxxxxx       # 签名密钥（生产环境必须用高强度随机密钥，弱密钥会被爆破）
  expireTime: 120            # 过期时间，单位分钟
```

```java
@Component
@ConfigurationProperties(prefix = "token")
public class TokenConfig {
    private String header;
    private String secret;
    private Integer expireTime;
    // getter / setter 省略
}
```

好处是后面改配置不用动代码——比如以后管理端和移动端要区分过期时间，加个配置项就行。

## 三、SecurityConfig：两个必踩的坑

Spring Security 6.x 和 5.x 的写法差别巨大：5.x 是重写 `configure(HttpSecurity)` 的链式调用，6.x 改成了 Lambda 风格，`WebSecurityConfigurerAdapter` 直接被废弃。我照着旧博客抄，编译都过不去，最后老老实实按官方文档重写。下面这两个坑，是重写过程中印象最深的。

### 坑1：CSRF 没关，登录直接 403

一开始我没动 CSRF 配置，登录请求直接被拦，后端日志报 `Invalid CSRF token found`，前端拿到的是个看不懂的 HTML 错误页。

后来想明白了 CSRF 防护的本质：**防止浏览器自动携带 Cookie 被冒充提交请求**。而我们前后端分离，根本不用 Cookie——token 是前端 JS 主动塞进请求头的，第三方站点拿不到也塞不进去，CSRF 防护在这个架构下没有意义。所以直接关掉：

```java
http.csrf(csrf -> csrf.disable());
```

### 坑2：Session 没关，JSESSIONID 捣乱

刚跑通登录时，响应里除了 JWT 还多了一个 `Set-Cookie: JSESSIONID`。一开始没在意，后来发现部分接口 Spring Security 还是从 Session 里取认证信息，把我 JWT 过滤器设置的认证状态覆盖了。

解决方式是明确告诉 Spring Security"别创建 Session"：

```java
http.sessionManagement(session ->
    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
```

这两行配完，整个认证链路才是真正的"无状态"，JWT 才算名副其实。

## 四、核心设计：JWT 为什么必须配合 Redis

### 4.1 纯 JWT 的三个无解问题

只把用户信息塞进 JWT 载荷发出去，架构上是过不了关的：

1. **无法主动失效**：JWT 签发后在过期前永远有效。用户改密码、被封号、被踢下线，旧 token 照样能用
2. **无法续期**：`exp` 字段签发时写死，要么让用户频繁重登，要么把有效期设超长（更不安全）
3. **载荷不能太大**：权限列表、角色、用户信息全塞进去，token 会非常长，每个请求都带一遍

结论：必须配一个**服务端可控的状态存储**。Redis 是最合适的选择——内存数据库、读写快、自带过期机制。

### 4.2 我存的是什么：JWT 只放 UUID，详情进 Redis

我的方案：JWT 的载荷里只放一个 UUID（去掉横线的 32 位字符串），用户的详细信息（用户实体、权限集合、登录时间、过期时间）全部存在 Redis：

```
Redis key:   login_tokens:{UUID}
Redis value: LoginUserDetail 对象（序列化后的 JSON）
```

这里藏着一个我印象最深的安全坑：`LoginUserDetail` 实现了 `UserDetails` 接口，一开始我没处理密码字段，排查一个无关问题时才发现 **Redis 里居然明文存着用户密码**。解决方式是在 `getPassword()` 上加 `@JsonIgnore`，序列化时把密码剔除。

这件事给我的教训是：**任何往 Redis / 日志 / 响应里写的数据，都要过一遍"这里有没有敏感信息"的检查**。

### 4.3 为什么用 UUID 不用 userId 做标识

这是个容易被忽略的设计点。如果 JWT 里放 userId：

- 同一用户多设备登录，token 指向同一个 Redis key，**无法区分设备**
- 想做"单设备登录限制"（挤掉旧登录）会很别扭

用 UUID，每次登录都生成新标识，各设备有各自的 key。以后想做"踢 A 保 B"，删掉 A 对应的 Redis key 就行——**主动失效的能力，就是这么从"不可能"变成"一行代码"的**。

### 4.4 双层过期 + 自动续期

过期控制有两层：

- **JWT 自身过期**（30 分钟）：兜底层。万一 Redis 挂了或数据被误删，JWT 自己的 `exp` 还能挡一下
- **Redis TTL**（120 分钟）：真正控制会话生命周期

自动续期的逻辑在 JWT 过滤器里：每次请求校验完 token，检查 Redis 里会话的剩余时间，**不足 20 分钟就自动续期**。这样用户只要持续活跃就不会被登出，而闲置超过时限自然过期——体验和安全的平衡点。

## 五、三类"看不懂的认证失败"

这部分是踩坑重灾区。前后端分离场景下，Spring Security 的很多默认行为是给传统模板页面设计的，直接用全是坑。

### 场景一：密码错误，返回的却是一坨堆栈

前端调登录接口，密码输错，我期待的是 `{code: 401, msg: "密码错误"}`，实际返回的是一长串异常堆栈。

原因：`AuthenticationManager.authenticate()` 抛出 `BadCredentialsException`，没被接住时走 Spring Security 默认的失败处理——**跳转到登录失败页面**。前后端分离下这个"跳转"毫无意义，前端拿到 302 跟一个 HTML。

解决：在登录逻辑里显式接住，再交给全局异常处理器返回标准 JSON：

```java
try {
    authentication = authenticationManager.authenticate(authToken);
} catch (BadCredentialsException e) {
    throw new BusinessException("用户名或密码错误");
} catch (DisabledException e) {
    throw new BusinessException("用户已被禁用");
}
```

有个细节我后来复盘时自己笑了：`BadCredentialsException` 分支其实是 catch 完又抛出去给全局处理器，等于啥也没干。但保留这个显式分支是有意义的——它明确了"这个异常是预期的业务分支"，也让不同异常类型对应不同提示文案。**代码有时候不只是给机器看的。**

### 场景二：token 过期，前端拿到的是 HTML

token 失效后访问接口，返回的是一段 HTML，前端 axios 直接 JSON 解析失败，用户只看到"系统异常"，根本不知道是登录过期了。

原因：Spring Security 默认的 `AuthenticationEntryPoint` 实现是 `LoginUrlAuthenticationEntryPoint`，干的事是 `sendRedirect()` 跳登录页。前后端分离场景完全没法用。

解决：自定义 EntryPoint，统一返回 JSON：

```java
@Component
public class AuthenticationEntryPointImpl implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException {
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write(
            "{\"code\": 401, \"msg\": \"登录状态已过期，请重新登录\"}");
    }
}
```

写完之后我复盘出两个自己当时没做对的地方，也是这篇文章里最想留给读者的：

1. **HTTP 状态码应该用 401 而不是 200**。当时图省事全返回 200 让前端只看 body，但这混淆了"业务异常"和"认证异常"——前端拦截器没法靠状态码统一处理"跳登录"逻辑
2. **错误语义应该细分**：token 过期、token 无效、未携带 token，都应该归到 401，但可以带不同的业务错误码，前端才能给出精确提示

### 场景三：没登录直接访问接口

表现和场景二几乎一样，但触发条件不同：这次是压根没带 token（比如用户直接在浏览器敲了一个受保护接口的 URL）。

原因：JWT 过滤器发现请求头没有 token，什么都不做直接放行；请求走到授权检查时发现 `SecurityContext` 里没有认证信息，抛 `AuthenticationException`——又被默认的 EntryPoint 接走跳 HTML。

这个和场景二是同一个修复点，自定义 `AuthenticationEntryPointImpl` 之后两类问题一起解决。

### 一个让我迷惑很久的问题：为什么是 403 不是 401

有一次访问受保护接口，返回的不是 401 而是 403 Forbidden。排查了很久才把这两个状态码的语义彻底分清：

- **401（Unauthorized）**：还没认证——系统不知道你是谁
- **403（Forbidden）**：认证成功——系统知道你是谁，但你没权限

那次是 JWT 过滤器设置了认证信息，但用户的权限集合是空的，走到 `@PreAuthorize` 权限校验时被拒。**"认证成功但授权失败"，所以是 403。** 把这组语义吃透之后，后面的认证报错就再也没有让我懵过。

## 六、一个隐蔽的边缘场景：Redis 挂了

上线后某次 Redis 服务不可用，登录接口直接 500，抛 `RedisConnectionFailureException`——而且这个异常没被全局异常处理器接住，前端拿到的是一坨原始错误。

修复：JWT 过滤器里专门 catch 这个异常，返回明确的"系统繁忙"错误码，而不是裸 500。

这类问题的价值不在技术本身，而在于提醒我：**任何引入的基础设施（Redis、MQ、ES）都是新的故障源**，设计时要问自己一句"它挂了会怎样"。

## 复盘：这次实践教会我的

1. **框架升级要看官方文档，旧博客会骗人**（5.x → 6.x 的重写之痛）
2. **无状态架构里，每一层"默认行为"都要重新审视**——CSRF、Session、EntryPoint，Spring Security 的默认值都是为传统架构设计的
3. **JWT 不是"更高级的 Session"，它是把状态管理从服务端转移给了客户端**——代价就是主动失效能力，所以需要 Redis 补回来
4. **敏感数据要有"出口检查"意识**——密码进 Redis 这种问题，测试环境很难发现，但一旦带上生产就是事故
5. **排查认证问题先分清 401 / 403**——一个是"你是谁"，一个是"你没有权限"
