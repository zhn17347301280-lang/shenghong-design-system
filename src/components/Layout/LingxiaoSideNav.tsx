import { useState, type ReactNode } from 'react';
import { Dropdown, Popover, Tooltip } from 'antd';
import type { MenuProps } from 'antd';
import { LockOutlined, LogoutOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import { LocalIcon } from '../Icon/LocalIcon';
import { DEFAULT_NOTIFICATIONS, NotificationPanel, type NotificationItem } from './NotificationPanel';
import mascotNormal from './lingxiao-chat-normal.png?inline';
import mascotActive from './lingxiao-chat-active.png?inline';

import iconGlobalSearch from '../../icons/svg/凌霄侧边栏-全局搜索.svg?raw';
import iconPersonalize from '../../icons/svg/凌霄侧边栏-个性化.svg?raw';
import iconKnowledge from '../../icons/svg/凌霄侧边栏-我的知识库.svg?raw';
import iconSkill from '../../icons/svg/凌霄侧边栏-skill管理.svg?raw';
import iconSchedule from '../../icons/svg/凌霄侧边栏-定时任务1.svg?raw';
import iconResults from '../../icons/svg/凌霄侧边栏-成果库.svg?raw';
import iconNotification from '../../icons/svg/通用-消息通知.svg?raw';
import iconSpace from '../../icons/svg/凌霄-用户设置-空间选择.svg?raw';
import iconPersonalSpace from '../../icons/svg/凌霄-用户设置-个人空间.svg?raw';
import iconPlatform from '../../icons/svg/企业智能平台-OntoForge-企业、本体.svg?raw';

export { iconSkill };

/** 与凌霄对话入口 key。 */
export const LINGXIAO_CHAT_KEY = 'chat';
/** 消息通知入口 key。 */
export const LINGXIAO_NOTIFICATION_KEY = 'notifications';

export interface LingxiaoNavItem {
  key: string;
  label: string;
  icon: string;
}

export type LingxiaoNotification = NotificationItem;

export interface LingxiaoSideNavProps {
  /** 当前选中项（受控）。 */
  activeKey?: string;
  /** 非受控默认选中项，默认「与凌霄对话」。 */
  defaultActiveKey?: string;
  onSelect?: (key: string) => void;
  /** 中部功能导航，默认取设计稿六项。 */
  items?: LingxiaoNavItem[];
  /** 消息通知列表，默认取设计稿三条团队邀请。 */
  notifications?: LingxiaoNotification[];
  /** 个人空间名称（空间切换菜单首项）。 */
  personalSpaceName?: string;
  /** 当前企业空间名称（头像菜单当前空间）。 */
  spaceName?: string;
  spaceCompany?: string;
  /** 可切换的企业空间列表。 */
  spaces?: string[];
  /** 头像单字，默认「凌」。 */
  avatarText?: string;
  onUserMenuClick?: MenuProps['onClick'];
  /** 相邻内容区域；传入时组件会输出「侧栏 + 内容」的整行布局。 */
  children?: ReactNode;
}

const DEFAULT_ITEMS: LingxiaoNavItem[] = [
  { key: 'search', label: '全局搜索', icon: iconGlobalSearch },
  { key: 'personalize', label: '个性化', icon: iconPersonalize },
  { key: 'knowledge', label: '我的知识库', icon: iconKnowledge },
  { key: 'skill', label: 'SKILL管理', icon: iconSkill },
  { key: 'schedule', label: '定时任务', icon: iconSchedule },
  { key: 'results', label: '成果库', icon: iconResults },
];

export function LingxiaoSideNav({
  activeKey,
  defaultActiveKey = LINGXIAO_CHAT_KEY,
  onSelect,
  items = DEFAULT_ITEMS,
  notifications = DEFAULT_NOTIFICATIONS,
  personalSpaceName = '{昵称}的个人空间',
  spaceName = '江苏东方盛虹股份有限公司',
  spaceCompany = '江苏东方盛虹股份有限公司',
  spaces = ['江苏东方盛虹股份有限公司', '上海创源辰星智能科技有限公司'],
  avatarText = '凌',
  onUserMenuClick,
  children,
}: LingxiaoSideNavProps) {
  const [innerActive, setInnerActive] = useState(defaultActiveKey);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const mergedActive = activeKey ?? innerActive;

  const select = (key: string) => {
    if (activeKey == null) setInnerActive(key);
    onSelect?.(key);
  };

  const menuIcon = (svg: string) => <LocalIcon svg={svg} size={16} />;

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'space',
      icon: menuIcon(iconSpace),
      label: (
        <span className="sh-lx-user-menu__space">
          <span className="sh-lx-user-menu__space-name">{spaceName}</span>
          <span className="sh-lx-user-menu__space-company">{spaceCompany}</span>
        </span>
      ),
      children: [
        { key: 'space-personal', icon: menuIcon(iconPersonalSpace), label: personalSpaceName },
        { type: 'divider' as const },
        ...spaces.map((space) => ({
          key: `space-${space}`,
          icon: menuIcon(iconSpace),
          label: space,
        })),
        { type: 'divider' as const },
        { key: 'settle', label: '入驻企业' },
        { key: 'settle-progress', label: '查询入驻进度' },
      ],
    },
    { key: 'platform', icon: menuIcon(iconPlatform), label: '企业智能平台' },
    { type: 'divider' },
    { key: 'profile', icon: <UserOutlined />, label: '个人信息设置' },
    { key: 'team-manage', icon: <TeamOutlined />, label: '账号与团队管理' },
    { key: 'password', icon: <LockOutlined />, label: '修改密码' },
    { type: 'divider' },
    { key: 'logout', icon: <LogoutOutlined />, label: '退出登录' },
  ];

  const nav = (
    <aside className="sh-lx-sidenav" aria-label="凌霄导航">
      <Tooltip title="与凌霄对话" placement="right" overlayClassName="sh-lx-tooltip">
        <button
          type="button"
          className={[
            'sh-lx-sidenav__mascot',
            mergedActive === LINGXIAO_CHAT_KEY ? 'is-active' : '',
          ].join(' ')}
          aria-label="与凌霄对话"
          aria-pressed={mergedActive === LINGXIAO_CHAT_KEY}
          onClick={() => select(LINGXIAO_CHAT_KEY)}
        >
          <img
            className="sh-lx-sidenav__mascot-img"
            src={mergedActive === LINGXIAO_CHAT_KEY ? mascotActive : mascotNormal}
            alt=""
            draggable={false}
          />
        </button>
      </Tooltip>

      <div className="sh-lx-sidenav__group">
        {items.map((item) => {
          const active = mergedActive === item.key;
          return (
            <Tooltip key={item.key} title={item.label} placement="right" overlayClassName="sh-lx-tooltip">
              <button
                type="button"
                className={['sh-lx-sidenav__item', active ? 'is-active' : ''].join(' ')}
                aria-label={item.label}
                aria-pressed={active}
                onClick={() => select(item.key)}
              >
                <LocalIcon svg={item.icon} size={20} />
              </button>
            </Tooltip>
          );
        })}
      </div>

      <div className="sh-lx-sidenav__footer">
        <Popover
          trigger="click"
          placement="rightTop"
          open={notifyOpen}
          onOpenChange={setNotifyOpen}
          classNames={{ root: 'sh-lx-notify-popover' }}
          content={<NotificationPanel items={notifications} />}
        >
          <button
            type="button"
            className={['sh-lx-sidenav__item', notifyOpen ? 'is-active' : ''].join(' ')}
            aria-label="消息通知"
          >
            <LocalIcon svg={iconNotification} size={20} />
          </button>
        </Popover>

        <Dropdown
          trigger={['click']}
          placement="rightTop"
          open={userOpen}
          onOpenChange={setUserOpen}
          menu={{ items: userMenuItems, onClick: onUserMenuClick }}
          overlayClassName="sh-lx-user-menu"
        >
          <button
            type="button"
            className={['sh-lx-sidenav__user', userOpen ? 'is-open' : ''].join(' ')}
            aria-label="用户设置"
          >
            {avatarText}
          </button>
        </Dropdown>
      </div>
    </aside>
  );

  if (!children) return nav;

  return (
    <div className="sh-lx-sidenav-layout">
      {nav}
      <div className="sh-lx-sidenav-layout__content">{children}</div>
    </div>
  );
}
