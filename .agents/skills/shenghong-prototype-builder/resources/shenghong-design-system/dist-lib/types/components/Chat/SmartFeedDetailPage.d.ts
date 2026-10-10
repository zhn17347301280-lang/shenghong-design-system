import type { SmartFeedStatus } from './SmartFeedCard';
export type SmartFeedConfirmationKind = 'dialog' | 'form';
export interface SmartFeedDetailPageProps {
    status: SmartFeedStatus;
    confirmationKind?: SmartFeedConfirmationKind;
    onClose?: () => void;
    onStatusChange?: (status: SmartFeedStatus) => void;
}
export declare function SmartFeedDetailPage({ status, confirmationKind, onClose, onStatusChange }: SmartFeedDetailPageProps): import("react").JSX.Element;
