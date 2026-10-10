import type { ReactNode } from 'react';
export interface OptionCardProps {
    title: ReactNode;
    description?: ReactNode;
    badge?: ReactNode;
    selected?: boolean;
    /** 是否允许点击切换选中状态。 */
    selectable?: boolean;
    onSelectedChange?: (selected: boolean) => void;
}
export declare function OptionCard({ title, description, badge, selected, selectable, onSelectedChange }: OptionCardProps): import("react").JSX.Element;
