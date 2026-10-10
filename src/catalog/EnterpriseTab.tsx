import { useState } from 'react';
import { Card, Checkbox, Form, Space, Typography } from 'antd';
import { AppButton, AppFormItem, AppInput, AppSelect, DataTable, DetailPage, EditableDataTable, EnterpriseDetailCard, EnterpriseDetailTemplate, EnterpriseDetailType, EnterprisePermissionCard, EnterpriseSearchTree, EnterpriseSideNav, EnterpriseTopNav, StatusTag, ENTERPRISE_NAV_GROUPS, type EnterpriseNavKey, type EnterpriseTopMenu, type EnterprisePermissionNode, type EnterpriseDetailTypeVariant, type EnterpriseDetailContentMode, type EnterpriseDetailFormType, type EnterpriseDetailTreeType, type EnterpriseDetailSectionType } from '../index';
import { CatalogStatus } from './CatalogStatus';

const { Paragraph, Text, Title } = Typography;

const detailColumns = [
  { title: '成员', dataIndex: 'name', key: 'name' },
  { title: '部门', dataIndex: 'department', key: 'department' },
  { title: '角色', dataIndex: 'role', key: 'role' },
  { title: '状态', dataIndex: 'status', key: 'status', render: () => <StatusTag tone="success">正常</StatusTag> },
];

const permissionCardExample: EnterprisePermissionNode = {
  key: 'example-primary', title: '一级分类', options: Array.from({ length: 10 }, (_, index) => `选项${index + 1}`),
  children: [{ key: 'example-secondary', title: '二级分类', options: Array.from({ length: 10 }, (_, index) => `选项${index + 1}`),
    children: [{ key: 'example-tertiary', title: '三级分类', options: Array.from({ length: 10 }, (_, index) => `选项${index + 1}`) }],
  }],
};

