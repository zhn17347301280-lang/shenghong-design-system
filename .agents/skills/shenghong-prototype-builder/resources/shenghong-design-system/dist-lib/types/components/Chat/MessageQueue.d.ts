import type { ReactNode } from 'react';
export type QueuePhase = 'understanding' | 'processing' | 'awaiting-confirmation';
export type QueueDisplayState = 'active' | 'inserting' | 'hitl' | 'paused' | 'cancelled' | 'empty';
export type QueueItemStatus = 'queued' | 'inserting' | 'waiting' | 'paused' | 'hitl-inserting' | 'hitl-waiting' | 'running' | 'failed';
export interface QueueMessage {
    id: string;
    content: ReactNode;
    status?: QueueItemStatus;
    /** 首个文件名与数量用于展示设计稿中的文本 + 文件条目。 */
    fileName?: string;
    fileCount?: number;
    /** 保留全部文件名，编辑队列消息时可还原到输入框。 */
    fileNames?: string[];
    attachment?: ReactNode;
}
export interface MessageQueueProps {
    items: QueueMessage[];
    phase?: QueuePhase;
    state?: QueueDisplayState;
    expanded?: boolean;
    totalCount?: number;
    queuedCount?: number;
    onExpandedChange?: (expanded: boolean) => void;
    onPauseQueue?: () => void;
    onResumeQueue?: () => void;
    onDiscussNewWork?: () => void;
    onInsert?: (item: QueueMessage) => void;
    onEdit?: (item: QueueMessage) => void;
    onRemove?: (item: QueueMessage) => void;
}
export declare function MessageQueue({ items, phase, state, expanded, totalCount, queuedCount, onExpandedChange, onPauseQueue, onResumeQueue, onDiscussNewWork, onInsert, onEdit, onRemove, }: MessageQueueProps): import("react").JSX.Element;
