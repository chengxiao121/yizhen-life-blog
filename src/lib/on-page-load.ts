/**
 * 视图过渡适配层（全站唯一入口）。
 *
 * 背景：Astro 的模块脚本在一次浏览器会话中只执行一次；视图过渡切换/返回页面时
 * DOM 会被整体换新，模块级绑定的监听器、定时器全部失效或泄漏。
 * Astro 路由器保证每次导航（含首次加载）都会在脚本执行后触发 astro:page-load，
 * 所以初始化必须挂在这个事件上，而不是模块顶层。
 *
 * 用法：
 *   onPageLoad(() => {
 *     // ...查询当前 DOM 并初始化（元素不存在时提前 return）
 *     return () => { 清理定时器与 document 级监听器 };
 *   });
 *
 * 每次页面载入会先执行上一次返回的清理函数；绑定在被换掉 DOM 上的监听器随
 * 元素一起回收，无需手动清理。
 */
export function onPageLoad(init: () => void | (() => void)) {
  let cleanup: (() => void) | null = null;
  document.addEventListener('astro:page-load', () => {
    cleanup?.();
    cleanup = init() || null;
  });
}
