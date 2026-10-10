import type { ReactNode } from 'react';
import type { MenuProps } from 'antd';
export interface EnterpriseShellProps {
    brand?: ReactNode;
    items: MenuProps['items'];
    selectedKeys?: string[];
    collapsed?: boolean;
    workspace?: string;
    workspaces?: Array<{
        label: ReactNode;
        value: string;
    }>;
    userName?: ReactNode;
    avatar?: ReactNode;
    headerActions?: ReactNode;
    children: ReactNode;
    onMenuClick?: MenuProps['onClick'];
    onWorkspaceChange?: (value: string) => void;
}
export declare function EnterpriseShell({ brand, items, selectedKeys, collapsed, workspace, workspaces, userName, avatar, headerActions, children, onMenuClick, onWorkspaceChange, }: EnterpriseShellProps): import("react").JSX.Element;
