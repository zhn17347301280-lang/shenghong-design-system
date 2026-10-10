import type { ReactNode } from 'react';

type CatalogStatusKind = 'public' | 'mixed' | 'example' | 'asset';

const labels: Record<CatalogStatusKind, string> = {
  public: '公共组件',
  mixed: '组件 + 示例组合',
  example: '仅示例组合',
  asset: '设计资产',
};

/** 仅供组件库展示站点说明复用边界，不属于对外导出的产品组件。 */
export function CatalogStatus({ kind, children }: { kind: CatalogStatusKind; children: ReactNode }) {
  return (
    <div className={`catalog-status catalog-status--${kind}`}>
      <span className="catalog-status__label">{labels[kind]}</span>
      <span>{children}</span>
    </div>
  );
}
