import type { ReactNode } from 'react';

export interface DrawerContentPanelProps {
  title?: ReactNode;
  children: ReactNode;
  tone?: 'white' | 'muted';
  className?: string;
}

/** 权限树等复杂内容的边框容器；结构内容通过 children 注入。 */
export function DrawerContentPanel({ title, children, tone = 'muted', className }: DrawerContentPanelProps) {
  return <div className={['sh-drawer-content-panel', `sh-drawer-content-panel--${tone}`, className].filter(Boolean).join(' ')}>{title && <strong className="sh-drawer-content-panel__title">{title}</strong>}{children}</div>;
}

export interface DrawerTextBlockProps {
  children: ReactNode;
  className?: string;
}

/** 成员名称摘要等纯文本内容，不附加卡片外框。 */
export function DrawerTextBlock({ children, className }: DrawerTextBlockProps) {
  return <div className={['sh-drawer-text-block', className].filter(Boolean).join(' ')}>{children}</div>;
}
