import {
  cloneElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from 'react';
import { Sender } from '@ant-design/x';
import type { SlotConfigType } from '@ant-design/x/es/sender';
import { Dropdown, Tooltip } from 'antd';
import type { MenuProps } from 'antd';
import { LocalIcon } from '../Icon/LocalIcon';
import { InputFileCard } from '../File/InputFileCard';
import type { ChatAttachment } from './ChatBubble';
import attachIconSvg from '../../icons/svg/通用-文件、附件.svg?raw';
import sendIconSvg from '../../icons/svg/通用-发送、箭头.svg?raw';
import downIconSvg from '../../icons/svg/通用-下.svg?raw';
import addIconSvg from '../../icons/svg/通用-添加.svg?raw';
import leftIconSvg from '../../icons/svg/通用-左.svg?raw';
import rightIconSvg from '../../icons/svg/通用-右.svg?raw';
import closeIconSvg from '../../icons/svg/通用-取消、关闭.svg?raw';
import confirmIconSvg from '../../icons/svg/通用-确认.svg?raw';
import { iconSkill as skillIconSvg } from '../Layout/LingxiaoSideNav';
import voiceIconSvg from '../../icons/svg/凌霄-对话框-语音输入.svg?raw';
import hitlGestureSvg from '../../icons/svg/凌霄-HITL选项-默认确认模式.svg?raw';
import hitlSkipSvg from '../../icons/svg/凌霄-HITL选项-跳过确认.svg?raw';
import hitlApproveSvg from '../../icons/svg/凌霄-HITL选项-替我审批.svg?raw';

/** HITL 人机交互确认模式。 */
export type HitlMode = 'gesture' | 'skip' | 'approve';

export type ChatSenderMentionCategory = 'dataSource' | 'documentTemplate' | 'smartFeed';
export type ChatSenderMentionScope = 'personal' | 'team';

export interface ChatSenderMentionItem {
  key: string;
  label: string;
  category: ChatSenderMentionCategory;
  /** 内容归属；dataSource / documentTemplate 分类使用。 */
  scope?: ChatSenderMentionScope;
}

export interface ChatSenderSkill {
  key: string;
  name: string;
  description: string;
  source?: string;
  /** 选中后在输入框中显示的名称。 */
  selectedLabel?: string;
}

const getEditableCaretOffset = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return null;
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || !target.contains(selection.anchorNode)) return null;
  const range = selection.getRangeAt(0).cloneRange();
  range.selectNodeContents(target);
  range.setEnd(selection.anchorNode as Node, selection.anchorOffset);
  return range.toString().length;
};

export interface ChatSenderAttachment extends ChatAttachment {
  /** 文件大小描述，如 119KB。 */
  size?: ReactNode;
  /** 图片缩略图地址；提供时按图片卡片（72×72）渲染。 */
  src?: string;
  /** 图片替代文本。 */
  alt?: string;
  /** 图片上传状态：normal / uploading。 */
  imageStatus?: 'normal' | 'uploading';
  /** 图片上传进度 0-100，uploading 时展示。 */
  percent?: number;
}

export interface ChatSenderProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  /** 是否正在生成回复：为 true 时右侧按钮切换为停止按钮。 */
  sending?: boolean;
  autoSize?: boolean | { minRows?: number; maxRows?: number };
  attachments?: ChatSenderAttachment[];
  /** 工具栏左侧在附件按钮之前追加的自定义节点。 */
  leadingTools?: ReactNode;
  /** HITL 当前选中模式，默认手势切换确认。 */
  hitlMode?: HitlMode;
  onHitlModeChange?: (mode: HitlMode) => void;
  onSend?: (value: string) => void;
  /** 仅禁用发送，仍允许编辑输入内容；例如消息队列已满。 */
  sendDisabled?: boolean;
  sendDisabledReason?: string;
  onStop?: () => void;
  onChange?: (value: string) => void;
  /** 点击附件按钮 / 末尾虚线添加卡片，一般用于打开文件选择器。 */
  onAttach?: () => void;
  /** 点击语音输入按钮。 */
  onVoice?: () => void;
  /** 语音模式模拟识别的最终文本。 */
  voicePreviewText?: string;
  onVoiceCancel?: () => void;
  onVoiceConfirm?: (text: string) => void;
  /** 输入 @ 时显示的可选上下文。 */
  mentionItems?: ChatSenderMentionItem[];
  /** 输入 / 时显示的 Skill 列表。 */
  skills?: ChatSenderSkill[];
  onMentionSelect?: (item: ChatSenderMentionItem) => void;
  onSkillSelect?: (skill: ChatSenderSkill) => void;
  onRemoveAttachment?: (index: number) => void;
  onKeyDown?: (event: ReactKeyboardEvent<Element>) => void | false;
  className?: string;
}

