import { type ReactNode } from 'react';
import type { ChartDatum, ChartSeriesPoint, RankingItem } from './types';
export declare function BarChart({ data }: {
    data: ChartDatum[];
}): import("react").JSX.Element;
export declare function GroupedBarChart({ points, names, colors, stacked }: {
    points: ChartSeriesPoint[];
    names: ReactNode[];
    colors: string[];
    stacked?: boolean;
}): import("react").JSX.Element;
export declare function LineChart({ points, names, colors }: {
    points: ChartSeriesPoint[];
    names: ReactNode[];
    colors: string[];
}): import("react").JSX.Element;
export declare function HorizontalBarChart({ data, colors }: {
    data: ChartDatum[];
    colors: string[];
}): import("react").JSX.Element;
export declare function GroupedHorizontalBarChart({ points, names, colors, stacked }: {
    points: ChartSeriesPoint[];
    names: ReactNode[];
    colors: string[];
    stacked?: boolean;
}): import("react").JSX.Element;
export declare function DonutChart({ data, colors, unit }: {
    data: ChartDatum[];
    colors: string[];
    unit?: ReactNode;
}): import("react").JSX.Element;
export declare function FunnelChart({ data, colors }: {
    data: ChartDatum[];
    colors: string[];
}): import("react").JSX.Element;
export declare function RankingChart({ data }: {
    data: RankingItem[];
}): import("react").JSX.Element;
