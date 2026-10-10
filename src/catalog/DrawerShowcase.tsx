import { useState, type CSSProperties, type ReactNode } from 'react';
import closeIconSvg from '../icons/svg/通用-取消、关闭.svg?raw';
import {
  AppButton,
  AppDrawer,
  DrawerActivityLog,
  DrawerFieldList,
  DrawerRecordCard,
  DrawerSection,
  DrawerTextBlock,
  DrawerTitle,
  DrawerTreeContent,
  LocalIcon,
  StatusTag,
} from '../index';

type WidthVariant = 'compact' | 'standard';
type TitleVariant = 'status' | 'plain';
type SectionVariant = 'inline' | 'below' | 'action' | 'count';
type ContentVariant = 'record' | 'text' | 'fields' | 'tree' | 'activity';

const treeNodes = [
  { key: 'lingxiao', label: '凌霄', children: [{ key: 'personal', label: '个性化', children: [{ key: 'approval', label: '智能审批设置 · 开启/关闭智能审批' }] }] },
  { key: 'platform', label: '企业智能平台', children: [
    { key: 'org', label: '组织与权限', children: [
      { key: 'organization', label: '组织管理 · 查看 / 创建组织 / 编辑组织 / 删除组织' },
      { key: 'member', label: '成员管理 · 查看 / 添加 / 邀请 / 批量导入' },
      { key: 'role', label: '角色与权限管理 · 查看 / 创建角色 / 编辑 / 删除' },
    ] },
    { key: 'knowledge', label: '知识中枢', children: [{ key: 'library', label: '知识管理库 · 查看 / 创建 / 编辑 / 删除' }] },
  ] },
];

const activityItems = [
  { key: 'a2', content: '张梦特修改了角色权限配置', time: '2026-07-10 09:09' },
  { key: 'a1', content: '张梦特创建并启用了组织管理员角色', time: '2026-07-09 16:32' },
];

function ContentExample({ variant, widthVariant }: { variant: ContentVariant; widthVariant: WidthVariant }) {
  switch (variant) {
    case 'record':
      return <DrawerRecordCard status="全部入库" statusTone="success" time="2026-09-08 11:06:42" identifierLabel="批次 ID" identifier="BI-20260908-110642" metrics={[
        { key: 'received', value: 16, label: '收到文档' },
        { key: 'accepted', value: 16, label: '成功入库', tone: 'success' },
        { key: 'blocked', value: 0, label: '拦截' },
      ]} note="无拦截文档，本批次全部入库" />;
    case 'text':
      return <DrawerTextBlock>张三、李四、王五、XXX、XXX、XXX、XXX、XXX、XXX、XXX、XXX、XXX、XXX、XXX、XXX。内容不带外框，适合成员摘要或说明文字。</DrawerTextBlock>;
    case 'fields':
      return <DrawerFieldList labelWidth={widthVariant === 'compact' ? 84 : 96} items={[
        { label: '角色名称', value: <strong>组织管理员</strong> },
        { label: '角色描述', value: '负责企业组织与成员管理，拥有组织查看、新增、编辑和删除权限。' },
        { label: '创建时间', value: '2026-02-02' },
        { label: '更新时间', value: '2026-07-10' },
      ]} />;
    case 'tree':
      return <DrawerTreeContent title="功能权限" nodes={treeNodes} />;
    case 'activity':
      return <DrawerActivityLog items={activityItems} />;
  }
}

function SectionExample({ variant, content }: { variant: SectionVariant; content: ReactNode }) {
  switch (variant) {
    case 'inline':
      return <DrawerSection title="标题文案" description="描述文案" action={<AppButton type="link" size="small">操作</AppButton>}>{content}</DrawerSection>;
    case 'below':
      return <DrawerSection title="标题文案" description="描述文案描述文案描述文案描述文案" descriptionPlacement="below" action={<><span className="sh-drawer-showcase__tag">tag1</span><span className="sh-drawer-showcase__tag sh-drawer-showcase__tag--warm">tag2</span></>}>{content}</DrawerSection>;
    case 'action':
      return <DrawerSection title="标题文案" action={<AppButton type="link" size="small">操作</AppButton>}>{content}</DrawerSection>;
    case 'count':
      return <DrawerSection title="标题文案" description="共 3 条" descriptionPlacement="end">{content}</DrawerSection>;
  }
}

