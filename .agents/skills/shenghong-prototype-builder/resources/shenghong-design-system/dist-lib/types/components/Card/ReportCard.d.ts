import { type ReactNode } from 'react';
export interface ReportCardProps {
    title: ReactNode;
    description?: ReactNode;
    tag?: ReactNode;
    date?: ReactNode;
    meta?: ReactNode;
    actions?: ReactNode;
    isNew?: boolean;
    /** 受控选中状态。 */
    selected?: boolean;
    /** 是否允许点击卡片切换选中状态。 */
    selectable?: boolean;
    /** 非受控模式下的初始选中状态。 */
    defaultSelected?: boolean;
    /** 选中状态变化回调。 */
    onSelectedChange?: (selected: boolean) => void;
}
export declare function ReportCard({ title, description, tag, date, meta, actions, isNew, selected, selectable, defaultSelected, onSelectedChange, }: ReportCardProps): import("react").JSX.Element;
