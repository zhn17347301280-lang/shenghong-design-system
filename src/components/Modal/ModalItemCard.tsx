import type { HTMLAttributes, KeyboardEvent, ReactNode } from 'react';

export type ModalItemCardAppearance = 'bordered' | 'filled';

export interface ModalItemCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'onSelect'> {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  control?: ReactNode;
  appearance?: ModalItemCardAppearance;
  selected?: boolean;
  onSelect?: () => void;
}

export function ModalItemCard({
  title,
  description,
  icon,
  control,
  appearance = 'bordered',
  selected = false,
  onSelect,
  className,
  onKeyDown,
  ...props
}: ModalItemCardProps) {
  const selectable = Boolean(onSelect);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || !onSelect) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect();
    }
  };

  return (
    <div
      {...props}
      aria-checked={selectable ? selected : undefined}
      className={['sh-modal-item-card', className].filter(Boolean).join(' ')}
      data-appearance={appearance}
      data-selected={selected || undefined}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      role={selectable ? 'radio' : undefined}
      tabIndex={selectable ? 0 : undefined}
    >
      {icon && <span className="sh-modal-item-card__icon">{icon}</span>}
      <span className="sh-modal-item-card__content">
        <strong>{title}</strong>
        {description && <span className="sh-modal-item-card__description">{description}</span>}
      </span>
      {control && <span className="sh-modal-item-card__control">{control}</span>}
    </div>
  );
}