interface HitlOption {
  key: HitlMode;
  /** 触发器上展示的短文案。 */
  triggerLabel: string;
  /** 下拉菜单主标题。 */
  title: string;
  /** 下拉菜单副标题说明。 */
  description: string;
  icon: string;
  danger?: boolean;
}

const HITL_OPTIONS: HitlOption[] = [
  {
    key: 'gesture',
    triggerLabel: '默认',
    title: '默认',
    description: '由凌霄自主判断并按需触发用户确认',
    icon: hitlGestureSvg,
  },
  {
    key: 'skip',
    triggerLabel: '跳过确认',
    title: '跳过确认',
    description: '低风险、非必要事项，默认跳过用户确认',
    icon: hitlSkipSvg,
  },
  {
    key: 'approve',
    triggerLabel: '替我审批',
    title: '替我审批',
    description: '所有操作行为均无需用户确认',
    icon: hitlApproveSvg,
    danger: true,
  },
];

const MENTION_TABS: Array<{ key: ChatSenderMentionCategory; label: string }> = [
  { key: 'dataSource', label: '数据源（3）' },
  { key: 'documentTemplate', label: '文书模板（3）' },
  { key: 'smartFeed', label: 'SmartFeed（3）' },
];

const DEFAULT_MENTION_ITEMS: ChatSenderMentionItem[] = [
  { key: 'personal-source', label: '@XXX 数据源', category: 'dataSource', scope: 'personal' },
  { key: 'source-item', label: '@Select menu item', category: 'dataSource', scope: 'personal' },
  { key: 'team-source', label: '@团队数据源', category: 'dataSource', scope: 'team' },
  { key: 'daily-template', label: '@化工行情日报模板', category: 'documentTemplate', scope: 'personal' },
  { key: 'template-2', label: '@经营分析模板', category: 'documentTemplate', scope: 'personal' },
  { key: 'template-3', label: '@合同审查模板', category: 'documentTemplate', scope: 'team' },
  { key: 'scheduled-feed', label: '@XXXX定时任务', category: 'smartFeed' },
  { key: 'feed-2', label: '@经营日报', category: 'smartFeed' },
  { key: 'feed-3', label: '@风险跟踪', category: 'smartFeed' },
];

const DEFAULT_SKILLS: ChatSenderSkill[] = [
  { key: 'contract-review', name: 'contract-review', description: '合同审查 Skill。当用户上传合同文件并请求审查时触发，包括但不限于：采购合同、销售合同...', source: '平台' },
  { key: 'marketing', name: 'marketing', description: '营销拜访数字化助手，在以下情况使用本技能：(1) 用户提供客户拜访/会议录音或视频（或给出 audio...', source: '平台' },
  { key: 'document-generation', name: 'document-generation', selectedLabel: '文书助手', description: '文书生成 Skill。用于需要起草、整合或按模板生成完整文书的请求，覆盖四种核心撰写任务...', source: '平台' },
  { key: 'marketing-report-h5-wecom', name: 'marketing-report-h5-wecom', description: '基于已落库的石化一体化营销日报，按整体或分产品的指定 HTML 模板生成并发布...', source: '平台' },
  { key: 'excel-xlsx', name: 'excel-xlsx', description: 'Create, inspect, and edit Microsoft Excel workbooks and XLSX files with reliable formulas, dates, ...', source: '平台' },
  { key: 'methanol-market-brief-h5', name: 'methanol-market-brief-h5', description: '基于甲醇行情 MCP 的已发布早盘晨报或收盘晚报生成并发布 H5，适用于“甲醇市场...', source: '平台' },
  { key: 'execute-scheduled-tasks', name: 'execute-scheduled-tasks', description: '当提到执行定时任务时，使用该 Skill 来约束 HITL、成果生成与发送通知等行为。', source: '平台' },
  { key: 'rotating-equipment-vibration-13', name: 'rotating-equipment-vibration-13', description: '可对离心泵、螺杆泵、螺杆压缩机、离心风机、罗茨风机、螺杆鼓风机等旋转...', source: '平台' },
  { key: 'manage-scheduled-tasks', name: 'manage-scheduled-tasks', description: '当用户要求创建、修改、查询、删除定时任务时使用。', source: '平台' },
  { key: 'rotating-equipment-vibration-analysis', name: 'rotating-equipment-vibration-an...', description: '可对离心泵、螺杆泵、螺杆压缩机、离心风机、罗茨风机、螺杆鼓风机等旋转...', source: '平台' },
  { key: 'rotating-equipment-vibration-anomaly', name: 'rotating-equipment-vibration-an...', description: '可对离心泵、螺杆泵、螺杆压缩机、离心风机、罗茨风机、螺杆鼓风机等旋转...', source: '平台' },
];

