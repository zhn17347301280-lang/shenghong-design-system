import { useState, type ReactNode } from 'react';
import { Checkbox, Flex, Radio, Segmented, Space, Tag, Typography } from 'antd';
import { AppButton, AppFormItem, AppInput, AppSelect, AppSwitch, AppTextArea } from '../index';

const { Paragraph, Text, Title } = Typography;

type FormLayout = 'vertical' | 'horizontal';
type FieldKind =
  | 'text'
  | 'textarea'
  | 'select'
  | 'segmented'
  | 'radio'
  | 'checkbox'
  | 'combined'
  | 'tags'
  | 'switch';
/** 同一行内容的三种呈现形式：可编辑 / 仅可读 / 可读可编辑（默认只读，点“编辑”转输入）。 */
type ContentForm = 'edit' | 'readonly' | 'read-edit';
type ValidateState = 'normal' | 'error';

const selectOptions = [
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
  { label: '选项3', value: '3' },
  { label: '选项4', value: '4' },
  { label: '选项5', value: '5' },
];

interface KindConfig {
  key: FieldKind;
  label: string;
  /** 该种类支持的内容形式。 */
  forms: ContentForm[];
  /** 该种类在可编辑形式下是否支持错误态。 */
  supportsError: boolean;
}

const fieldKinds: KindConfig[] = [
  { key: 'text', label: '单排文字', forms: ['edit', 'readonly', 'read-edit'], supportsError: true },
  { key: 'textarea', label: '多排文字', forms: ['edit', 'readonly', 'read-edit'], supportsError: true },
  { key: 'select', label: '下拉选择', forms: ['edit', 'readonly', 'read-edit'], supportsError: true },
  { key: 'segmented', label: 'Tab 切换', forms: ['edit'], supportsError: false },
  { key: 'radio', label: '单选', forms: ['edit', 'readonly', 'read-edit'], supportsError: false },
  { key: 'checkbox', label: '多选', forms: ['edit', 'readonly', 'read-edit'], supportsError: false },
  { key: 'combined', label: '多字段合并', forms: ['edit'], supportsError: true },
  { key: 'tags', label: '标签内容', forms: ['readonly'], supportsError: false },
  { key: 'switch', label: '开关', forms: ['edit'], supportsError: false },
];

const formOptions: Array<{ key: ContentForm; label: string; hint: string }> = [
  { key: 'edit', label: '可编辑', hint: '直接展示输入控件' },
  { key: 'readonly', label: '仅可读', hint: '只展示文本，不能修改' },
  { key: 'read-edit', label: '可读可编辑', hint: '默认只读，点击“编辑”转为输入' },
];

const ERROR_HELP = '字段内容不符合要求';

/** 多选的可读可编辑：只读态展示已选标签，编辑态勾选/取消后标签实时同步。 */
function CheckboxReadEditField({ layout }: { layout: FormLayout }) {
  const [checked, setChecked] = useState<string[]>(selectOptions.map((option) => option.value));
  const tags = (
    <Space size={[4, 4]} wrap>
      {selectOptions
        .filter((option) => checked.includes(option.value))
        .map((option) => <Tag key={option.value}>{option.label}</Tag>)}
    </Space>
  );
  return (
    <AppFormItem layout={layout} label="字段" required mode="read-edit" displayValue={tags}>
      <Checkbox.Group options={selectOptions} value={checked} onChange={(values) => setChecked(values as string[])} />
    </AppFormItem>
  );
}

