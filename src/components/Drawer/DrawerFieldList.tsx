import type { CSSProperties, ReactNode } from 'react';

export interface DrawerFieldItem {
  key?: string;
  label: ReactNode;
  value: ReactNode;
}

export interface DrawerFieldListProps {
  items: DrawerFieldItem[];
  /** 紧凑抽屉的标签列可使用 84px；标准抽屉默认 96px。 */
  labelWidth?: number;
  className?: string;
}

/** 两列只读字段，长值自然换行并保持与标签顶部对齐。 */
export function DrawerFieldList({ items, labelWidth = 96, className }: DrawerFieldListProps) {
  return (
    <dl className={['sh-drawer-fields', className].filter(Boolean).join(' ')} style={{ '--sh-drawer-label-width': `${labelWidth}px` } as CSSProperties}>
      {items.map((item, index) => (
        <div className="sh-drawer-fields__row" key={item.key ?? `${index}-${String(item.label)}`}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
