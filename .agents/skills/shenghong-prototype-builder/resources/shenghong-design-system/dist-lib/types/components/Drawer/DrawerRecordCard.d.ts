import type { ReactNode } from 'react';
export interface DrawerRecordMetric {
    key: string;
    label: ReactNode;
    value: ReactNode;
    tone?: 'default' | 'success' | 'warning';
}
export interface DrawerRecordCardProps {
    status: ReactNode;
    statusTone?: 'default' | 'success' | 'warning';
    time?: ReactNode;
    identifierLabel?: ReactNode;
    identifier?: ReactNode;
    metrics?: DrawerRecordMetric[];
    note?: ReactNode;
    className?: string;
}
/** 抽屉内的记录/统计卡片；状态、编号、指标均由业务传值。 */
export declare function DrawerRecordCard({ status, statusTone, time, identifierLabel, identifier, metrics, note, className }: DrawerRecordCardProps): import("react").JSX.Element;
