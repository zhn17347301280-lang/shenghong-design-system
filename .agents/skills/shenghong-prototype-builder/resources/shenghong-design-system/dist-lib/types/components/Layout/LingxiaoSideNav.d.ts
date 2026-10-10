import { type ReactNode } from 'react';
import type { MenuProps } from 'antd';
import { type NotificationItem } from './NotificationPanel';
import iconSkill from '../../icons/svg/凌霄侧边栏-skill管理.svg?raw';
export { iconSkill };
/** 与凌霄对话入口 key。 */
export declare const LINGXIAO_CHAT_KEY = "chat";
/** 消息通知入口 key。 */
export declare const LINGXIAO_NOTIFICATION_KEY = "notifications";
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
export declare function LingxiaoSideNav({ activeKey, defaultActiveKey, onSelect, items, notifications, personalSpaceName, spaceName, spaceCompany, spaces, avatarText, onUserMenuClick, children, }: LingxiaoSideNavProps): import("react").JSX.Element;
