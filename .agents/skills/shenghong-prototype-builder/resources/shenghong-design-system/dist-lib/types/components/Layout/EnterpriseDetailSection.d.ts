import type { ReactNode } from 'react';
export type EnterpriseDetailSectionType = 'plain' | 'fields' | 'upload' | 'description';
export interface EnterpriseDetailSectionProps {
    type: EnterpriseDetailSectionType;
    title?: ReactNode;
    actions?: ReactNode;
    fields?: Array<{
        label: string;
        value: ReactNode;
    }>;
    children?: ReactNode;
}
/** MasterGo 详情页分区的四种类型：无字段、详情字段、文件上传、说明内容。 */
export declare function EnterpriseDetailSection({ type, title, actions, fields, children }: EnterpriseDetailSectionProps): import("react").JSX.Element;
