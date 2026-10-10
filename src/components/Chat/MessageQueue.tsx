import type { ReactNode } from 'react';
import { Button } from 'antd';
import { LocalIcon } from '../Icon/LocalIcon';
import { FileTypeIcon } from '../File/FileTypeIcon';
import mascot from '../Layout/lingxiao-chat-normal.png';
import insertIcon from '../../icons/svg/凌霄-消息队列-插入队列.svg?raw';
import pauseIcon from '../../icons/svg/凌霄-消息队列-暂停.svg?raw';
import playIcon from '../../icons/svg/凌霄-消息队列-播放.svg?raw';
import editIcon from '../../icons/svg/通用-编辑.svg?raw';
import deleteIcon from '../../icons/svg/通用-删除.svg?raw';
import loadingIcon from '../../icons/svg/通用-加载.svg?raw';

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

const PHASE_LABELS: Record<QueuePhase, string> = {
  understanding: '凌霄正在理解任务...',
  processing: '凌霄正在处理任务...',
  'awaiting-confirmation': '凌霄正在等待你的确认',
};

function QueueAction({
  label, icon, onClick, disabled = false, tone,
}: {
  label: string;
  icon?: string;
  onClick?: () => void;
  disabled?: boolean;
  tone?: 'loading';
}) {
  return (
    <Button
      type="text"
      size="small"
      className="sh-message-queue__icon-button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      icon={tone === 'loading'
        ? <span className="sh-message-queue__row-spinner" aria-hidden />
        : icon ? <LocalIcon svg={icon} size={14} /> : undefined}
    />
  );
}

function QueueRow({ item, state, onInsert, onEdit, onRemove }: Pick<MessageQueueProps, 'onInsert' | 'onEdit' | 'onRemove'> & {
  item: QueueMessage;
  state: QueueDisplayState;
}) {
  const status = item.status ?? 'queued';
  const inserting = status === 'inserting' || status === 'hitl-inserting' || status === 'running';
  const inactive = status === 'waiting' || status === 'paused' || status === 'hitl-waiting' || status === 'failed';
  const locked = state === 'hitl' || state === 'paused' || state === 'cancelled' || status.startsWith('hitl-');
  const fileName = item.fileName ?? item.fileNames?.[0];
  const fileCount = item.fileNames?.length ?? item.fileCount ?? 0;

  return (
    <div className="sh-message-queue__item" data-status={status}>
      {fileName ? (
        <div className="sh-message-queue__attachments" aria-label={`附件：${item.fileNames?.join('、') ?? fileName}`}>
          <img className="sh-message-queue__mascot" src={mascot} alt="凌霄" />
          <div className="sh-message-queue__file" data-stacked={fileCount > 1}>
            <div className="sh-message-queue__file-face">
              <FileTypeIcon name={fileName} size={16} />
              <span className="sh-message-queue__file-name" title={fileName}>{fileName}</span>
            </div>
            {fileCount > 1 ? <sup className="sh-message-queue__file-count">{fileCount}</sup> : null}
          </div>
        </div>
      ) : null}
      <div className="sh-message-queue__item-content" title={typeof item.content === 'string' ? item.content : undefined}>{item.content}</div>
      <div className="sh-message-queue__item-actions">
        <QueueAction
          label={inserting ? '正在插入消息' : '插入此消息'}
          icon={insertIcon}
          tone={inserting ? 'loading' : undefined}
          disabled={inserting || inactive || locked}
          onClick={() => onInsert?.(item)}
        />
        <QueueAction label="编辑消息" icon={editIcon} disabled={locked} onClick={() => onEdit?.(item)} />
        <QueueAction label="删除消息" icon={deleteIcon} disabled={locked} onClick={() => onRemove?.(item)} />
      </div>
    </div>
  );
}

export function MessageQueue({
  items, phase = 'processing', state = 'active', expanded = true, totalCount = 10, queuedCount,
  onExpandedChange, onPauseQueue, onResumeQueue, onDiscussNewWork, onInsert, onEdit, onRemove,
}: MessageQueueProps) {
  const hasHeader = state !== 'cancelled';
  const hasQueue = state !== 'empty' && items.length > 0;
  const queuePaused = state === 'paused' || state === 'cancelled' || state === 'hitl';
  const count = queuedCount ?? items.length;
  const countLabel = `${count}/${totalCount}`;
  const summary = state === 'hitl'
    ? `正在等待你的确认，等待队列暂停（${countLabel}）`
    : queuePaused ? `等待队列已暂停（${countLabel}）` : `等待队列（${countLabel}）`;

  return (
    <section className="sh-message-queue" data-state={state} data-expanded={expanded} aria-label="消息队列">
      {hasHeader ? (
        <div className="sh-message-queue__status">
          <span className="sh-message-queue__status-main">
            {phase === 'awaiting-confirmation'
              ? <LocalIcon svg={loadingIcon} size={16} className="sh-message-queue__wait-icon" />
              : <span className="sh-message-queue__spinner" aria-hidden />}
            <span>{PHASE_LABELS[phase]}</span>
          </span>
          {phase !== 'understanding' ? (
            <Button type="link" size="small" className="sh-message-queue__discuss" onClick={onDiscussNewWork}>讨论新工作</Button>
          ) : null}
        </div>
      ) : null}

      {hasQueue ? (
        <>
          <div className="sh-message-queue__summary">
            <button
              type="button"
              className="sh-message-queue__summary-label"
              aria-expanded={expanded}
              onClick={() => onExpandedChange?.(!expanded)}
            >
              {summary}
            </button>
            <div className="sh-message-queue__summary-actions">
              {expanded ? (
                <QueueAction
                  label={queuePaused ? '继续队列' : '暂停队列'}
                  icon={queuePaused ? playIcon : pauseIcon}
                  onClick={queuePaused ? onResumeQueue : onPauseQueue}
                />
              ) : null}
              <button
                type="button"
                className="sh-message-queue__expand-button"
                aria-label={expanded ? '收起队列' : '展开队列'}
                aria-expanded={expanded}
                onClick={() => onExpandedChange?.(!expanded)}
              >
                <span className="sh-message-queue__chevron" data-expanded={expanded} />
              </button>
            </div>
          </div>
          {expanded ? (
            <div className="sh-message-queue__list" data-scrollable={items.length > 3 || undefined}>
              {items.map((item) => (
                <QueueRow
                  key={item.id}
                  item={item}
                  state={state}
                  onInsert={onInsert}
                  onEdit={onEdit}
                  onRemove={onRemove}
                />
              ))}
            </div>
          ) : null}
        </>
      ) : null}
    </section>
  );
}
