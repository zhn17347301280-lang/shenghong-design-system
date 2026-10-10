import { useMemo, type ReactNode } from 'react';
import { Card, Skeleton } from 'antd';
import { chartTokens } from '../../theme/foundations';
import type { BaseChartProps, ChartDatum, ChartSeriesPoint, ChartType, RankingItem } from './types';
import {
  BarChart,
  DonutChart,
  FunnelChart,
  GroupedBarChart,
  GroupedHorizontalBarChart,
  HorizontalBarChart,
  LineChart,
  RankingChart,
} from './chartRenders';

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
  /** 兼容旧 API：原 extra 保持在右上角。 */
}

function Legend({ names, colors }: { names: ReactNode[]; colors: string[] }) {
  if (names.length <= 1 && !names[0]) return null;
  return (
    <ul className="sh-chart-card__legend">
      {names.map((name, i) => (
        <li key={i}>
          <span className="sh-chart-card__legend-dot" style={{ background: colors[i] }} />
          <span>{name}</span>
        </li>
      ))}
    </ul>
  );
}

export function ChartCard({
  title,
  subtitle,
  type = 'bar',
  data = [],
  seriesData = [],
  seriesNames = [],
  ranking = [],
  colorMode = 'mono',
  count,
  extra,
  unit,
  loading = false,
}: ChartCardProps) {
  /** 按外部 Top N 选择器的 count 截取数据；未传 count 时展示全部。 */
  const sliced = useMemo(() => (count == null ? data : data.slice(0, count)), [data, count]);
  const slicedSeries = useMemo(() => (count == null ? seriesData : seriesData.slice(0, count)), [seriesData, count]);
  const slicedRanking = useMemo(() => (count == null ? ranking : ranking.slice(0, count)), [ranking, count]);

  const seriesColors = useMemo(() => {
    const palette = colorMode === 'categorical' ? chartTokens.categorical : chartTokens.blueScale;
    return seriesNames.map((_, i) => palette[i % palette.length]);
  }, [seriesNames, colorMode]);

  /** 单系列取色：多色模式按 categorical 循环；单色模式下环形用蓝色阶梯、漏斗用蓝色阶梯、其余全部主色。 */
  const itemColors = useMemo(() => {
    if (colorMode === 'categorical') {
      return sliced.map((_, i) => chartTokens.categorical[i % chartTokens.categorical.length]);
    }
    if (type === 'donut') return sliced.map((_, i) => chartTokens.donutMonoScale[i % chartTokens.donutMonoScale.length]);
    if (type === 'funnel') return sliced.map((_, i) => chartTokens.blueScale[i % chartTokens.blueScale.length]);
    return sliced.map(() => chartTokens.primary);
  }, [sliced, colorMode, type]);

  const isMultiSeries = ['line', 'groupedBar', 'stackedBar', 'groupedHorizontalBar', 'stackedHorizontalBar'].includes(type);
  // 环形图图例由图形右侧明细列表承担，header 不再重复展示圆点图例。
  const legendNames = isMultiSeries ? seriesNames : [];
  const legendColors = isMultiSeries ? seriesColors : itemColors;

  /** 单线折线支持直接使用 data；多线使用 seriesData。 */
  const linePoints = useMemo<ChartSeriesPoint[]>(
    () => (seriesData.length ? slicedSeries : sliced.map((d) => ({ label: d.label, values: [d.value] }))),
    [seriesData, slicedSeries, sliced],
  );
  const lineNames = seriesNames.length ? seriesNames : [''];

  const renderChart = () => {
    if (loading) {
      return (
        <div className="sh-chart-card__loading">
          <Skeleton active paragraph={{ rows: 4 }} title={false} />
        </div>
      );
    }
    switch (type) {
      case 'line':
        return <LineChart points={linePoints} names={lineNames} colors={seriesColors.length ? seriesColors : [chartTokens.primary]} />;
      case 'bar':
        return <BarChart data={sliced} />;
      case 'horizontalBar':
        return <HorizontalBarChart data={sliced} colors={itemColors} />;
      case 'groupedBar':
        return <GroupedBarChart points={slicedSeries} names={seriesNames} colors={seriesColors} />;
      case 'stackedBar':
        return <GroupedBarChart points={slicedSeries} names={seriesNames} colors={seriesColors} stacked />;
      case 'groupedHorizontalBar':
        return <GroupedHorizontalBarChart points={slicedSeries} names={seriesNames} colors={seriesColors} />;
      case 'stackedHorizontalBar':
        return <GroupedHorizontalBarChart points={slicedSeries} names={seriesNames} colors={seriesColors} stacked />;
      case 'donut':
        return <DonutChart data={sliced} colors={itemColors} unit={unit ?? subtitle} />;
      case 'funnel':
        return <FunnelChart data={sliced} colors={itemColors} />;
      case 'ranking':
        return <RankingChart data={slicedRanking} />;
      default:
        return null;
    }
  };

  return (
    <Card className="sh-chart-card" bordered>
      <div className="sh-chart-card__head">
        <div className="sh-chart-card__titles">
          <span className="sh-chart-card__title">{title}</span>
          {subtitle && <span className="sh-chart-card__subtitle">{subtitle}</span>}
        </div>
        <div className="sh-chart-card__head-right">
          {type !== 'ranking' && legendNames.length > 0 && legendNames.some((n) => n !== '') && (
            <Legend names={legendNames} colors={legendColors} />
          )}
          {extra}
        </div>
      </div>
      {renderChart()}
    </Card>
  );
}
