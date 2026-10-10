import { type ReactNode } from 'react';
import { type MessageActionsProps } from './MessageActions';
export interface ChatAttachment {
    name: ReactNode;
    meta?: ReactNode;
    icon?: ReactNode;
}
export interface ChatBubbleProps {
    role: 'user' | 'assistant';
    children: ReactNode;
    attachments?: ChatAttachment[];
    collapsed?: boolean;
    pinned?: boolean;
    collapsible?: boolean;
    actions?: MessageActionsProps;
    onToggle?: () => void;
}
export declare function ChatBubble({ role, children, attachments, collapsed, pinned, collapsible, actions, onToggle }: ChatBubbleProps): import("react").JSX.Element;
