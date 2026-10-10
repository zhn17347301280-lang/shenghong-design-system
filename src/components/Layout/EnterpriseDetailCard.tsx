import { useState, type ReactNode } from 'react';
import { Button, Input, Popconfirm, Tag } from 'antd';
import { LocalIcon } from '../Icon/LocalIcon';
import modelIcon from '../../icons/svg/企业智能平台-OntoForge-逻辑建模-大模型.svg?raw';
import functionIcon from '../../icons/svg/企业智能平台-OntoForge-逻辑建模-函数.svg?raw';
import editIcon from '../../icons/svg/通用-编辑.svg?raw';
import deleteIcon from '../../icons/svg/通用-删除.svg?raw';

export interface EnterpriseDetailCardField {
  label: string;
  value: ReactNode;
}

export interface EnterpriseDetailCardProps {
  kind: 'model' | 'function';
  title: string;
  fields?: EnterpriseDetailCardField[];
  onDelete?: () => void;
}

const modelFields: EnterpriseDetailCardField[] = [
  { label: '模型名称', value: '模型名称xxxxxxxx' },
  { label: '模型标识', value: 'model_xxxxxxxx' },
  { label: '模型类型', value: <Tag>Tag</Tag> },
  { label: '所属分类', value: <><Tag>Tag</Tag><Tag>Tag</Tag></> },
  { label: '状态', value: '描述 xxxxxxxxxxxxxxx' },
  { label: '能力标签', value: <><Tag>Tag</Tag><Tag>Tag</Tag></> },
];

const functionFields: EnterpriseDetailCardField[] = [
  { label: '函数名称', value: '函数名称xxxxxxxxxxxxx' },
  { label: '输入参数', value: <><Tag>str.</Tag><Tag>str.</Tag></> },
  { label: '代码类型', value: 'Python' },
  { label: '函数代码', value: <code className="sh-enterprise-detail-card__code">{'//在此编写代码\nfunction main(params) {\n  return params;\n}'}</code> },
  { label: '输出参数', value: <><Tag>Tag</Tag><Tag>Tag</Tag></> },
];

/** MasterGo「卡片card」：56px 标题栏、编辑/删除操作与只读字段区。 */
export function EnterpriseDetailCard({ kind, title, fields, onDelete }: EnterpriseDetailCardProps) {
  const [editing, setEditing] = useState(false);
  const [localTitle, setLocalTitle] = useState(title);
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;
  return <article className="sh-enterprise-detail-card" data-kind={kind}>
    <div className="sh-enterprise-detail-card__header">
      <div className="sh-enterprise-detail-card__heading">
        <LocalIcon svg={kind === 'model' ? modelIcon : functionIcon} size={24} />
        {editing ? <Input aria-label="卡片标题" value={localTitle} onChange={(event) => setLocalTitle(event.target.value)} onPressEnter={() => setEditing(false)} onBlur={() => setEditing(false)} autoFocus /> : <h5>{localTitle}</h5>}
      </div>
      <div className="sh-enterprise-detail-card__actions">
        <Button type="text" aria-label={editing ? '完成编辑' : '编辑卡片'} icon={<LocalIcon svg={editIcon} size={16} />} onClick={() => setEditing((value) => !value)} />
        <Popconfirm title="确认删除这张卡片？" okText="删除" cancelText="取消" onConfirm={() => onDelete ? onDelete() : setHidden(true)}><Button type="text" aria-label="删除卡片" icon={<LocalIcon svg={deleteIcon} size={16} />} /></Popconfirm>
      </div>
    </div>
    <dl className="sh-enterprise-detail-card__fields">
      {(fields ?? (kind === 'model' ? modelFields : functionFields)).map((field, index) => <div className="sh-enterprise-detail-card__field" key={`${field.label}-${index}`}><dt>{field.label}</dt><dd>{field.value}</dd></div>)}
    </dl>
  </article>;
}
