import type { ReactNode } from 'react';
export interface InformationCardProps {
    eyebrow?: ReactNode;
    title: ReactNode;
    value?: ReactNode;
    unit?: ReactNode;
    icon?: ReactNode;
    footer?: ReactNode;
}
export declare function InformationCard({ eyebrow, title, value, unit, icon, footer }: InformationCardProps): import("react").JSX.Element;
