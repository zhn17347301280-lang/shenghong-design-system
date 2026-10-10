import type { ReactNode } from 'react';
export type EnterpriseDetailTypeVariant = 'form' | 'cards' | 'table';
/** 详情页表单、卡片、表格区块共用的标题、操作与内容容器；选项归入表单。 */
export declare function EnterpriseDetailType({ variant, title, icon, action, children }: {
    variant: EnterpriseDetailTypeVariant;
    title?: ReactNode;
    icon?: ReactNode;
    action?: ReactNode;
    children: ReactNode;
}): import("react").JSX.Element;
