import { useRef, useState } from 'react';
import { Typography } from 'antd';
import {
  AppButton,
  ChatBubble,
  ChatSender,
  HITLDialogConfirmation,
  MessageActions,
  type ChatSenderAttachment,
  MessageQueue,
  THINKING_DEMO_STEPS,
  ThinkingProcess,
  type QueueDisplayState,
  type QueueItemStatus,
  type QueueMessage,
  type QueuePhase,
} from '../index';

const { Paragraph, Title } = Typography;
const QUEUE_LIMIT = 10;

const SAMPLE_CONTENT = [
  '请分析本月经营指标的变化，结合华东区域的销售数据和库存周转情况，指出异常原因、潜在风险及需要优先处理的问题。',
  '请继续核对供应链履约数据，整理两家重点供应商的延期情况、恢复时间、替代采购方案和责任团队。',
  '请将分析结论整理成周报，列出下一步跟进事项、完成时限和验收方式，并标明仍需确认的信息。',
];

const MODE_OPTIONS: Array<{ value: QueueDisplayState; label: string }> = [
  { value: 'active', label: '消息已插入' },
  { value: 'inserting', label: '消息插入等待' },
  { value: 'hitl', label: 'HITL 等待确认' },
  { value: 'paused', label: '队列暂停' },
  { value: 'cancelled', label: '对话取消' },
  { value: 'empty', label: '无消息队列' },
];

const PHASE_OPTIONS: Array<{ value: QueuePhase; label: string }> = [
  { value: 'understanding', label: '理解任务' },
  { value: 'processing', label: '处理任务' },
  { value: 'awaiting-confirmation', label: '等待确认' },
];

function itemsFor(state: QueueDisplayState, withFile: boolean): QueueMessage[] {
  if (state === 'empty') return [];
  const statuses: QueueItemStatus[] = state === 'inserting'
    ? ['inserting', 'waiting', 'waiting']
    : state === 'hitl'
      ? ['hitl-inserting', 'hitl-waiting', 'hitl-waiting']
      : state === 'paused' || state === 'cancelled'
        ? ['paused', 'paused', 'paused']
        : ['queued', 'queued', 'queued'];
  return SAMPLE_CONTENT.map((content, index) => ({
    id: String(index + 1),
    content,
    status: statuses[index],
    ...(withFile ? { fileName: '文件1.doc', fileCount: 2, fileNames: ['文件1.doc', '文件2.doc'] } : {}),
  }));
}

