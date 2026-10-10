import { useState, type Dispatch, type SetStateAction } from 'react';
import { Card, Flex, Tabs, Typography } from 'antd';
import { BubbleShowcase } from './BubbleShowcase';
import { CitationShowcase } from './CitationShowcase';
import { ThinkingShowcase } from './ThinkingShowcase';
import { MessageQueueShowcase } from './MessageQueueShowcase';
import { SmartFeedShowcase } from './SmartFeedShowcase';
import { SmartFeedPageTab } from './SmartFeedPageTab';
import { ConversationPageTab } from './ConversationPageTab';
import { CatalogStatus } from './CatalogStatus';
import {
  AppButton,
  ChatSender,
  type ChatSenderAttachment,
  ChartCard,
  HITLCard,
  LingxiaoSideNav,
  MessageActions,
} from '../index';

const { Paragraph, Title } = Typography;

const DEMO_FILES: Array<{ name: string; meta: string }> = [
  { name: '经营数据.xlsx', meta: '2.4 MB' },
  { name: '指标口径.docx', meta: '860 KB' },
  { name: '供应链履约说明.pdf', meta: '1.8 MB' },
  { name: '华东库存明细.csv', meta: '512 KB' },
  { name: '风险处置规范.pdf', meta: '940 KB' },
  { name: '月度分析模板.pptx', meta: '3.1 MB' },
  { name: '供应商评估表.xlsx', meta: '1.2 MB' },
  { name: '采购合同条款.docx', meta: '680 KB' },
  { name: '产能周报-第38周.pdf', meta: '2.0 MB' },
  { name: '质量抽检记录.xlsx', meta: '430 KB' },
];

/** 文生图接口生成演示缩略图（72×72 方图）。 */
const sampleImage = (prompt: string) =>
  `https://console.enterprise.trae.cn/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=square`;

const DEMO_IMAGES: Array<{ name: string; src: string }> = [
  { name: '纺丝车间现场.jpg', src: sampleImage('现代化化纤工厂纺丝车间生产线实景，整齐的设备') },
  { name: '成品丝垛.jpg', src: sampleImage('仓库中整齐堆放的白色化纤丝饼产品') },
  { name: '仓储物流.jpg', src: sampleImage('大型物流仓库内高耸货架与叉车作业实景') },
  { name: '数据看板.png', src: sampleImage('深色风格经营数据可视化仪表盘界面截图，图表') },
  { name: '码头出货.jpg', src: sampleImage('集装箱港口码头航拍，货轮与吊车') },
];

export interface LingxiaoTabProps {
  senderValue: string;
  setSenderValue: Dispatch<SetStateAction<string>>;
}

