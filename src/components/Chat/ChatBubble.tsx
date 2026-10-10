import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { Button, Flex, Typography } from 'antd';
import { FileTypeIcon } from '../File/FileTypeIcon';
import { MessageActions, type MessageActionsProps } from './MessageActions';

const { Paragraph } = Typography;

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

export function ChatBubble({ role, children, attachments = [], collapsed, pinned = false, collapsible = false, actions, onToggle }: ChatBubbleProps) {
  const bubbleRef = useRef<HTMLElement>(null);
  const [overflowsTwoLines, setOverflowsTwoLines] = useState(false);
  const isCollapsed = collapsed ?? pinned;
  const canToggle = pinned && collapsible && !!onToggle;
  const showToggle = canToggle && overflowsTwoLines;

  useLayoutEffect(() => {
    if (!canToggle) return;
    const bubble = bubbleRef.current;
    const content = bubble?.querySelector<HTMLElement>('.sh-chat-bubble__content');
    if (!bubble || !content) return;

    const measure = () => {
      const lineHeight = Number.parseFloat(getComputedStyle(content).lineHeight);
      setOverflowsTwoLines(content.scrollHeight > lineHeight * 2 + 1);
    };
    let frame = 0;
    const scheduleMeasure = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(measure);
    };
    measure();
    scheduleMeasure();
    const observer = new ResizeObserver(scheduleMeasure);
    observer.observe(bubble);
    observer.observe(content);
    window.addEventListener('resize', scheduleMeasure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', scheduleMeasure);
      window.cancelAnimationFrame(frame);
    };
  }, [canToggle, children]);

  return (
    <article ref={bubbleRef} className="sh-chat-bubble" data-role={role} data-pinned={pinned || undefined} data-collapsed={isCollapsed || undefined} data-collapsible={showToggle || undefined}>
      {attachments.length > 0 && (
        <div className="sh-chat-bubble__attachments">
          {attachments.map((item, index) => (
            <div className="sh-chat-bubble__file" key={index} title={typeof item.name === 'string' ? item.name : undefined}>
              <span className="sh-chat-bubble__file-icon">{item.icon ?? (typeof item.name === 'string' ? <FileTypeIcon name={item.name} size={20} /> : null)}</span>
              <span className="sh-chat-bubble__file-name">{item.name}</span>
              {item.meta && <span className="sh-chat-bubble__file-meta">{item.meta}</span>}
            </div>
          ))}
        </div>
      )}
      <Paragraph className="sh-chat-bubble__content">{children}</Paragraph>
      {showToggle && <Button className="sh-chat-bubble__toggle" size="small" onClick={onToggle} aria-expanded={!isCollapsed}>{isCollapsed ? '展开' : '收起'}</Button>}
      {actions && <Flex justify={role === 'user' ? 'end' : 'start'}><MessageActions {...actions} /></Flex>}
    </article>
  );
}
