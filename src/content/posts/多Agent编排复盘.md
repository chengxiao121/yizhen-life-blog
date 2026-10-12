---
title: 多Agent 模拟面试：AI 模拟面试官的编排复盘
date: "2026-10-04"
category: 技术
description: AI 模拟面试官的多 Agent 编排设计复盘：Agent ＋函数的分工、并行分析串行面试的编排图，以及「编排管时序，数据走数据库」的取舍
draft: false
---
求职者把简历、目标岗位 JD、甚至本地项目代码交给系统，系统先用多个分析 Agent 并行"摸底"——分析简历的亮点、JD 的考点、代码的技术栈和风险点——生成一份《面试计划》，然后由面试官 Agent 按计划逐轮出题、追问、点评，每道题的回答由独立的评估官打分落库，评估结果当场影响下一题的难度，最后输出一份带证据链的《面试评估报告》。

这篇文章回顾多 Agent 架构的决策过程。

## 一、角色设计：先决定什么配成为 Agent

动手之前我先定了一条纪律：**有工具循环的才配叫 Agent，没有循环、输入固定、输出就是结构化 JSON 的，就是普通函数。**

| 角色     | 名字                             | 职责                              |
| ------ | ------------------------------ | ------------------------------- |
| 意图路由器  | intent-router（LlmRoutingAgent） | 分诊台：判断这条消息是"带资料的分析型面试"还是普通面试对话  |
| JD 分析官 | jd-analyzer（ReactAgent）        | 读 JD 文本，提炼考点清单落库                |
| 简历分析官  | resume-analyzer（ReactAgent）    | 读简历，提炼项目/技能清单落库                 |
| 代码分析官  | code-analyzer（ReactAgent）      | 通过 MCP 只读工具翻代码，提炼技术栈/风险点/可追问点落库 |
| 面试官    | interviewer（ReactAgent）        | 出题、追问、点评、转述评估结果                 |

三个普通函数是：面试计划生成（InterviewPlanService）、答案评估官（AnswerEvaluatorService）、评估报告生成（AssessmentReportService）。它们输入固定、输出就是一段结构化 JSON，中间不需要翻工具、不需要多步推理——做成 Agent 纯属浪费，还多一层不确定性。

## 二、路由：能不问大模型就不问

意图路由的第一反应是"每条消息都丢给路由 Agent 判断"。但路由调用也是一次 LLM 调用，贵且慢，而大量消息根本不需要判断。所以我在 LLM 路由前面加了规则前置，组成"三道关口"：

```java
// AgentRouter.chat() —— 三道关口
// 第一道：该会话已分析过资料且本条没提新资料 → 必然是继续面试，直连面试官
if (codeProfileRepository.existsBySessionId(sessionId) && materials.isEmpty()) {
    return interviewer.chat(userMessage, sessionId, candidateId);
}
// 第二道：消息明确提到资料（路径/扩展名/关键词）→ 直接进资料流水线，跳过路由 LLM
if (!materials.isEmpty()) {
    return materialInterviewPipeline.chat(userMessage, sessionId, candidateId);
}
// 第三道：规则没认出，交给 LlmRoutingAgent 二选一（拿不准 → fallback 到 interviewer）
```

能确定答案的便宜事，不花路由调用。真正走到第三道的消息，才是"拿不准该问谁"的。

**这里踩过一个经典坑**：检测消息是否提到"JD"用的是子串匹配，结果候选人回答里的一句"JDK 提供的工具类"被当成"提到了 JD 资料"，整个对话被错误地送进了资料流水线。修复方式是负向预查：

```java
Pattern.compile("JD(?!(K|BC))")
```

## 三、编排图：并行摸底，串行开考

带资料的面试是一个典型的"先并行收集、再串行对话"结构。我用 Spring AI Alibaba 的 ParallelAgent / SequentialAgent 搭了两层编排图：

```java
// MaterialInterviewPipeline.build()
Agent analysisStage = analyzers.size() == 1
    ? analyzers.get(0)
    : ParallelAgent.builder()
        .subAgents(analyzers)
        .mergeStrategy(new ConcatenationMergeStrategy("\n\n"))
        .mergeOutputKey("merged_facts")
        .maxConcurrency(analyzers.size())
        .build();

SequentialAgent pipeline = SequentialAgent.builder()
    .name("material-interview")
    .subAgents(List.of(analysisStage, interviewer.getAgent()))  // 分析完 → 面试官
    .build();
```

三个分析官并行跑，各自分析完各自的资料；面试官必须等全部分析结束才开考——它出题要引用三份事实清单，这份等待是语义上必需的。编排图按资料组合用 bitmask 缓存（最多 8 种），build 一次反复复用。

这个环节踩的是框架的坑：

