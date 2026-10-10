import { useEffect, useState, type ReactNode } from 'react';
import { Button, Form, Input, Switch, Typography, type FormItemProps } from 'antd';

const { Text } = Typography;

export type AppFormItemMode = 'readonly' | 'read-edit' | 'editing' | 'edit' | 'switch' | 'error';

export type AppFormItemProps = Omit<FormItemProps, 'children'> & {
  /** 字段内容的状态，与 layout 完全独立。 */
  mode?: AppFormItemMode;
  /** 只读状态展示的值。 */
  displayValue?: ReactNode;
  /** 标签下方的补充描述。 */
  description?: ReactNode;
  /** 开关状态的默认值，仅在未传入 children 时生效。 */
  defaultChecked?: boolean;
  /** 单项可读可编辑的初始文本值。 */
  editableValue?: string;
  editText?: ReactNode;
  completeText?: ReactNode;
  /** @deprecated 请使用 completeText。 */
  saveText?: ReactNode;
  onEdit?: () => void;
  onValueChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  /** @deprecated 请使用 onComplete。 */
  onSave?: (value: string) => void;
  children?: ReactNode;
};

function FieldLabel({ label, required, htmlFor }: Pick<AppFormItemProps, 'label' | 'required' | 'htmlFor'>) {
  return (
    <label className="sh-form-item__label" htmlFor={htmlFor}>
      {required && <span className="sh-form-item__required" aria-hidden="true">*</span>}
      <span>{label}</span>
    </label>
  );
}

/**
 * MasterGo Form Item：layout 只描述“字段与内容”的位置关系，mode 只描述内容状态。
 */
export function AppFormItem({
  mode = 'edit',
  displayValue,
  description,
  defaultChecked,
  editableValue,
  editText = '编辑',
  completeText,
  saveText,
  onEdit,
  onValueChange,
  onComplete,
  onSave,
  className,
  children,
  label,
  required,
  htmlFor,
  layout = 'vertical',
  validateStatus,
  help,
  ...formItemProps
}: AppFormItemProps) {
  const rootClassName = ['sh-form-item', className].filter(Boolean).join(' ');
  const initialText = editableValue ?? (typeof displayValue === 'string' ? displayValue : '');
  const [isEditing, setIsEditing] = useState(mode === 'editing');
  const [draftValue, setDraftValue] = useState(initialText);
  const [committedValue, setCommittedValue] = useState(initialText);

  useEffect(() => {
    const nextValue = editableValue ?? (typeof displayValue === 'string' ? displayValue : '');
    setDraftValue(nextValue);
    setCommittedValue(nextValue);
  }, [displayValue, editableValue]);

  useEffect(() => {
    setIsEditing(mode === 'editing');
  }, [mode]);

  const startEditing = () => {
    setDraftValue(committedValue);
    setIsEditing(true);
    onEdit?.();
  };

  const finishEditing = () => {
    setCommittedValue(draftValue);
    if (mode === 'read-edit') setIsEditing(false);
    onComplete?.(draftValue);
    onSave?.(draftValue);
  };

  const defaultEditor = (
    <Input
      id={htmlFor}
      value={draftValue}
      onChange={(event) => {
        setDraftValue(event.target.value);
        onValueChange?.(event.target.value);
      }}
    />
  );

  if (mode === 'readonly' || mode === 'read-edit') {
    return (
      <div className={rootClassName} data-layout={layout} data-mode={isEditing ? 'editing' : mode}>
        <FieldLabel label={label} required={required} htmlFor={htmlFor} />
        <div className="sh-form-item__content">
          {isEditing ? (
            <div className="sh-form-item__editing">
              <div className="sh-form-item__control">{children ?? defaultEditor}</div>
              <Button size="small" type="primary" onClick={finishEditing}>{completeText ?? saveText ?? '完成'}</Button>
            </div>
          ) : (
            <div className="sh-form-item__readonly-body">
              <div className="sh-form-item__readonly-copy">
                {description && <Text type="secondary" className="sh-form-item__description">{description}</Text>}
                <div className="sh-form-item__value">{committedValue || displayValue || children || '—'}</div>
              </div>
              {mode === 'read-edit' && <Button size="small" onClick={startEditing}>{editText}</Button>}
            </div>
          )}
        </div>
      </div>
    );
  }

  const control = mode === 'switch' && children === undefined
    ? <Switch defaultChecked={defaultChecked} />
    : children;
  const resolvedStatus = mode === 'error' ? 'error' : validateStatus;
  const resolvedHelp = mode === 'error' ? (help ?? '请检查并修正该字段') : help;

  return (
    <div className={rootClassName} data-layout={layout} data-mode={mode}>
      <FieldLabel label={label} required={required} htmlFor={htmlFor} />
      <div className="sh-form-item__content">
        {description && <Text type="secondary" className="sh-form-item__description">{description}</Text>}
        <Form.Item
          {...formItemProps}
          className="sh-form-item__antd"
          help={resolvedHelp}
          htmlFor={htmlFor}
          required={required}
          validateStatus={resolvedStatus}
        >
          {mode === 'editing' ? (
            <div className="sh-form-item__editing">
              <div className="sh-form-item__control">{control}</div>
              <Button size="small" type="primary" onClick={finishEditing}>{completeText ?? saveText ?? '完成'}</Button>
            </div>
          ) : control}
        </Form.Item>
      </div>
    </div>
  );
}