function FieldPreview({ kind, form, error, layout }: { kind: FieldKind; form: ContentForm; error: boolean; layout: FormLayout }) {
  const isError = error && form === 'edit';
  const errorProps = isError ? { validateStatus: 'error' as const, help: ERROR_HELP } : {};

  const renderEdit = (): ReactNode => {
    switch (kind) {
      case 'text':
        return (
          <AppFormItem layout={layout} label="字段" required htmlFor="field-text" {...errorProps}>
            <AppInput id="field-text" status={isError ? 'error' : ''} placeholder="请输入xxxx" maxLength={50} showCount />
          </AppFormItem>
        );
      case 'textarea':
        return (
          <AppFormItem layout={layout} label="字段" required htmlFor="field-textarea" {...errorProps}>
            <AppTextArea id="field-textarea" status={isError ? 'error' : ''} placeholder="请输入xxxxxxxxxxxx" maxLength={200} showCount autoSize={{ minRows: 2, maxRows: 4 }} />
          </AppFormItem>
        );
      case 'select':
        return (
          <AppFormItem layout={layout} label="字段" required {...errorProps}>
            <AppSelect placeholder="请选择" status={isError ? 'error' : undefined} options={selectOptions} />
          </AppFormItem>
        );
      case 'segmented':
        return (
          <AppFormItem layout={layout} label="字段">
            <Segmented options={['标签1', '标签2', '标签3']} />
          </AppFormItem>
        );
      case 'radio':
        return (
          <AppFormItem layout={layout} label="字段" required>
            <Radio.Group options={selectOptions} defaultValue="1" />
          </AppFormItem>
        );
      case 'checkbox':
        return (
          <AppFormItem layout={layout} label="字段" required>
            <Checkbox.Group options={selectOptions} defaultValue={['1', '2', '3', '4', '5']} />
          </AppFormItem>
        );
      case 'combined':
        return (
          <AppFormItem layout={layout} label="字段" required {...errorProps}>
            <Space.Compact block>
              <AppInput status={isError ? 'error' : ''} placeholder="字段1" />
              <AppSelect defaultValue="1" status={isError ? 'error' : undefined} options={selectOptions.slice(0, 3)} />
              <AppInput status={isError ? 'error' : ''} placeholder="字段2" />
            </Space.Compact>
          </AppFormItem>
        );
      case 'tags':
        return null;
      case 'switch':
        return (
          <AppFormItem layout={layout} label="字段" mode="switch">
            <Space>
              <AppSwitch defaultChecked />
              <Text>已开启</Text>
            </Space>
          </AppFormItem>
        );
      default:
        return null;
    }
  };

  const renderReadonly = (): ReactNode => {
    switch (kind) {
      case 'text':
      case 'textarea':
        return <AppFormItem layout={layout} label="字段" mode="readonly" displayValue="字段内容 xxxxxxxxxxxxxx" />;
      case 'select':
        return <AppFormItem layout={layout} label="字段" mode="readonly" displayValue="选项2" />;
      case 'radio':
        return <AppFormItem layout={layout} label="字段" mode="readonly" displayValue="选项1" />;
      case 'checkbox':
        return (
          <AppFormItem layout={layout} label="字段" mode="readonly">
            <Space size={[4, 4]} wrap>
              {selectOptions.map((option) => <Tag key={option.value}>{option.label}</Tag>)}
            </Space>
          </AppFormItem>
        );
      case 'tags':
        return (
          <AppFormItem layout={layout} label="字段" mode="readonly">
            <Space size={[4, 4]} wrap>
              <Tag>tag1</Tag>
              <Tag>tag2</Tag>
              <Tag>tag3</Tag>
            </Space>
          </AppFormItem>
        );
      default:
        return null;
    }
  };

  const renderReadEdit = (): ReactNode => {
    switch (kind) {
      case 'text':
        return <AppFormItem layout={layout} label="字段" mode="read-edit" editableValue="字段内容 xxxxxxxxxxxxxx" />;
      case 'textarea':
        return (
          <AppFormItem layout={layout} label="字段" mode="read-edit" editableValue="字段内容 xxxxxxxxxxxxxx">
            <AppTextArea autoSize={{ minRows: 2, maxRows: 4 }} />
          </AppFormItem>
        );
      case 'select':
        return (
          <AppFormItem layout={layout} label="字段" mode="read-edit" displayValue="选项2">
            <AppSelect defaultValue="2" options={selectOptions} />
          </AppFormItem>
        );
      case 'radio':
        return (
          <AppFormItem layout={layout} label="字段" mode="read-edit" displayValue="选项1">
            <Radio.Group options={selectOptions} defaultValue="1" />
          </AppFormItem>
        );
      case 'checkbox':
        return <CheckboxReadEditField layout={layout} />;
      default:
        return null;
    }
  };

  if (form === 'readonly') return <>{renderReadonly()}</>;
  if (form === 'read-edit') return <>{renderReadEdit()}</>;
  return <>{renderEdit()}</>;
}

