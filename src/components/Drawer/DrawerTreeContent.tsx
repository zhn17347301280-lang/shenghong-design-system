import type { ReactNode } from 'react';
import { DrawerContentPanel } from './DrawerContent';

export interface DrawerTreeNode {
  key: string;
  label: ReactNode;
  children?: DrawerTreeNode[];
}

export interface DrawerTreeContentProps {
  title?: ReactNode;
  nodes: DrawerTreeNode[];
  className?: string;
}

function TreeNodes({ nodes }: { nodes: DrawerTreeNode[] }) {
  return <ul className="sh-drawer-tree__list">{nodes.map((node) => <li key={node.key}>
    {node.children?.length ? <details open><summary>{node.label}</summary><TreeNodes nodes={node.children} /></details> : <span className="sh-drawer-tree__leaf">{node.label}</span>}
  </li>)}</ul>;
}

/** 分层字段/权限等树状内容，使用原生 details 支持展开与键盘操作。 */
export function DrawerTreeContent({ title, nodes, className }: DrawerTreeContentProps) {
  return <DrawerContentPanel title={title} className={['sh-drawer-tree', className].filter(Boolean).join(' ')}><TreeNodes nodes={nodes} /></DrawerContentPanel>;
}
