import type { ReactNode } from 'react';
import { Card } from 'antd';

/** 展示页的统一白底外框，不属于公共组件接口。 */
export function CatalogFrame({ children }: { children: ReactNode }) {
  return <Card className="catalog-frame">{children}</Card>;
}