/** 32×32 圆角方形图标按钮（附件 / 语音）。 */
function ToolButton({
  svg,
  label,
  tooltip,
  tooltipClassName,
  onClick,
  disabled,
  tone,
  children,
  extraClassName = '',
}: {
  svg?: string;
  label: string;
  tooltip?: ReactNode;
  tooltipClassName?: string;
  onClick?: () => void;
  disabled?: boolean;
  tone?: 'voice';
  children?: ReactNode;
  extraClassName?: string;
}) {
  return (
    <Tooltip title={tooltip ?? label} classNames={tooltipClassName ? { root: tooltipClassName } : undefined}>
      <button
        type="button"
        aria-label={label}
        disabled={disabled}
        className={`sh-chat-sender__tool ${tone === 'voice' ? 'is-voice' : ''} ${extraClassName}`.trim()}
        onClick={(event) => {
          event.stopPropagation();
          onClick?.();
        }}
      >
        {svg ? <LocalIcon svg={svg} size={16} /> : children}
      </button>
    </Tooltip>
  );
}

/** 附件区：横向滚动文件卡片 + 末尾虚线「添加」卡片。 */
function AttachmentBar({
  attachments,
  onRemove,
  onAdd,
}: {
  attachments: ChatSenderAttachment[];
  onRemove?: (index: number) => void;
  onAdd?: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState({ left: false, right: false });

  const updateOverflow = useCallback(() => {
    const node = scrollRef.current;
    if (!node) return;
    const left = node.scrollLeft > 1;
    const right = node.scrollLeft + node.clientWidth < node.scrollWidth - 1;
    setOverflow((current) => (
      current.left === left && current.right === right ? current : { left, right }
    ));
  }, []);

  const scroll = (direction: -1 | 1) => {
    const node = scrollRef.current;
    if (!node) return;
    node.scrollBy({ left: direction * Math.max(160, node.clientWidth - 48), behavior: 'smooth' });
  };

  useEffect(() => {
    updateOverflow();
    const node = scrollRef.current;
    if (!node || typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(updateOverflow);
    observer.observe(node);
    return () => observer.disconnect();
  }, [attachments.length, updateOverflow]);

  return (
    <div
      className={`sh-chat-sender__attachments-viewport${overflow.left ? ' has-left-overflow' : ''}${overflow.right ? ' has-right-overflow' : ''}`}
    >
      <div ref={scrollRef} className="sh-chat-sender__attachments-scroll" onScroll={updateOverflow}>
        {attachments.map((item, index) => (
          item.src ? (
            <InputFileCard
              key={index}
              kind="image"
              src={item.src}
              alt={item.alt ?? String(item.name ?? '')}
              status={item.imageStatus}
              percent={item.percent}
              onClose={() => onRemove?.(index)}
            />
          ) : (
            <InputFileCard
              key={index}
              name={String(item.name ?? '')}
              size={item.meta ?? item.size}
              icon={item.icon}
              onClose={() => onRemove?.(index)}
            />
          )
        ))}
        <button
          type="button"
          className="sh-chat-sender__attach-add"
          aria-label="添加附件"
          onClick={(event) => {
            event.stopPropagation();
            onAdd?.();
          }}
        >
          <LocalIcon svg={addIconSvg} size={21} />
        </button>
      </div>
      {overflow.left ? (
        <button type="button" className="sh-chat-sender__attachments-nav is-left" aria-label="向左查看更多附件" onClick={() => scroll(-1)}>
          <LocalIcon svg={leftIconSvg} size={16} />
        </button>
      ) : null}
      {overflow.right ? (
        <button type="button" className="sh-chat-sender__attachments-nav is-right" aria-label="向右查看更多附件" onClick={() => scroll(1)}>
          <LocalIcon svg={rightIconSvg} size={16} />
        </button>
      ) : null}
    </div>
  );
}

const VOICE_MOCK_MIN_HEIGHT = 4;
const VOICE_MOCK_MAX_HEIGHT = 18;

interface VoiceMockEnvelope {
  step: number;
  length: number;
  peak: number;
  peakAt: number;
  drift: number;
  pauseRemaining: number;
}

const createVoiceMockEnvelope = (): VoiceMockEnvelope => ({
  step: 0,
  length: 22 + Math.floor(Math.random() * 13),
  peak: 13 + Math.random() * 5,
  peakAt: 0.42 + Math.random() * 0.16,
  drift: 0,
  pauseRemaining: 0,
});

const resetVoiceMockEnvelope = (envelope: VoiceMockEnvelope) => {
  envelope.step = 0;
  envelope.length = 22 + Math.floor(Math.random() * 13);
  envelope.peak = 13 + Math.random() * 5;
  envelope.peakAt = 0.42 + Math.random() * 0.16;
  envelope.drift = 0;
};

const smoothStep = (value: number) => value * value * (3 - 2 * value);

const createVoiceMockAmplitude = (envelope: VoiceMockEnvelope) => {
  if (envelope.pauseRemaining > 0) {
    envelope.pauseRemaining -= 1;
    return 0;
  }

  const progress = envelope.step / Math.max(1, envelope.length - 1);
  const envelopeProgress = progress <= envelope.peakAt
    ? progress / envelope.peakAt
    : (1 - progress) / (1 - envelope.peakAt);
  const shape = smoothStep(Math.max(0, Math.min(1, envelopeProgress)));

  // Adjacent samples share most of the same drift, like a smoothed RMS envelope.
  envelope.drift = envelope.drift * 0.58 + (Math.random() - 0.5) * 4.2;
  const roughness = envelope.drift * (0.35 + shape * 0.9);
  const rawHeight = VOICE_MOCK_MIN_HEIGHT + (envelope.peak - VOICE_MOCK_MIN_HEIGHT) * shape + roughness;
  const height = Math.round(Math.max(VOICE_MOCK_MIN_HEIGHT, Math.min(VOICE_MOCK_MAX_HEIGHT, rawHeight)) * 2) / 2;

  envelope.step += 1;
  if (envelope.step >= envelope.length) {
    envelope.pauseRemaining = Math.random() < 0.38 ? 2 + Math.floor(Math.random() * 4) : 0;
    resetVoiceMockEnvelope(envelope);
  }

  return height;
};

interface VoiceMockSample {
  id: number;
  height: number;
}

const createVoiceMockSamples = (count: number, envelope: VoiceMockEnvelope) => {
  const recordedCount = Math.min(26, count);
  return [
    ...Array.from({ length: count - recordedCount }, (_, id) => ({ id, height: 0 })),
    ...Array.from({ length: recordedCount }, (_, index) => ({
      id: count - recordedCount + index,
      height: createVoiceMockAmplitude(envelope),
    })),
  ];
};

function VoiceWaveform() {
  const containerRef = useRef<HTMLDivElement>(null);
  const nextSampleIdRef = useRef(96);
  const envelopeRef = useRef(createVoiceMockEnvelope());
  const [samples, setSamples] = useState<VoiceMockSample[]>(() => createVoiceMockSamples(96, envelopeRef.current));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const resize = () => {
      const count = Math.max(1, Math.ceil((container.clientWidth + 3) / 6));
      setSamples((current) => {
        if (current.length === count) return current;
        if (current.length > count) return current.slice(current.length - count);
        const missingCount = count - current.length;
        const placeholders = Array.from({ length: missingCount }, () => ({
          id: nextSampleIdRef.current++,
          height: 0,
        }));
        return [...placeholders, ...current];
      });
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const timer = window.setInterval(() => {
      const sample = {
        id: nextSampleIdRef.current++,
        height: createVoiceMockAmplitude(envelopeRef.current),
      };
      setSamples((current) => current.length > 0 ? [...current.slice(1), sample] : current);
    }, 88);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div ref={containerRef} className="sh-chat-sender__voice-wave" aria-hidden="true">
      <div className="sh-chat-sender__voice-cells">
        {samples.map((sample) => (
          <span
            key={sample.id}
            className={sample.height > 0 ? 'is-active' : ''}
            data-sample-id={sample.id}
            style={{ height: sample.height || 3 }}
          />
        ))}
      </div>
    </div>
  );
}

const attachmentTooltip = (
  <span className="sh-chat-sender__attachment-tooltip-copy">
    支持文档、表格、音频、视频等常见文件。<br />
    最多上传 2 个文件；音视频单文件最大 500MB，其他文件最大 20MB。<br />
    更多格式或大文件请前往「<span className="sh-chat-sender__attachment-tooltip-link">我的知识库</span>」上传。
  </span>
);

export function ChatSender({
  value,
  defaultValue,
  placeholder = '请输入你的问题，我将进行跟进；输入“@”可插入模板或数据源',
  disabled,
  sending = false,
  autoSize = { minRows: 1, maxRows: 6 },
  attachments = [],
  leadingTools,
  hitlMode,
  onHitlModeChange,
  onSend,
  sendDisabled = false,
  sendDisabledReason,
  onStop,
  onChange,
  onAttach,
  onVoice,
  voicePreviewText = '请帮我分析本月经营指标，并给出需要关注的风险建议。',
  onVoiceCancel,
  onVoiceConfirm,
  mentionItems = DEFAULT_MENTION_ITEMS,
  skills = DEFAULT_SKILLS,
  onMentionSelect,
  onSkillSelect,
  onRemoveAttachment,
  onKeyDown,
  className = '',
}: ChatSenderProps) {
  const [innerHitl, setInnerHitl] = useState<HitlMode>('gesture');
  const [hitlOpen, setHitlOpen] = useState(false);
  const [innerValue, setInnerValue] = useState(value ?? defaultValue ?? '');
  const [voiceMode, setVoiceMode] = useState(false);
  const [voiceCharacterCount, setVoiceCharacterCount] = useState(0);
  const [mentionCategory, setMentionCategory] = useState<ChatSenderMentionCategory>('dataSource');
  const [mentionScope, setMentionScope] = useState<ChatSenderMentionScope>('personal');
  const [activeOption, setActiveOption] = useState(0);
  const [commandDismissed, setCommandDismissed] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ left: 12, top: 0 });
  const senderWrapRef = useRef<HTMLDivElement>(null);
  const senderRef = useRef<ComponentRef<typeof Sender>>(null);
  const initialSlotConfigRef = useRef<SlotConfigType[]>([
    { type: 'text', value: value ?? defaultValue ?? '' },
  ]);
  const nextInlineTagIdRef = useRef(0);
  const cursorPositionRef = useRef((value ?? defaultValue ?? '').length);
  const latestValue = value ?? innerValue;
  const cursorPosition = Math.min(cursorPositionRef.current, latestValue.length);
  const valueBeforeCursor = latestValue.slice(0, cursorPosition);
  const commandMatch = commandDismissed ? null : valueBeforeCursor.match(/([@/])([^\s@/]*)$/);
  const command = commandMatch?.[1] === '@' ? 'mention' : commandMatch?.[1] === '/' ? 'skill' : undefined;
  const commandQuery = commandMatch?.[2]?.toLocaleLowerCase() ?? '';
  const commandTriggerIndex = commandMatch ? cursorPosition - commandQuery.length - 1 : -1;
  const visibleMentionItems = mentionItems.filter((item) => (
    item.category === mentionCategory
    && (mentionCategory === 'smartFeed' || (item.scope ?? 'personal') === mentionScope)
    && item.label.toLocaleLowerCase().includes(commandQuery)
  ));
  const visibleSkills = skills.filter((skill) => (
    skill.name.toLocaleLowerCase().includes(commandQuery)
    || skill.description.toLocaleLowerCase().includes(commandQuery)
  ));
  const visibleOptions: Array<ChatSenderMentionItem | ChatSenderSkill> = command === 'mention' ? visibleMentionItems : visibleSkills;
  const canSend = latestValue.trim().length > 0;
  const mergedHitl = hitlMode ?? innerHitl;
  const currentHitl = HITL_OPTIONS.find((item) => item.key === mergedHitl) ?? HITL_OPTIONS[0];

  const updatePopupPosition = useCallback(() => {
    const wrap = senderWrapRef.current;
    const editor = wrap?.querySelector('[contenteditable="true"]');
    const selection = window.getSelection();
    if (!wrap || !editor || !selection || selection.rangeCount === 0 || !editor.contains(selection.anchorNode)) return;
    const range = selection.getRangeAt(0).cloneRange();
    range.collapse(true);
    const caretRect = range.getBoundingClientRect();
    const editorRect = editor.getBoundingClientRect();
    const wrapRect = wrap.getBoundingClientRect();
    const anchorRect = caretRect.height > 0 ? caretRect : editorRect;
    const maxLeft = Math.max(12, wrapRect.width - 358);
    setPopupPosition({
      left: Math.max(12, Math.min(maxLeft, anchorRect.left - wrapRect.left)),
      top: Math.max(8, anchorRect.bottom - wrapRect.top + 8),
    });
  }, []);

  useEffect(() => {
    if (!command) return undefined;
    const frame = window.requestAnimationFrame(updatePopupPosition);
    return () => window.cancelAnimationFrame(frame);
  }, [command, commandQuery, cursorPosition, updatePopupPosition]);

  useEffect(() => {
    if (!command) return undefined;
    const handleOutsidePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      const wrap = senderWrapRef.current;
      if (!wrap || !target || !wrap.contains(target)) {
        setCommandDismissed(true);
        return;
      }
      const isPopup = target instanceof Element && Boolean(target.closest('.sh-chat-sender__mention-popup, .sh-chat-sender__skill-popup'));
      if (!isPopup) setCommandDismissed(true);
    };
    document.addEventListener('pointerdown', handleOutsidePointerDown, true);
    return () => document.removeEventListener('pointerdown', handleOutsidePointerDown, true);
  }, [command]);

  const handleChange = (next: string, eventTarget?: EventTarget | null) => {
    const caretOffset = getEditableCaretOffset(eventTarget ?? null);
    if (caretOffset !== null) cursorPositionRef.current = caretOffset;
    if (value === undefined) setInnerValue(next);
    setCommandDismissed(false);
    setActiveOption(0);
    onChange?.(next);
  };

  useEffect(() => {
    if (!voiceMode) {
      setVoiceCharacterCount(0);
      return undefined;
    }
    const timer = window.setInterval(() => {
      setVoiceCharacterCount((current) => Math.min(voicePreviewText.length, current + 1));
    }, 105);
    return () => window.clearInterval(timer);
  }, [voiceMode, voicePreviewText]);

  const insertCommandResult = (token: string) => {
    if (!command || commandTriggerIndex < 0) return;
    const replaceCharacters = latestValue.slice(commandTriggerIndex, cursorPosition);
    const key = `inline-context-${nextInlineTagIdRef.current++}`;
    const isSkill = command === 'skill';
    const displayLabel = isSkill ? token.replace(/^\//, '') : token;
    senderRef.current?.insert([
      {
        type: 'tag',
        key,
        props: {
          label: (
            <span className={isSkill ? 'sh-chat-sender__inline-skill' : 'sh-chat-sender__inline-mention'}>
              {isSkill ? <LocalIcon svg={skillIconSvg} size={14} /> : null}
              <span>{displayLabel}</span>
            </span>
          ),
          value: token,
        },
      },
      { type: 'text', value: ' ' },
    ], 'cursor', replaceCharacters);
    window.setTimeout(() => setCommandDismissed(true), 0);
  };

  const selectMention = (item: ChatSenderMentionItem) => {
    insertCommandResult(item.label.startsWith('@') ? item.label : `@${item.label}`);
    onMentionSelect?.(item);
  };

  const selectSkill = (skill: ChatSenderSkill) => {
    insertCommandResult(`/${skill.selectedLabel ?? skill.name}`);
    onSkillSelect?.(skill);
  };

  const handleSenderKeyDown = (event: ReactKeyboardEvent<Element>) => {
    if (onKeyDown?.(event) === false) return;
    if (!command || visibleOptions.length === 0) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      setActiveOption((current) => (current + direction + visibleOptions.length) % visibleOptions.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const selected = visibleOptions[activeOption];
      if (command === 'mention') selectMention(selected as ChatSenderMentionItem);
      else selectSkill(selected as ChatSenderSkill);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setCommandDismissed(true);
    }
  };

  const handleHitlClick: MenuProps['onClick'] = ({ key, domEvent }) => {
    domEvent.stopPropagation();
    const next = key as HitlMode;
    setInnerHitl(next);
    onHitlModeChange?.(next);
  };

  const hitlMenu: MenuProps = {
    items: [
      {
        key: '__hitl_group__',
        type: 'group',
        label: '设置如何处理用户确认',
        children: HITL_OPTIONS.map((option) => ({
          key: option.key,
          icon: (
            <LocalIcon
              svg={option.icon}
              size={20}
              className={option.danger ? 'sh-chat-sender__hitl-danger-icon' : undefined}
            />
          ),
          label: (
            <span className={`sh-chat-sender__hitl-option${option.danger ? ' is-danger' : ''}`}>
              <span className="sh-chat-sender__hitl-option-title">{option.title}</span>
              <span className="sh-chat-sender__hitl-option-desc">{option.description}</span>
            </span>
          ),
        })),
      },
    ],
    selectable: true,
    selectedKeys: [mergedHitl],
    onClick: handleHitlClick,
  };

  const toolbar = (
    <div className="sh-chat-sender__toolbar" onMouseDown={(event) => event.stopPropagation()}>
      <div className="sh-chat-sender__tools">
        {leadingTools}
        <ToolButton
          svg={attachIconSvg}
          label="上传附件"
          tooltip={attachmentTooltip}
          tooltipClassName="sh-chat-sender__attachment-tooltip"
          onClick={() => onAttach?.()}
          disabled={disabled}
        />
        <Dropdown
          menu={hitlMenu}
          trigger={['click']}
          placement="topLeft"
          disabled={disabled}
          open={disabled ? false : undefined}
          onOpenChange={setHitlOpen}
          classNames={{ root: 'sh-chat-sender__hitl-menu' }}
        >
          <button
            type="button"
            aria-label="人机交互确认模式"
            disabled={disabled}
            className={`sh-chat-sender__hitl${hitlOpen && !disabled ? ' is-open' : ''}`}
            onClick={(event) => event.stopPropagation()}
          >
            <LocalIcon svg={currentHitl.icon} size={14} className="sh-chat-sender__hitl-icon" />
            <span className="sh-chat-sender__hitl-label">{currentHitl.triggerLabel}</span>
            <LocalIcon svg={downIconSvg} size={16} className="sh-chat-sender__hitl-caret" />
          </button>
        </Dropdown>
      </div>
      <div className="sh-chat-sender__actions">
        <ToolButton svg={voiceIconSvg} label="语音输入" onClick={() => { setVoiceMode(true); onVoice?.(); }} disabled={disabled} tone="voice" />
        {sending ? (
          <Tooltip title="停止生成">
            <button
              type="button"
              className="sh-chat-sender__send is-stop"
              aria-label="停止生成"
              onClick={(event) => {
                event.stopPropagation();
                onStop?.();
              }}
            >
              <span className="sh-chat-sender__stop-dot" />
            </button>
          </Tooltip>
        ) : (
          <Tooltip title={sendDisabled ? (sendDisabledReason ?? '暂时无法发送') : '发送'}>
            <span className="sh-chat-sender__send-hitbox">
              <button
                type="button"
                className="sh-chat-sender__send"
                aria-label="发送"
                disabled={disabled || sendDisabled || !canSend}
                onClick={(event) => {
                  event.stopPropagation();
                  const text = latestValue.trim();
                  if (text && !sendDisabled) onSend?.(text);
                }}
              >
                <LocalIcon svg={sendIconSvg} size={16} />
              </button>
            </span>
          </Tooltip>
        )}
      </div>
    </div>
  );

  const header = attachments.length > 0 ? (
    <Sender.Header open forceRender closable={false} className="sh-chat-sender__attachments">
      <AttachmentBar attachments={attachments} onRemove={onRemoveAttachment} onAdd={onAttach} />
    </Sender.Header>
  ) : null;

  const popup = command === 'mention' ? (
    <div className="sh-chat-sender__mention-popup" role="listbox" aria-label="@ 上下文选择">
      <div className="sh-chat-sender__mention-tabs" role="tablist">
        {MENTION_TABS.map((tab) => (
          <button key={tab.key} type="button" role="tab" aria-selected={mentionCategory === tab.key} className={mentionCategory === tab.key ? 'is-active' : ''} onMouseDown={(event) => event.preventDefault()} onClick={() => { setMentionCategory(tab.key); setActiveOption(0); }}>
            {tab.label}
          </button>
        ))}
      </div>
      {mentionCategory !== 'smartFeed' ? (
        <div className="sh-chat-sender__mention-scope" role="group" aria-label={mentionCategory === 'dataSource' ? '数据源范围' : '模板范围'}>
          <button type="button" className={mentionScope === 'personal' ? 'is-active' : ''} aria-pressed={mentionScope === 'personal'} onMouseDown={(event) => event.preventDefault()} onClick={() => { setMentionScope('personal'); setActiveOption(0); }}>{mentionCategory === 'dataSource' ? '个人数据源' : '个人模板'}</button>
          <button type="button" className={mentionScope === 'team' ? 'is-active' : ''} aria-pressed={mentionScope === 'team'} onMouseDown={(event) => event.preventDefault()} onClick={() => { setMentionScope('team'); setActiveOption(0); }}>{mentionCategory === 'dataSource' ? '团队数据源' : '团队模板'}</button>
        </div>
      ) : null}
      <div className="sh-chat-sender__mention-options">
        {visibleMentionItems.map((item, index) => (
          <button key={item.key} type="button" role="option" aria-selected={activeOption === index} className={activeOption === index ? 'is-active' : ''} onMouseEnter={() => setActiveOption(index)} onMouseDown={(event) => event.preventDefault()} onClick={() => selectMention(item)}>
            {item.label.replace(/^@/, '')}
          </button>
        ))}
      </div>
    </div>
  ) : command === 'skill' ? (
    <div className="sh-chat-sender__skill-popup" role="listbox" aria-label="Skill 选择">
      {visibleSkills.map((skill, index) => (
        <button key={skill.key} type="button" role="option" aria-selected={activeOption === index} className={activeOption === index ? 'is-active' : ''} onMouseEnter={() => setActiveOption(index)} onMouseDown={(event) => event.preventDefault()} onClick={() => selectSkill(skill)}>
          <span className="sh-chat-sender__skill-name">{skill.name}</span>
          <span className="sh-chat-sender__skill-desc">{skill.description}</span>
          <span className="sh-chat-sender__skill-source">{skill.source ?? '平台'}</span>
        </button>
      ))}
    </div>
  ) : null;

  if (voiceMode) {
    return (
      <div className="sh-chat-sender-wrap">
        <div className={`sh-chat-sender sh-chat-sender--voice ${className}`.trim()}>
          <div className="sh-chat-sender__voice-preview">
            <span className="sh-chat-sender__voice-preview-label">语音预览</span>
            <span aria-live="polite">{voiceCharacterCount === 0 ? '正在聆听…' : voicePreviewText.slice(0, voiceCharacterCount)}</span>
            <span className="sh-chat-sender__voice-caret" aria-hidden="true" />
          </div>
          <div className="sh-chat-sender__voice-toolbar">
            <ToolButton svg={attachIconSvg} label="上传附件" onClick={onAttach} disabled={disabled} />
            <VoiceWaveform />
            <div className="sh-chat-sender__voice-actions">
              <ToolButton svg={closeIconSvg} label="取消语音输入" onClick={() => { setVoiceMode(false); onVoiceCancel?.(); }} disabled={disabled} />
              <button type="button" className="sh-chat-sender__voice-confirm" aria-label="确认语音输入" disabled={disabled} onClick={() => { handleChange(voicePreviewText); setVoiceMode(false); onVoiceConfirm?.(voicePreviewText); }}>
                <LocalIcon svg={confirmIconSvg} size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={senderWrapRef} className="sh-chat-sender-wrap">
      {popup ? cloneElement(popup, { style: { left: popupPosition.left, top: popupPosition.top, bottom: 'auto' } }) : null}
      <Sender
        ref={senderRef}
        slotConfig={initialSlotConfigRef.current}
        placeholder={placeholder}
        disabled={disabled}
        submitType="enter"
        autoSize={autoSize}
        header={header}
        footer={toolbar}
        suffix={false}
        onKeyDown={handleSenderKeyDown}
        onKeyUp={(event) => {
          const caretOffset = getEditableCaretOffset(event.currentTarget);
          if (caretOffset !== null) cursorPositionRef.current = caretOffset;
        }}
        onChange={(next, event) => handleChange(next, event?.target)}
        onSubmit={() => { const message = latestValue.trim(); if (message && !sendDisabled) onSend?.(message); }}
        onCancel={onStop}
        rootClassName={`sh-chat-sender ${className}`.trim()}
        classNames={{ input: 'sh-chat-sender__input' }}
      />
    </div>
  );
}
