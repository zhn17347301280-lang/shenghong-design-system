import { useState } from 'react';
import { Button, Form, Input, Select } from 'antd';
import { DataTable } from '../Table/DataTable';
import { AppButton } from '../Button/AppButton';
import { CellText } from '../Table/CellText';
import { TableCellContent } from '../Table/TableCellContent';
import { StatusTag } from '../Tag/StatusTag';
import { EnterprisePermissionTree } from './EnterprisePermissionCard';
import { EditableDataTable } from '../Table/EditableDataTable';
import type { EnterpriseSearchTreeType } from './EnterpriseSearchTree';
import { LocalIcon } from '../Icon/LocalIcon';
import addIcon from '../../icons/svg/通用-添加.svg?raw';
import importIcon from '../../icons/svg/企业智能平台-组织与权限-成员管理-批量导入.svg?raw';

export type EnterpriseDetailContentMode = 'table' | 'form' | 'cards' | 'details';
export type EnterpriseDetailFormType = 'role' | 'ontology' | 'member' | 'resource';
export type EnterpriseDetailTreeType = 'none' | EnterpriseSearchTreeType;

const tableRows = Array.from({ length: 8 }, (_, index) => ({
  id: index + 1,
  name: '单元格文字',
  department: '单元格文字',
  owner: '单元格文字',
  time: '2025-11-12 12:20:20',
  status: '标签',
  category: index % 2 === 0 ? 'all' : 'mine',
}));