function ControlGroup<T extends string>({ title, value, options, onChange }: { title: string; value: T; options: Array<{ value: T; label: string }>; onChange: (value: T) => void }) {
  return <div className="sh-drawer-showcase__control-group">
    <span className="sh-drawer-showcase__control-title">{title}</span>
    <div className="sh-drawer-showcase__control-buttons">{options.map((option) => <AppButton className="sh-drawer-showcase__control-button" key={option.value} type={value === option.value ? 'primary' : 'default'} aria-pressed={value === option.value} onClick={() => onChange(option.value)}>{option.label}</AppButton>)}</div>
  </div>;
}

export function DrawerShowcase() {
  const [widthVariant, setWidthVariant] = useState<WidthVariant>('standard');
  const [titleVariant, setTitleVariant] = useState<TitleVariant>('status');
  const [sectionVariant, setSectionVariant] = useState<SectionVariant>('inline');
  const [contentVariant, setContentVariant] = useState<ContentVariant>('fields');
  const [open, setOpen] = useState(false);
  const status = titleVariant === 'status' ? <StatusTag tone="success">已启用</StatusTag> : undefined;
  const content = <ContentExample variant={contentVariant} widthVariant={widthVariant} />;
  const section = <SectionExample variant={sectionVariant} content={content} />;
  const subtle = contentVariant === 'record';

  return <div className="sh-drawer-showcase">
    <div className="sh-drawer-showcase__lab">
      <div className="sh-drawer-showcase__stage">
        <span className="sh-drawer-showcase__stage-label">组合预览 · {widthVariant === 'standard' ? '600px 标准抽屉' : '400px 紧凑抽屉'}</span>
        <div className="sh-drawer-showcase__preview" style={{ '--sh-drawer-preview-width': widthVariant === 'standard' ? '600px' : '400px' } as CSSProperties}>
          <div className="sh-drawer-showcase__preview-header"><DrawerTitle title="抽屉标题" status={status} /><span className="sh-drawer-showcase__preview-close" aria-hidden="true"><LocalIcon svg={closeIconSvg} size={20} /></span></div>
          <div className={`sh-drawer-showcase__preview-body${subtle ? ' sh-drawer-showcase__preview-body--subtle' : ''}`}>{section}</div>
        </div>
      </div>
      <div className="sh-drawer-showcase__controls" aria-label="抽屉组件类型控制">
        <ControlGroup title="1. 抽屉宽度" value={widthVariant} onChange={setWidthVariant} options={[{ value: 'standard', label: '600px 标准' }, { value: 'compact', label: '400px 紧凑' }]} />
        <ControlGroup title="2. 大标题" value={titleVariant} onChange={setTitleVariant} options={[{ value: 'status', label: '标题 + 状态' }, { value: 'plain', label: '仅标题' }]} />
        <ControlGroup title="3. 小标题" value={sectionVariant} onChange={setSectionVariant} options={[{ value: 'inline', label: '同行描述 + 操作' }, { value: 'below', label: '下方描述 + 标签' }, { value: 'action', label: '标题 + 操作' }, { value: 'count', label: '标题 + 数量' }]} />
        <ControlGroup title="4. 内容类型" value={contentVariant} onChange={setContentVariant} options={[{ value: 'record', label: '记录卡片' }, { value: 'text', label: '纯文本' }, { value: 'fields', label: '字段列表' }, { value: 'tree', label: '权限树' }, { value: 'activity', label: '操作日志' }]} />
        <AppButton type="primary" onClick={() => setOpen(true)}>打开真实抽屉</AppButton>
      </div>
    </div>
    <p className="sh-drawer-showcase__hint">大标题、小标题、内容和宽度彼此独立；实际业务可在同一个 AppDrawer 内放多个 DrawerSection。</p>
    <AppDrawer title="抽屉标题" status={status} widthVariant={widthVariant} bodyTone={subtle ? 'subtle' : 'white'} open={open} onClose={() => setOpen(false)} destroyOnHidden>{section}</AppDrawer>
  </div>;
}
