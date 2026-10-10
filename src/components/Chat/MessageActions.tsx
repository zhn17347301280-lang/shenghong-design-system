import type { ReactNode } from 'react';
import { Tooltip, Typography } from 'antd';
import { LocalIcon } from '../Icon/LocalIcon';
import quoteIconSvg from '../../icons/svg/凌霄-引用.svg?raw';
import dislikeIconSvg from '../../icons/svg/凌霄-点踩.svg?raw';
import copyIconSvg from '../../icons/svg/凌霄-复制.svg?raw';

const { Text } = Typography;

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

export function MessageActions({ type = 'answer', timestamp, quoted, disliked, copied, onQuote, onDislike, onCopy }: MessageActionsProps) {
  const isQuestion = type === 'question';
  return (
    <div className={`sh-message-actions sh-message-actions--${type}`}>
      <Tooltip title="引用">
        <button type="button" className={`sh-message-actions__button${quoted ? ' is-selected' : ''}`} aria-label="引用" aria-pressed={quoted} onClick={onQuote}>
          <LocalIcon svg={quoteIconSvg} size={16} />
        </button>
      </Tooltip>
      {!isQuestion ? (
        <>
          <Tooltip title="点踩">
            <button type="button" className={`sh-message-actions__button${disliked ? ' is-selected' : ''}`} aria-label="点踩" aria-pressed={disliked} onClick={onDislike}>
              <LocalIcon svg={dislikeIconSvg} size={16} />
            </button>
          </Tooltip>
          <Tooltip title="复制">
            <button type="button" className={`sh-message-actions__button${copied ? ' is-selected' : ''}`} aria-label="复制" aria-pressed={copied} onClick={onCopy}>
              <LocalIcon svg={copyIconSvg} size={16} />
            </button>
          </Tooltip>
        </>
      ) : null}
      {timestamp && <Text type="secondary" className="sh-message-actions__timestamp">{timestamp}</Text>}
    </div>
  );
}
