import type { ReactNode } from 'react';

export interface NotificationItem {
  id: string;
  content: ReactNode;
  time: string;
}

export const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  { id: '1', content: '【东方盛虹】团队邀请你成为团队成员，你将可使用团队级智能工作空间能力与资源。', time: '2025-11-12 12:20:20' },
  { id: '2', content: '【盛虹石化】团队邀请你成为团队成员，你将可使用团队级智能工作空间能力与资源。', time: '2025-10-12 12:20:20' },
  { id: '3', content: '【虹港石化】团队邀请你成为团队成员，你将可使用团队级智能工作空间能力与资源。', time: '2025-10-12 12:20:20' },
];

/** 通知文案中「【xxx】」前缀按设计稿使用 Semibold。 */
function renderNotificationContent(content: ReactNode) {
  if (typeof content !== 'string') return content;
  const match = content.match(/^(【[^】]*】)([\s\S]*)$/);
  if (!match) return content;
  return <><strong>{match[1]}</strong>{match[2]}</>;
}

export function NotificationPanel({ items }: { items: NotificationItem[] }) {
  return (
    <div className="sh-lx-notify">
      <div className="sh-lx-notify__head">消息通知</div>
      <div className="sh-lx-notify__body">
        {items.map((item, index) => (
          <div key={item.id} className="sh-lx-notify__item">
            <div className="sh-lx-notify__text">{renderNotificationContent(item.content)}</div>
            <div className="sh-lx-notify__time">{item.time}</div>
            {index < items.length - 1 && <div className="sh-lx-notify__divider" />}
          </div>
        ))}
      </div>
    </div>
  );
}
