import type { ReactNode } from 'react';
import type { BreadcrumbProps } from 'antd';
export interface DetailPageProps {
    title: ReactNode;
    description?: ReactNode;
    breadcrumbs?: BreadcrumbProps['items'];
    extra?: ReactNode;
    backLabel?: ReactNode;
    aside?: ReactNode;
    children: ReactNode;
    onBack?: () => void;
}
export declare function DetailPage({ title, description, breadcrumbs, extra, backLabel, aside, children, onBack, }: DetailPageProps): import("react").JSX.Element;
