import type { ReactNode } from 'react';

export interface DetailFieldItem {
  label: ReactNode;
  value: ReactNode;
}

export interface DetailFieldGroupProps {
  title: ReactNode;
  items: DetailFieldItem[];
}

export function DetailFieldGroup({ title, items }: DetailFieldGroupProps) {
  return (
    <section className="sh-detail-field-group">
      <h5 className="sh-detail-field-group__title">{title}</h5>
      <dl className="sh-detail-field-group__list">
        {items.map((item, index) => (
          <div className="sh-detail-field-group__row" key={`${String(item.label)}-${index}`}>
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
