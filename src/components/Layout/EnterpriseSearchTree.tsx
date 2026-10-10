import { useState } from 'react';
import { Button, Input, Space } from 'antd';
import { LocalIcon } from '../Icon/LocalIcon';
import folderIcon from '../../icons/svg/通用-文件夹.svg?raw';
import organizationIcon from '../../icons/svg/企业智能平台-侧边栏-组织与权限.svg?raw';
import searchIcon from '../../icons/svg/通用-搜索.svg?raw';

export type EnterpriseSearchTreeType = 'organization' | 'files';

export interface EnterpriseSearchTreeNode {
  key: string;
  title: string;
  children?: EnterpriseSearchTreeNode[];
}

const organizationNodes: EnterpriseSearchTreeNode[] = [
  { key: 'group', title: '盛虹控股集团', children: [
    { key: 'petrochemical', title: '盛虹石化', children: [
      { key: 'marketing', title: '营销中心', children: [{ key: 'sales', title: '销售部' }] },
      { key: 'hr', title: '人力资源部', children: [{ key: 'recruitment', title: '招聘组' }] },
      { key: 'tech', title: '技术研发部', children: [{ key: 'tech-team', title: '研发一组' }] },
      { key: 'other', title: 'XXXXXX', children: [{ key: 'other-team', title: '下属部门' }] },
    ] },
    { key: 'east', title: '江苏东方盛虹股份有限公司', children: [
      { key: 'purchase', title: '采购部', children: [{ key: 'purchase-team', title: '采购一组' }] },
      { key: 'production', title: '生产运营部', children: [{ key: 'production-team', title: '运营一组' }] },
      { key: 'finance', title: '财务部', children: [{ key: 'finance-team', title: '会计组' }] },
      { key: 'east-other', title: 'XXXXXX', children: [{ key: 'east-other-team', title: '下属部门' }] },
    ] },
    { key: 'power', title: '盛泽热电厂', children: [{ key: 'power-team', title: '下属部门' }] },
    { key: 'market', title: '苏州盛泽市场经营管理有限公司', children: [{ key: 'market-team', title: '下属部门' }] },
    { key: 'group-other', title: 'XXXXXX', children: [{ key: 'group-other-team', title: '下属部门' }] },
  ] },
  { key: 'other-group', title: 'XXXXX集团', children: [{ key: 'chemical', title: '化工事业部' }] },
];

const fileNodes: EnterpriseSearchTreeNode[] = [
  { key: 'folder-1', title: '文件夹 1', children: [
    { key: 'folder-1-child', title: '文件夹 1' },
    { key: 'folder-2', title: '文件夹 2', children: [
      { key: 'folder-2-child', title: '文件夹 2' },
      { key: 'folder-3', title: '文件夹 3', children: [
        { key: 'folder-3-child', title: '文件夹 3' },
        { key: 'folder-4', title: '文件夹 4', children: [
          { key: 'folder-4-child', title: '文件夹 4' },
          { key: 'folder-5', title: '文件夹 5', children: [{ key: 'folder-5-child', title: '文件夹 5' }] },
        ] },
      ] },
    ] },
  ] },
];

function filterNodes(nodes: EnterpriseSearchTreeNode[], query: string): EnterpriseSearchTreeNode[] {
  if (!query.trim()) return nodes;
  return nodes.flatMap((node) => {
    const children = node.children ? filterNodes(node.children, query) : [];
    return node.title.toLowerCase().includes(query.toLowerCase()) || children.length ? [{ ...node, children }] : [];
  });
}

/** MasterGo「树-搜索」：组织树与知识库文件夹树共用行、展开和搜索行为。 */
export function EnterpriseSearchTree({ type, selectedKey, onSelect, className }: {
  type: EnterpriseSearchTreeType;
  selectedKey?: string;
  onSelect?: (key: string) => void;
  className?: string;
}) {
  const [query, setQuery] = useState('');
  const [internalSelected, setInternalSelected] = useState(type === 'organization' ? 'tech' : 'folder-5-child');
  const [expanded, setExpanded] = useState<string[]>(type === 'organization'
    ? ['group', 'petrochemical', 'east'] : ['folder-1', 'folder-2', 'folder-3', 'folder-4', 'folder-5']);
  const isFile = type === 'files';
  const rootNodes = filterNodes(isFile ? fileNodes : organizationNodes, query);
  const currentSelected = selectedKey ?? internalSelected;

  const toggle = (key: string) => setExpanded((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key]);
  const select = (key: string) => { if (selectedKey === undefined) setInternalSelected(key); onSelect?.(key); };
  const renderNodes = (nodes: EnterpriseSearchTreeNode[], depth = 0): React.ReactNode => nodes.map((node) => {
    const hasChildren = !!node.children?.length;
    const isOpen = expanded.includes(node.key) || !!query;
    const showIcon = isFile || depth === 0;
    return <div key={node.key} className="sh-enterprise-search-tree__branch">
      <div className="sh-enterprise-search-tree__row" data-selected={currentSelected === node.key} style={{ paddingLeft: depth * 16 }}>
        {hasChildren ? <button className="sh-enterprise-search-tree__toggle" type="button" aria-label={`${isOpen ? '收起' : '展开'}${node.title}`} aria-expanded={isOpen} onClick={() => toggle(node.key)}><span /></button> : <span className="sh-enterprise-search-tree__toggle" />}
        {showIcon && <LocalIcon svg={isFile ? folderIcon : organizationIcon} size={16} />}
        <button className="sh-enterprise-search-tree__label" type="button" title={node.title} onClick={() => select(node.key)}>{node.title}</button>
      </div>
      {hasChildren && isOpen && <div>{renderNodes(node.children!, depth + 1)}</div>}
    </div>;
  });

  return <aside className={['sh-enterprise-search-tree', `sh-enterprise-search-tree--${type}`, className].filter(Boolean).join(' ')} aria-label={isFile ? '知识库文件夹树' : '组织树'}>
    <Space.Compact className="sh-enterprise-search-tree__search" block>
      <Input
        className="sh-enterprise-search-tree__field"
        aria-label={isFile ? '搜索文件或文件夹名称' : '搜索组织名称'}
        placeholder={isFile ? '文件/文件夹名称' : '组织名称'}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onPressEnter={() => setQuery(query.trim())}
        allowClear
      />
      <Button aria-label="搜索" type="default" icon={<LocalIcon svg={searchIcon} size={16} />} onClick={() => setQuery(query.trim())} />
    </Space.Compact>
    <div className="sh-enterprise-search-tree__items" role="tree">{renderNodes(rootNodes)}</div>
  </aside>;
}
