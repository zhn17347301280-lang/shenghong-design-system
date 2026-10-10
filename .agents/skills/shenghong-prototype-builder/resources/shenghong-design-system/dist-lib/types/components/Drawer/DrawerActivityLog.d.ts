import type { ReactNode } from 'react';
export interface DrawerActivityItem {
    key: string;
    content: ReactNode;
    time: ReactNode;
    actor?: ReactNode;
}
export interface DrawerActivityLogProps {
    items: DrawerActivityItem[];
    className?: string;
}
/** 抽屉内操作日志时间线，按输入顺序由新到旧展示。 */
export declare function DrawerActivityLog({ items, className }: DrawerActivityLogProps): import("react").JSX.Element;
