import type { ReactNode } from 'react';
import { Card, Tag } from 'antd';

export interface EntityCardField {
  label: ReactNode;
  /** 数组值会自动渲染为一组紧凑 Tag，单值保持普通文本。 */
  value: ReactNode | ReactNode[];
}

export interface EntityCardProps {
  title?: ReactNode;
  icon?: ReactNode;
  fields?: EntityCardField[];
}

export function EntityCard({
  title = '本体名称',
  icon,
  fields = [
    { label: '业务线', value: ['业务线 1'] },
    { label: '属性', value: ['变量 1', '变量 2', '变量 3'] },
  ],
}: EntityCardProps) {
  return (
    <Card className="sh-entity-card">
      <div className="sh-entity-card__title">{icon}<strong>{title}</strong></div>
      <dl className="sh-entity-card__fields">
        {fields.map((field, fieldIndex) => (
          <div className="sh-entity-card__field" key={fieldIndex}>
            <dt>{field.label}：</dt>
            <dd>
              {Array.isArray(field.value) ? (
                <span className="sh-entity-card__tags">
                  {field.value.map((value, valueIndex) => <Tag key={`${fieldIndex}-${valueIndex}`} variant="filled">{value}</Tag>)}
                </span>
              ) : field.value}
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
