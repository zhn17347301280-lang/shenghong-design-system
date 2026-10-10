import type { ReactNode } from 'react';
import { Button } from 'antd';
import { LocalIcon } from '../Icon/LocalIcon';
import collapseIcon from '../../icons/svg/通用-上.svg?raw';

export type EnterpriseDetailTypeVariant = 'form' | 'cards' | 'table';

const DEFAULT_TITLES: Record<EnterpriseDetailTypeVariant, string> = {
  form: '表单标题',
  cards: '卡片类型',
  table: '表格标题',
};
/** 详情页表单、卡片、表格区块共用的标题、操作与内容容器；选项归入表单。 */
export function EnterpriseDetailType({ variant, title, icon, action, children }: {
  variant: EnterpriseDetailTypeVariant;
  title?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
}) {
  return <section className="sh-enterprise-detail-type" data-variant={variant}>
    <div className="sh-enterprise-detail-type__header">
      <div className="sh-enterprise-detail-type__title">{icon ?? <LocalIcon svg={collapseIcon} size={24} />}<h4>{title ?? DEFAULT_TITLES[variant]}</h4></div>
      {action ?? (variant === 'cards' || variant === 'table' ? <Button type="link">操作</Button> : null)}
    </div>
    <div className="sh-enterprise-detail-type__body">{children}</div>
  </section>;
}
