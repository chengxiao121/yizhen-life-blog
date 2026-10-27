/**
 * 站点导航唯一数据源（结构规则 §3）：
 * GooeyNav 岛屿（BaseLayout 与欢迎页）共用，禁止再各写一份。
 */
export interface NavItem {
  href: string;
  label: string;
  /** 仅侧栏使用：内联 SVG path */
  icon?: string;
}

export const navItems: NavItem[] = [
  { href: '/', label: '首页', icon: 'M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z' },
  { href: '/tech', label: '技术', icon: 'M8 9l-4 3 4 3M16 9l4 3-4 3M13 6l-2 12' },
  { href: '/life', label: '生活', icon: 'M12 21C7 17 3 13.5 3 9.5 3 7 5 5 7.5 5c1.7 0 3.3.9 4.5 2.3C13.2 5.9 14.8 5 16.5 5 19 5 21 7 21 9.5c0 4-4 7.5-9 11.5z' },
  { href: '/photos', label: '照片墙', icon: 'M4 5h16v14H4zM4 15l4-4 3 3 5-5 4 4' },
  { href: '/about', label: '关于', icon: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4 3.6-6 8-6s8 2 8 6' },
];

/** 判断导航项在当前路径下是否激活（全站统一逻辑） */
export function isActiveNav(href: string, pathname: string): boolean {
  return pathname === href || pathname.startsWith(href + '/');
}

/**
 * GooeyNav 药丸颜色，必须与 tokens.css 的 --accent 保持一致。
 * 单独定义为常量是因为 WebGL 着色器需要具体色值，无法使用 CSS 变量；
 * 全站只有这一处定义，欢迎页与 BaseLayout 共用。
 */
export const NAV_PILL_COLOR = '#E8833A';
