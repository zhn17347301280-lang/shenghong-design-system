import type { ReactNode } from 'react';
export interface NotificationItem {
    id: string;
    content: ReactNode;
    time: string;
}
export declare const DEFAULT_NOTIFICATIONS: NotificationItem[];
export declare function NotificationPanel({ items }: {
    items: NotificationItem[];
}): import("react").JSX.Element;
