import type { ReactNode } from 'react';
import { Breadcrumb, Button, Tabs } from 'antd';
import { LocalIcon } from '../Icon/LocalIcon';
import { EnterpriseSideNav, type EnterpriseNavKey } from './EnterpriseSideNav';
import { EnterpriseTopNav, type EnterpriseTopNavProps } from './EnterpriseTopNav';
import backIcon from '../../icons/svg/通用-返回.svg?raw';
import { EnterpriseDetailForm, EnterpriseDetailTable, type EnterpriseDetailContentMode, type EnterpriseDetailFormType, type EnterpriseDetailTreeType } from './EnterpriseDetailContent';
import { EnterpriseDetailSection, type EnterpriseDetailSectionType } from './EnterpriseDetailSection';
import { EnterpriseDetailType } from './EnterpriseDetailType';
import { EnterpriseSearchTree } from './EnterpriseSearchTree';
import { EnterpriseDetailCard } from './EnterpriseDetailCard';

export interface EnterpriseDetailTemplateProps {
  /** 标题栏与 Tab 栏共用同一详情页容器。 */
  headerMode?: 'title' | 'tabs' | 'none';
  contentMode?: EnterpriseDetailContentMode;
  formType?: EnterpriseDetailFormType;
  sectionType?: EnterpriseDetailSectionType;
  treeType?: EnterpriseDetailTreeType;
  title?: string;
  breadcrumbs?: [string, string];
  tabs?: Array<{ key: string; label: string }>;
  activeTabKey?: string;
  selectedNavKey?: EnterpriseNavKey;
  collapsedNav?: boolean;
  topNavProps?: EnterpriseTopNavProps;
  onBack?: () => void;
  onTabChange?: (key: string) => void;
  onNavSelect?: (key: EnterpriseNavKey) => void;
  onNavCollapseChange?: (collapsed: boolean) => void;
  children?: ReactNode;
  className?: string;
}

const DEFAULT_TABS = [
  { key: 'tab1', label: 'Tab1' },
  { key: 'tab2', label: 'Tab2' },
  { key: 'tab3', label: 'Tab3' },
  { key: 'tab4', label: 'Tab4' },
];

export function EnterpriseDetailTemplate({
  headerMode = 'title',
  contentMode = 'table',
  formType = 'role',
  sectionType = 'fields',
  treeType = 'none',
  title = '邀请详情',
  breadcrumbs = ['组织与成员', '组织管理'],
  tabs = DEFAULT_TABS,
  activeTabKey = 'tab1',
  selectedNavKey = 'organization-management',
  collapsedNav = false,
  topNavProps,
  onBack,
  onTabChange,
  onNavSelect,
  onNavCollapseChange,
  children,
  className,
}: EnterpriseDetailTemplateProps) {
  return (
    <div className={['sh-enterprise-detail-template', className].filter(Boolean).join(' ')}>
      <EnterpriseTopNav {...topNavProps} />
      <div className="sh-enterprise-detail-template__body">
        <EnterpriseSideNav
          className="sh-enterprise-detail-template__sidebar"
          selectedKey={selectedNavKey}
          collapsed={collapsedNav}
          onSelect={onNavSelect}
          onCollapseChange={onNavCollapseChange}
        />
        <div className="sh-enterprise-detail-template__workspace">
          <div className="sh-enterprise-detail-template__breadcrumb">
            <Breadcrumb items={[{ title: breadcrumbs[0] }, { title: breadcrumbs[1] }]} separator="/" />
          </div>
          <section className="sh-enterprise-detail-template__panel" aria-label={headerMode === 'title' ? title : '详情页'}>
            {headerMode === 'title' ? (
              <div className="sh-enterprise-detail-template__titlebar">
                <Button type="text" className="sh-enterprise-detail-template__back" icon={<LocalIcon svg={backIcon} size={16} />} aria-label="返回" onClick={onBack} />
                <span className="sh-enterprise-detail-template__divider" />
                <h3>{title}</h3>
              </div>
            ) : headerMode === 'tabs' ? (
              <Tabs
                className="sh-enterprise-detail-template__tabs"
                activeKey={activeTabKey}
                items={tabs.map((tab) => ({ key: tab.key, label: tab.label }))}
                onChange={onTabChange}
                tabBarGutter={24}
                animated={false}
                styles={{
                  root: { height: 56 },
                  header: { height: 56, margin: 0, padding: '0 24px' },
                  item: { height: 56, padding: 0 },
                  body: { display: 'none' },
                }}
              />
            ) : null}
            <div className="sh-enterprise-detail-template__content" data-header={headerMode}>
              {treeType !== 'none' && <EnterpriseSearchTree key={treeType} type={treeType} />}
              <div className="sh-enterprise-detail-template__content-main">
                {children ?? (contentMode === 'table'
                  ? <EnterpriseDetailTable withTree={treeType !== 'none'} />
                  : contentMode === 'form'
                    ? <EnterpriseDetailForm type={formType} />
                    : contentMode === 'cards'
                      ? <EnterpriseDetailType variant="cards"><div className="sh-enterprise-detail-type__cards"><EnterpriseDetailCard kind="model" title="模型名称xxxxxxxx" /><EnterpriseDetailCard kind="function" title="函数名称xxxxxxxx" /></div></EnterpriseDetailType>
                    : contentMode === 'details'
                      ? <div className="sh-enterprise-detail-template__details"><EnterpriseDetailSection type={sectionType} /></div>
                    : null)}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
