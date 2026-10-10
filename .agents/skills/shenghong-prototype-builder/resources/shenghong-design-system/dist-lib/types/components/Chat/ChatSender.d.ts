import { type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from 'react';
import type { ChatAttachment } from './ChatBubble';
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
    autoSize?: boolean | {
        minRows?: number;
        maxRows?: number;
    };
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
export declare function ChatSender({ value, defaultValue, placeholder, disabled, sending, autoSize, attachments, leadingTools, hitlMode, onHitlModeChange, onSend, sendDisabled, sendDisabledReason, onStop, onChange, onAttach, onVoice, voicePreviewText, onVoiceCancel, onVoiceConfirm, mentionItems, skills, onMentionSelect, onSkillSelect, onRemoveAttachment, onKeyDown, className, }: ChatSenderProps): import("react").JSX.Element;
