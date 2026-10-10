import { useState, type ReactNode } from 'react';
import { Checkbox, Radio, Space, Typography } from 'antd';
import { AppButton, AppFormItem, AppInput, AppModal, AppSelect, AppTextArea, DetailFieldGroup, LocalIcon, ModalItemCard, RankingContent, ResourcePickerContent } from '../index';
import botIconSvg from '../icons/svg/企业智能平台-用量管理-智能问数.svg?raw';
import knowledgeIconSvg from '../icons/svg/企业智能平台-用量管理-知识问答.svg?raw';
import analysisIconSvg from '../icons/svg/数据报告-数据分析.svg?raw';

const { Paragraph, Text, Title } = Typography;

type ModalCategory = 'readonly' | 'editable' | 'items' | 'composite';
type ItemMode = 'select' | 'action';
type ItemAppearance = 'bordered' | 'filled';
type ReadonlyMode = 'basic' | 'grouped';
type CompositeMode = 'resource-picker' | 'ranking';

const categories: Array<{ key: ModalCategory; label: string; description: string }> = [
  { key: 'readonly', label: '仅读字段', description: '查看详情，不允许修改字段内容。' },
  { key: 'editable', label: '可编辑字段', description: '由 Form Item 组合输入、选择和多行文本。' },
  { key: 'items', label: '条目类', description: '相同条目结构，通过 Radio 或按钮承载不同操作。' },
  { key: 'composite', label: '复合内容', description: '由搜索、选择、列表或数据展示等多个基础组件组成的任务型弹窗。' },
];

function ReadonlyContent() {
  return (
    <div className="sh-modal-fields sh-modal-fields--readonly">
      <section>
        <Title level={5}>基础信息</Title>
        <AppFormItem label="名称" mode="readonly" displayValue="经营分析日报" />
        <AppFormItem label="所属团队" mode="readonly" displayValue="数据运营组" />
        <AppFormItem label="创建人" mode="readonly" displayValue="张三" />
      </section>
      <section>
        <Title level={5}>配置信息</Title>
        <AppFormItem label="更新频率" mode="readonly" displayValue="每日 09:30" />
        <AppFormItem label="说明" mode="readonly" displayValue="汇总企业经营指标，输出变化趋势和异常提示。" />
      </section>
    </div>
  );
}

const groupedDetailItems = [
  { label: '字段1', value: '描述xxxxxxxxxxxx' },
  { label: '字段2', value: '描述xxxxxxxx' },
  { label: '字段3', value: '描述xxxxxxxx描述xxxxxxxx描述xxxxxxxx描述xxxxxxxx' },
  { label: '字段4', value: '描述xxxxxxxx' },
];

function GroupedReadonlyContent() {
  return (
    <div className="sh-grouped-detail">
      <DetailFieldGroup title="标题 1" items={groupedDetailItems} />
      <DetailFieldGroup title="标题 2" items={groupedDetailItems} />
    </div>
  );
}

function EditableContent({ idPrefix }: { idPrefix: string }) {
  return (
    <div className="sh-modal-fields">
      <AppFormItem label="任务名称" required htmlFor={`${idPrefix}-task-name`}>
        <AppInput id={`${idPrefix}-task-name`} placeholder="请输入任务名称" maxLength={50} showCount />
      </AppFormItem>
      <AppFormItem label="任务说明" required htmlFor={`${idPrefix}-task-description`}>
        <AppTextArea id={`${idPrefix}-task-description`} placeholder="请输入任务说明" maxLength={200} showCount autoSize={{ minRows: 3, maxRows: 5 }} />
      </AppFormItem>
      <AppFormItem label="所属分类" required>
        <AppSelect placeholder="请选择分类" options={[{ label: '经营分析', value: 'business' }, { label: '供应链', value: 'supply' }, { label: '客户洞察', value: 'customer' }]} />
      </AppFormItem>
      <AppFormItem label="可见范围" required>
        <Radio.Group defaultValue="team" options={[{ label: '仅自己', value: 'self' }, { label: '所属团队', value: 'team' }, { label: '全部成员', value: 'all' }]} />
      </AppFormItem>
      <AppFormItem label="关注指标">
        <Checkbox.Group defaultValue={['income', 'profit']} options={[{ label: '收入', value: 'income' }, { label: '利润', value: 'profit' }, { label: '产量', value: 'output' }, { label: '库存', value: 'stock' }]} />
      </AppFormItem>
    </div>
  );
}

