import type { ReactNode } from 'react';
import { Button } from 'antd';
import { FileUpload } from '../File/FileUpload';

export type EnterpriseDetailSectionType = 'plain' | 'fields' | 'upload' | 'description';

export interface EnterpriseDetailSectionProps {
  type: EnterpriseDetailSectionType;
  title?: ReactNode;
  actions?: ReactNode;
  fields?: Array<{ label: string; value: ReactNode }>;
  children?: ReactNode;
}

const DEMO_FIELDS = Array.from({ length: 5 }, (_, index) => ({ label: `字段${index + 1}：`, value: '文案xxxxxxxxxxxxxxxxxx' }));

/** MasterGo 详情页分区的四种类型：无字段、详情字段、文件上传、说明内容。 */
export function EnterpriseDetailSection({ type, title = '文案xxxxxxxxxxxxxxxxxx', actions, fields = DEMO_FIELDS, children }: EnterpriseDetailSectionProps) {
  const defaultActions = type === 'upload' ? null : <><Button>按钮1</Button><Button>按钮2</Button></>;
  return <section className="sh-enterprise-detail-section" data-type={type}>
    <div className="sh-enterprise-detail-section__heading"><h4>{title}</h4>{(actions ?? defaultActions) && <div>{actions ?? defaultActions}</div>}</div>
    {children ?? (type === 'fields' ? <dl className="sh-enterprise-detail-section__fields">{fields.map((field, index) => <div key={`${field.label}-${index}`}><dt>{field.label}</dt><dd>{field.value}</dd></div>)}</dl>
      : type === 'upload' ? <FileUpload hint="描述文案xxxxxxxx" beforeUpload={() => false} />
        : type === 'description' ? <div className="sh-enterprise-detail-section__description"><h5>标题文案</h5><p>说明文案xxxxx</p><p>详情文案xxxxxxxxxxxxxxxxxxxx <a href="#enterprise-detail" onClick={(event) => event.preventDefault()}>链接地址</a></p><Button>按钮</Button></div>
          : null)}
  </section>;
}
