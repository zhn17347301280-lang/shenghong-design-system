import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { Typography } from 'antd';
import { AppButton, ChatBubble, ChatFileCard, ChatSender, HITLDialogConfirmation, HITLFormConfirmation, LocalIcon, MessageActions, MessageQueue, SourceCitation, SourceCitationDetail, ThinkingProcess, THINKING_DEMO_STEPS, type QueueMessage } from '../index';
import { CitationMarker, citationRecords } from './CitationShowcase';
import downIcon from '../icons/svg/通用-下.svg?raw';

type ConversationKind = 'knowledge' | 'plain' | 'running' | 'hitl' | 'form' | 'file' | 'queue';

const cases: Array<{ key: ConversationKind; label: string }> = [
  { key: 'knowledge', label: '知识库检索' },
  { key: 'plain', label: '普通问答' },
  { key: 'running', label: '任务执行中' },
  { key: 'hitl', label: '对话确认' },
  { key: 'form', label: '表单确认' },
  { key: 'file', label: '生成结果有文件' },
  { key: 'queue', label: '消息队列' },
];

const previousTurns = [
  { question: '请结合经营数据、会议录音和风险说明，分析本月销售额、库存周转与供应链履约情况；对比上月变化，指出异常原因、潜在影响和需要优先处理的问题，并给出面向业务团队的跟进建议。', answer: '我会先确认任务目标、涉及的数据和资料范围，再按步骤推进分析。' },
  { question: '可以先说明你准备如何处理吗？', answer: '可以。我会先理解问题和规划步骤，再检索相关资料；如有需要你确认的内容，会在执行前提出。' },
];

const initialQueue: QueueMessage[] = [
  { id: 'queue-1', content: '继续核对相关资料，补充关键风险和依据。', status: 'queued' },
  { id: 'queue-2', content: '请把结论整理为便于分享的摘要。', status: 'queued' },
];

const questions: Record<ConversationKind, string> = {
  knowledge: 'PSA氢气提纯单元的工作原理是什么',
  plain: 'PDH 是什么意思？',
  running: 'PSA氢气提纯单元的工作原理是什么',
  hitl: '请分析本月经营指标的变化，并说明需要重点关注的风险。',
  form: '请帮我填写差旅报销申请。',
  file: 'PX 和 PTA 近期价格分析，并输出 excel 分析报告',
  queue: '请先分析本月经营指标，再整理后续待办。',
};

