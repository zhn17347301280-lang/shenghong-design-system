import { useState, type KeyboardEvent, type ReactNode } from 'react';
import { Card } from 'antd';

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

export function ReportCard({
  title,
  description,
  tag,
  date,
  meta,
  actions,
  isNew = false,
  selected,
  selectable = false,
  defaultSelected = false,
  onSelectedChange,
}: ReportCardProps) {
  const [internalSelected, setInternalSelected] = useState(defaultSelected);
  const isSelected = selected ?? (selectable ? internalSelected : false);

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
      className="sh-report-card"
      data-selectable={selectable || undefined}
      data-selected={isSelected || undefined}
      onClick={toggleSelected}
      onKeyDown={handleKeyDown}
      role={selectable ? 'button' : undefined}
      tabIndex={selectable ? 0 : undefined}
    >
      <div className="sh-report-card__header"><strong className="sh-report-card__title">{title}</strong>{isNew && <span className="sh-report-card__new">NEW</span>}</div>
      {(tag || date) && <div className="sh-report-card__subline"><span>{tag}</span><time>{date}</time></div>}
      {description && <p className="sh-report-card__description">{description}</p>}
      {(meta || actions) && (
        <div className="sh-report-card__footer">
          <span>{meta}</span>
          {actions && (
            <span
              className="sh-report-card__action"
              onClick={(event) => event.stopPropagation()}
              onKeyDown={(event) => event.stopPropagation()}
            >
              {actions}
            </span>
          )}
        </div>
      )}
    </Card>
  );
}
