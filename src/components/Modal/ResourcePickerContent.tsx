import { useMemo, useState } from 'react';
import { Button, Checkbox, Input, Segmented, Tag } from 'antd';
import { LocalIcon } from '../Icon/LocalIcon';
import organizationIconSvg from '../../icons/svg/企业智能平台-侧边栏-组织与权限.svg?raw';
import memberIconSvg from '../../icons/svg/企业智能平台-组织与权限-成员管理-岗位管理.svg?raw';
import searchIconSvg from '../../icons/svg/通用-搜索.svg?raw';

const resources = [
  { key: 'org-01', label: '组织 01', kind: 'org' as const },
  { key: 'org-02', label: '组织 02', kind: 'org' as const },
  { key: 'org-03', label: '组织 03', kind: 'org' as const },
  { key: 'member-01', label: '成员 1', kind: 'member' as const },
  { key: 'member-02', label: '成员 2', kind: 'member' as const },
  { key: 'member-03', label: '成员 3', kind: 'member' as const },
];

export interface ResourcePickerContentProps {
  onCancel?: () => void;
  onConfirm?: () => void;
}

export function ResourcePickerContent({ onCancel, onConfirm }: ResourcePickerContentProps) {
  const [kind, setKind] = useState<'组织' | '成员'>('成员');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string[]>(['member-01']);
  const visibleResources = useMemo(() => resources.filter((item) => item.label.includes(query)), [query]);
  const selectedItems = resources.filter((item) => selected.includes(item.key));

  const toggle = (key: string) => {
    setSelected((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key]);
  };

  return (
    <div className="sh-resource-picker">
      <section className="sh-resource-picker__browser" aria-label="可选组织和成员">
        <h4>添加组织/成员</h4>
        <Segmented value={kind} options={['组织', '成员']} onChange={(value) => setKind(value as '组织' | '成员')} />
        <Input
          allowClear
          aria-label="搜索成员名称"
          placeholder="成员名称"
          suffix={<LocalIcon svg={searchIconSvg} size={16} />}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <strong className="sh-resource-picker__section-title">根组织</strong>
        <div className="sh-resource-picker__list">
          {visibleResources.map((item) => (
            <div className="sh-resource-picker__row" key={item.key}>
              {item.kind === 'member' ? (
                <Checkbox checked={selected.includes(item.key)} onChange={() => toggle(item.key)}>
                  <LocalIcon svg={memberIconSvg} size={16} />
                  <span>{item.label}</span>
                </Checkbox>
              ) : (
                <>
                  <span className="sh-resource-picker__resource-name">
                    <LocalIcon svg={organizationIconSvg} size={16} />
                    <span>{item.label}</span>
                  </span>
                  <Button type="link" size="small">下级</Button>
                </>
              )}
            </div>
          ))}
        </div>
      </section>
      <section className="sh-resource-picker__selected" aria-live="polite">
        <h4>已选择</h4>
        <span className="sh-resource-picker__caption">本次新增</span>
        <div className="sh-resource-picker__tags">
          {selectedItems.map((item) => (
            <Tag closable key={item.key} onClose={() => toggle(item.key)}>
              <LocalIcon svg={item.kind === 'member' ? memberIconSvg : organizationIconSvg} size={14} />
              {item.label}
            </Tag>
          ))}
        </div>
        <span className="sh-resource-picker__caption">历史已添加</span>
        <Tag className="sh-resource-picker__history" icon={<LocalIcon svg={memberIconSvg} size={14} />}>成员 2</Tag>
        <div className="sh-resource-picker__actions">
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" onClick={onConfirm}>确定</Button>
        </div>
      </section>
    </div>
  );
}
