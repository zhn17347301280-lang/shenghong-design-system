import type { ReactNode } from 'react';
export interface DrawerFieldItem {
    key?: string;
    label: ReactNode;
    value: ReactNode;
}
export interface DrawerFieldListProps {
    items: DrawerFieldItem[];
    /** 紧凑抽屉的标签列可使用 84px；标准抽屉默认 96px。 */
    labelWidth?: number;
    className?: string;
}
/** 两列只读字段，长值自然换行并保持与标签顶部对齐。 */
export declare function DrawerFieldList({ items, labelWidth, className }: DrawerFieldListProps): import("react").JSX.Element;
