import { useRef, useState, type Key, type ReactNode } from 'react';
import { Space, Tabs, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { AppButton, CellText, DataTable, InlineEditableTable, LocalIcon, StatusTag, TableActionCell, TableCellContent, type InlineEditableTableHandle, type TableActionItem } from '../index';
import addIconSvg from '../icons/svg/通用-添加.svg?raw';
import importIconSvg from '../icons/svg/企业智能平台-组织与权限-成员管理-批量导入.svg?raw';
import fileIconSvg from '../icons/svg/通用-文件、附件.svg?raw';
import downloadIconSvg from '../icons/svg/通用-下载.svg?raw';

const { Paragraph } = Typography;

/* ----------------------------- 单元格类型速查 ----------------------------- */

interface CellSpecRow {
  id: string;
  spec: string;
  scope: string;
  demo: ReactNode;
}

const fileIcon = <LocalIcon svg={fileIconSvg} size={16} />;
const downloadIcon = <LocalIcon svg={downloadIconSvg} size={16} />;
const loginTag = <StatusTag tone="info">需要登录</StatusTag>;

const cellSpecRows: CellSpecRow[] = [
  {
    id: 'normal',
    spec: '纯文字 · 普通文本',
    scope: '默认正文色 rgba(0,0,0,0.88)',
    demo: <TableCellContent text="单元格文字" />,
  },
  {
    id: 'link',
    spec: '纯文字 · 跳转文本',
    scope: '链接色 #1677FF，可点击',
    demo: <CellText type="link" onClick={() => undefined}>单元格文字</CellText>,
  },
  {
    id: 'disabled',
    spec: '纯文字 · 失效文本',
    scope: '置灰 rgba(0,0,0,0.25)，不可点',
    demo: <CellText type="disabled">单元格文字</CellText>,
  },
  {
    id: 'icon-text',
    spec: '图标 + 文字',
    scope: '自有 16px 图标与文字 8px 间距',
    demo: <TableCellContent icon={fileIcon} text="单元格文字" />,
  },
  {
    id: 'text-tag',
    spec: '文字 + 标签',
    scope: '主体文字尾部挂语义标签',
    demo: <TableCellContent text="单元格文字" tag={loginTag} />,
  },
  {
    id: 'icon-text-tag',
    spec: '图标 + 文字 + 标签',
    scope: '三个槽位同时出现',
    demo: <TableCellContent icon={fileIcon} text="单元格文字" tag={loginTag} />,
  },
  {
    id: 'icon-only',
    spec: '仅图标',
    scope: '只有自有 16px 图标',
    demo: <TableCellContent icon={downloadIcon} />,
  },
  {
    id: 'tag-only',
    spec: '仅标签',
    scope: '只有 22px 标签',
    demo: <TableCellContent tag={loginTag} />,
  },
  {
    id: 'actions',
    spec: '操作单元格',
    scope: '32px 描边按钮、8px 间距；TableActionCell 公共接口',
    demo: <TableActionCell actions={[{ key: 'edit', label: '编辑' }, { key: 'remove', label: '移除' }]} />,
  },
];

const cellSpecColumns: ColumnsType<CellSpecRow> = [
  { title: '组合形态', dataIndex: 'spec', key: 'spec', width: 220,
    render: (value: string) => <strong>{value}</strong> },
  { title: '区分依据', dataIndex: 'scope', key: 'scope', width: 320,
    render: (value: string) => <span style={{ color: 'rgba(0,0,0,0.45)' }}>{value}</span> },
  { title: '实际渲染', dataIndex: 'demo', key: 'demo', render: (_: unknown, record) => record.demo },
];

function CellTypesPanel() {
  return (
    <>
      <Paragraph type="secondary" style={{ marginTop: 0 }}>
        单元格按「槽位组合」与「纯文字语义」两层区分：外层是 icon / text / tag 三个可缺省槽位（6 种组合）；
        纯文字时再用 textType 区分普通、跳转、失效。所有图标统一使用组件库自有 LocalIcon。下表逐行列出全部形态（该表演示「不可选择」表格，无复选框列）。
      </Paragraph>
      <DataTable<CellSpecRow>
        columns={cellSpecColumns}
        dataSource={cellSpecRows}
        pagination={false}
      />
    </>
  );
}

/* ------------------------------ 业务表格演示 ------------------------------ */

interface MemberRecord {
  id: number;
  name: string;
  source: string;
  permission: string;
  category: string;
  enabled: boolean;
}

const names = ['张明', '李妍', '王强', '赵琳', '陈昊', '刘畅', '孙悦', '周航', '吴迪', '郑爽', '冯远', '许静', '蒋磊', '韩雪', '沈涛'];
const memberRows: MemberRecord[] = names.map((name, index) => ({
  id: index + 1,
  name,
  source: index % 4 === 3 ? '历史归档数据源' : '企业微信',
  permission: index % 3 === 0 ? '需要登录' : '公开访问',
  category: index % 2 === 0 ? '内部成员' : '外部协作者',
  enabled: index % 5 !== 4,
}));

const moreMenu = {
  items: [
    { key: 'copy', label: '复制链接' },
    { key: 'export', label: '导出' },
  ],
};

const memberActions = (_record: MemberRecord): TableActionItem[] => [
  { key: 'edit', label: '编辑', onClick: () => undefined },
  { key: 'remove', label: '移除', onClick: () => undefined },
];

const memberColumns: ColumnsType<MemberRecord> = [
  {
    title: '成员', dataIndex: 'name', key: 'name', width: 180,
    render: (_: unknown, record) => (
      <TableCellContent icon={fileIcon} text={record.name} textType="link" />
    ),
  },
  {
    title: '数据来源', dataIndex: 'source', key: 'source', width: 180,
    render: (value: string, record) => <CellText type={record.enabled ? 'normal' : 'disabled'}>{value}</CellText>,
  },
  {
    title: '访问权限', dataIndex: 'permission', key: 'permission', width: 200,
    render: (value: string) => (
      <TableCellContent
        text={value === '需要登录' ? '受控资源' : '开放资源'}
        tag={<StatusTag tone={value === '需要登录' ? 'info' : 'success'}>{value}</StatusTag>}
      />
    ),
  },
  {
    title: '成员类别', dataIndex: 'category', key: 'category', width: 150,
    render: (value: string) => <TableCellContent tag={<StatusTag tone="neutral">{value}</StatusTag>} />,
  },
];

const paginationConfig = { defaultPageSize: 8, pageSizeOptions: [8, 15, 30] };

function useRowSelection() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([1]);
  return { selectedRowKeys, onChange: setSelectedRowKeys };
}