- **ParallelAgent requires at least 2 sub-agents**。实测硬校验：只传一份简历的"单资料面试"直接 500。只能分支处理——单分析官时不套并行层，直接挂进 SequentialAgent。
- **ParallelAgent 要求每个子 Agent 的 outputKey 唯一**，三个都设成 `messages` 会被校验拒绝。
- 另外一个通用问题：LLM 输出 JSON 爱带 ` ```json ` 围栏和解释文字。我写了 LlmJson 做剥围栏 + 截取两级清洗，解析失败重试一次。

## 四、"编排管时序，数据走数据库"

Agent 之间怎么传数据，我见过两种方案：让消息在 Agent 之间接力传递，或者从数据库获取。

我选了后者，一句话概括：**编排层只管时序，数据一律走数据库。**

- 三个分析官各自调用 `saveCodeProfile` 工具，把结构化事实清单（factsJson）写进 `code_profile` 表，带 `sessionId + profileType`；
- 面试官每轮出题前由 `loadCodeFacts()` 查表取清单，拼成 SystemMessage 注入上下文；
- JSON 原文直接给 LLM、不做 Jackson 解析——读者是 LLM 不是程序，坏 JSON 也不阻塞面试。

这样做的收益：分析是一次性的，出题是持续几十轮的——数据落库意味着面试官随时可以重新读取，跨会话的薄弱点聚合也顺理成章（同一个候选人在不同会话的历史评分能汇到一起）。如果走"消息接力"，这些都要重新设计。

上下文的统一锚点是 RunnableConfig：`threadId = sessionId`（隔离记忆/checkpoint/清单），metadata 里带 candidateId（工具经 SessionKeys 读回）。短期记忆是 Redis 的 MessageWindowChatMemory（60 条滑动窗口），每轮结束手动写回；MemorySaver 的 checkpoint 每轮跑完手动 `release()`，防止旧消息重复累积。Advisors 一条没用——ReactAgent 不带记忆 advisor，历史读写全是手动的，手写虽然啰嗦，但每一行我都知道它在干什么。

## 五、最大的重构：

早期设计是让面试官在长对话中"自觉"调用 scoreRecord 工具，把上一个回答的评分写进数据库。——评分本来就是面试官职责的一部分。结果验收时发现**评分记录大量缺失**：模型在长对话中间会概率性地忘记调工具。

这不是 prompt 能修好的。prompt 是建议，不是约束。最后的解法是结构性重构：

1. 把评估从面试官身上拆出来，做成独立的 AnswerEvaluatorService（单轮、输入固定、输出结构化 JSON 的"普通函数"）；
2. 落库由服务代码直接执行，不经过 LLM 的"自觉"；
3. 面试官只负责转述评估结果——点评是它的本职，评分落库不再依赖它。

漂移面从"长对话中的一次概率性工具调用"，缩成了"独立单轮结构化输出 + 确定性落库"。**任何"每轮必须发生"的事，都不要托付给 LLM 的自觉，要写进代码的时序里。**

现在每一轮的开头是写死在代码里的确定性时序，而不是 Agent 自觉：

```java
// InterviewAssistant.chat() —— 每轮第 1 步，先评估上一答再出题
InterviewPlan plan = interviewPlanService.ensurePlan(userMessage, sessionId, candidateId);
AnswerEvaluatorService.EvaluationOutcome evaluation =
        answerEvaluatorService.evaluateTurn(userMessage, sessionId, candidateId, plan);
// ...然后把薄弱点回顾/面试计划/事实清单/RAG/上一题评估组装成 SystemMessage，
// 加上 Redis 窗口历史，交给 ReactAgent 跑 ReAct 循环流式出题
```

## 六、完整流程

把上面所有设计串起来，看一次"上传简历 + JD 开始面试"的全流程：

1. **路由**：Controller 检测到 materialIds 非空——按钮选文件本身是最可靠的意图信号，三道关口全跳过——直达流水线；
2. **画像**：库里没有这两个类型的清单 → 构建 Sequential(Parallel(jd-analyzer, resume-analyzer), interviewer)。两个分析官并行跑 ReAct 循环：守门确认资料在消息里 → 分析 → 各自调 saveCodeProfile 落库。资料全文只在本轮可见，不进长期记忆（不挤占后续问答的上下文）；
3. **出题**：面试官第一轮启动前，ensurePlan 用 LLM 函数生成《面试计划》（考点 + 优先级 + 难度档）→ loadCodeFacts 取回两份事实清单 → 若该候选人历史有评分，注入【跨会话薄弱点回顾】→ 题库 RAG 检索 → ReAct 循环 → SSE 流式问出第一题；
4. **闭环**：候选人回答后，下一轮第 1 步评估官先跑，输出 `{isAnswer:true, topic:"线程池参数", score:6, gaps:"...", nextSuggestion:"该考点换更基础角度再问"}` → 落 score_record 表 → 作为【上一题评估】注入 → 面试官转述点评并降低难度；
5. **收尾**：面试结束调报告服务，以《面试计划》考点为基准做覆盖矩阵 join 评分记录，输出带证据链的评估报告。

## 最后

1. **不是所有环节都值得做成 Agent**——有工具循环的才配叫 Agent，确定性的活交给普通函数，"每轮必须发生"的事写进代码时序而不是托付给 LLM 的自觉。
2. **编排管时序，数据走数据库**——Agent 之间不接力传消息，落库让一次性分析服务于几十轮出题和跨会话聚合。
3. **能不问大模型就不问**——路由前面先立规则关口，便宜且可回归测试；LLM 只处理真正拿不准的部分。

写完这个项目，我判断一个环节该不该交给 Agent 自觉，多了个标准：它偶尔没做到，后果能不能兜住。能兜住的交给模型，不能的写进代码。
