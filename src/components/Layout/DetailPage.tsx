import type { ReactNode } from 'react';
import { Breadcrumb, Button, Flex, Space, Typography } from 'antd';
import type { BreadcrumbProps } from 'antd';

const { Paragraph, Title } = Typography;

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

export function DetailPage({
  title,
  description,
  breadcrumbs,
  extra,
  backLabel = '返回',
  aside,
  children,
  onBack,
}: DetailPageProps) {
  return (
    <section className="sh-detail-page">
      {breadcrumbs && <Breadcrumb items={breadcrumbs} />}
      <Flex className="sh-detail-page__heading" justify="space-between" align="start" gap={24} wrap>
        <Flex align="start" gap={12}>
          {onBack && <Button type="text" onClick={onBack} aria-label="返回">←</Button>}
          <div>
            <Title level={3}>{title}</Title>
            {description && <Paragraph type="secondary">{description}</Paragraph>}
          </div>
        </Flex>
        <Space wrap>{extra}</Space>
      </Flex>
      <div className={aside ? 'sh-detail-page__grid' : undefined}>
        <div className="sh-detail-page__main">{children}</div>
        {aside && <aside className="sh-detail-page__aside">{aside}</aside>}
      </div>
      {onBack && <span className="sh-visually-hidden">{backLabel}</span>}
    </section>
  );
}

