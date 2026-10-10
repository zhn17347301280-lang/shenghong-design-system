import { useState } from 'react';
import { Typography } from 'antd';
import { AppButton, SmartFeedCard, SmartFeedDetailPage, type SmartFeedConfirmationKind, type SmartFeedStatus } from '../index';

const { Paragraph, Title } = Typography;

const STATUSES: Array<{ value: SmartFeedStatus; label: string }> = [
  { value: 'complete', label: '任务完成' },
  { value: 'failed', label: '执行失败' },
  { value: 'running', label: '进行中' },
  { value: 'stopped', label: '任务终止' },
  { value: 'pending', label: '待确认' },
];

export function SmartFeedShowcase() {
  const [status, setStatus] = useState<SmartFeedStatus>('complete');
  const [hasResults, setHasResults] = useState(true);
  const [reminder, setReminder] = useState(false);
  const [scheduled, setScheduled] = useState(true);
  const [longTitle, setLongTitle] = useState(false);
  const [longDescription, setLongDescription] = useState(false);
  const [visible, setVisible] = useState(true);
  const [detailOpen, setDetailOpen] = useState(false);
  const [confirmationKind, setConfirmationKind] = useState<SmartFeedConfirmationKind>('dialog');
  const [feedback, setFeedback] = useState('');

  const handleAction = (action: 'detail' | 'stop' | 'retry' | 'progress' | 'confirm' | 'result', value?: string) => {
    if (action === 'detail' || action === 'progress' || action === 'result') setDetailOpen(true);
    if (action === 'stop') setStatus('stopped');
    if (action === 'retry') setStatus('running');
    if (action === 'confirm') setStatus('complete');
    setFeedback({ detail: '已打开任务详情预览', stop: '任务已终止', retry: '任务已重新开始', progress: '已打开进度详情预览', confirm: '任务已确认', result: `已选择结果文件：${value}` }[action]);
  };

  return (
    <div className="sh-smart-feed-demo">
      <section className="sh-smart-feed-demo__preview" aria-label="SmartFeed 卡片交互预览">
        <div className="sh-smart-feed-demo__preview-header">
          <span>交互预览</span>
          <span>{STATUSES.find((item) => item.value === status)?.label} · {reminder ? '提醒态' : '普通态'}</span>
        </div>
        <div className="sh-smart-feed-demo__stage">
          {detailOpen ? <SmartFeedDetailPage status={status} confirmationKind={confirmationKind} onClose={() => setDetailOpen(false)} onStatusChange={setStatus} /> : visible ? (
            <SmartFeedCard
              title={longTitle ? '任务名称较长名称较长名称较长名称较长' : '任务Summary'}
              description={longDescription ? '本月经营指标分析任务已完成，已生成销售趋势、库存周转与风险提示等详细内容，点击结果文件可以查看完整报告。' : '任务已完成，相关结果已生成，请点击查看。'}
              status={status}
              scheduled={scheduled}
              reminder={reminder}
              hasResults={hasResults}
              onDiscuss={() => setFeedback('已进入该任务的讨论')}
              onMore={(key) => {
                if (key === 'remove') setVisible(false);
                if (key === 'detail') setDetailOpen(true);
                setFeedback(key === 'remove' ? '任务卡片已删除，可通过右侧状态按钮恢复' : '已打开任务详情预览');
              }}
              onAction={handleAction}
            />
          ) : <AppButton onClick={() => { setVisible(true); setFeedback(''); }}>恢复卡片预览</AppButton>}
          <span className="sh-smart-feed-demo__feedback" role="status" aria-live="polite">{feedback}</span>
        </div>
      </section>

      <aside className="sh-smart-feed-demo__controls" aria-label="SmartFeed 卡片状态控制">
        <div>
          <Title level={4}>状态控制</Title>
          <Paragraph type="secondary">按设计稿切换任务状态、结果文件、提醒态和文案长短；卡片内按钮可演示状态变化。</Paragraph>
        </div>
        <fieldset className="sh-smart-feed-demo__group">
          <legend>详情页面</legend>
          <div className="sh-smart-feed-demo__buttons">
            <AppButton size="small" type={detailOpen ? 'primary' : 'default'} onClick={() => { setVisible(true); setDetailOpen(true); }}>查看详情</AppButton>
            <AppButton size="small" disabled={!detailOpen} onClick={() => setDetailOpen(false)}>返回卡片</AppButton>
          </div>
        </fieldset>
        <fieldset className="sh-smart-feed-demo__group">
          <legend>任务状态</legend>
          <div className="sh-smart-feed-demo__buttons">
            {STATUSES.map((item) => <AppButton key={item.value} size="small" type={status === item.value ? 'primary' : 'default'} onClick={() => { setStatus(item.value); setVisible(true); setFeedback(''); }}>{item.label}</AppButton>)}
          </div>
        </fieldset>
        <fieldset className="sh-smart-feed-demo__group">
          <legend>待确认类型</legend>
          <div className="sh-smart-feed-demo__buttons">
            <AppButton size="small" type={confirmationKind === 'dialog' ? 'primary' : 'default'} onClick={() => { setConfirmationKind('dialog'); setStatus('pending'); setDetailOpen(true); }}>文字 / 选项</AppButton>
            <AppButton size="small" type={confirmationKind === 'form' ? 'primary' : 'default'} onClick={() => { setConfirmationKind('form'); setStatus('pending'); setDetailOpen(true); }}>表单</AppButton>
          </div>
        </fieldset>
        <fieldset className="sh-smart-feed-demo__group">
          <legend>结果文件</legend>
          <div className="sh-smart-feed-demo__buttons">
            <AppButton size="small" type={hasResults ? 'primary' : 'default'} onClick={() => setHasResults(true)}>有结果</AppButton>
            <AppButton size="small" type={!hasResults ? 'primary' : 'default'} onClick={() => setHasResults(false)}>无结果</AppButton>
          </div>
        </fieldset>
        <fieldset className="sh-smart-feed-demo__group">
          <legend>卡片状态</legend>
          <div className="sh-smart-feed-demo__buttons">
            <AppButton size="small" type={!reminder ? 'primary' : 'default'} onClick={() => setReminder(false)}>普通</AppButton>
            <AppButton size="small" type={reminder ? 'primary' : 'default'} onClick={() => setReminder(true)}>提醒</AppButton>
          </div>
        </fieldset>
        <fieldset className="sh-smart-feed-demo__group">
          <legend>标题变体</legend>
          <div className="sh-smart-feed-demo__buttons">
            <AppButton size="small" type={scheduled ? 'primary' : 'default'} onClick={() => setScheduled((current) => !current)}>{scheduled ? '定时任务：是' : '定时任务：否'}</AppButton>
            <AppButton size="small" type={longTitle ? 'primary' : 'default'} onClick={() => setLongTitle((current) => !current)}>{longTitle ? '长名称：是' : '长名称：否'}</AppButton>
          </div>
        </fieldset>
        <fieldset className="sh-smart-feed-demo__group">
          <legend>正文内容</legend>
          <div className="sh-smart-feed-demo__buttons">
            <AppButton size="small" type={!longDescription ? 'primary' : 'default'} onClick={() => setLongDescription(false)}>未超长</AppButton>
            <AppButton size="small" type={longDescription ? 'primary' : 'default'} onClick={() => setLongDescription(true)}>超长（悬停查看）</AppButton>
          </div>
        </fieldset>
      </aside>
    </div>
  );
}
