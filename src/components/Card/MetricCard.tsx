import { useState, type KeyboardEvent, type ReactNode } from 'react';
import { Card, Skeleton, Tooltip } from 'antd';

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

function ChangeValue({ label, value, direction }: { label: string; value?: ReactNode; direction: MetricTrendDirection }) {
  return <span className="sh-metric-card__change"><span>{label}</span><strong data-direction={direction} data-missing={value == null || undefined}>{value ?? '--'}</strong></span>;
}

export function MetricCard({
  title,
  value = '4,520',
  unit,
  yearOnYear,
  monthOnMonth,
  trendDirection = 'up',
  metrics,
  hint,
  hintTooltip = '指标数据来源于当前统计周期，支持查看同比与环比变化。',
  status = 'normal',
  selected,
  selectable = false,
  defaultSelected = false,
  onSelectedChange,
  trend,
  detail,
  icon,
}: MetricCardProps) {
  const [internalSelected, setInternalSelected] = useState(defaultSelected || status === 'selected');
  const isSelected = selected ?? (selectable ? internalSelected : status === 'selected');
  const resolvedStatus = isSelected ? 'selected' : status === 'selected' ? 'normal' : status;
  const items = (metrics?.length ? metrics : [{ value, unit, yearOnYear, monthOnMonth }]).slice(0, 2);
  const isLoading = resolvedStatus === 'loading';
  const isDataMissing = resolvedStatus === 'data-missing';
  const isComparisonMissing = resolvedStatus === 'comparison-missing';

  const toggleSelected = () => {
    if (!selectable) return;
    const nextSelected = !isSelected;
    if (selected === undefined) setInternalSelected(nextSelected);
    onSelectedChange?.(nextSelected);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!selectable || (event.key !== 'Enter' && event.key !== ' ')) return;
    event.preventDefault();
    toggleSelected();
  };

  return (
    <Card
      aria-pressed={selectable ? isSelected : undefined}
      className="sh-metric-card"
      data-count={items.length}
      data-selectable={selectable || undefined}
      data-status={resolvedStatus}
      data-selected={isSelected || undefined}
      onClick={toggleSelected}
      onKeyDown={handleKeyDown}
      role={selectable ? 'button' : undefined}
      tabIndex={selectable ? 0 : undefined}
    >
      <div className="sh-metric-card__header">
        <span className="sh-metric-card__title">{title}</span>
        {(hint || icon) && (
          <Tooltip title={hintTooltip} trigger={['hover', 'focus']}>
            <span
              aria-label="指标说明"
              className="sh-metric-card__hint"
              onClick={(event) => event.stopPropagation()}
              onKeyDown={(event) => event.stopPropagation()}
              tabIndex={0}
            >
              {hint || icon}
            </span>
          </Tooltip>
        )}
      </div>
      {isLoading ? (
        <div className="sh-metric-card__loading" aria-label="数据加载中">
          {items.map((_, index) => (
            <div className="sh-metric-card__loading-metric" key={index}>
              <div className="sh-metric-card__loading-value"><Skeleton.Input active size="small" /></div>
              <div className="sh-metric-card__loading-changes">
                <div><Skeleton.Input active size="small" /></div>
                <div><Skeleton.Input active size="small" /></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="sh-metric-card__metrics">
          {items.map((item, index) => (
            <div className="sh-metric-card__metric" key={index}>
              <div className="sh-metric-card__number"><strong>{isDataMissing ? '--' : item.value}</strong>{!isDataMissing && item.unit && <span>{item.unit}</span>}</div>
              {(trend || detail) && items.length === 1 && !yearOnYear && !monthOnMonth ? (
                <div className="sh-metric-card__legacy-meta">{trend}<span>{detail}</span></div>
              ) : (
                <div className="sh-metric-card__changes">
                  <ChangeValue label="同比" direction={item.trendDirection ?? trendDirection} value={isDataMissing || isComparisonMissing ? undefined : item.yearOnYear ?? yearOnYear} />
                  <ChangeValue label="环比" direction={item.trendDirection ?? trendDirection} value={isDataMissing || isComparisonMissing ? undefined : item.monthOnMonth ?? monthOnMonth} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