export function EnterpriseDetailTable({ withTree = false }: { withTree?: boolean }) {
  const [rows, setRows] = useState(tableRows);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [filtered, setFiltered] = useState(false);
  const [tableVersion, setTableVersion] = useState(0);
  const visible = rows.filter((row) =>
    (category === 'all' || row.category === category)
    && (!filtered || row.id % 2 === 0)
    && Object.values(row).some((value) => String(value).includes(search)));
  const reset = () => { setRows(tableRows); setSearch(''); setCategory('all'); setFiltered(false); setTableVersion((value) => value + 1); };
  return (
    <div className="sh-enterprise-detail-table">
      {withTree && (
        <div className="sh-enterprise-detail-table__information">
          <h4>基本信息</h4>
          <dl><div><dt>组织名称：</dt><dd>技术研发部</dd></div><div><dt>组织编号：</dt><dd>TECH001</dd></div><div><dt>部门负责人：</dt><dd>张三（123456）</dd></div><div><dt>分管领导：</dt><dd>李四（123456）</dd></div></dl>
        </div>
      )}
      <DataTable
        square
        flush
        key={tableVersion}
        toolbarVariant="actions"
        actions={<>
          <AppButton type="primary" icon={<LocalIcon svg={addIcon} size={16} />} onClick={() => setRows((current) => [...current, { ...tableRows[0], id: Date.now() }])}>新建任务</AppButton>
          <AppButton icon={<LocalIcon svg={importIcon} size={16} />} onClick={reset}>批量导入</AppButton>
        </>}
        categories={[{ key: 'all', label: '类别1' }, { key: 'mine', label: '类别2' }]}
        activeCategory={category}
        onCategoryChange={setCategory}
        filterable
        filterText={filtered ? '已筛选' : '筛选'}
        onFilter={() => setFiltered((value) => !value)}
        searchable
        searchPlaceholder="请输入关键词"
        onSearch={setSearch}
        refreshable
        onRefresh={reset}
        rowSelection={{}}
        columns={[
          { title: '单元格文字', dataIndex: 'name', key: 'name', ellipsis: true, render: (value: string) => <TableCellContent text={value} textType="link" /> },
          { title: '单元格文字', dataIndex: 'department', key: 'department', ellipsis: true, render: (value: string) => <TableCellContent text={value} /> },
          { title: '单元格文字', dataIndex: 'owner', key: 'owner', ellipsis: true, render: (value: string) => <TableCellContent text={value} /> },
          { title: '时间', dataIndex: 'time', key: 'time', ellipsis: true, render: (value: string) => <CellText>{value}</CellText> },
          { title: '标签', dataIndex: 'status', key: 'status', width: 100, render: (value: string) => <TableCellContent tag={<StatusTag tone="neutral">{value}</StatusTag>} /> },
          { title: '操作', key: 'actions', width: 176, render: (_: unknown, row: (typeof tableRows)[number]) => <div className="sh-enterprise-detail-table__actions"><AppButton size="middle">查看</AppButton><AppButton size="middle" onClick={() => setRows((current) => current.filter((item) => item.id !== row.id))}>删除</AppButton></div> },
        ]}
        dataSource={visible}
        pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 项` }}
      />
    </div>
  );
}

function EnterpriseRoleForm() {
  return <Form className="sh-enterprise-detail-form" layout="vertical" onFinish={() => undefined}>
    <section className="sh-enterprise-detail-form__section"><h4>基本信息</h4>
      <div className="sh-enterprise-detail-form__grid"><Form.Item label="角色名称" name="roleName" rules={[{ required: true, message: '请输入角色名称' }]}><Input placeholder="请输入角色名称" /></Form.Item><Form.Item label="角色描述" name="roleDescription"><Input placeholder="请输入角色描述" /></Form.Item></div>
    </section>
    <section className="sh-enterprise-detail-form__section"><EnterprisePermissionTree /></section>
    <div className="sh-enterprise-detail-form__footer"><Button htmlType="reset">取消</Button><Button type="primary" htmlType="submit">保存</Button></div>
  </Form>;
}

function EnterpriseOntologyForm() {
  return <Form className="sh-enterprise-detail-form" layout="vertical" onFinish={() => undefined}>
    <section className="sh-enterprise-detail-form__section"><h4>基本信息</h4>
      <div className="sh-enterprise-detail-form__grid">
        <Form.Item label="中文名称" name="nameZh" rules={[{ required: true, message: '请输入中文名称' }]}><Input placeholder="请输入" /></Form.Item>
        <Form.Item label="英文名称" name="nameEn"><Input placeholder="请输入" /></Form.Item>
        <Form.Item label="所属业务域" name="businessDomain"><Select placeholder="请选择" options={[{ value: 'production', label: '生产经营' }, { value: 'organization', label: '组织管理' }]} /></Form.Item>
        <Form.Item label="描述" name="description"><Input.TextArea placeholder="请输入" autoSize={{ minRows: 2, maxRows: 3 }} /></Form.Item>
      </div>
    </section>
    <EditableDataTable kind="property" /><EditableDataTable kind="relation" />
    <section className="sh-enterprise-detail-form__section"><h4>绑定数据</h4><Button>选择数据表</Button></section>
    <div className="sh-enterprise-detail-form__footer"><Button htmlType="reset">取消</Button><Button type="primary" htmlType="submit">保存</Button></div>
  </Form>;
}

function EnterpriseMemberForm() {
  return <Form className="sh-enterprise-detail-form" layout="vertical" onFinish={() => undefined}>
    <section className="sh-enterprise-detail-form__section"><h4>成员信息</h4>
      <div className="sh-enterprise-detail-form__grid">
        <Form.Item label="姓名" name="memberName" rules={[{ required: true, message: '请输入姓名' }]}><Input placeholder="请输入姓名" /></Form.Item>
        <Form.Item label="手机号" name="phone"><Input placeholder="请输入手机号" /></Form.Item>
        <Form.Item label="邮箱" name="email"><Input placeholder="请输入邮箱" /></Form.Item>
        <Form.Item label="所属组织" name="organization"><Select placeholder="请选择组织" options={[{ value: 'petrochemical', label: '盛虹石化' }, { value: 'east', label: '江苏东方盛虹股份有限公司' }]} /></Form.Item>
        <Form.Item label="角色" name="memberRole"><Select placeholder="请选择角色" options={[{ value: 'admin', label: '管理员' }, { value: 'member', label: '成员' }]} /></Form.Item>
        <Form.Item label="岗位" name="position"><Input placeholder="请输入岗位" /></Form.Item>
        <Form.Item className="sh-enterprise-detail-form__full" label="备注" name="note"><Input.TextArea placeholder="请输入备注" autoSize={{ minRows: 3, maxRows: 5 }} /></Form.Item>
      </div>
    </section>
    <div className="sh-enterprise-detail-form__footer"><Button htmlType="reset">取消</Button><Button type="primary" htmlType="submit">保存</Button></div>
  </Form>;
}

function EnterpriseResourceForm() {
  return <Form className="sh-enterprise-detail-form" layout="vertical" onFinish={() => undefined}>
    <section className="sh-enterprise-detail-form__section"><h4>信息源配置</h4>
      <div className="sh-enterprise-detail-form__grid">
        <Form.Item label="信息源名称" name="resourceName" rules={[{ required: true, message: '请输入信息源名称' }]}><Input placeholder="请输入信息源名称" /></Form.Item>
        <Form.Item label="来源类型" name="sourceType"><Select placeholder="请选择来源类型" options={[{ value: 'file', label: '文件' }, { value: 'api', label: 'API' }]} /></Form.Item>
        <Form.Item label="所属业务域" name="resourceDomain"><Select placeholder="请选择业务域" options={[{ value: 'production', label: '生产经营' }, { value: 'organization', label: '组织管理' }]} /></Form.Item>
        <Form.Item label="访问权限" name="access"><Select placeholder="请选择访问权限" options={[{ value: 'public', label: '公开访问' }, { value: 'restricted', label: '需要登录' }]} /></Form.Item>
        <Form.Item className="sh-enterprise-detail-form__full" label="描述" name="resourceDescription"><Input.TextArea placeholder="请输入描述" autoSize={{ minRows: 3, maxRows: 5 }} /></Form.Item>
      </div>
    </section>
    <div className="sh-enterprise-detail-form__footer"><Button htmlType="reset">取消</Button><Button type="primary" htmlType="submit">保存</Button></div>
  </Form>;
}

export function EnterpriseDetailForm({ type }: { type: EnterpriseDetailFormType }) {
  if (type === 'role') return <EnterpriseRoleForm />;
  if (type === 'ontology') return <EnterpriseOntologyForm />;
  if (type === 'member') return <EnterpriseMemberForm />;
  return <EnterpriseResourceForm />;
}
