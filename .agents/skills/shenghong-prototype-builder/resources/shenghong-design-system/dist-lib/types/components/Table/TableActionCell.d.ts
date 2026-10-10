import type { ReactNode } from 'react';
import { type MenuProps } from 'antd';
export interface TableActionItem {
    key: string;
    label: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    danger?: boolean;
}
export interface TableActionMore {
    items: MenuProps['items'];
    label?: ReactNode;
}
export interface TableActionCellProps {
    actions: TableActionItem[];
    more?: TableActionMore;
    /** 整行失效时，统一禁用操作按钮与更多菜单。 */
    disabled?: boolean;
}
/**
 * 表格「操作」单元格的公开内容组件：32px 描边按钮、8px 间距、不可换行。
 * 按钮组合与操作回调由业务提供；列的固定、宽度和层级由 DataTable 的 rowActions API 负责。
 */
export declare function TableActionCell({ actions, more, disabled }: TableActionCellProps): import("react").JSX.Element;
