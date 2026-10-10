import type { ReactNode } from 'react';
import { type DrawerProps } from 'antd';
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
export declare function AppDrawer({ title, status, widthVariant, bodyTone, closable, width, size, rootClassName, children, ...props }: AppDrawerProps): import("react").JSX.Element;
