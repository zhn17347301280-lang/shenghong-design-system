import type { ReactNode } from 'react';
import { Drawer, type DrawerProps } from 'antd';
import closeIconSvg from '../../icons/svg/通用-取消、关闭.svg?raw';
import { LocalIcon } from '../Icon/LocalIcon';
import { DrawerTitle } from './DrawerTitle';

export interface AppDrawerProps extends Omit<DrawerProps, 'title' | 'closable' | 'classNames'> {
  /** 抽屉标题；与状态标签处于同一标题组。 */
  title: ReactNode;
  /** 标题后方的状态，例如 StatusTag。 */
  status?: ReactNode;
  /** 标准 600px，紧凑 400px；antd size 可覆盖业务特殊宽度。 */
  widthVariant?: 'standard' | 'compact';
  /** 接入日志等卡片列表使用浅灰内容底色。 */
  bodyTone?: 'white' | 'subtle';
  /** 关闭按钮默认始终在右侧；仅特殊无关闭场景可关闭该能力。 */
  closable?: boolean;
}

/**
 * 盛虹详情抽屉外壳。只负责遮罩、标题/状态、右侧关闭按钮、内容区和可选底部操作；
 * 字段、日志、权限树等内容由 DrawerSection 等公共内容块组合，不应在业务页重写头部。
 */
export function AppDrawer({
  title,
  status,
  widthVariant = 'standard',
  bodyTone = 'white',
  closable = true,
  width,
  size,
  rootClassName,
  children,
  ...props
}: AppDrawerProps) {
  return (
    <Drawer
      {...props}
      size={size ?? width ?? (widthVariant === 'compact' ? 400 : 600)}
      placement="right"
      rootClassName={['sh-drawer', `sh-drawer--${bodyTone}`, rootClassName].filter(Boolean).join(' ')}
      classNames={{
        header: 'sh-drawer__header',
        title: 'sh-drawer__title',
        close: 'sh-drawer__close',
        body: 'sh-drawer__body',
        footer: 'sh-drawer__footer',
      }}
      closable={closable ? { placement: 'end', closeIcon: <LocalIcon svg={closeIconSvg} size={20} /> } : false}
      title={<DrawerTitle title={title} status={status} />}
    >
      {children}
    </Drawer>
  );
}
