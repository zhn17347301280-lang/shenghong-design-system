import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Flex, Space, Tabs, Typography } from 'antd';
import { AppButton, LocalIcon, colorTokens, radiusTokens, spacingTokens } from '../index';
import addIconSvg from '../icons/svg/通用-添加.svg?raw';
import downloadIconSvg from '../icons/svg/通用-下载.svg?raw';
import { CatalogHeading } from './CatalogHeading';

const { Text } = Typography;
const types = [
  { value: 'primary', label: '主要按钮', usage: '用于提交、创建等最重要的操作。' },
  { value: 'default', label: '默认按钮', usage: '用于取消、返回、导出等其他操作。' },
  { value: 'dashed', label: '虚线按钮', usage: '用于添加条目或条件。' },
  { value: 'text', label: '文本按钮', usage: '用于工具栏等辅助操作。' },
  { value: 'link', label: '链接按钮', usage: '用于查看详情或打开页面。' },
] as const;
const sizes = [
  { value: 'large', label: '大 · 40px' },
  { value: 'medium', label: '中 · 32px' },
  { value: 'small', label: '小 · 24px' },
] as const;
const addIcon = <LocalIcon svg={addIconSvg} />;
const downloadIcon = <LocalIcon svg={downloadIconSvg} />;

function Example({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="button-showcase__example">
      <CatalogHeading title={title} description={description} />
      <Flex wrap gap={spacingTokens.spaceXS} align="center">{children}</Flex>
    </section>
  );
}

function SizeExamples() {
  return (
    <Tabs
      size="small"
      type="card"
      defaultActiveKey="medium"
      aria-label="按钮尺寸"
      items={sizes.map((item) => ({
        key: item.value,
        label: item.label,
        children: (
          <Flex wrap align="center" gap={spacingTokens.spaceSM} aria-label={`${item.label}按钮预览`}>
            {types.map((type) => <AppButton key={type.value} type={type.value} size={item.value}>{type.label}</AppButton>)}
            <AppButton size={item.value} icon={addIcon}>添加</AppButton>
            <AppButton size={item.value} shape="circle" icon={addIcon} aria-label="添加任务" />
          </Flex>
        ),
      }))}
    />
  );
}

function StateExamples() {
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('点击保存，演示 1.5 秒异步等待。');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  function save() {
    if (saving) return;
    setSaving(true);
    setFeedback('正在保存，请稍候…');
    timer.current = setTimeout(() => { setSaving(false); setFeedback('保存成功，可以再次操作。'); }, 1500);
  }
  return (
    <Flex vertical gap={spacingTokens.spaceLG}>
      <Example title="正常与禁用" description="禁用按钮不可点击，旁边应说明原因。">
        <div className="button-showcase__matrix">
          {types.map((item) => <div key={item.value}><AppButton type={item.value}>{item.label}</AppButton><AppButton type={item.value} disabled>{item.label}</AppButton></div>)}
        </div>
      </Example>
      <Text type="secondary">禁用示例原因：当前账号没有编辑权限。</Text>
      <Example title="加载中" description="操作处理中显示加载动画，完成后恢复可点击。">
        <AppButton type="primary" loading>提交中</AppButton>
        <AppButton loading>导出中</AppButton>
        <AppButton type="primary" loading={saving} onClick={save}>{saving ? '保存中' : '点击保存'}</AppButton>
        <span role="status">{feedback}</span>
      </Example>
      <Example title="危险语义" description="用于删除、撤销授权等需谨慎执行的操作。">
        {types.map((item) => <AppButton key={item.value} type={item.value} danger>{item.label}</AppButton>)}
        <AppButton danger disabled>无删除权限</AppButton>
        <AppButton danger type="primary" loading>处理中</AppButton>
      </Example>
      <Example title="真实交互状态" description="悬停或按住按钮查看变化；也可用 Tab 选中、按回车触发。">
        <AppButton type="primary" onClick={() => setFeedback('已触发主要操作。')}>主要操作</AppButton>
        <AppButton onClick={() => setFeedback('已触发次要操作。')}>次要操作</AppButton>
      </Example>
    </Flex>
  );
}

