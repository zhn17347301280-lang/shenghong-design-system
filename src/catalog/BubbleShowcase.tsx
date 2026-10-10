import { useCallback, useEffect, useRef, useState } from 'react';
import { Typography } from 'antd';
import { AppButton, ChatBubble, MessageActions, type ChatAttachment } from '../index';

const { Paragraph, Title } = Typography;

type ContentLength = 'single' | 'double' | 'long';

const questionText: Record<ContentLength, string> = {
  single: '请分析本月经营指标的变化。',
  double: '请分析本月经营指标的变化，结合销售额、库存周转与供应链履约情况，指出需要重点关注的风险，并说明这些风险对下个月交付计划和区域库存的影响。',
  long: '请结合经营数据、会议录音和风险说明，分析本月销售额、库存周转与供应链履约情况；对比上月变化，指出异常原因、潜在影响和需要优先处理的问题，并给出面向华东区域的具体改进建议。请同时列出每项建议的数据依据、责任团队、预计完成时间和验证方式，说明哪些事项需要进一步确认。',
};

const sourceQuestionVariants: Record<ContentLength, string>[] = [
  questionText,
  {
    single: '说明华东仓库存异常的原因。',
    double: '结合分析结果，请说明华东仓库存异常的原因，并列出需要核实的数据口径。',
    long: '结合经营指标、未交付订单、安全库存和在途物料，拆解华东仓库存异常的原因；逐项列出需要核实的数据口径、涉及区域与建议处理顺序。',
  },
  {
    single: '整理供应商改进建议。',
    double: '请将履约率偏低的供应商与改进建议整理成表格。',
    long: '请按履约率影响程度整理供应商名单，补充当前延迟情况、恢复时间、替代采购方案和后续责任人，并以表格输出。',
  },
  {
    single: '总结结论和下一步。',
    double: '总结本次分析结论，并给出下一步跟进事项和负责人。',
    long: '最后请汇总本次分析结论，按优先级列出下一步跟进事项、负责团队、完成时限及验收方式，并标明仍需确认的信息。',
  },
];

const sampleFiles: ChatAttachment[] = [
  { name: '经营数据.doc' },
  { name: '会议录音.wav' },
  { name: '风险说明.txt' },
];

const answerText = [
  '本月经营指标整体保持增长。销售额较上月提升 8.4%，主要来自华东区域重点客户的集中采购。',
  '库存周转天数增加 3.2 天。华东仓部分原料备货高于实际需求，建议先核查未交付订单与安全库存口径。',
  '供应链履约率维持在 96.8%，但两家重点供应商存在交付延迟。建议对高风险物料建立替代采购方案。',
  '接下来可按区域拆分库存与销售数据，优先处理周转超过 45 天的品类，并在下周复盘。',
].join('\n\n');

function ChoiceGroup<T extends string>({ label, options, value, onChange }: {
  label: string;
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset className="sh-bubble-demo__control-group">
      <legend className="sh-bubble-demo__control-label">{label}</legend>
      <div className="sh-bubble-demo__control-buttons">
        {options.map((option) => (
          <AppButton
            key={option.value}
            size="small"
            type={value === option.value ? 'primary' : 'default'}
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </AppButton>
        ))}
      </div>
    </fieldset>
  );
}

