import type { ReactNode } from 'react';

export interface DrawerTitleProps {
  title: ReactNode;
  /** 状态与大标题处于同一行；关闭按钮由 AppDrawer 外壳统一放在右侧。 */
  status?: ReactNode;
  className?: string;
}

/** 抽屉大标题的可复用内容组合，不包含业务数据或关闭行为。 */
export function DrawerTitle({ title, status, className }: DrawerTitleProps) {
  return (
    <div className={['sh-drawer__heading', className].filter(Boolean).join(' ')}>
      <span className="sh-drawer__heading-text">{title}</span>
      {status}
    </div>
  );
}