function UsageExamples() {
  const [feedback, setFeedback] = useState('');
  return (
    <Flex vertical gap={spacingTokens.spaceLG}>
      <Example title="主次按钮搭配" description="把最重要的操作设为蓝色按钮，例如“确定”；“取消”等其他操作用默认按钮。">
        <AppButton onClick={() => setFeedback('已取消操作')}>取消</AppButton>
        <AppButton type="primary" onClick={() => setFeedback('已确认操作')}>确定</AppButton>
      </Example>
      <Example title="执行操作与打开页面" description="“导出示例”用于演示点击后的提示；“查看 Ant Design 文档”会在新窗口打开文档。">
        <AppButton icon={downloadIcon} onClick={() => setFeedback('已点击导出，本示例不下载文件。')}>导出示例</AppButton>
        <AppButton type="link" href="https://ant.design/components/button-cn/" target="_blank" rel="noopener noreferrer">查看 Ant Design 文档</AppButton>
      </Example>
      {feedback && <Text role="status">{feedback}</Text>}
    </Flex>
  );
}

export function ButtonShowcase() {
  return (
    <div className="button-showcase">
      <Tabs items={[
        { key: 'type', label: '类型与层级', children: <Flex vertical gap={spacingTokens.spaceLG}>
          <div className="button-showcase__types">
            {types.map((item) => <Example key={item.value} title={item.label} description={item.usage}><AppButton type={item.value}>{item.label}</AppButton></Example>)}
          </div>
          <Example title="颜色与变体（进阶）" description="对比实心、描边和浅色填充等样式。">
            <AppButton color="primary" variant="solid">实心</AppButton><AppButton color="primary" variant="outlined">描边</AppButton><AppButton color="primary" variant="filled">浅色填充</AppButton><AppButton color="primary" variant="dashed">虚线</AppButton><AppButton color="primary" variant="text">文本</AppButton><AppButton color="primary" variant="link">链接</AppButton>
          </Example>
        </Flex> },
        { key: 'size', label: '尺寸', children: <SizeExamples /> },
        { key: 'state', label: '状态与危险操作', children: <StateExamples /> },
        { key: 'icon', label: '图标与形状', children: <Flex vertical gap={spacingTokens.spaceLG}>
          <Example title="内容与图标位置" description="图标可放在文字前、文字后，也可单独使用。">
            <AppButton>创建任务</AppButton><AppButton icon={addIcon} type="primary">创建任务</AppButton><AppButton icon={downloadIcon} iconPlacement="end">下载报告</AppButton><AppButton icon={downloadIcon} aria-label="下载报告" title="下载报告" />
          </Example>
          <Example title="形状" description="圆角矩形、圆形和胶囊形。纯图标按钮需提供操作名称。">
            <AppButton icon={addIcon} aria-label="添加任务" title="添加任务" /><AppButton shape="circle" icon={addIcon} aria-label="添加任务" title="添加任务" /><AppButton shape="round" icon={addIcon}>创建任务</AppButton>
          </Example>
        </Flex> },
        { key: 'layout', label: '背景与宽度', children: <Flex vertical gap={spacingTokens.spaceLG}>
          <Example title="幽灵按钮" description="背景透明，适合放在深色背景或图片上。">
            <div className="button-showcase__ghost" style={{ background: colorTokens.colorText, borderRadius: radiusTokens.radiusMD, padding: spacingTokens.spaceLG }}>
              <Space wrap><AppButton type="primary" ghost>主要按钮</AppButton><AppButton ghost>默认按钮</AppButton><AppButton type="dashed" ghost>虚线按钮</AppButton><AppButton danger ghost>危险操作</AppButton><AppButton ghost disabled>禁用</AppButton></Space>
            </div>
          </Example>
          <Example title="内容自适应与撑满容器" description="默认随文字调整宽度，也可撑满所在区域。">
            <AppButton>内容自适应</AppButton>
            <div className="button-showcase__block"><AppButton type="primary" block>登录</AppButton><AppButton block>返回</AppButton></div>
          </Example>
        </Flex> },
        { key: 'usage', label: '组合与行为', children: <UsageExamples /> },
      ]} />
    </div>
  );
}