export function EnterpriseTab() {
  const [selectedNav, setSelectedNav] = useState<EnterpriseNavKey>('member-management');
  const [collapsedNav, setCollapsedNav] = useState(false);
  const [pageHeaderMode, setPageHeaderMode] = useState<'title' | 'tabs' | 'none'>('title');
  const [pageContentMode, setPageContentMode] = useState<EnterpriseDetailContentMode>('table');
  const [pageFormType, setPageFormType] = useState<EnterpriseDetailFormType>('role');
  const [pageSectionType, setPageSectionType] = useState<EnterpriseDetailSectionType>('fields');
  const [pageTreeType, setPageTreeType] = useState<EnterpriseDetailTreeType>('none');
  const [permissionLevel, setPermissionLevel] = useState<1 | 2 | 3>(1);
  const [treePreviewType, setTreePreviewType] = useState<'organization' | 'files'>('organization');
  const [detailTypeVariant, setDetailTypeVariant] = useState<EnterpriseDetailTypeVariant>('cards');
  const [pageTitle, setPageTitle] = useState('邀请详情');
  const [pageActiveTab, setPageActiveTab] = useState('tab1');
  const [pageSelectedNav, setPageSelectedNav] = useState<EnterpriseNavKey>('organization-management');
  const [pageCollapsedNav, setPageCollapsedNav] = useState(false);
  const [topMenu, setTopMenu] = useState<EnterpriseTopMenu>(null);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [organization, setOrganization] = useState('盛虹石化');
  const [lingxiaoActive, setLingxiaoActive] = useState(false);
  const [topAction, setTopAction] = useState('');
  const selectedLabel = ENTERPRISE_NAV_GROUPS.flatMap((group) => group.children.map((item) => ({ key: item.key, label: item.label }))).find((item) => item.key === selectedNav)?.label;

  return (
    <section className="catalog-page">
      <header className="catalog-page__header">
        <Title level={2}>企业智能平台</Title>
        <Paragraph type="secondary">企业智能平台的侧边导航与页面组件。</Paragraph>
      </header>

      <section className="docs-section">
        <Title level={3} className="docs-section__title">详情页模板</Title>
        <CatalogStatus kind="mixed">EnterpriseDetailTemplate 已公开；右侧状态切换、示例标题和业务内容是展示页配置，不是独立组件。</CatalogStatus>
        <div className="enterprise-detail-showcase">
          <div className="enterprise-detail-showcase__stage">
            <EnterpriseDetailTemplate
              headerMode={pageHeaderMode}
              contentMode={pageContentMode}
              formType={pageFormType}
              sectionType={pageSectionType}
              treeType={pageTreeType}
              title={pageTitle}
              activeTabKey={pageActiveTab}
              selectedNavKey={pageSelectedNav}
              collapsedNav={pageCollapsedNav}
              onBack={() => setPageHeaderMode('tabs')}
              onTabChange={setPageActiveTab}
              onNavSelect={setPageSelectedNav}
              onNavCollapseChange={setPageCollapsedNav}
            />
          </div>
          <Card size="small" className="enterprise-detail-showcase__controls" title="详情页状态">
            <Text type="secondary">顶部栏类型</Text>
            <div className="enterprise-detail-showcase__buttons">
              <AppButton type={pageHeaderMode === 'title' ? 'primary' : 'default'} onClick={() => setPageHeaderMode('title')}>返回标题栏</AppButton>
              <AppButton type={pageHeaderMode === 'tabs' ? 'primary' : 'default'} onClick={() => setPageHeaderMode('tabs')}>Tab 栏</AppButton>
              <AppButton type={pageHeaderMode === 'none' ? 'primary' : 'default'} onClick={() => setPageHeaderMode('none')}>无顶部栏</AppButton>
            </div>
            {pageHeaderMode === 'title' && <><label htmlFor="enterprise-detail-title">详情页标题</label><input id="enterprise-detail-title" value={pageTitle} onChange={(event) => setPageTitle(event.target.value)} /></>}
            <Text type="secondary">内容类型</Text>
            <div className="enterprise-detail-showcase__buttons">
              <AppButton type={pageContentMode === 'table' ? 'primary' : 'default'} onClick={() => setPageContentMode('table')}>表格</AppButton>
              <AppButton type={pageContentMode === 'form' ? 'primary' : 'default'} onClick={() => { setPageContentMode('form'); setPageHeaderMode('title'); setPageTitle('创建角色'); }}>表单</AppButton>
              <AppButton type={pageContentMode === 'cards' ? 'primary' : 'default'} onClick={() => setPageContentMode('cards')}>卡片类型</AppButton>
              <AppButton type={pageContentMode === 'details' ? 'primary' : 'default'} onClick={() => setPageContentMode('details')}>详情分区</AppButton>
            </div>
            {pageContentMode === 'form' && <><Text type="secondary">表单示例</Text><div className="enterprise-detail-showcase__buttons">
              <AppButton type={pageFormType === 'role' ? 'primary' : 'default'} onClick={() => { setPageFormType('role'); setPageTitle('创建角色'); }}>创建角色</AppButton>
              <AppButton type={pageFormType === 'ontology' ? 'primary' : 'default'} onClick={() => { setPageFormType('ontology'); setPageTitle('创建本体'); }}>创建本体</AppButton>
              <AppButton type={pageFormType === 'member' ? 'primary' : 'default'} onClick={() => { setPageFormType('member'); setPageTitle('成员信息'); }}>成员信息</AppButton>
              <AppButton type={pageFormType === 'resource' ? 'primary' : 'default'} onClick={() => { setPageFormType('resource'); setPageTitle('信息源配置'); }}>信息源配置</AppButton>
            </div></>}
            {pageContentMode === 'details' && <><Text type="secondary">分区类型</Text><div className="enterprise-detail-showcase__buttons">
              {([['plain', '无字段'], ['fields', '详情字段'], ['upload', '上传文件'], ['description', '说明内容']] as const).map(([key, label]) => <AppButton key={key} type={pageSectionType === key ? 'primary' : 'default'} onClick={() => setPageSectionType(key)}>{label}</AppButton>)}
            </div></>}
            <Text type="secondary">左侧树</Text>
            <div className="enterprise-detail-showcase__buttons">
              <AppButton type={pageTreeType === 'none' ? 'primary' : 'default'} onClick={() => setPageTreeType('none')}>无</AppButton>
              <AppButton type={pageTreeType === 'organization' ? 'primary' : 'default'} onClick={() => { setPageTreeType('organization'); setPageContentMode('table'); }}>组织树</AppButton>
              <AppButton type={pageTreeType === 'files' ? 'primary' : 'default'} onClick={() => { setPageTreeType('files'); setPageContentMode('table'); }}>文件树</AppButton>
            </div>
            <Text type="secondary">侧边导航</Text>
            <div className="enterprise-detail-showcase__buttons">
              <AppButton type={!pageCollapsedNav ? 'primary' : 'default'} onClick={() => setPageCollapsedNav(false)}>展开</AppButton>
              <AppButton type={pageCollapsedNav ? 'primary' : 'default'} onClick={() => setPageCollapsedNav(true)}>收起</AppButton>
            </div>
            <Text type="secondary">顶部栏、内容类型与左侧树独立组合；业务内容也可通过模板的 children 插槽替换。</Text>
          </Card>
        </div>
      </section>

      <section className="docs-section">
        <Title level={3} className="docs-section__title">详情页类型</Title>
        <CatalogStatus kind="mixed">EnterpriseDetailType、EnterpriseDetailCard、EditableDataTable 已公开；此处表单/卡片组合是展示页示例，EditableDataTable 仅支持固定的属性/关联字段。</CatalogStatus>
        <div className="enterprise-detail-type-showcase">
          <div className="enterprise-detail-type-showcase__stage">
            <EnterpriseDetailType variant={detailTypeVariant}>
              {detailTypeVariant === 'form' ? <Form><AppFormItem layout="horizontal" label="字段1"><AppInput placeholder="请输入xxxx" /></AppFormItem><AppFormItem layout="horizontal" label="字段2"><AppInput placeholder="请输入xxxx" /></AppFormItem><AppFormItem layout="horizontal" label="字段3"><AppSelect placeholder="请选择" options={[{ value: 'one', label: '选项1' }, { value: 'two', label: '选项2' }]} /></AppFormItem><AppFormItem layout="horizontal" label="选项字段"><Checkbox.Group options={['选项1', '选项2', '选项3']} /></AppFormItem></Form>
                : detailTypeVariant === 'cards' ? <div className="sh-enterprise-detail-type__cards"><EnterpriseDetailCard kind="model" title="模型名称xxxxxxxx" /><EnterpriseDetailCard kind="function" title="函数名称xxxxxxxx" /></div>
                    : <EditableDataTable kind="property" showHeading={false} />}
            </EnterpriseDetailType>
          </div>
          <Card size="small" title="区块类型"><div className="enterprise-detail-showcase__buttons">
            {([['form', '表单'], ['cards', '卡片'], ['table', '表格']] as const).map(([key, label]) => <AppButton key={key} type={detailTypeVariant === key ? 'primary' : 'default'} onClick={() => setDetailTypeVariant(key)}>{label}</AppButton>)}
          </div><Text type="secondary">选项控件归入表单类型；卡片与可编辑表格分别复用独立组件。</Text></Card>
        </div>
      </section>

      <section className="docs-section">
        <Title level={3} className="docs-section__title">树 · 搜索</Title>
        <CatalogStatus kind="public">EnterpriseSearchTree 已公开；右侧类型切换仅用于演示。</CatalogStatus>
        <div className="enterprise-tree-showcase">
          <div className="enterprise-tree-showcase__stage"><EnterpriseSearchTree key={treePreviewType} type={treePreviewType} /></div>
          <Card size="small" title="树类型"><div className="enterprise-detail-showcase__buttons">
            <AppButton type={treePreviewType === 'organization' ? 'primary' : 'default'} onClick={() => setTreePreviewType('organization')}>组织树</AppButton>
            <AppButton type={treePreviewType === 'files' ? 'primary' : 'default'} onClick={() => setTreePreviewType('files')}>知识库文件夹树</AppButton>
          </div><Text type="secondary">支持搜索、层级展开和单项选中；详情页左栏复用同一个组件。</Text></Card>
        </div>
      </section>

      <section className="docs-section">
        <Title level={3} className="docs-section__title">表单树卡片</Title>
        <CatalogStatus kind="public">EnterprisePermissionCard 已公开；树节点数据和右侧层级切换为示例。</CatalogStatus>
        <div className="enterprise-permission-showcase">
          <div className="enterprise-permission-showcase__stage">
            <EnterprisePermissionCard key={permissionLevel} node={permissionLevel === 1 ? permissionCardExample : permissionLevel === 2 ? permissionCardExample.children![0] : permissionCardExample.children![0].children![0]} level={permissionLevel} />
          </div>
          <Card size="small" title="卡片层级"><div className="enterprise-detail-showcase__buttons">
            {([1, 2, 3] as const).map((level) => <AppButton key={level} type={permissionLevel === level ? 'primary' : 'default'} onClick={() => setPermissionLevel(level)}>{level} 级分类</AppButton>)}
          </div><Text type="secondary">点击箭头展开／收起，勾选分类可批量选择其下权限。</Text></Card>
        </div>
      </section>

      <section className="docs-section">
        <Title level={3} className="docs-section__title">顶部导航栏</Title>
        <CatalogStatus kind="public">EnterpriseTopNav 已公开，菜单/通知交互由组件处理；右侧状态面板仅供演示。</CatalogStatus>
        <div className="enterprise-top-nav-showcase">
          <div className="enterprise-top-nav-showcase__stage">
            <EnterpriseTopNav
              organization={organization}
              openMenu={topMenu}
              notificationOpen={notificationOpen}
              lingxiaoActive={lingxiaoActive}
              onOpenMenuChange={(menu) => { setTopMenu(menu); if (menu) setNotificationOpen(false); }}
              onNotificationOpenChange={(open) => { setNotificationOpen(open); if (open) setTopMenu(null); }}
              onOrganizationChange={setOrganization}
              onLingxiaoClick={() => { setLingxiaoActive((active) => !active); setTopAction('使用凌霄'); }}
              onNotificationClick={() => setTopAction('消息通知')}
              onUserAction={(action) => setTopAction({ profile: '个人信息设置', team: '账号与团队管理', password: '修改密码', logout: '退出登录' }[action])}
            />
          </div>
          <Card size="small" className="enterprise-top-nav-showcase__controls" title="导航状态">
            <Text type="secondary">展开菜单</Text>
            <div className="enterprise-top-nav-showcase__buttons">
              <AppButton type={topMenu === null && !notificationOpen ? 'primary' : 'default'} onClick={() => { setTopMenu(null); setNotificationOpen(false); }}>默认</AppButton>
              <AppButton type={topMenu === 'organization' ? 'primary' : 'default'} onClick={() => { setTopMenu('organization'); setNotificationOpen(false); }}>组织</AppButton>
              <AppButton type={topMenu === 'user' ? 'primary' : 'default'} onClick={() => { setTopMenu('user'); setNotificationOpen(false); }}>用户</AppButton>
              <AppButton type={notificationOpen ? 'primary' : 'default'} onClick={() => { setNotificationOpen(true); setTopMenu(null); }}>通知</AppButton>
            </div>
            <Text type="secondary">凌霄入口</Text>
            <AppButton type={lingxiaoActive ? 'primary' : 'default'} onClick={() => setLingxiaoActive((active) => !active)}>{lingxiaoActive ? '选中' : '默认'}</AppButton>
            <Text type="secondary">当前组织：{organization}{topAction ? ` · 最近操作：${topAction}` : ''}</Text>
          </Card>
        </div>
      </section>

      <section className="docs-section">
        <Title level={3} className="docs-section__title">侧边导航栏</Title>
        <CatalogStatus kind="public">EnterpriseSideNav 已公开；旁边的内容占位区和状态面板不是公共组件。</CatalogStatus>
        <div className="enterprise-nav-showcase">
          <div className="enterprise-nav-showcase__stage">
            <EnterpriseSideNav selectedKey={selectedNav} collapsed={collapsedNav} onSelect={setSelectedNav} onCollapseChange={setCollapsedNav} />
            <div className="enterprise-nav-showcase__content"><span>{selectedLabel}</span></div>
          </div>
          <Card size="small" className="enterprise-nav-showcase__controls" title="导航状态">
            <Text type="secondary">展开与收起</Text>
            <div className="enterprise-nav-showcase__buttons">
              <AppButton type={!collapsedNav ? 'primary' : 'default'} onClick={() => setCollapsedNav(false)}>展开</AppButton>
              <AppButton type={collapsedNav ? 'primary' : 'default'} onClick={() => setCollapsedNav(true)}>收起</AppButton>
            </div>
            <label htmlFor="enterprise-nav-selection">选中菜单</label>
            <select id="enterprise-nav-selection" value={selectedNav} onChange={(event) => setSelectedNav(event.target.value as EnterpriseNavKey)}>
              {ENTERPRISE_NAV_GROUPS.map((group) => (
                <optgroup key={group.key} label={group.label}>
                  {group.children.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
                </optgroup>
              ))}
            </select>
            <Text type="secondary">展开时点击一级菜单；收起时悬浮一级图标，可在弹出菜单中选择二级页面。</Text>
          </Card>
        </div>
      </section>

      <section className="docs-section">
        <Title level={3} className="docs-section__title">企业智能平台详情页</Title>
        <CatalogStatus kind="mixed">DetailPage、DataTable、StatusTag 已公开；整个“成员管理”页面及其业务列、操作按钮是示例组合，没有整页接口。</CatalogStatus>
        <Card>
          <DetailPage
            title="成员管理"
            description="管理企业成员、部门归属和访问角色。"
            breadcrumbs={[{ title: '组织与权限' }, { title: '成员管理' }]}
            extra={<><AppButton>批量导入</AppButton><AppButton type="primary">邀请成员</AppButton></>}
            onBack={() => undefined}
            aside={<Card size="small" title="组织信息"><Space orientation="vertical"><Text>盛虹石化</Text><Text type="secondary">共 1,286 名成员</Text><StatusTag tone="success">运行正常</StatusTag></Space></Card>}
          >
            <DataTable
              title="成员列表"
              searchable
              columns={detailColumns}
              dataSource={[
                { id: 1, name: '张明', department: '数据运营部', role: '管理员', status: '正常' },
                { id: 2, name: '李妍', department: '供应链中心', role: '成员', status: '正常' },
              ]}
            />
          </DetailPage>
        </Card>
      </section>
    </section>
  );
}
