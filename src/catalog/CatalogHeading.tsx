import type { ReactNode } from 'react';

/** 示例类型标题：名称必填，说明仅在需要解释用途或操作时展示。 */
export function CatalogHeading({ title, description }: { title: ReactNode; description?: ReactNode }) {
  return (
    <header className="catalog-heading">
      <h4 className="catalog-heading__title">{title}</h4>
      {description && <p className="catalog-heading__description">{description}</p>}
    </header>
  );
}
