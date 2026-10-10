import type { ReactNode } from 'react';
import { Card } from 'antd';

export interface InformationCardProps { eyebrow?: ReactNode; title: ReactNode; value?: ReactNode; unit?: ReactNode; icon?: ReactNode; footer?: ReactNode; }

export function InformationCard({ eyebrow, title, value, unit, icon, footer }: InformationCardProps) {
  return (
    <Card className="sh-information-card">
      <div className="sh-information-card__heading">{icon && <span className="sh-information-card__icon">{icon}</span>}<div>{eyebrow && <span className="sh-information-card__eyebrow">{eyebrow}</span>}<strong>{title}</strong></div></div>
      {value != null && <div className="sh-information-card__value"><strong>{value}</strong>{unit && <span>{unit}</span>}</div>}
      {footer && <div className="sh-information-card__footer">{footer}</div>}
    </Card>
  );
}
