import { useEffect, useRef, useState } from 'react';
import { Popover } from 'antd';
import { LocalIcon } from '../Icon/LocalIcon';
import { DEFAULT_NOTIFICATIONS, NotificationPanel, type NotificationItem } from './NotificationPanel';
import mascot from './lingxiao-chat-normal.png?inline';
import notificationIcon from '../../icons/svg/通用-消息通知.svg?raw';
import downIcon from '../../icons/svg/通用-下.svg?raw';
import profileIcon from '../../icons/svg/凌霄-用户设置-个人信息设置.svg?raw';
import teamIcon from '../../icons/svg/凌霄-用户设置-账号与团队管理.svg?raw';
import passwordIcon from '../../icons/svg/凌霄-用户设置-修改密码.svg?raw';
import logoutIcon from '../../icons/svg/凌霄-用户设置-退出登录.svg?raw';

export type EnterpriseTopMenu = 'organization' | 'user' | null;
export type EnterpriseUserAction = 'profile' | 'team' | 'password' | 'logout';

const USER_ACTIONS: Array<{ key: EnterpriseUserAction; label: string; icon: string }> = [
  { key: 'profile', label: '个人信息设置', icon: profileIcon },
  { key: 'team', label: '账号与团队管理', icon: teamIcon },
  { key: 'password', label: '修改密码', icon: passwordIcon },
  { key: 'logout', label: '退出登录', icon: logoutIcon },
];

export interface EnterpriseTopNavProps {
  organization?: string;
  organizations?: string[];
  userName?: string;
  avatarText?: string;
  notifications?: NotificationItem[];
  notificationOpen?: boolean;
  openMenu?: EnterpriseTopMenu;
  lingxiaoActive?: boolean;
  onOpenMenuChange?: (menu: EnterpriseTopMenu) => void;
  onOrganizationChange?: (organization: string) => void;
  onUserAction?: (action: EnterpriseUserAction) => void;
  onLingxiaoClick?: () => void;
  onNotificationClick?: () => void;
  onNotificationOpenChange?: (open: boolean) => void;
  className?: string;
}

export function EnterpriseTopNav({
  organization,
  organizations = ['盛虹石化', '组织2', '组织3', '组织4'],
  userName = '用户昵称',
  avatarText = '凌',
  notifications = DEFAULT_NOTIFICATIONS,
  notificationOpen,
  openMenu,
  lingxiaoActive = false,
  onOpenMenuChange,
  onOrganizationChange,
  onUserAction,
  onLingxiaoClick,
  onNotificationClick,
  onNotificationOpenChange,
  className,
}: EnterpriseTopNavProps) {
  const [internalOrganization, setInternalOrganization] = useState(organizations[0] ?? '盛虹石化');
  const [internalMenu, setInternalMenu] = useState<EnterpriseTopMenu>(null);
  const [internalNotificationOpen, setInternalNotificationOpen] = useState(false);
  const currentOrganization = organization ?? internalOrganization;
  const currentMenu = openMenu === undefined ? internalMenu : openMenu;
  const currentNotificationOpen = notificationOpen === undefined ? internalNotificationOpen : notificationOpen;
  const rootRef = useRef<HTMLElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function setMenu(menu: EnterpriseTopMenu) {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
    setInternalMenu(menu);
    onOpenMenuChange?.(menu);
    if (menu) setNotificationOpen(false);
  }

  function setNotificationOpen(open: boolean) {
    setInternalNotificationOpen(open);
    onNotificationOpenChange?.(open);
    if (open) setMenu(null);
  }

  function scheduleOrganizationClose() {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setMenu(null), 120);
  }

  useEffect(() => {
    if (!currentMenu) return;
    const onOutsidePointer = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setMenu(null);
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenu(null);
    };
    document.addEventListener('pointerdown', onOutsidePointer);
    document.addEventListener('keydown', onEscape);
    return () => {
      document.removeEventListener('pointerdown', onOutsidePointer);
      document.removeEventListener('keydown', onEscape);
    };
  }, [currentMenu]);

  useEffect(() => () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  }, []);

  return (
    <header ref={rootRef} className={['sh-enterprise-top-nav', className].filter(Boolean).join(' ')}>
      <div className="sh-enterprise-top-nav__left">
        <strong className="sh-enterprise-top-nav__title">企业智能平台</strong>
        <div className="sh-enterprise-top-nav__organization" onMouseEnter={() => setMenu('organization')} onMouseLeave={scheduleOrganizationClose}>
          <button
            type="button"
            className={['sh-enterprise-top-nav__organization-button', currentMenu === 'organization' && 'is-open'].filter(Boolean).join(' ')}
            aria-label={`当前组织：${currentOrganization}`}
            aria-haspopup="menu"
            aria-expanded={currentMenu === 'organization'}
            onClick={() => setMenu('organization')}
          >
            <span>{currentOrganization}</span><LocalIcon svg={downIcon} size={16} />
          </button>
          {currentMenu === 'organization' && (
            <div className="sh-enterprise-top-nav__menu sh-enterprise-top-nav__menu--organization" role="menu" aria-label="选择组织" onMouseEnter={() => { if (closeTimerRef.current) clearTimeout(closeTimerRef.current); }}>
              {organizations.map((item) => (
                <button key={item} type="button" role="menuitem" className={['sh-enterprise-top-nav__menu-item', item === currentOrganization && 'is-selected'].filter(Boolean).join(' ')} onClick={() => { setInternalOrganization(item); onOrganizationChange?.(item); setMenu(null); }}>{item}</button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="sh-enterprise-top-nav__right">
        <button type="button" className={['sh-enterprise-top-nav__lingxiao', lingxiaoActive && 'is-active'].filter(Boolean).join(' ')} onClick={onLingxiaoClick}>
          <img src={mascot} alt="" /><span>使用凌霄</span>
        </button>
        <Popover
          trigger="click"
          placement="bottomRight"
          open={currentNotificationOpen}
          onOpenChange={setNotificationOpen}
          classNames={{ root: 'sh-lx-notify-popover' }}
          content={<NotificationPanel items={notifications} />}
        >
          <button type="button" className={['sh-enterprise-top-nav__notification', currentNotificationOpen && 'is-active'].filter(Boolean).join(' ')} aria-label="消息通知" aria-expanded={currentNotificationOpen} onClick={onNotificationClick}>
            <LocalIcon svg={notificationIcon} size={20} />
          </button>
        </Popover>
        <div className="sh-enterprise-top-nav__user">
          <button type="button" className={['sh-enterprise-top-nav__user-button', currentMenu === 'user' && 'is-open'].filter(Boolean).join(' ')} aria-haspopup="menu" aria-expanded={currentMenu === 'user'} onClick={() => setMenu(currentMenu === 'user' ? null : 'user')}>
            <span className="sh-enterprise-top-nav__avatar">{avatarText}</span>
            <span className="sh-enterprise-top-nav__user-name">{userName}</span>
            <LocalIcon svg={downIcon} size={16} />
          </button>
          {currentMenu === 'user' && (
            <div className="sh-enterprise-top-nav__menu sh-enterprise-top-nav__menu--user" role="menu" aria-label="用户设置">
              {USER_ACTIONS.map((item) => (
                <button key={item.key} type="button" role="menuitem" className={['sh-enterprise-top-nav__menu-item', item.key === 'logout' && 'is-last'].filter(Boolean).join(' ')} onClick={() => { onUserAction?.(item.key); setMenu(null); }}>
                  <LocalIcon svg={item.icon} size={16} /><span>{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
