import type { ReactNode } from 'react';
export interface MessageActionsProps {
    /** 回答操作列显示引用、点踩、复制；问题操作列只显示引用。 */
    type?: 'answer' | 'question';
    timestamp?: ReactNode;
    quoted?: boolean;
    disliked?: boolean;
    copied?: boolean;
    onQuote?: () => void;
    onDislike?: () => void;
    onCopy?: () => void;
}
export declare function MessageActions({ type, timestamp, quoted, disliked, copied, onQuote, onDislike, onCopy }: MessageActionsProps): import("react").JSX.Element;