export function ConversationPageTab() {
  const [kind, setKind] = useState<ConversationKind>('knowledge');
  const [selectedCitation, setSelectedCitation] = useState<number | null>(null);
  const [citationExpanded, setCitationExpanded] = useState(true);
  const [pinnedExpanded, setPinnedExpanded] = useState(false);
  const [dockedQuestion, setDockedQuestion] = useState<string | null>(null);
  const [awayFromBottom, setAwayFromBottom] = useState(false);
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [running, setRunning] = useState(false);
  const [queueVisible, setQueueVisible] = useState(true);
  const [discussingNewWork, setDiscussingNewWork] = useState(false);
  const [queueItems, setQueueItems] = useState<QueueMessage[]>(initialQueue);
  const [queueExpanded, setQueueExpanded] = useState(false);
  const [queuePaused, setQueuePaused] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const selectedRecord = selectedCitation === null ? null : citationRecords.knowledge[selectedCitation];
  const queueActive = !discussingNewWork && (kind === 'queue' || kind === 'running' || ((kind === 'hitl' || kind === 'form') && !submitted));

  const syncScroll = useCallback(() => {
    const scroll = scrollRef.current;
    if (!scroll) return;
    const top = scroll.getBoundingClientRect().top;
    const pastQuestions = [...scroll.querySelectorAll<HTMLElement>('[data-question-text]')]
      .filter((node) => node.getBoundingClientRect().bottom < top + 4);
    setDockedQuestion(pastQuestions.at(-1)?.dataset.questionText ?? null);
    setAwayFromBottom(scroll.scrollHeight - scroll.scrollTop - scroll.clientHeight > 60);
  }, []);

  useLayoutEffect(() => {
    const scroll = scrollRef.current;
    if (!scroll) return;
    scroll.scrollTop = scroll.scrollHeight;
    syncScroll();
  }, [kind, syncScroll]);

  const switchCase = (next: ConversationKind) => {
    setKind(next);
    setSelectedCitation(null);
    setSubmitted(false);
    setInput('');
    setQueueVisible(true);
    setDiscussingNewWork(false);
    setQueueItems(initialQueue);
    setQueueExpanded(false);
    setQueuePaused(false);
    setEditingId(null);
    setRunning(false);
    setPinnedExpanded(false);
  };

  const send = (value: string) => {
    const text = value.trim();
    if (!text) return;
    if (queueActive && queueItems.length >= 10 && !editingId) return;
    if (queueActive) {
      setQueueItems((current) => editingId
        ? current.map((item) => item.id === editingId ? { ...item, content: text } : item)
        : [...current, { id: `queue-${Date.now()}`, content: text, status: 'queued' }]);
      setQueueVisible(true);
      setEditingId(null);
    } else setRunning(true);
    setInput('');
  };

  return (
    <div className="sh-conversation-demo" data-has-detail={selectedRecord !== null || undefined}>
      <section className="sh-conversation-demo__preview" aria-label="对话整页预览">
        <div className="sh-smart-feed-demo__preview-header"><span>整页交互预览</span><span>{cases.find((item) => item.key === kind)?.label}</span></div>
        <div className="sh-conversation-demo__stage" data-has-detail={selectedRecord !== null || undefined}>
          <div className="sh-conversation-page">
            {dockedQuestion && <div className="sh-conversation-page__pinned">
              <ChatBubble role="user" pinned collapsed={!pinnedExpanded} collapsible onToggle={() => setPinnedExpanded((current) => !current)}>
                {dockedQuestion}
              </ChatBubble>
            </div>}
            <div ref={scrollRef} className="sh-conversation-page__scroll" onScroll={syncScroll}>
              <div className="sh-conversation-page__exchange">
                {previousTurns.map((turn, index) => <div className="sh-conversation-page__turn" key={`${kind}-previous-${index}`}>
                  <div className="sh-conversation-page__question" data-question-text={turn.question}>
                    <ChatBubble role="user">{turn.question}</ChatBubble>
                    <MessageActions type="question" timestamp={`2025-11-02 12:${20 + index}:30`} />
                  </div>
                  <div className="sh-conversation-page__answer">
                    <ThinkingProcess steps={THINKING_DEMO_STEPS.slice(0, 3).map((step) => ({ ...step, status: 'finish' as const }))} defaultOpen={false} statusText="120s" />
                    <div className="sh-conversation-page__response"><ChatBubble role="assistant">{turn.answer}</ChatBubble></div>
                    <MessageActions timestamp={`2025-11-02 12:${20 + index}:42`} />
                  </div>
                </div>)}
                <div className="sh-conversation-page__turn">
                <div className="sh-conversation-page__question" data-question-text={questions[kind]}>
                  <ChatBubble role="user">{questions[kind]}</ChatBubble>
                  <MessageActions type="question" timestamp="2025-11-02 12:30:30" />
                </div>
                <div className="sh-conversation-page__answer">
                  <ThinkingProcess key={kind} steps={kind === 'running' || kind === 'queue' ? [
                    ...THINKING_DEMO_STEPS.slice(0, 2).map((step) => ({ ...step, status: 'finish' as const })),
                    { ...THINKING_DEMO_STEPS[2], title: '正在知识检索', status: 'process' },
                  ] : THINKING_DEMO_STEPS.slice(0, kind === 'file' ? 10 : 3).map((step) => ({ ...step, status: 'finish' as const }))} defaultOpen statusText={kind === 'running' || kind === 'queue' ? '进行中' : '360s'} running={kind === 'running' || kind === 'queue'} />
                  {kind === 'knowledge' && <>
                    <div className="sh-conversation-page__response sh-citation-demo"><ChatBubble role="assistant">
                      根据操作导航知识库，为你提供如下答复：<br />
                      <span className="sh-citation-demo__sentence" data-highlighted={selectedCitation === 0 || undefined}>PSA 氢气提纯利用不同气体组分在吸附剂上的吸附能力差异，通过加压吸附、降压解吸，将氢气从混合气中分离出来。<CitationMarker record={citationRecords.knowledge[0]} selected={selectedCitation === 0} onClick={() => setSelectedCitation((current) => current === 0 ? null : 0)} index={0} /></span> <span className="sh-citation-demo__sentence" data-highlighted={selectedCitation === 1 || undefined}>吸附塔交替运行，以保证提纯过程连续进行；运行中需重点关注吸附压力、产品纯度和切换周期。<CitationMarker record={citationRecords.knowledge[1]} selected={selectedCitation === 1} onClick={() => setSelectedCitation((current) => current === 1 ? null : 1)} index={1} /></span>
                    </ChatBubble></div>
                    <SourceCitation kind="knowledge" records={citationRecords.knowledge} expanded={citationExpanded} onExpandedChange={setCitationExpanded} selectedIndex={selectedCitation} onSelect={(_, index) => setSelectedCitation((current) => current === index ? null : index)} />
                    <MessageActions timestamp="2025-11-02 12:30:30" />
                  </>}
                  {kind === 'plain' && <><div className="sh-conversation-page__response"><ChatBubble role="assistant">PDH 是“丙烷脱氢”（Propane Dehydrogenation）的缩写。在化工领域，它指将丙烷转化为丙烯的工艺；如果你指的是其他领域，请提供更多上下文。</ChatBubble></div><MessageActions timestamp="2025-11-02 12:30:30" /></>}
                  {kind === 'hitl' && <HITLDialogConfirmation kind="radio-input" stage={submitted ? 'after' : 'before'} onSubmit={() => setSubmitted(true)} />}
                  {kind === 'form' && <HITLFormConfirmation stage={submitted ? 'submitted' : 'complete'} onSubmit={() => setSubmitted(true)} />}
                  {kind === 'file' && <><div className="sh-conversation-page__response"><ChatBubble role="assistant">PX 与 PTA 价格分析报告已生成，您可以直接下载查看。报告涵盖近期价格走势、关键统计指标及趋势研判。</ChatBubble></div><div className="sh-conversation-page__files"><ChatFileCard name="PX与PTA近30日价格数据明细.xlsx" /><ChatFileCard name="PX与PTA价格分析报告.xlsx" /></div><MessageActions timestamp="2025-11-02 12:30:30" /></>}
                  {kind === 'queue' && <div className="sh-conversation-page__response"><ChatBubble role="assistant">正在检索资料并整理指标。你可以继续输入问题，后续消息会在输入框上方排队。</ChatBubble></div>}
                </div>
                </div>
              </div>
            </div>
            <div className="sh-conversation-page__composer">
              {awayFromBottom && <AppButton className="sh-conversation-page__to-bottom" shape="circle" aria-label="回到最新消息" title="回到最新消息" icon={<LocalIcon svg={downIcon} size={16} />} onClick={() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })} />}
              {queueActive && queueVisible && <MessageQueue
                items={queueItems}
                state={kind === 'hitl' || kind === 'form' ? 'hitl' : queuePaused ? 'paused' : 'active'}
                phase={kind === 'hitl' || kind === 'form' ? 'awaiting-confirmation' : 'processing'}
                expanded={queueExpanded}
                onExpandedChange={setQueueExpanded}
                onPauseQueue={() => setQueuePaused(true)}
                onResumeQueue={() => setQueuePaused(false)}
                onDiscussNewWork={() => { setQueueVisible(false); setQueueItems([]); setEditingId(null); setDiscussingNewWork(true); }}
                onInsert={(item) => setQueueItems((current) => current.filter((entry) => entry.id !== item.id))}
                onEdit={(item) => { setEditingId(item.id); setInput(String(item.content)); }}
                onRemove={(item) => setQueueItems((current) => current.filter((entry) => entry.id !== item.id))}
              />}
              <ChatSender key={editingId ?? 'new-message'} value={input} onChange={setInput} onSend={send} sending={running && !queueActive} onStop={() => setRunning(false)} sendDisabled={queueActive && queueItems.length >= 10 && !editingId} sendDisabledReason="等待队列最多 10 条，请先处理或删除一条消息" placeholder={editingId ? '修改问题后发送，将替换原队列消息' : undefined} />
              <span className="sh-conversation-page__disclaimer">内容由 AI 生成，请核查重要信息</span>
            </div>
          </div>
          {selectedRecord && selectedCitation !== null && <SourceCitationDetail record={selectedRecord} selectedIndex={selectedCitation} recordCount={citationRecords.knowledge.length} onSelect={setSelectedCitation} onClose={() => setSelectedCitation(null)} />}
        </div>
      </section>
      <aside className="sh-smart-feed-demo__controls" aria-label="对话页面控制">
        <div><Typography.Title level={4}>页面控制</Typography.Title><Typography.Paragraph type="secondary">切换设计稿中的对话类型；页面中的引用、确认卡片和输入框可直接交互。</Typography.Paragraph></div>
        <fieldset className="sh-smart-feed-demo__group"><legend>对话类型</legend><div className="sh-smart-feed-demo__buttons">{cases.map((item) => <AppButton key={item.key} size="small" type={kind === item.key ? 'primary' : 'default'} onClick={() => switchCase(item.key)}>{item.label}</AppButton>)}</div></fieldset>
        <AppButton size="small" onClick={() => switchCase('knowledge')}>重置预览</AppButton>
      </aside>
    </div>
  );
}
