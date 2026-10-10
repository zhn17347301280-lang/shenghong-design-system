import type { ReactNode } from 'react';
import { type EnterpriseNavKey } from './EnterpriseSideNav';
import { type EnterpriseTopNavProps } from './EnterpriseTopNav';
import { type EnterpriseDetailContentMode, type EnterpriseDetailFormType, type EnterpriseDetailTreeType } from './EnterpriseDetailContent';
import { type EnterpriseDetailSectionType } from './EnterpriseDetailSection';
export interface EnterpriseDetailTemplateProps {
    /** 标题栏与 Tab 栏共用同一详情页容器。 */
    headerMode?: 'title' | 'tabs' | 'none';
    contentMode?: EnterpriseDetailContentMode;
    formType?: EnterpriseDetailFormType;
    sectionType?: EnterpriseDetailSectionType;
    treeType?: EnterpriseDetailTreeType;
    title?: string;
    breadcrumbs?: [string, string];
    tabs?: Array<{
        key: string;
        label: string;
    }>;
    activeTabKey?: string;
    selectedNavKey?: EnterpriseNavKey;
    collapsedNav?: boolean;
    topNavProps?: EnterpriseTopNavProps;
    onBack?: () => void;
    onTabChange?: (key: string) => void;
    onNavSelect?: (key: EnterpriseNavKey) => void;
    onNavCollapseChange?: (collapsed: boolean) => void;
    children?: ReactNode;
    className?: string;
}
export declare function EnterpriseDetailTemplate({ headerMode, contentMode, formType, sectionType, treeType, title, breadcrumbs, tabs, activeTabKey, selectedNavKey, collapsedNav, topNavProps, onBack, onTabChange, onNavSelect, onNavCollapseChange, children, className, }: EnterpriseDetailTemplateProps): import("react").JSX.Element;
