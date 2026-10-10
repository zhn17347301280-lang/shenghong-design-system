import { useState } from 'react';
import { Button, Checkbox, Input, Select } from 'antd';
import { DataTable } from './DataTable';

export type EditableDataTableKind = 'property' | 'relation';

interface EditableRow {
  id: number;
  name: string;
  code: string;
  type?: string;
  required: boolean;
  target?: string;
  relation: string;
  description: string;
}

const createRow = (id: number): EditableRow => ({ id, name: '', code: '', required: false, relation: '', description: '' });

/** 可编辑单元格表格；沿用通用 DataTable 的表头、行、勾选列与操作列。 */
export function EditableDataTable({ kind, showHeading = true }: { kind: EditableDataTableKind; showHeading?: boolean }) {
  const [rows, setRows] = useState<EditableRow[]>([createRow(1), createRow(2)]);
  const update = (id: number, patch: Partial<EditableRow>) => setRows((current) => current.map((row) => row.id === id ? { ...row, ...patch } : row));
  const add = () => setRows((current) => [...current, createRow(Date.now())]);
  const remove = (id: number) => setRows((current) => current.filter((row) => row.id !== id));

  const columns = kind === 'property' ? [
    { title: '属性名称', key: 'name', render: (_: unknown, row: EditableRow) => <Input aria-label={`第${row.id}行属性名称`} placeholder="请输入" value={row.name} onChange={(event) => update(row.id, { name: event.target.value })} /> },
    { title: '属性编码', key: 'code', render: (_: unknown, row: EditableRow) => <Input aria-label={`第${row.id}行属性编码`} placeholder="请输入" value={row.code} onChange={(event) => update(row.id, { code: event.target.value })} /> },
    { title: '数据类型', key: 'type', render: (_: unknown, row: EditableRow) => <Select aria-label={`第${row.id}行数据类型`} placeholder="请选择" value={row.type} onChange={(value) => update(row.id, { type: value })} options={[{ value: 'text', label: '文本' }, { value: 'number', label: '数字' }]} /> },
    { title: '必填', key: 'required', width: 70, render: (_: unknown, row: EditableRow) => <Checkbox aria-label={`第${row.id}行必填`} checked={row.required} onChange={(event) => update(row.id, { required: event.target.checked })} /> },
    { title: '操作', key: 'action', width: 72, render: (_: unknown, row: EditableRow) => <Button type="link" onClick={() => remove(row.id)}>删除</Button> },
  ] : [
    { title: '关联本体', key: 'target', render: (_: unknown, row: EditableRow) => <Select aria-label={`第${row.id}行关联本体`} placeholder="请选择" value={row.target} onChange={(value) => update(row.id, { target: value })} options={[{ value: 'organization', label: '组织' }, { value: 'member', label: '成员' }]} /> },
    { title: '关联关系', key: 'relation', render: (_: unknown, row: EditableRow) => <Input aria-label={`第${row.id}行关联关系`} placeholder="请输入" value={row.relation} onChange={(event) => update(row.id, { relation: event.target.value })} /> },
    { title: '关系描述', key: 'description', render: (_: unknown, row: EditableRow) => <Input aria-label={`第${row.id}行关系描述`} placeholder="请输入" value={row.description} onChange={(event) => update(row.id, { description: event.target.value })} /> },
    { title: '操作', key: 'action', width: 72, render: (_: unknown, row: EditableRow) => <Button type="link" onClick={() => remove(row.id)}>删除</Button> },
  ];

  return <section className={['sh-enterprise-detail-form__section', 'sh-enterprise-detail-form__section--table', !showHeading && 'sh-enterprise-detail-form__section--embedded'].filter(Boolean).join(' ')}>
    {showHeading && <div className="sh-enterprise-detail-form__section-head"><h4>{kind === 'property' ? '属性' : '关联本体'}</h4><Button type="link" onClick={add}>＋ 新增{kind === 'property' ? '属性' : '关联'}</Button></div>}
    <DataTable<EditableRow> square rowKey="id" rowSelection={{}} pagination={false} dataSource={rows} columns={columns} />
  </section>;
}
