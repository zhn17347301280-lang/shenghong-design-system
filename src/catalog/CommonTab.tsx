import { Card, Flex, Space, Typography } from 'antd';
import {
  AppButton,
  LocalIcon,
} from '../index';
import { LoginShowcase } from './LoginShowcase';
import { FormShowcase } from './FormShowcase';
import { CardShowcase } from './CardShowcase';
import { ModalShowcase } from './ModalShowcase';
import { DrawerShowcase } from './DrawerShowcase';
import { FileShowcase } from './FileShowcase';
import { TagShowcase } from './TagShowcase';
import { TableShowcase } from './TableShowcase';
import { ChartShowcase } from './ChartShowcase';
import { CatalogStatus } from './CatalogStatus';
import addIconSvg from '../icons/svg/通用-添加.svg?raw';

const { Paragraph, Title } = Typography;

export function CommonTab() {
  return (
    <section className="catalog-page">
      <header className="catalog-page__header">
        <Title level={2}>通用组件</Title>
        <Paragraph type="secondary">对应 MasterGo 通用目录中的 Button、Login、Form Item、Card、Modal、Drawer、File、Tag、Table 和 Chart。</Paragraph>
      </header>

      <section className="docs-section">
        <Title level={3} className="docs-section__title">Button 按钮</Title>
        <CatalogStatus kind="public">AppButton 已公开；下方按钮组只用于展示不同 Props 状态。</CatalogStatus>
        <Card><Flex vertical gap={16}>
          <Space wrap>
            <AppButton type="primary">主要按钮</AppButton><AppButton>默认按钮</AppButton><AppButton type="text">纯文本</AppButton><AppButton ghost type="primary">幽灵按钮</AppButton>
          </Space>
          <Space wrap>
            <AppButton danger type="primary">危险操作</AppButton><AppButton loading type="primary">加载状态</AppButton><AppButton disabled>禁用状态</AppButton><AppButton type="primary" icon={<LocalIcon svg={addIconSvg} />}>图标与文本</AppButton>
          </Space>
        </Flex></Card>
      </section>

      <section className="docs-section">
        <Title level={3} className="docs-section__title">Tag 标签</Title>
        <CatalogStatus kind="public">StatusTag、FieldTypeTag 已公开；标签分组和演示切换不是公共接口。</CatalogStatus>
        <Paragraph type="secondary">普通标签基于 antd Tag，覆盖蓝 / 绿 / 红 / 橙 / 灰五色，并区分有、无前置图标；另提供字段类型标签，便于后续扩展更多标签类型。</Paragraph>
        <TagShowcase />
      </section>

      <section className="docs-section">
        <Title level={3} className="docs-section__title">Card 卡片</Title>
        <CatalogStatus kind="public">MetricCard、ReportCard、InformationCard、OptionCard、EntityCard 已公开；演示数据与切换控件属于示例。</CatalogStatus>
        <Paragraph type="secondary">按分类覆盖指标卡、报告卡片、本体卡片和卡片选项；状态由按钮组合控制，Hover 通过真实鼠标悬浮触发。</Paragraph>
        <CardShowcase />
      </section>

      <section className="docs-section">
        <Title level={3} className="docs-section__title">Login 登陆</Title>
        <CatalogStatus kind="public">LoginPanel 已公开；右侧状态控制仅用于演示。</CatalogStatus>
        <Paragraph type="secondary">在一张 416 × 416 卡片中完成验证码/密码切换、找回密码、返回与设置密码；难触发的报错状态可从右侧控制。</Paragraph>
        <LoginShowcase />
      </section>

      <section className="docs-section">
        <Title level={3} className="docs-section__title">Form Item 表单项</Title>
        <CatalogStatus kind="mixed">AppFormItem 与 AppInput、AppSelect、AppTextArea、AppSwitch 已公开；此处部分字段控件和多字段组合由展示页临时拼接，没有统一字段组合接口。</CatalogStatus>
        <Paragraph type="secondary">按 MasterGo 属性覆盖字段内容、上下/左右布局，以及只读、编辑、编辑中、开关和错误状态。</Paragraph>
        <FormShowcase />
      </section>

      <section className="docs-section">
        <Title level={3} className="docs-section__title">Modal 弹窗</Title>
        <CatalogStatus kind="mixed">AppModal 及部分弹窗内容组件已公开；示例中的只读/编辑表单内容由展示页组装，不是整块公共弹窗接口。</CatalogStatus>
        <Paragraph type="secondary">按任务结构分为仅读字段、可编辑字段、条目类和复合内容；复合内容继续区分成员组织选择与排行榜。左侧同步展示卡片预览，并保留真实弹窗入口。</Paragraph>
        <ModalShowcase />
      </section>

      <section className="docs-section">
        <Title level={3} className="docs-section__title">Drawer 抽屉</Title>
        <CatalogStatus kind="public">AppDrawer 外壳、DrawerTitle 大标题、DrawerSection 小标题，以及记录卡片、纯文本、字段列表、权限树、操作日志内容组件均已公开。</CatalogStatus>
        <Paragraph type="secondary">按「大标题 → 小标题 → 内容」组合抽屉，宽度独立选择 400/600px。右侧按钮分别切换各层变体，左侧即时预览；也可打开真实抽屉检查遮罩与滚动。</Paragraph>
        <DrawerShowcase />
      </section>

      <section className="docs-section">
        <Title level={3} className="docs-section__title">File 文件</Title>
        <CatalogStatus kind="public">FileUpload、ModalFileUpload、文件卡片和文件类型图标已公开；演示容器与示例文件是展示页内容。</CatalogStatus>
        <FileShowcase />
      </section>

      <section className="docs-section">
        <Title level={3} className="docs-section__title">Table 表格</Title>
        <CatalogStatus kind="mixed">DataTable、CellText、TableCellContent、TableActionCell、InlineEditableTable 已公开；操作列通过 DataTable 的 rowActions 接口配置。业务字段与示例数据仍由展示页提供；InlineEditableTable 当前只支持其固定字段结构。</CatalogStatus>
        <Paragraph type="secondary">表格分数据展示与行内编辑两类，通过 Tab 切换；名称型、操作型仅属于工具栏布局，由右侧按钮切换。行内编辑表格保持控件描边，支持保存前必填校验与稳定行高的错误提示。</Paragraph>
        <TableShowcase />
      </section>

      <section className="docs-section">
        <Title level={3} className="docs-section__title">Chart 图表</Title>
        <CatalogStatus kind="public">ChartCard、TopCountSelect 已公开；图表示例数据与切换控件不属于公共接口。</CatalogStatus>
        <Paragraph type="secondary">覆盖排行榜、折线图、基础柱状 / 条形图、多系列分组 / 堆叠图、环形图和漏斗图；可切换图表类别，并用 Top N 控制展示数据条数。</Paragraph>
        <ChartShowcase />
      </section>
    </section>
  );
}
