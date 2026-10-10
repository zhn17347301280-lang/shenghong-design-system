import type { ReactNode } from 'react';
export interface ChatFileCardProps {
    /** 文件名（含后缀），用于匹配类型图标与展示。 */
    name: string;
    /** 自定义图标，默认按文件名后缀自动匹配 28px 彩色图标。 */
    icon?: ReactNode;
    /** 点击卡片回调。 */
    onClick?: () => void;
    className?: string;
}
/**
 * AI 对话产出文件卡片：200 × 52，左侧 28px 文件类型图标 + 文件名。
 * 对齐设计稿「AI对话产出文件」。
 */
export declare function ChatFileCard({ name, icon, onClick, className }: ChatFileCardProps): import("react").JSX.Element;
