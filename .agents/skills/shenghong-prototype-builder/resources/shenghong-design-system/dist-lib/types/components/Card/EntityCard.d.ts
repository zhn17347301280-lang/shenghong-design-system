import type { ReactNode } from 'react';
export interface EntityCardField {
    label: ReactNode;
    /** 数组值会自动渲染为一组紧凑 Tag，单值保持普通文本。 */
    value: ReactNode | ReactNode[];
}
export interface EntityCardProps {
    title?: ReactNode;
    icon?: ReactNode;
    fields?: EntityCardField[];
}
export declare function EntityCard({ title, icon, fields, }: EntityCardProps): import("react").JSX.Element;