const itemOptions = [
  { value: 'business', title: '企业 AI Bot', description: '通过企业数据 AI Bot 快速和数据对话', icon: botIconSvg },
  { value: 'knowledge', title: '知识问答 Bot', description: '从企业知识库中查找并总结答案', icon: knowledgeIconSvg },
  { value: 'analysis', title: '经营分析 Bot', description: '围绕经营指标生成分析与洞察', icon: analysisIconSvg },
];

function ItemListContent({ mode, appearance }: { mode: ItemMode; appearance: ItemAppearance }) {
  const [value, setValue] = useState('knowledge');
  const items = itemOptions.map((item) => {
    const selected = mode === 'select' && value === item.value;
    return (
      <ModalItemCard
        appearance={appearance}
        control={mode === 'select'
          ? <Radio aria-label={`选择${item.title}`} checked={selected} />
          : <AppButton size="small">按钮</AppButton>}
        description={item.description}
        icon={<LocalIcon svg={item.icon} size={16} />}
        key={item.value}
        onSelect={mode === 'select' ? () => setValue(item.value) : undefined}
        selected={mode === 'select' && selected}
        title={item.title}
      />
    );
  });

  return <div aria-label={mode === 'select' ? '选择智能助手' : undefined} className="sh-modal-item-list" role={mode === 'select' ? 'radiogroup' : undefined}>{items}</div>;
}

function getModalContent(category: ModalCategory, itemMode: ItemMode, itemAppearance: ItemAppearance, readonlyMode: ReadonlyMode, compositeMode: CompositeMode, surface: 'preview' | 'modal', close?: () => void): ReactNode {
  if (category === 'readonly') return readonlyMode === 'grouped' ? <GroupedReadonlyContent /> : <ReadonlyContent />;
  if (category === 'editable') return <EditableContent idPrefix={surface} />;
  if (category === 'items') return <ItemListContent appearance={itemAppearance} key={`${surface}-${itemMode}-${itemAppearance}`} mode={itemMode} />;
  return compositeMode === 'resource-picker' ? <ResourcePickerContent onCancel={close} onConfirm={close} /> : <RankingContent />;
}

