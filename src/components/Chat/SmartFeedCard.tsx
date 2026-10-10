import { useLayoutEffect, useRef, useState } from 'react';
import { Button, Card, Dropdown, Tooltip } from 'antd';
import type { MenuProps } from 'antd';
import { LocalIcon } from '../Icon/LocalIcon';
import scheduleIcon from '../../icons/svg/通用-定时任务.svg?raw';
import discussIcon from '../../icons/svg/凌霄-smartfeed继续讨论.svg?raw';
import moreIcon from '../../icons/svg/通用-更多.svg?raw';
import resultIcon from '../../icons/svg/link-file/link-smart-result.svg?raw';

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

const STATUS_META: Record<SmartFeedStatus, { label: string; dot: string }> = {
  complete: { label: '任务完成', dot: 'complete' },
  failed: { label: '执行失败', dot: 'failed' },
  running: { label: '正在规划...', dot: 'running' },
  stopped: { label: '任务终止', dot: 'stopped' },
  pending: { label: '待你确定XXXXXXX', dot: 'pending' },
};

const MORE_ITEMS: MenuProps['items'] = [
  { key: 'detail', label: '查看详情' },
  { key: 'remove', label: '删除任务' },
];

function SmartFeedDescription({ text }: { text: string }) {
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const [truncated, setTruncated] = useState(false);

  useLayoutEffect(() => {
    const paragraph = paragraphRef.current;
    if (!paragraph) return;
    const measure = () => setTruncated(paragraph.scrollHeight > paragraph.clientHeight + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(paragraph);
    return () => observer.disconnect();
  }, [text]);

  return (
    <Tooltip title={truncated ? text : null} placement="rightTop" styles={{ container: { width: 232 } }}>
      <p ref={paragraphRef} className="sh-smart-feed-card__description">{text}</p>
    </Tooltip>
  );
}

export function SmartFeedCard({
  title,
  status = 'complete',
  description = '任务已完成，相关结果已生成，请点击查看。',
  scheduled = true,
  reminder = false,
  hasResults = true,
  resultNames,
  duration = '120s',
  updatedAt = '2026-12-12 12:12',
  onDiscuss,
  onMore,
  onAction,
}: SmartFeedCardProps) {
  const meta = STATUS_META[status];
  const results = resultNames ?? (status === 'complete' ? ['查询结果', '审批结果'] : ['智能填报结果']);
  const showResults = hasResults && status !== 'running';

  return (
    <Card
      className="sh-smart-feed-card"
      data-reminder={reminder}
      styles={{ body: { padding: 8 } }}
      aria-label={`SmartFeed：${title}，${meta.label}`}
    >
      <div className="sh-smart-feed-card__layout">
        <div className="sh-smart-feed-card__header">
          {scheduled ? <span className="sh-smart-feed-card__schedule"><LocalIcon svg={scheduleIcon} size={16} /></span> : null}
          <Tooltip title={title} placement="topLeft">
            <span className="sh-smart-feed-card__title">{title}</span>
          </Tooltip>
          <div className="sh-smart-feed-card__header-actions">
            <Tooltip title="继续讨论">
              <Button type="text" size="small" aria-label="继续讨论" icon={<LocalIcon svg={discussIcon} size={16} />} onClick={onDiscuss} />
            </Tooltip>
            <Dropdown menu={{ items: MORE_ITEMS, onClick: ({ key }) => onMore?.(key) }} trigger={['click']}>
              <Button type="text" size="small" aria-label="更多操作" icon={<LocalIcon svg={moreIcon} size={16} />} />
            </Dropdown>
          </div>
        </div>

        <div className="sh-smart-feed-card__detail" data-status={status}>
          <div className="sh-smart-feed-card__status-line">
            <span className={`sh-smart-feed-card__dot is-${meta.dot}`} aria-hidden="true" />
            <strong>{meta.label}</strong>
            {(status === 'running' || status === 'stopped') ? <span className="sh-smart-feed-card__duration">{duration}</span> : null}
          </div>
          <SmartFeedDescription text={description} />

          {showResults ? (
            <div className="sh-smart-feed-card__results">
              {results.map((name) => (
                <button key={name} type="button" className="sh-smart-feed-card__result" onClick={() => onAction?.('result', name)}>
                  <LocalIcon svg={resultIcon} size={16} />
                  <span>{name}</span>
                </button>
              ))}
            </div>
          ) : null}
          {status === 'failed' ? (
            <div className="sh-smart-feed-card__action-row">
              <Button size="small" onClick={() => onAction?.('detail')}>详情</Button>
              <Button size="small" onClick={() => onAction?.('stop')}>终止</Button>
              <Button size="small" onClick={() => onAction?.('retry')}>重试</Button>
            </div>
          ) : null}
          {status === 'running' ? <Button size="small" block onClick={() => onAction?.('progress')}>进度详情</Button> : null}
          {status === 'pending' ? <Button size="small" block className="sh-smart-feed-card__confirm" onClick={() => onAction?.('confirm')}>立即确认</Button> : null}
        </div>

        <span className="sh-smart-feed-card__updated">更新于 {updatedAt}</span>
      </div>
    </Card>
  );
}
