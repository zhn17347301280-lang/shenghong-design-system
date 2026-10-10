import { forwardRef, useImperativeHandle, useState, type ReactNode } from 'react';
import { Button, Input, Select, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import addIconSvg from '../../icons/svg/通用-添加.svg?raw';
import deleteIconSvg from '../../icons/svg/通用-删除.svg?raw';
import { AppButton } from '../Button/AppButton';
import { LocalIcon } from '../Icon/LocalIcon';
import { DataTable } from './DataTable';

export interface InlineEditableRow {
  id: number;
  fieldName: string;
  fieldCode: string;
  dataType?: 'text' | 'number' | 'date';
  required?: 'yes' | 'no';
  defaultValue: string;
  description: string;
}

export type InlineEditableRequiredField = 'fieldName' | 'fieldCode' | 'dataType' | 'required' | 'defaultValue' | 'description';

export interface InlineEditableTableProps {
  toolbarVariant?: 'titled' | 'actions';
  initialRows?: InlineEditableRow[];
  onChange?: (rows: InlineEditableRow[]) => void;
  /** 需要校验非空的列；默认字段名称、字段编码、数据类型、是否必填。 */
  requiredFields?: readonly InlineEditableRequiredField[];
}

export interface InlineEditableTableHandle {
  /** 保存前调用；失败时展示单元格红框和提示。编辑后会实时重新校验。 */
  validate: () => boolean;
  getRows: () => InlineEditableRow[];
  clearValidation: () => void;
}

const defaultRows: InlineEditableRow[] = [
  { id: 1, fieldName: '姓名', fieldCode: 'name', dataType: 'text', required: 'yes', defaultValue: '', description: '成员姓名' },
  { id: 2, fieldName: '年龄', fieldCode: 'age', dataType: 'number', required: 'no', defaultValue: '18', description: '成员年龄' },
  { id: 3, fieldName: '入职日期', fieldCode: 'hire_date', dataType: 'date', required: 'yes', defaultValue: '', description: '首次入职日期' },
];

const defaultRequiredFields: readonly InlineEditableRequiredField[] = ['fieldName', 'fieldCode', 'dataType', 'required'];
const fieldLabels: Record<InlineEditableRequiredField, string> = {
  fieldName: '字段名称',
  fieldCode: '字段编码',
  dataType: '数据类型',
  required: '是否必填',
  defaultValue: '默认值',
  description: '字段说明',
};

const createRow = (): InlineEditableRow => ({
  id: Date.now(),
  fieldName: '',
  fieldCode: '',
  dataType: undefined,
  required: undefined,
  defaultValue: '',
  description: '',
});

const isEmpty = (value: InlineEditableRow[InlineEditableRequiredField]) => value === undefined || value.trim() === '';

/** 数据单元格始终有描边；错误提示位始终预留，校验前后不改变行高。 */
export const InlineEditableTable = forwardRef<InlineEditableTableHandle, InlineEditableTableProps>(function InlineEditableTable(
  { toolbarVariant = 'titled', initialRows = defaultRows, onChange, requiredFields = defaultRequiredFields }, ref,
) {
  const [rows, setRows] = useState(initialRows);
  const [hasValidated, setHasValidated] = useState(false);

  const hasErrors = (candidateRows: InlineEditableRow[]) => candidateRows.some((row) =>
    requiredFields.some((field) => isEmpty(row[field])),
  );

  useImperativeHandle(ref, () => ({
    validate: () => {
      setHasValidated(true);
      return !hasErrors(rows);
    },
    getRows: () => rows,
    clearValidation: () => setHasValidated(false),
  }));

  const commit = (nextRows: InlineEditableRow[]) => {
    setRows(nextRows);
    onChange?.(nextRows);
  };

  const update = (id: number, patch: Partial<InlineEditableRow>) => {
    commit(rows.map((row) => row.id === id ? { ...row, ...patch } : row));
  };

  const add = () => commit([...rows, createRow()]);
  const remove = (id: number) => commit(rows.filter((row) => row.id !== id));

  const errorFor = (row: InlineEditableRow, field: InlineEditableRequiredField) =>
    hasValidated && requiredFields.includes(field) && isEmpty(row[field])
      ? `${field === 'dataType' || field === 'required' ? '请选择' : '请填写'}${fieldLabels[field]}`
      : undefined;

  const header = (field: InlineEditableRequiredField) => (
    <span>{requiredFields.includes(field) && <span className="sh-inline-editable-table__required" aria-hidden="true">* </span>}{fieldLabels[field]}</span>
  );

  const cell = (row: InlineEditableRow, field: InlineEditableRequiredField, control: (error?: string, helpId?: string) => ReactNode) => {
    const error = errorFor(row, field);
    const helpId = `sh-inline-editable-${row.id}-${field}-help`;
    return (
      <div className="sh-inline-editable-table__field">
        {control(error, error ? helpId : undefined)}
        <div id={helpId} className="sh-inline-editable-table__help" aria-live="polite">{error || '\u00a0'}</div>
      </div>
    );
  };

  const columns: ColumnsType<InlineEditableRow> = [
    {
      title: header('fieldName'), key: 'fieldName', width: 156,
      render: (_: unknown, row) => cell(row, 'fieldName', (error, helpId) => <Input aria-label={`第${row.id}行字段名称`} aria-invalid={!!error} aria-describedby={helpId} status={error ? 'error' : undefined} placeholder="请输入" value={row.fieldName} onChange={(event) => update(row.id, { fieldName: event.target.value })} />),
    },
    {
      title: header('fieldCode'), key: 'fieldCode', width: 156,
      render: (_: unknown, row) => cell(row, 'fieldCode', (error, helpId) => <Input aria-label={`第${row.id}行字段编码`} aria-invalid={!!error} aria-describedby={helpId} status={error ? 'error' : undefined} placeholder="请输入" spellCheck={false} value={row.fieldCode} onChange={(event) => update(row.id, { fieldCode: event.target.value })} />),
    },
    {
      title: header('dataType'), key: 'dataType', width: 140,
      render: (_: unknown, row) => cell(row, 'dataType', (error, helpId) => <Select aria-label={`第${row.id}行数据类型`} aria-invalid={!!error} aria-describedby={helpId} status={error ? 'error' : undefined} placeholder="请选择" value={row.dataType} onChange={(value) => update(row.id, { dataType: value })} options={[{ value: 'text', label: '文本' }, { value: 'number', label: '数字' }, { value: 'date', label: '日期' }]} />),
    },
    {
      title: header('required'), key: 'required', width: 128,
      render: (_: unknown, row) => cell(row, 'required', (error, helpId) => <Select aria-label={`第${row.id}行是否必填`} aria-invalid={!!error} aria-describedby={helpId} status={error ? 'error' : undefined} placeholder="请选择" value={row.required} onChange={(value) => update(row.id, { required: value })} options={[{ value: 'yes', label: '是' }, { value: 'no', label: '否' }]} />),
    },
    {
      title: header('defaultValue'), key: 'defaultValue', width: 156,
      render: (_: unknown, row) => cell(row, 'defaultValue', (error, helpId) => <Input aria-label={`第${row.id}行默认值`} aria-invalid={!!error} aria-describedby={helpId} status={error ? 'error' : undefined} placeholder="请输入" value={row.defaultValue} onChange={(event) => update(row.id, { defaultValue: event.target.value })} />),
    },
    {
      title: header('description'), key: 'description', width: 200,
      render: (_: unknown, row) => cell(row, 'description', (error, helpId) => <Input aria-label={`第${row.id}行字段说明`} aria-invalid={!!error} aria-describedby={helpId} status={error ? 'error' : undefined} placeholder="请输入" value={row.description} onChange={(event) => update(row.id, { description: event.target.value })} />),
    },
    {
      title: '操作', key: 'action', width: 72, fixed: 'right',
      render: (_: unknown, row) => <Button aria-label={`删除第${row.id}行`} icon={<LocalIcon svg={deleteIconSvg} size={16} />} type="text" onClick={() => remove(row.id)} />,
    },
  ];

  const addButton = <AppButton type="primary" icon={<LocalIcon svg={addIconSvg} size={16} />} onClick={add}>新增字段</AppButton>;

  return (
    <div className="sh-inline-editable-table">
      <DataTable<InlineEditableRow>
        actions={<Space size={8}>{addButton}</Space>}
        columns={columns}
        dataSource={rows}
        pagination={false}
        rowKey="id"
        scroll={{ x: 1008 }}
        title={toolbarVariant === 'titled' ? `字段配置（${rows.length}）` : undefined}
        toolbarVariant={toolbarVariant}
      />
    </div>
  );
});