export function MessageQueueShowcase() {
  const [phase, setPhase] = useState<QueuePhase>('processing');
  const [state, setState] = useState<QueueDisplayState>('active');
  const [expanded, setExpanded] = useState(true);
  const [withFile, setWithFile] = useState(false);
  const [items, setItems] = useState<QueueMessage[]>(() => itemsFor('active', false));
  const [senderValue, setSenderValue] = useState('');
  const [senderAttachments, setSenderAttachments] = useState<ChatSenderAttachment[]>([]);
  const [senderRevision, setSenderRevision] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showQueue, setShowQueue] = useState(true);
  const senderWrapRef = useRef<HTMLDivElement>(null);
  const editingExistingItem = editingId !== null && items.some((item) => item.id === editingId);
  const queueAtLimit = items.length >= QUEUE_LIMIT && !editingExistingItem;

  const changeState = (next: QueueDisplayState) => {
    setShowQueue(true);
    setState(next);
    setPhase(next === 'hitl' ? 'awaiting-confirmation' : 'processing');
    setExpanded(true);
    setItems(itemsFor(next, withFile));
    setEditingId(null);
    setSenderValue('');
    setSenderAttachments([]);
    setSenderRevision((current) => current + 1);
  };

  const changeType = (nextWithFile: boolean) => {
    setWithFile(nextWithFile);
    setItems((current) => current.map((item) => ({
      ...item,
      fileName: nextWithFile ? '文件1.doc' : undefined,
      fileCount: nextWithFile ? 2 : undefined,
      fileNames: nextWithFile ? ['文件1.doc', '文件2.doc'] : undefined,
    })));
  };

  const insertItem = (item: QueueMessage) => {
    setState('inserting');
    setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, status: 'inserting' } : entry));
    window.setTimeout(() => {
      setItems((current) => current.filter((entry) => entry.id !== item.id).map((entry) => ({ ...entry, status: 'queued' })));
      setState('active');
    }, 1200);
  };

  const editItem = (item: QueueMessage) => {
    setEditingId(item.id);
    setSenderValue(typeof item.content === 'string' ? item.content : '');
    const fileNames = item.fileNames ?? (item.fileName ? [item.fileName] : []);
    setSenderAttachments(fileNames.map((name) => ({ name, meta: '已添加至输入框' })));
    // Sender 的富文本初始内容由 slotConfig 构建，重新挂载以显示待编辑的问题。
    setSenderRevision((current) => current + 1);
    window.requestAnimationFrame(() => {
      senderWrapRef.current?.querySelector<HTMLElement>('[contenteditable="true"], textarea')?.focus();
      senderWrapRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
  };

  const sendItem = (content: string) => {
    const text = content.trim();
    if (!text || queueAtLimit) return;
    const fileNames = senderAttachments.map((attachment) => String(attachment.name));
    const replacement: QueueMessage = {
      id: `queue-${Date.now()}`,
      content: text,
      status: 'queued',
      ...(fileNames.length > 0 ? {
        fileName: fileNames[0],
        fileCount: fileNames.length,
        fileNames,
      } : {}),
    };
    setItems((current) => {
      if (!editingId) return current.length < QUEUE_LIMIT ? [...current, replacement] : current;
      const index = current.findIndex((item) => item.id === editingId);
      if (index < 0) return current.length < QUEUE_LIMIT ? [...current, replacement] : current;
      return current.map((item) => item.id === editingId ? replacement : item);
    });
    setShowQueue(true);
    setState('active');
    setExpanded(true);
    setEditingId(null);
    setSenderValue('');
    setSenderAttachments([]);
    setSenderRevision((current) => current + 1);
  };

  const discussNewWork = () => {
    setItems([]);
    setShowQueue(false);
    setEditingId(null);
    setSenderValue('');
    setSenderAttachments([]);
    setSenderRevision((current) => current + 1);
    window.requestAnimationFrame(() => senderWrapRef.current?.querySelector<HTMLElement>('[contenteditable="true"], textarea')?.focus());
  };

  const fillQueue = () => {
    setItems(Array.from({ length: QUEUE_LIMIT }, (_, index) => ({
      id: `sample-${index + 1}`,
      content: SAMPLE_CONTENT[index % SAMPLE_CONTENT.length],
      status: 'queued',
      ...(withFile ? { fileName: '文件1.doc', fileCount: 2, fileNames: ['文件1.doc', '文件2.doc'] } : {}),
    })));
    setState('active');
    setShowQueue(true);
    setExpanded(true);
    setEditingId(null);
    setSenderValue('');
    setSenderAttachments([]);
    setSenderRevision((current) => current + 1);
  };

  return (
    <div className="sh-queue-demo">
      <section className="sh-queue-demo__preview" aria-label="消息队列预览">
        <div className="sh-queue-demo__preview-header">
          <span>交互预览</span>
          <span>{MODE_OPTIONS.find((option) => option.value === state)?.label} · {withFile ? '文本 + 文件' : '纯文本'}</span>
        </div>
        <div className="sh-queue-demo__stage">
          <div className="sh-queue-demo__conversation" aria-label="消息队列对话预览">
            <div className="sh-queue-demo__question"><ChatBubble role="user">请分析本月经营指标的变化，并说明需要重点关注的风险。</ChatBubble><MessageActions type="question" timestamp="2025-11-02 12:30:30" /></div>
            <div className="sh-queue-demo__answer">
              <ThinkingProcess key={state} steps={THINKING_DEMO_STEPS.slice(0, 3).map((step, index) => ({ ...step, status: state === 'hitl' ? 'finish' : index === 2 ? 'process' : 'finish' }))} defaultOpen running={state !== 'hitl' && state !== 'cancelled'} statusText={state === 'hitl' ? '360s' : '进行中'} />
              {state === 'hitl' ? <HITLDialogConfirmation kind="radio-input" onSubmit={() => changeState('active')} /> : <ChatBubble role="assistant">正在检索经营数据并整理分析结果。后续输入的问题会进入下方等待队列。</ChatBubble>}
            </div>
          </div>
          {showQueue ? <MessageQueue
            items={items}
            phase={phase}
            state={state}
            expanded={expanded}
            queuedCount={state === 'hitl' ? 1 : undefined}
            onExpandedChange={setExpanded}
            onPauseQueue={() => changeState('paused')}
            onResumeQueue={() => changeState('active')}
            onDiscussNewWork={discussNewWork}
            onInsert={insertItem}
            onEdit={editItem}
            onRemove={(item) => {
              setItems((current) => current.filter((entry) => entry.id !== item.id));
              if (editingId === item.id) setEditingId(null);
            }}
          /> : null}
          <div ref={senderWrapRef} className="sh-queue-demo__sender">
            <ChatSender
              key={senderRevision}
              value={senderValue}
              onChange={setSenderValue}
              attachments={senderAttachments}
              onRemoveAttachment={(index) => setSenderAttachments((current) => current.filter((_, attachmentIndex) => attachmentIndex !== index))}
              onSend={sendItem}
              sendDisabled={queueAtLimit}
              sendDisabledReason={`等待队列最多 ${QUEUE_LIMIT} 条，请先处理或删除一条消息`}
              placeholder={editingId ? '修改问题后发送，将替换原队列消息' : '输入你的问题，发送后加入等待队列'}
            />
          </div>
        </div>
      </section>

      <aside className="sh-queue-demo__controls" aria-label="消息队列状态控制">
        <div>
          <Title level={4}>状态控制</Title>
          <Paragraph type="secondary">最多等待 {QUEUE_LIMIT} 条消息；满额后不能新增，但仍可编辑替换。讨论新工作会清空并隐藏当前队列。</Paragraph>
        </div>
        <fieldset className="sh-queue-demo__control-group">
          <legend>整体状态</legend>
          <div className="sh-queue-demo__buttons">
            {PHASE_OPTIONS.map((option) => (
              <AppButton key={option.value} size="small" type={phase === option.value ? 'primary' : 'default'} onClick={() => {
                if (option.value === 'awaiting-confirmation') changeState('hitl');
                else {
                  if (state === 'hitl') changeState('active');
                  setPhase(option.value);
                }
              }}>{option.label}</AppButton>
            ))}
          </div>
        </fieldset>
        <fieldset className="sh-queue-demo__control-group">
          <legend>队列状态</legend>
          <div className="sh-queue-demo__buttons">
            {MODE_OPTIONS.map((option) => (
              <AppButton key={option.value} size="small" type={state === option.value ? 'primary' : 'default'} onClick={() => changeState(option.value)}>{option.label}</AppButton>
            ))}
          </div>
        </fieldset>
        <fieldset className="sh-queue-demo__control-group">
          <legend>单条队列类型</legend>
          <div className="sh-queue-demo__buttons">
            <AppButton size="small" type={!withFile ? 'primary' : 'default'} onClick={() => changeType(false)}>纯文本</AppButton>
            <AppButton size="small" type={withFile ? 'primary' : 'default'} onClick={() => changeType(true)}>文本 + 文件</AppButton>
          </div>
        </fieldset>
        <fieldset className="sh-queue-demo__control-group">
          <legend>队列数量</legend>
          <div className="sh-queue-demo__buttons">
            <AppButton size="small" onClick={fillQueue}>模拟满额（10 条）</AppButton>
            <AppButton size="small" onClick={() => changeState('active')}>恢复 3 条</AppButton>
          </div>
        </fieldset>
      </aside>
    </div>
  );
}
