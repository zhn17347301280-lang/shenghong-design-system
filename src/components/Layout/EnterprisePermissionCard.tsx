import { useState } from 'react';
import { Checkbox } from 'antd';

export interface EnterprisePermissionNode {
  key: string;
  title: string;
  options?: string[];
  children?: EnterprisePermissionNode[];
}

const permissionOptions = ['查看', '创建', '编辑', '删除'];

export const ENTERPRISE_PERMISSION_GROUPS: EnterprisePermissionNode[] = [
  { key: 'lingxiao', title: '凌霄', options: ['查看', '使用'], children: [
    { key: 'personalize', title: '个性化', options: permissionOptions },
    { key: 'approval', title: '智能审批设置', options: permissionOptions },
  ] },
  { key: 'organization', title: '组织与权限', options: ['查看'], children: [
    { key: 'organization-management', title: '组织管理', options: permissionOptions, children: [
      { key: 'department', title: '部门管理', options: permissionOptions },
    ] },
    { key: 'member-management', title: '成员管理', options: ['查看', '邀请', '编辑', '删除'] },
    { key: 'role-management', title: '角色与权限管理', options: permissionOptions },
  ] },
  { key: 'knowledge', title: '知识中枢', options: ['查看'], children: [
    { key: 'ontoforge', title: 'OntoForge', options: permissionOptions },
  ] },
];

function descendantOptionKeys(node: EnterprisePermissionNode): string[] {
  return [
    ...(node.options ?? []).map((_, index) => `${node.key}:${index}`),
    ...(node.children ?? []).flatMap(descendantOptionKeys),
  ];
}

function PermissionBranch({ node, level, selected, onSelectedChange }: {
  node: EnterprisePermissionNode;
  level: 1 | 2 | 3;
  selected: string[];
  onSelectedChange: (keys: string[]) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const descendants = descendantOptionKeys(node);
  const count = descendants.filter((key) => selected.includes(key)).length;
  const checked = descendants.length > 0 && count === descendants.length;
  const toggleAll = () => onSelectedChange(checked
    ? selected.filter((key) => !descendants.includes(key))
    : [...new Set([...selected, ...descendants])]);
  const hasContent = Boolean(node.options?.length || node.children?.length);

  return <div className={`sh-enterprise-permission-card sh-enterprise-permission-card--level-${level}`} data-expanded={expanded}>
    <div className="sh-enterprise-permission-card__heading">
      {hasContent ? <button className="sh-enterprise-permission-card__toggle" type="button" aria-label={`${expanded ? '收起' : '展开'}${node.title}`} aria-expanded={expanded} onClick={() => setExpanded((value) => !value)}><span /></button> : <span className="sh-enterprise-permission-card__toggle" />}
      <Checkbox aria-label={`选择${node.title}全部权限`} checked={checked} indeterminate={count > 0 && !checked} onChange={toggleAll} />
      <span className="sh-enterprise-permission-card__title">{node.title}</span>
    </div>
    {expanded && hasContent && <div className="sh-enterprise-permission-card__body">
      {!!node.options?.length && <div className="sh-enterprise-permission-card__options">
        {node.options.map((label, index) => {
          const key = `${node.key}:${index}`;
          return <Checkbox key={key} checked={selected.includes(key)} onChange={(event) => onSelectedChange(event.target.checked ? [...selected, key] : selected.filter((item) => item !== key))}>{label}</Checkbox>;
        })}
      </div>}
      {node.children?.map((child) => <PermissionBranch key={child.key} node={child} level={Math.min(level + 1, 3) as 1 | 2 | 3} selected={selected} onSelectedChange={onSelectedChange} />)}
    </div>}
  </div>;
}

/** MasterGo 一级、二级、三级「表单树卡片」共用的递归组件。 */
export function EnterprisePermissionCard({ node, level = 1, selectedKeys, onSelectedKeysChange }: {
  node: EnterprisePermissionNode;
  level?: 1 | 2 | 3;
  selectedKeys?: string[];
  onSelectedKeysChange?: (keys: string[]) => void;
}) {
  const [internalSelected, setInternalSelected] = useState<string[]>([]);
  return <PermissionBranch node={node} level={level} selected={selectedKeys ?? internalSelected} onSelectedChange={onSelectedKeysChange ?? setInternalSelected} />;
}

export function EnterprisePermissionTree({ groups = ENTERPRISE_PERMISSION_GROUPS }: { groups?: EnterprisePermissionNode[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const all = groups.flatMap(descendantOptionKeys);
  const isAll = all.length > 0 && all.every((key) => selected.includes(key));
  return <div className="sh-enterprise-permission-tree">
    <div className="sh-enterprise-permission-tree__header"><h4>功能权限</h4><Checkbox checked={isAll} indeterminate={selected.length > 0 && !isAll} onChange={() => setSelected(isAll ? [] : all)}>全选</Checkbox></div>
    {groups.map((group) => <EnterprisePermissionCard key={group.key} node={group} selectedKeys={selected} onSelectedKeysChange={setSelected} />)}
  </div>;
}
