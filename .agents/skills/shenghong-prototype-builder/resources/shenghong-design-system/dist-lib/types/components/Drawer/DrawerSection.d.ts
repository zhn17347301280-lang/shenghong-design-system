import type { ReactNode } from 'react';
export interface DrawerSectionProps {
    title: ReactNode;
    /** 灰色补充文案，可跟随标题、置于标题下方或右侧。 */
    description?: ReactNode;
    descriptionPlacement?: 'inline' | 'below' | 'end';
    /** 标题右侧的操作链接或统计标签。 */
    action?: ReactNode;
    children?: ReactNode;
    className?: string;
}
/** 蓝色短竖线、小标题、辅助文案与右侧操作的规范组合。 */
export declare function DrawerSection({ title, description, descriptionPlacement, action, children, className }: DrawerSectionProps): import("react").JSX.Element;
