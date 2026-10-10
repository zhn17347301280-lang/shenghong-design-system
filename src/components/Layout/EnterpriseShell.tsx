import type { ReactNode } from 'react';
import { Avatar, Button, Dropdown, Flex, Layout, Menu, Select, Space, Typography } from 'antd';
import type { MenuProps } from 'antd';
import notificationIconSvg from '../../icons/svg/通用-消息通知.svg?raw';
import { LocalIcon } from '../Icon/LocalIcon';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export interface EnterpriseShellProps {
  brand?: ReactNode;
  items: MenuProps['items'];
  selectedKeys?: string[];
  collapsed?: boolean;
  workspace?: string;
  workspaces?: Array<{ label: ReactNode; value: string }>;
  userName?: ReactNode;
  avatar?: ReactNode;
  headerActions?: ReactNode;
  children: ReactNode;
  onMenuClick?: MenuProps['onClick'];
  onWorkspaceChange?: (value: string) => void;
}

export function EnterpriseShell({
  brand = '企业智能平台',
  items,
  selectedKeys,
  collapsed,
  workspace,
  workspaces = [],
  userName = '用户昵称',
  avatar,
  headerActions,
  children,
  onMenuClick,
  onWorkspaceChange,
}: EnterpriseShellProps) {
  const userMenu: MenuProps = {
    items: [
      { key: 'profile', label: '个人信息设置' },
      { key: 'team', label: '账号与团队管理' },
      { key: 'password', label: '修改密码' },
      { type: 'divider' },
      { key: 'logout', label: '退出登录', danger: true },
    ],
  };

  return (
    <Layout className="sh-enterprise-shell">
      <Sider className="sh-enterprise-shell__sider" width={216} collapsedWidth={64} collapsed={collapsed}>
        <div className="sh-enterprise-shell__brand">{collapsed ? 'SH' : brand}</div>
        <Menu mode="inline" items={items} selectedKeys={selectedKeys} onClick={onMenuClick} />
      </Sider>
      <Layout>
        <Header className="sh-enterprise-shell__header">
          <Flex align="center" justify="space-between" gap={16}>
            <Space>
              <Text strong>{brand}</Text>
              {workspaces.length > 0 && (
                <Select value={workspace} options={workspaces} onChange={onWorkspaceChange} popupMatchSelectWidth={false} />
              )}
            </Space>
            <Space>
              {headerActions}
              <Button type="text" aria-label="消息通知" icon={<LocalIcon svg={notificationIconSvg} size={18} />} />
              <Dropdown menu={userMenu} trigger={['click']}>
                <Button type="text" className="sh-enterprise-shell__user">
                  <Avatar size={28}>{avatar ?? '凌'}</Avatar>
                  {!collapsed && userName}
                </Button>
              </Dropdown>
            </Space>
          </Flex>
        </Header>
        <Content className="sh-enterprise-shell__content">{children}</Content>
      </Layout>
    </Layout>
  );
}