type ToolbarVariant = 'titled' | 'actions';

function EditableTablePanel({ toolbarVariant }: { toolbarVariant: ToolbarVariant }) {
  const tableRef = useRef<InlineEditableTableHandle>(null);
  return (
    <>
      <Paragraph type="secondary" style={{ marginTop: 0 }}>
        数据单元格直接编辑。点击「检查必填」显示红框和单元格下方提示；补齐内容后错误实时消失，行高保持一致。
      </Paragraph>
      <Space style={{ marginBottom: 16 }}>
        <AppButton onClick={() => tableRef.current?.validate()}>检查必填</AppButton>
        <AppButton onClick={() => tableRef.current?.clearValidation()}>清除报错</AppButton>
      </Space>
      <InlineEditableTable
        ref={tableRef}
        toolbarVariant={toolbarVariant}
        initialRows={[
          { id: 1, fieldName: '', fieldCode: '', dataType: 'text', required: 'yes', defaultValue: '', description: '请补充字段名称与编码' },
          { id: 2, fieldName: '年龄', fieldCode: 'age', dataType: 'number', required: 'no', defaultValue: '18', description: '成员年龄' },
        ]}
      />
    </>
  );
}

function StandardTablePanel({ toolbarVariant }: { toolbarVariant: ToolbarVariant }) {
  const selection = useRowSelection();
  return (
    <>
      <Paragraph type="secondary" style={{ marginTop: 0 }}>
        数据展示表格用于浏览、筛选和批量选择数据；右上角按钮只切换工具栏布局，不改变表格类型。
      </Paragraph>
      <DataTable<MemberRecord>
        toolbarVariant={toolbarVariant}
        title={toolbarVariant === 'titled' ? '成员列表（1000）' : undefined}
        actions={
          <Space size={8}>
            <AppButton type="primary" icon={<LocalIcon svg={addIconSvg} size={16} />}>新建任务</AppButton>
            <AppButton icon={<LocalIcon svg={importIconSvg} size={16} />}>批量导入</AppButton>
          </Space>
        }
        categories={[{ key: 'all', label: '类别1' }, { key: 'mine', label: '类别2' }]}
        defaultActiveCategory="all"
        filterable
        onFilter={() => undefined}
        searchable
        refreshable
        onRefresh={() => undefined}
        columns={memberColumns}
        rowActions={memberActions}
        rowActionMore={() => moreMenu}
        rowActionDisabled={(record) => !record.enabled}
        dataSource={memberRows}
        rowKey="id"
        rowSelection={{ selectedRowKeys: selection.selectedRowKeys, onChange: selection.onChange }}
        pagination={paginationConfig}
      />
      <section className="sh-table-showcase__fixed-test">
        <h4>固定操作列 · 横向滚动状态检查</h4>
        <Paragraph type="secondary">下方预览宽度限制为 760px。横向滚动并悬停、选中行时，右侧操作列必须盖住下方单元格内容。</Paragraph>
        <div style={{ maxWidth: 760 }}>
          <DataTable<MemberRecord>
            columns={memberColumns}
            rowActions={memberActions}
            rowActionMore={() => moreMenu}
            rowActionDisabled={(record) => !record.enabled}
            dataSource={memberRows.slice(0, 5)}
            rowKey="id"
            rowSelection={{ selectedRowKeys: selection.selectedRowKeys, onChange: selection.onChange }}
            pagination={false}
            scroll={{ x: 1200 }}
          />
        </div>
      </section>
      <section className="sh-table-showcase__cell-types">
        <h4>单元格类型速查</h4>
        <CellTypesPanel />
      </section>
    </>
  );
}

export function TableShowcase() {
  const [toolbarVariant, setToolbarVariant] = useState<ToolbarVariant>('titled');

  const toolbarSwitch = (
    <div className="sh-table-showcase__toolbar-switch" aria-label="工具栏类型">
      <span>工具栏</span>
      <AppButton size="small" type={toolbarVariant === 'titled' ? 'primary' : 'default'} onClick={() => setToolbarVariant('titled')}>表格名称型</AppButton>
      <AppButton size="small" type={toolbarVariant === 'actions' ? 'primary' : 'default'} onClick={() => setToolbarVariant('actions')}>纯操作栏</AppButton>
    </div>
  );

  return (
    <div className="sh-table-showcase">
      <Tabs
        tabBarExtraContent={{ right: toolbarSwitch }}
        items={[
          { key: 'data', label: '数据展示表格', children: <StandardTablePanel toolbarVariant={toolbarVariant} /> },
          { key: 'editable', label: '行内编辑表格', children: <EditableTablePanel toolbarVariant={toolbarVariant} /> },
        ]}
      />
    </div>
  );
}
