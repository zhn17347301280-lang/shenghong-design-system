import type { KeyboardEvent, ReactNode } from 'react';
import { Card } from 'antd';

export interface OptionCardProps {
  title: ReactNode;
  description?: ReactNode;
  badge?: ReactNode;
  selected?: boolean;
  /** 是否允许点击切换选中状态。 */
  selectable?: boolean;
  onSelectedChange?: (selected: boolean) => void;
}

export function OptionCard({ title, description, badge, selected = false, selectable = false, onSelectedChange }: OptionCardProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!selectable || (event.key !== 'Enter' && event.key !== ' ')) return;
    event.preventDefault();
    onSelectedChange?.(!selected);
  };

  return (
    <Card
      aria-pressed={selectable ? selected : undefined}
      className="sh-option-card"
      data-selectable={selectable || undefined}
      data-selected={selected || undefined}
      onClick={selectable ? () => onSelectedChange?.(!selected) : undefined}
      onKeyDown={handleKeyDown}
      role={selectable ? 'button' : undefined}
      tabIndex={selectable ? 0 : undefined}
    >
      <div className="sh-option-card__header"><strong>{title}</strong>{badge}</div>
      {description && <span className="sh-option-card__description">{description}</span>}
    </Card>
  );
}
