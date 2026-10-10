import type { ReactNode } from 'react';
export interface DrawerContentPanelProps {
    title?: ReactNode;
    children: ReactNode;
    tone?: 'white' | 'muted';
    className?: string;
}
/** 权限树等复杂内容的边框容器；结构内容通过 children 注入。 */
export declare function DrawerContentPanel({ title, children, tone, className }: DrawerContentPanelProps): import("react").JSX.Element;
export interface DrawerTextBlockProps {
    children: ReactNode;
    className?: string;
}
/** 成员名称摘要等纯文本内容，不附加卡片外框。 */
export declare function DrawerTextBlock({ children, className }: DrawerTextBlockProps): import("react").JSX.Element;