export function LingxiaoTab({ senderValue, setSenderValue }: LingxiaoTabProps) {
  // 预置较多文件 + 图片，超过一屏以展示附件横向滑动交互。
  const [demoAttachments, setDemoAttachments] = useState<ChatSenderAttachment[]>([
    ...DEMO_FILES.slice(0, 6).map((file) => ({ name: file.name, meta: file.meta })),
    ...DEMO_IMAGES.slice(0, 2).map((image) => ({ name: image.name, src: image.src, alt: image.name })),
  ]);
  const [sending, setSending] = useState(false);
  const [subPage, setSubPage] = useState<'conversation' | 'smartfeed'>('conversation');

  const addSampleFiles = () => {
    setDemoAttachments((prev) => {
      const pool = DEMO_FILES.filter(
        (file) => !prev.some((item) => !item.src && String(item.name) === file.name),
      );
      return [...prev, ...pool.slice(0, 2).map((file) => ({ name: file.name, meta: file.meta }))];
    });
  };

  const addSampleImages = () => {
    setDemoAttachments((prev) => {
      const pool = DEMO_IMAGES.filter(
        (image) => !prev.some((item) => item.src && String(item.name) === image.name),
      );
      return [...prev, ...pool.slice(0, 2).map((image) => ({ name: image.name, src: image.src, alt: image.name }))];
    });
  };

  const hasMoreFiles = demoAttachments.filter((item) => !item.src).length < DEMO_FILES.length;
  const hasMoreImages = demoAttachments.filter((item) => item.src).length < DEMO_IMAGES.length;

  const addSampleAttachment = () => {
    if (hasMoreFiles) addSampleFiles();
    else if (hasMoreImages) addSampleImages();
  };

  const handleSend = (text: string) => {
    setSenderValue('');
    setSending(true);
    window.setTimeout(() => setSending(false), 1500);
    void text;
  };

  return (
    <section className="catalog-page">
      <header className="catalog-page__header">
        <Title level={2}>凌霄</Title>
        <Paragraph type="secondary">覆盖 Chat、Chart、DetailPage、Actions、Site、Bubble、思考与执行、Sender、HITL、MessageList 与 SmartFeed。</Paragraph>
      </header>

      <Tabs className="sh-lingxiao-subtabs" activeKey={subPage} onChange={(key) => setSubPage(key as 'conversation' | 'smartfeed')} items={[{ key: 'conversation', label: '对话' }, { key: 'smartfeed', label: 'SmartFeed' }]} />

      {subPage === 'conversation' ? <>
      <section className="docs-section">
        <Title level={3} className="docs-section__title">对话完整页面</Title>
        <CatalogStatus kind="mixed">由 ChatBubble、ChatSender、MessageQueue 等公共组件组合；“完整对话页面”本身没有单独导出。</CatalogStatus>
        <ConversationPageTab />
      </section>

      <section className="docs-section">
        <Title level={3} className="docs-section__title">侧边导航栏 LingxiaoSideNav</Title>
        <CatalogStatus kind="public">LingxiaoSideNav 已公开；右侧工作区内容是演示占位。</CatalogStatus>
        <Paragraph type="secondary">吉祥物入口 + 六项功能导航 + 消息通知 + 用户设置，支持 normal / hover / select 三态与受控选中。</Paragraph>
        <div style={{ height: 560, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 12, overflow: 'hidden' }}>
          <LingxiaoSideNav defaultActiveKey="knowledge">
            <div style={{ padding: 24, background: '#f7f9fc', height: '100%', boxSizing: 'border-box' }}>
              <Title level={4} style={{ marginTop: 0 }}>工作区内容区</Title>
              <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                点击左侧图标可切换选中态；悬停查看 tooltip；底部「消息通知」与「用户头像」可展开对应面板。
              </Paragraph>
            </div>
          </LingxiaoSideNav>
        </div>
      </section>

      <section className="docs-section">
        <Title level={3} className="docs-section__title">Bubble 对话气泡</Title>
        <CatalogStatus kind="public">ChatBubble 已公开；消息内容与状态切换是展示页示例。</CatalogStatus>
        <BubbleShowcase />
      </section>

      <section className="docs-section"><Title level={3} className="docs-section__title">Actions 操作列表</Title><CatalogStatus kind="public">MessageActions 已公开；两行排列是演示布局。</CatalogStatus><Card><Flex vertical gap={12}><MessageActions timestamp="2026-09-18 10:36" /><MessageActions type="question" timestamp="2026-09-18 10:38" /></Flex></Card></section>

      <section className="docs-section">
        <Title level={3} className="docs-section__title">Site 引用</Title>
        <CatalogStatus kind="mixed">SourceCitation、SourceCitationDetail 已公开；引用面板的演示交互与示例数据由展示页组合。</CatalogStatus>
        <CitationShowcase />
      </section>

      <section className="docs-section">
        <Title level={3} className="docs-section__title">React 思考与执行</Title>
        <CatalogStatus kind="public">ThinkingProcess 已公开；步骤内容和切换控件是演示数据。</CatalogStatus>
        <ThinkingShowcase />
      </section>

      <section className="docs-section">
        <Title level={3} className="docs-section__title">Sender 输入框</Title>
        <CatalogStatus kind="public">ChatSender 已公开；上方“添加示例文件”等按钮只控制演示状态。</CatalogStatus>
        <Paragraph type="secondary">输入 @ 或 / 选择上下文与 Skill；麦克风进入语音预览，附件超宽可左右翻页。</Paragraph>
        <Flex vertical gap={12}>
          <Flex gap={12} wrap="wrap" align="center">
            <AppButton size="small" onClick={addSampleFiles} disabled={!hasMoreFiles}>添加示例文件</AppButton>
            <AppButton size="small" onClick={addSampleImages} disabled={!hasMoreImages}>添加示例图片</AppButton>
            <AppButton size="small" onClick={() => setDemoAttachments([])} disabled={demoAttachments.length === 0}>清空附件</AppButton>
            <AppButton size="small" type={sending ? 'default' : 'primary'} ghost onClick={() => setSending((prev) => !prev)}>{sending ? '停止生成' : '模拟生成中'}</AppButton>
          </Flex>
          <ChatSender
            value={senderValue}
            onChange={(next) => setSenderValue(next)}
            onSend={handleSend}
            sending={sending}
            onStop={() => setSending(false)}
            attachments={demoAttachments}
            onAttach={addSampleAttachment}
            onRemoveAttachment={(index) => setDemoAttachments((prev) => prev.filter((_, i) => i !== index))}
          />
        </Flex>
      </section>

      <section className="docs-section">
        <Title level={3} className="docs-section__title">HITL 用户确认卡片</Title>
        <CatalogStatus kind="public">HITLCard 与确认卡片组件已公开；展示数据仅用于预览。</CatalogStatus>
        <HITLCard />
      </section>

      <section className="docs-section">
        <Title level={3} className="docs-section__title">MessageList 消息队列</Title>
        <CatalogStatus kind="public">MessageQueue 已公开；队列样例与状态控制属于展示页。</CatalogStatus>
        <MessageQueueShowcase />
      </section>

      <section className="docs-section">
        <Title level={3} className="docs-section__title">Chat Chart 对话图表</Title>
        <CatalogStatus kind="public">ChartCard 已公开；图表数据和双列布局是展示页示例。</CatalogStatus>
        <div className="docs-grid docs-grid--2"><ChartCard title="月度调用趋势" data={[{ label: '5月', value: 42 }, { label: '6月', value: 58 }, { label: '7月', value: 66 }, { label: '8月', value: 79 }, { label: '9月', value: 92 }]} /><ChartCard title="任务状态" type="donut" data={[{ label: '已完成', value: 68 }, { label: '进行中', value: 18 }, { label: '待确认', value: 9 }, { label: '失败', value: 5 }]} /></div>
      </section>
      </> : <>

      <section className="docs-section">
        <Title level={3} className="docs-section__title">SmartFeed 卡片</Title>
        <CatalogStatus kind="public">SmartFeedCard 已公开；示例卡片数据与切换控件不属于公共接口。</CatalogStatus>
        <SmartFeedShowcase />
      </section>

      <section className="docs-section">
        <Title level={3} className="docs-section__title">SmartFeed 页面</Title>
        <CatalogStatus kind="mixed">SmartFeedHeader、SmartFeedDetailPage 等已公开；展示页中的整页导航与样例流程是组合示例。</CatalogStatus>
        <SmartFeedPageTab />
      </section>
      </>}
    </section>
  );
}
