import type { ReactNode } from 'react';
export interface DrawerTreeNode {
    key: string;
    label: ReactNode;
    children?: DrawerTreeNode[];
}
export interface DrawerTreeContentProps {
    title?: ReactNode;
    nodes: DrawerTreeNode[];
    className?: string;
}
/** 分层字段/权限等树状内容，使用原生 details 支持展开与键盘操作。 */
export declare function DrawerTreeContent({ title, nodes, className }: DrawerTreeContentProps): import("react").JSX.Element;