export function ModalShowcase() {
  const [category, setCategory] = useState<ModalCategory>('readonly');
  const [itemMode, setItemMode] = useState<ItemMode>('select');
  const [itemAppearance, setItemAppearance] = useState<ItemAppearance>('bordered');
  const [readonlyMode, setReadonlyMode] = useState<ReadonlyMode>('basic');
  const [compositeMode, setCompositeMode] = useState<CompositeMode>('resource-picker');
  const [open, setOpen] = useState(false);
  const current = categories.find((item) => item.key === category) ?? categories[0];
  const titles: Record<ModalCategory, string> = {
    readonly: readonlyMode === 'grouped' ? '弹窗标题' : '查看任务详情',
    editable: '编辑任务',
    items: itemMode === 'select' ? '选择智能助手' : '智能助手操作',
    composite: compositeMode === 'resource-picker' ? '添加组织/成员' : '全部功能-部门使用排行',
  };
  const currentLabel = category === 'items'
    ? `${current.label}（${itemMode === 'select' ? '选择型' : '按钮操作型'} / ${itemAppearance === 'bordered' ? '边框' : '填充'}）`
    : category === 'readonly'
      ? `${current.label}（${readonlyMode === 'basic' ? '基础字段型' : '分组详情型'}）`
      : category === 'composite'
        ? `${current.label}（${compositeMode === 'resource-picker' ? '成员组织选择' : '排行榜'}）`
        : current.label;
  const groupedReadonly = category === 'readonly' && readonlyMode === 'grouped';

  return (
    <div className="modal-showcase">
      <article className="modal-showcase__preview">
        <div className="modal-showcase__preview-heading">
          <Text className="modal-showcase__eyebrow">卡片预览</Text>
          <Title level={4}>{currentLabel}</Title>
          <Paragraph type="secondary">{current.description}</Paragraph>
        </div>
        <div className="modal-showcase__preview-card" data-category={category} data-composite={category === 'composite' ? compositeMode : undefined}>
          {(category !== 'composite' || compositeMode === 'ranking') && <strong className="modal-showcase__preview-title">{titles[category]}</strong>}
          {getModalContent(category, itemMode, itemAppearance, readonlyMode, compositeMode, 'preview')}
        </div>
        <AppButton type="primary" onClick={() => setOpen(true)}>打开弹窗预览</AppButton>
      </article>

      <aside className="modal-showcase__controls" aria-label="弹窗类型控制">
        <div>
          <Title level={4}>类型控制</Title>
          <Paragraph type="secondary">切换类别后，使用左侧唯一入口打开对应弹窗。</Paragraph>
        </div>
        <div className="modal-showcase__control-group">
          <Text strong>1. 内容类别</Text>
          <Space wrap size={[8, 8]}>
            {categories.map((item) => (
              <AppButton aria-pressed={category === item.key} key={item.key} type={category === item.key ? 'primary' : 'default'} onClick={() => setCategory(item.key)}>{item.label}</AppButton>
            ))}
          </Space>
        </div>
        {category === 'readonly' && (
          <div className="modal-showcase__control-group">
            <Text strong>2. 详情结构</Text>
            <Space wrap size={[8, 8]}>
              <AppButton aria-pressed={readonlyMode === 'basic'} type={readonlyMode === 'basic' ? 'primary' : 'default'} onClick={() => setReadonlyMode('basic')}>基础字段型</AppButton>
              <AppButton aria-pressed={readonlyMode === 'grouped'} type={readonlyMode === 'grouped' ? 'primary' : 'default'} onClick={() => setReadonlyMode('grouped')}>分组详情型</AppButton>
            </Space>
          </div>
        )}
        {category === 'items' && (
          <>
            <div className="modal-showcase__control-group">
              <Text strong>2. 条目操作方式</Text>
              <Space wrap size={[8, 8]}>
                <AppButton aria-pressed={itemMode === 'select'} type={itemMode === 'select' ? 'primary' : 'default'} onClick={() => setItemMode('select')}>选择型</AppButton>
                <AppButton aria-pressed={itemMode === 'action'} type={itemMode === 'action' ? 'primary' : 'default'} onClick={() => setItemMode('action')}>按钮操作型</AppButton>
              </Space>
            </div>
            <div className="modal-showcase__control-group">
              <Text strong>3. 条目样式</Text>
              <Space wrap size={[8, 8]}>
                <AppButton aria-pressed={itemAppearance === 'bordered'} type={itemAppearance === 'bordered' ? 'primary' : 'default'} onClick={() => setItemAppearance('bordered')}>边框</AppButton>
                <AppButton aria-pressed={itemAppearance === 'filled'} type={itemAppearance === 'filled' ? 'primary' : 'default'} onClick={() => setItemAppearance('filled')}>填充</AppButton>
              </Space>
            </div>
          </>
        )}
        {category === 'composite' && (
          <div className="modal-showcase__control-group">
            <Text strong>2. 复合内容类型</Text>
            <Space wrap size={[8, 8]}>
              <AppButton aria-pressed={compositeMode === 'resource-picker'} type={compositeMode === 'resource-picker' ? 'primary' : 'default'} onClick={() => setCompositeMode('resource-picker')}>成员组织选择</AppButton>
              <AppButton aria-pressed={compositeMode === 'ranking'} type={compositeMode === 'ranking' ? 'primary' : 'default'} onClick={() => setCompositeMode('ranking')}>排行榜</AppButton>
            </Space>
          </div>
        )}
      </aside>

      <AppModal
        className={`sh-modal--${category}${groupedReadonly ? ' sh-modal--grouped-detail' : ''}${category === 'composite' ? ` sh-modal--${compositeMode}` : ''}`}
        destroyOnHidden
        open={open}
        title={category === 'composite' && compositeMode === 'resource-picker' ? undefined : titles[category]}
        width={category === 'composite' && compositeMode === 'resource-picker' ? 720 : 600}
        footer={groupedReadonly ? (
          <Space size={8}>
            <AppButton onClick={() => setOpen(false)}>按钮1</AppButton>
            <AppButton className="sh-modal__secondary-action" onClick={() => setOpen(false)}>按钮2</AppButton>
            <AppButton type="primary" onClick={() => setOpen(false)}>按钮3</AppButton>
          </Space>
        ) : category === 'composite' ? null : undefined}
        okText={category === 'readonly' ? '关闭' : '确定'}
        cancelText="取消"
        cancelButtonProps={category === 'readonly' ? { style: { display: 'none' } } : undefined}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      >
        {getModalContent(category, itemMode, itemAppearance, readonlyMode, compositeMode, 'modal', () => setOpen(false))}
      </AppModal>
    </div>
  );
}
