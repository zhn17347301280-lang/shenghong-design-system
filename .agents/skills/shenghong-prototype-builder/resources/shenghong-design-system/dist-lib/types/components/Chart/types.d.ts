import type { ReactNode } from 'react';
/** 图表类别，对应 MasterGo《设计规范》Chart图表组件集。 */
export type ChartType = 'ranking' | 'line' | 'bar' | 'horizontalBar' | 'groupedBar' | 'stackedBar' | 'groupedHorizontalBar' | 'stackedHorizontalBar' | 'donut' | 'funnel';
/** 单系列数据点。 */
export interface ChartDatum {
    label: ReactNode;
    value: number;
}
/** 多系列数据点（多系列柱 / 多系列条 / 多线）。 */
export interface ChartSeriesPoint {
    label: ReactNode;
    values: number[];
}
/** 排行榜行。 */
export interface RankingItem {
    /** 大类 / 一级名称 */
    category: ReactNode;
    /** 小类 / 二级名称 */
    name: ReactNode;
    /** 计量值（带单位的字符串由调用方格式化） */
    value: ReactNode;
    /** 环比，正数展示上升箭头，负数下降，0 持平 */
    change?: number;
}
export interface BaseChartProps {
    /** 仅展示数据的前 N 条（Top N）；不传则展示全部。选择器由图表外部的 TopCountSelect 控制。 */
    count?: number;
    /** 右上角操作区（如「更多」）。 */
    extra?: ReactNode;
    /** 自定义提示单位文案，如「单位：万次」。 */
    unit?: ReactNode;
}
/** hover 提示信息，x/y 为 SVG viewBox 坐标下的锚点（数据点位置）。 */
export interface TooltipState {
    x: number;
    y: number;
    title: ReactNode;
    rows: {
        name: ReactNode;
        value: ReactNode;
        color: string;
    }[];
}
