import type { ReactNode } from 'react';

export interface DrawerActivityItem {
  key: string;
  content: ReactNode;
  time: ReactNode;
  actor?: ReactNode;
}

export interface DrawerActivityLogProps {
  items: DrawerActivityItem[];
  className?: string;
}

/** 抽屉内操作日志时间线，按输入顺序由新到旧展示。 */
export function DrawerActivityLog({ items, className }: DrawerActivityLogProps) {
  return (
    <ol className={['sh-drawer-activity', className].filter(Boolean).join(' ')}>
      {items.map((item) => (
        <li className="sh-drawer-activity__item" key={item.key}>
          <div className="sh-drawer-activity__content">{item.content}</div>
          <div className="sh-drawer-activity__meta"><span>{item.time}</span>{item.actor && <span>· {item.actor}</span>}</div>
        </li>
      ))}
    </ol>
  );
}
