import type { ReactNode } from 'react';

export interface DrawerSectionProps {
  title: ReactNode;
  /** 灰色补充文案，可跟随标题、置于标题下方或右侧。 */
  description?: ReactNode;
  descriptionPlacement?: 'inline' | 'below' | 'end';
  /** 标题右侧的操作链接或统计标签。 */
  action?: ReactNode;
  children?: ReactNode;
  className?: string;
}

/** 蓝色短竖线、小标题、辅助文案与右侧操作的规范组合。 */
export function DrawerSection({ title, description, descriptionPlacement = 'inline', action, children, className }: DrawerSectionProps) {
  return (
    <section className={['sh-drawer-section', className].filter(Boolean).join(' ')}>
      <div className="sh-drawer-section__header">
        <div className="sh-drawer-section__heading-group">
          <span aria-hidden="true" className="sh-drawer-section__bar" />
          <div className="sh-drawer-section__heading-copy">
            <div className="sh-drawer-section__heading-line">
              <span className="sh-drawer-section__title">{title}</span>
              {descriptionPlacement === 'inline' && description && <span className="sh-drawer-section__description">{description}</span>}
            </div>
            {descriptionPlacement === 'below' && description && <div className="sh-drawer-section__description sh-drawer-section__description--below">{description}</div>}
          </div>
        </div>
        {(action || (descriptionPlacement === 'end' && description)) && (
          <div className="sh-drawer-section__trailing">
            {descriptionPlacement === 'end' && description && <span className="sh-drawer-section__description">{description}</span>}
            {action}
          </div>
        )}
      </div>
      {children && <div className="sh-drawer-section__content">{children}</div>}
    </section>
  );
}
