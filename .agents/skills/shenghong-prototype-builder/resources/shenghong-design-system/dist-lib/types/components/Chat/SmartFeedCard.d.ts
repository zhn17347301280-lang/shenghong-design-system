export type SmartFeedStatus = 'complete' | 'failed' | 'running' | 'stopped' | 'pending';
export interface SmartFeedCardProps {
    title: string;
    status?: SmartFeedStatus;
    description?: string;
    scheduled?: boolean;
    reminder?: boolean;
    hasResults?: boolean;
    resultNames?: string[];
    duration?: string;
    updatedAt?: string;
    onDiscuss?: () => void;
    onMore?: (key: string) => void;
    onAction?: (action: 'detail' | 'stop' | 'retry' | 'progress' | 'confirm' | 'result', value?: string) => void;
}
export declare function SmartFeedCard({ title, status, description, scheduled, reminder, hasResults, resultNames, duration, updatedAt, onDiscuss, onMore, onAction, }: SmartFeedCardProps): import("react").JSX.Element;
