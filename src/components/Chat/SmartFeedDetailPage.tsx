import { useEffect, useState } from 'react';
import { Button } from 'antd';
import { LocalIcon } from '../Icon/LocalIcon';
import { ChatBubble } from './ChatBubble';
import { ThinkingProcess, type ThinkingStep } from './ThinkingProcess';
import { SmartFeedHeader } from './SmartFeedHeader';
import { HITLDialogConfirmation, HITLFormConfirmation } from './HITLConfirmationCard';
import type { SmartFeedStatus } from './SmartFeedCard';
import closeIcon from '../../icons/svg/通用-取消、关闭.svg?raw';
import excelIcon from '../../icons/svg/link-file/link-excel.svg?raw';

export type SmartFeedConfirmationKind = 'dialog' | 'form';

export interface SmartFeedDetailPageProps {
  status: SmartFeedStatus;
  confirmationKind?: SmartFeedConfirmationKind;
  onClose?: () => void;
  onStatusChange?: (status: SmartFeedStatus) => void;
}

const stepDescription = '详情描述XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

export function SmartFeedDetailPage({ status, confirmationKind = 'dialog', onClose, onStatusChange }: SmartFeedDetailPageProps) {
  const [hitlSubmitted, setHitlSubmitted] = useState(false);
  useEffect(() => setHitlSubmitted(false), [status, confirmationKind]);
  const pending = status === 'pending';
  const running = status === 'running';
  const failed = status === 'failed';
  const completed = status === 'complete';
  const steps: ThinkingStep[] = [
    { key: 'thinking', title: '思考完成', description: stepDescription, duration: '120s', status: 'finish' },
    { key: 'planning', title: running ? '正在规划...' : '规划完成', description: stepDescription, duration: '120s', status: running ? 'process' : 'finish' },
    ...(!running ? [{ key: 'execution', title: failed ? '执行失败' : '执行完成', description: stepDescription, duration: '120s', status: failed ? 'error' : 'finish' } satisfies ThinkingStep] : []),
    ...(pending ? [{ key: 'confirmation', title: '待你确认', description: stepDescription, status: 'process' } satisfies ThinkingStep] : []),
  ];

  return (
    <section className="sh-smart-feed-detail" aria-label="SmartFeed 任务详情">
      <SmartFeedHeader />
      <main className="sh-smart-feed-detail__main">
        <div className="sh-smart-feed-detail__task-heading"><strong>任务Summary-思考与执行链路</strong><span>120s</span><Button type="text" size="small" aria-label="返回卡片" icon={<LocalIcon svg={closeIcon} size={16} />} onClick={onClose} /></div>
        <div className="sh-smart-feed-detail__sheet" data-status={status}>
          {!pending && <section className="sh-smart-feed-detail__question"><h3>问题</h3><ChatBubble role="user" attachments={[{ name: '问题附件.doc', meta: '.doc' }]}>问题二：请分析本月经营指标的变化，并说明需要重点关注的风险。</ChatBubble></section>}
          {!pending && <h3 className="sh-smart-feed-detail__section-title">思考与执行</h3>}
          <div className="sh-smart-feed-detail__chain"><ThinkingProcess title={pending ? undefined : '思考与执行'} steps={steps} defaultOpen statusText={undefined} running={running} /></div>
          {pending && <div className={confirmationKind === 'form' ? 'sh-smart-feed-detail__hitl-form' : 'sh-smart-feed-detail__hitl-dialog'}>
            {confirmationKind === 'form'
              ? <HITLFormConfirmation stage={hitlSubmitted ? 'submitted' : 'complete'} onSubmit={() => setHitlSubmitted(true)} />
              : <HITLDialogConfirmation kind="radio-input" stage={hitlSubmitted ? 'after' : 'before'} onSubmit={() => setHitlSubmitted(true)} onStop={() => onStatusChange?.('stopped')} />}
          </div>}
          {completed && <section className="sh-smart-feed-detail__outcome"><div><span className="sh-smart-feed-detail__outcome-dot" /><strong>任务完成</strong></div><p>XXXXXXXXXXXXXXXXXXXXX</p><a href="#smartfeed-result" onClick={(event) => event.preventDefault()}><LocalIcon svg={excelIcon} size={16} />文件产物.xlsx</a><time>更新于 2026-12-12 12:12</time></section>}
        </div>
      </main>
    </section>
  );
}
