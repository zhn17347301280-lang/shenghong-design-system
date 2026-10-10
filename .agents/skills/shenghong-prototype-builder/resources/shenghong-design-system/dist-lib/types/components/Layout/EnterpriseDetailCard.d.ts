import { type ReactNode } from 'react';
export interface EnterpriseDetailCardField {
    label: string;
    value: ReactNode;
}
export interface EnterpriseDetailCardProps {
    kind: 'model' | 'function';
    title: string;
    fields?: EnterpriseDetailCardField[];
    onDelete?: () => void;
}
/** MasterGo「卡片card」：56px 标题栏、编辑/删除操作与只读字段区。 */
export declare function EnterpriseDetailCard({ kind, title, fields, onDelete }: EnterpriseDetailCardProps): import("react").JSX.Element | null;
