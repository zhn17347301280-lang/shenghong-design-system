import { type ReactNode } from 'react';
export type MetricCardStatus = 'normal' | 'selected' | 'loading' | 'data-missing' | 'comparison-missing';
export type MetricTrendDirection = 'up' | 'down' | 'neutral';
export interface MetricCardItem {
    value: ReactNode;
    unit?: ReactNode;
    yearOnYear?: ReactNode;
    monthOnMonth?: ReactNode;
    trendDirection?: MetricTrendDirection;
}
export interface MetricCardProps {
    title: ReactNode;
    value?: ReactNode;
    unit?: ReactNode;
    yearOnYear?: ReactNode;
    monthOnMonth?: ReactNode;
    /** 同比、环比的涨跌方向，用于统一控制颜色。 */
    trendDirection?: MetricTrendDirection;
    metrics?: MetricCardItem[];
    hint?: ReactNode;
    /** 右上角提示图标悬浮或聚焦时显示的说明。 */
    hintTooltip?: ReactNode;
    status?: MetricCardStatus;
    /** 受控选中状态。 */
    selected?: boolean;
    /** 是否允许点击卡片切换选中状态。 */
    selectable?: boolean;
    /** 非受控模式下的初始选中状态。 */
    defaultSelected?: boolean;
    /** 选中状态变化回调。 */
    onSelectedChange?: (selected: boolean) => void;
    /** 兼容早期 API。 */
    trend?: ReactNode;
    /** 兼容早期 API。 */
    detail?: ReactNode;
    /** 兼容早期 API。 */
    icon?: ReactNode;
}
export declare function MetricCard({ title, value, unit, yearOnYear, monthOnMonth, trendDirection, metrics, hint, hintTooltip, status, selected, selectable, defaultSelected, onSelectedChange, trend, detail, icon, }: MetricCardProps): import("react").JSX.Element;
