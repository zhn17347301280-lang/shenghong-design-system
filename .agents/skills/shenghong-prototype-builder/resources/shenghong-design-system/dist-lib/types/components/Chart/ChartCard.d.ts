import { type ReactNode } from 'react';
import type { BaseChartProps, ChartDatum, ChartSeriesPoint, ChartType, RankingItem } from './types';
export type { ChartType, ChartDatum, ChartSeriesPoint, RankingItem } from './types';
export interface ChartCardProps extends BaseChartProps {
    title: ReactNode;
    subtitle?: ReactNode;
    type?: ChartType;
    /** 单系列数据（基础柱 / 基础条 / 环形 / 漏斗 / 单线折线）。 */
    data?: ChartDatum[];
    /** 多系列数据（多线 / 多系列柱 / 多系列条）。 */
    seriesData?: ChartSeriesPoint[];
    /** 多系列名称，同时作为图例文案。 */
    seriesNames?: ReactNode[];
    /** 排行榜数据。 */
    ranking?: RankingItem[];
    /** 单色（蓝）或多色模式，设计稿中基础柱/条为单色，环形/漏斗存在多色变体。 */
    colorMode?: 'mono' | 'categorical';
    /** 加载骨架屏。 */
    loading?: boolean;
    height?: number;
}
export declare function ChartCard({ title, subtitle, type, data, seriesData, seriesNames, ranking, colorMode, count, extra, unit, loading, }: ChartCardProps): import("react").JSX.Element;