export function FormShowcase() {
  const [layout, setLayout] = useState<FormLayout>('vertical');
  const [kind, setKind] = useState<FieldKind>('text');
  const [form, setForm] = useState<ContentForm>('edit');
  const [validate, setValidate] = useState<ValidateState>('normal');

  const kindConfig = fieldKinds.find((item) => item.key === kind) ?? fieldKinds[0];
  const formSupported = (candidate: ContentForm) => kindConfig.forms.includes(candidate);
  const errorEnabled = kindConfig.supportsError && form === 'edit';

  const selectKind = (next: FieldKind) => {
    const config = fieldKinds.find((item) => item.key === next) ?? fieldKinds[0];
    const nextForm = config.forms.includes(form) ? form : config.forms[0];
    setKind(next);
    setForm(nextForm);
    if (validate === 'error' && !(config.supportsError && nextForm === 'edit')) setValidate('normal');
  };

  const selectForm = (next: ContentForm) => {
    if (!formSupported(next)) return;
    setForm(next);
    if (validate === 'error' && next !== 'edit') setValidate('normal');
  };

  const layoutLabel = layout === 'vertical' ? '上下布局' : '左右布局';
  const formLabel = formOptions.find((item) => item.key === form)?.label ?? '';
  const isError = validate === 'error' && errorEnabled;
  const activeFormHint = formOptions.find((item) => item.key === form)?.hint ?? '';

  return (
    <div className="form-showcase">
      <div className="form-showcase__stage">
        <article className="form-showcase__preview">
          <Text className="form-showcase__eyebrow">
            交互预览 · {layoutLabel} · {kindConfig.label} · {formLabel}{isError ? ' · 错误' : ''}
          </Text>
          <div className="form-showcase__preview-card" key={`${layout}-${kind}-${form}`}>
            <FieldPreview kind={kind} form={form} error={isError} layout={layout} />
          </div>
          <Text type="secondary" className="form-showcase__preview-hint">{activeFormHint}</Text>
        </article>

        <aside className="form-showcase__controls" aria-label="Form Item 类型控制">
          <div>
            <Title level={4}>类型控制</Title>
            <Paragraph type="secondary">字段种类、内容形式与校验状态彼此独立：同一种内容可在可编辑 / 仅可读 / 可读可编辑三种形式间切换，错误态可作用于任意可编辑字段。</Paragraph>
          </div>

          <div className="form-showcase__control-group">
            <Text strong>1. 布局方式</Text>
            <Flex wrap gap={8}>
              <AppButton aria-pressed={layout === 'vertical'} type={layout === 'vertical' ? 'primary' : 'default'} onClick={() => setLayout('vertical')}>上下布局</AppButton>
              <AppButton aria-pressed={layout === 'horizontal'} type={layout === 'horizontal' ? 'primary' : 'default'} onClick={() => setLayout('horizontal')}>左右布局</AppButton>
            </Flex>
          </div>

          <div className="form-showcase__control-group">
            <Text strong>2. 字段种类</Text>
            <Flex wrap gap={8}>
              {fieldKinds.map((item) => (
                <AppButton
                  aria-pressed={kind === item.key}
                  key={item.key}
                  type={kind === item.key ? 'primary' : 'default'}
                  onClick={() => selectKind(item.key)}
                >
                  {item.label}
                </AppButton>
              ))}
            </Flex>
          </div>

          <div className="form-showcase__control-group">
            <Text strong>3. 内容形式</Text>
            <Flex wrap gap={8}>
              {formOptions.map((item) => {
                const disabled = !formSupported(item.key);
                return (
                  <AppButton
                    aria-pressed={form === item.key}
                    disabled={disabled}
                    key={item.key}
                    title={disabled ? `${kindConfig.label}不支持该形式` : item.hint}
                    type={form === item.key ? 'primary' : 'default'}
                    onClick={() => selectForm(item.key)}
                  >
                    {item.label}
                  </AppButton>
                );
              })}
            </Flex>
          </div>

          <div className="form-showcase__control-group">
            <Text strong>4. 校验状态</Text>
            <Flex wrap gap={8}>
              <AppButton aria-pressed={!isError} type={!isError ? 'primary' : 'default'} disabled={!errorEnabled} onClick={() => setValidate('normal')}>正常</AppButton>
              <AppButton aria-pressed={isError} danger={isError} type={isError ? 'primary' : 'default'} disabled={!errorEnabled} onClick={() => setValidate('error')}>错误</AppButton>
            </Flex>
          </div>
        </aside>
      </div>
    </div>
  );
}
