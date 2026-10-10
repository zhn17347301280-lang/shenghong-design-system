import type { ReactNode } from 'react';
import { DrawerContentPanel } from './DrawerContent';

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
export function DrawerRecordCard({ status, statusTone = 'default', time, identifierLabel, identifier, metrics = [], note, className }: DrawerRecordCardProps) {
  return (
    <DrawerContentPanel tone="white" className={['sh-drawer-record', className].filter(Boolean).join(' ')}>
      <div className="sh-drawer-record__header">
        <strong className={`sh-drawer-record__status sh-drawer-record__status--${statusTone}`}>{status}</strong>
        {time && <span className="sh-drawer-record__time">{time}</span>}
      </div>
      {identifier != null && <div className="sh-drawer-record__identifier">{identifierLabel && <span>{identifierLabel}</span>}<strong>{identifier}</strong></div>}
      {metrics.length > 0 && <div className="sh-drawer-record__metrics">
        {metrics.map((metric) => <div className={`sh-drawer-record__metric sh-drawer-record__metric--${metric.tone ?? 'default'}`} key={metric.key}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}
      </div>}
      {note && <div className={`sh-drawer-record__note sh-drawer-record__note--${statusTone}`}>{note}</div>}
    </DrawerContentPanel>
  );
}