export function BubbleShowcase() {
  const [staticPinned, setStaticPinned] = useState(false);
  const [staticHasFiles, setStaticHasFiles] = useState(false);
  const [staticLength, setStaticLength] = useState<ContentLength>('long');
  const [staticExpanded, setStaticExpanded] = useState(false);
  const [dynamicExpanded, setDynamicExpanded] = useState(false);
  const [isDocked, setIsDocked] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const stickyFrameRef = useRef<HTMLDivElement>(null);
  const sourceQuestionsRef = useRef<Array<HTMLDivElement | null>>([]);
  const sourceTexts = sourceQuestionVariants.map((variants) => variants.long);
  const sourceAnswers = [
    answerText,
    '华东仓库存异常主要集中在原料备货高于实际需求的品类。建议先对齐未交付订单、安全库存和在途物料口径，再确认积压原因。',
    '建议优先联系两家存在延迟交付的重点供应商，确认恢复时间，并为高风险物料准备替代采购方案。',
    '本次分析已归纳为库存核查、供应商跟进和区域复盘三项工作，完成后可继续补充相关文件或调整分析范围。',
  ];
  const questionTimes = ['2026-09-18 10:34', '2026-09-18 10:38', '2026-09-18 10:42', '2026-09-18 10:46'];
  const answerTimes = ['2026-09-18 10:36', '2026-09-18 10:40', '2026-09-18 10:44', '2026-09-18 10:48'];

  const updatePinned = useCallback(() => {
    const viewport = viewportRef.current;
    const stickyFrame = stickyFrameRef.current;
    if (!viewport || !stickyFrame) return;

    const viewportRect = viewport.getBoundingClientRect();
    const frameRect = stickyFrame.getBoundingClientRect();
    const docked = frameRect.top <= viewportRect.top + 1;
    setIsDocked(docked);
    if (!docked) {
      setActiveQuestion(0);
      return;
    }

    let latestQuestion = 0;
    sourceQuestionsRef.current.forEach((question, index) => {
      if (question && question.getBoundingClientRect().bottom <= frameRect.bottom + 1) {
        latestQuestion = Math.min(index + 1, sourceQuestionVariants.length - 1);
      }
    });
    setActiveQuestion(latestQuestion);
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const observer = new ResizeObserver(updatePinned);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [updatePinned]);

  return (
    <div className="sh-bubble-demo">
      <section className="sh-bubble-demo__preview" aria-label="滚动交互预览">
        <div className="sh-bubble-demo__preview-header">
          <span>滚动交互预览</span>
          <span>{isDocked ? `已吸顶 · 当前问题 ${activeQuestion + 1}/4` : '向下滚动，查看气泡吸顶与问题切换'}</span>
        </div>
        <div className="sh-bubble-demo__viewport" ref={viewportRef} onScroll={updatePinned}>
          <div className="sh-bubble-demo__previous">
            <span>上一轮对话</span>
            <p>已完成初步数据整理，下面继续查看本月经营分析。</p>
          </div>
          <div className="sh-bubble-demo__conversation">
            <div
              ref={stickyFrameRef}
              className="sh-bubble-demo__sticky-frame"
              data-docked={isDocked || undefined}
            >
              <div className="sh-bubble-demo__sticky-content">
                <div className="sh-bubble-demo__sticky-bubble">
                  <ChatBubble
                    key={activeQuestion}
                    role="user"
                    pinned={isDocked}
                    collapsed={isDocked && !dynamicExpanded}
                    collapsible
                    onToggle={() => setDynamicExpanded((value) => !value)}
                  >
                    {sourceTexts[activeQuestion]}
                  </ChatBubble>
                  {!isDocked && <MessageActions type="question" timestamp={questionTimes[activeQuestion]} />}
                </div>
              </div>
            </div>
            <div className="sh-bubble-demo__source-answer">
              <ChatBubble role="assistant" actions={{ timestamp: answerTimes[0] }}>{sourceAnswers[0]}</ChatBubble>
            </div>
            {sourceTexts.slice(1).map((text, sourceIndex) => {
              const index = sourceIndex + 1;
              return (
                <section className="sh-bubble-demo__turn" key={index}>
                  <div
                    className="sh-bubble-demo__source-question"
                    data-mirrored={isDocked && activeQuestion >= index || undefined}
                    ref={(node) => { sourceQuestionsRef.current[sourceIndex] = node; }}
                  >
                    <ChatBubble role="user">{text}</ChatBubble>
                  </div>
                  <div className="sh-bubble-demo__source-actions" data-mirrored={isDocked && activeQuestion >= index || undefined}>
                    <MessageActions type="question" timestamp={questionTimes[index]} />
                  </div>
                  <div className="sh-bubble-demo__source-answer">
                    <ChatBubble role="assistant" actions={{ timestamp: answerTimes[index] }}>{sourceAnswers[index]}</ChatBubble>
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </section>

      <div className="sh-bubble-demo__static">
        <section className="sh-bubble-demo__static-preview" aria-label="静态状态样例">
          <div className="sh-bubble-demo__preview-header">
            <span>静态状态样例</span>
            <span>{staticPinned ? '吸顶样式' : '常规样式'}</span>
          </div>
          <div className="sh-bubble-demo__static-stage">
            <div className="sh-bubble-demo__static-bubble" data-pinned={staticPinned || undefined}>
              <ChatBubble
                role="user"
                pinned={staticPinned}
                collapsed={staticPinned && !staticExpanded}
                collapsible={staticPinned && staticLength === 'long'}
                attachments={staticHasFiles ? sampleFiles : undefined}
                onToggle={() => setStaticExpanded((value) => !value)}
              >
                {questionText[staticLength]}
              </ChatBubble>
              {!staticPinned && <MessageActions type="question" timestamp={questionTimes[0]} />}
            </div>
          </div>
        </section>

        <aside className="sh-bubble-demo__controls" aria-label="静态气泡状态切换">
          <div>
            <Title level={4}>状态切换</Title>
            <Paragraph type="secondary">选择状态，查看左侧静态气泡样式。</Paragraph>
          </div>
          <ChoiceGroup
            label="外观状态"
            options={[{ value: 'normal', label: '常规样式' }, { value: 'pinned', label: '吸顶样式' }]}
            value={staticPinned ? 'pinned' : 'normal'}
            onChange={(value) => setStaticPinned(value === 'pinned')}
          />
          <ChoiceGroup
            label="文件"
            options={[{ value: 'none', label: '无文件' }, { value: 'files', label: '有文件' }]}
            value={staticHasFiles ? 'files' : 'none'}
            onChange={(value) => setStaticHasFiles(value === 'files')}
          />
          <ChoiceGroup
            label="内容长度"
            options={[{ value: 'single', label: '单行' }, { value: 'double', label: '双行' }, { value: 'long', label: '超长' }]}
            value={staticLength}
            onChange={setStaticLength}
          />
          {staticPinned && staticLength === 'long' && (
            <ChoiceGroup
              label="超长内容"
              options={[{ value: 'collapsed', label: '收起' }, { value: 'expanded', label: '展开' }]}
              value={staticExpanded ? 'expanded' : 'collapsed'}
              onChange={(value) => setStaticExpanded(value === 'expanded')}
            />
          )}
        </aside>
      </div>
    </div>
  );
}
