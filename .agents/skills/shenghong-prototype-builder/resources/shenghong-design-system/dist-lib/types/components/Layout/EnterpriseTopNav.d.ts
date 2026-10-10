import { type NotificationItem } from './NotificationPanel';
export type EnterpriseTopMenu = 'organization' | 'user' | null;
export type EnterpriseUserAction = 'profile' | 'team' | 'password' | 'logout';
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
export declare function EnterpriseTopNav({ organization, organizations, userName, avatarText, notifications, notificationOpen, openMenu, lingxiaoActive, onOpenMenuChange, onOrganizationChange, onUserAction, onLingxiaoClick, onNotificationClick, onNotificationOpenChange, className, }: EnterpriseTopNavProps): import("react").JSX.Element;
