import { Flex, Space, Tabs } from 'antd';
import { FieldTypeTag, LocalIcon, StatusTag, type StatusTagTone } from '../index';
import shareIconSvg from '../icons/svg/通用-分享.svg?raw';
import { CatalogHeading } from './CatalogHeading';

const tones: { tone: StatusTagTone; label: string }[] = [
  { tone: 'info', label: '标签' },
  { tone: 'success', label: '标签' },
  { tone: 'error', label: '标签' },
  { tone: 'orange', label: '标签' },
  { tone: 'neutral', label: '标签' },
];

function BasicTags() {
  return (
    <Flex vertical gap={16} className="sh-tag-showcase__panel">
      <div>
        <CatalogHeading title="无图标" />
        <Space wrap size={[8, 8]}>
          {tones.map((t) => (
            <StatusTag key={`plain-${t.tone}`} tone={t.tone}>{t.label}</StatusTag>
          ))}
        </Space>
      </div>
      <div>
        <CatalogHeading title="有图标" />
        <Space wrap size={[8, 8]}>
          {tones.map((t) => (
            <StatusTag key={`icon-${t.tone}`} tone={t.tone} leadingIcon={<LocalIcon svg={shareIconSvg} size={12} />}>公开访问</StatusTag>
          ))}
        </Space>
      </div>
    </Flex>
  );
}

const fieldTypes = [
  { type: 'str.', value: 'Xxxxxxxxxxx' },
  { type: 'int.', value: '1024' },
  { type: 'bool.', value: 'true' },
  { type: 'list.', value: '[a, b, c]' },
];

function FieldTypeTags() {
  return (
    <Flex vertical gap={12} className="sh-tag-showcase__panel">
      <Space wrap size={[8, 8]}>
        {fieldTypes.map((f) => (
          <FieldTypeTag key={f.type} typeLabel={f.type} value={f.value} />
        ))}
        <FieldTypeTag typeLabel="null" />
      </Space>
    </Flex>
  );
}

export function TagShowcase() {
  return (
    <div className="sh-tag-showcase">
      <Tabs
        items={[
          { key: 'basic', label: '普通标签', children: <BasicTags /> },
          { key: 'field', label: '字段类型标签', children: <FieldTypeTags /> },
        ]}
      />
    </div>
  );
}
