import type { ReactNode } from 'react';
export interface DetailFieldItem {
    label: ReactNode;
    value: ReactNode;
}
export interface DetailFieldGroupProps {
    title: ReactNode;
    items: DetailFieldItem[];
}
export declare function DetailFieldGroup({ title, items }: DetailFieldGroupProps): import("react").JSX.Element;
