import type { ReactNode } from 'react';
import { type TagProps } from 'antd';
export type StatusTagTone = 'info' | 'success' | 'error' | 'warning' | 'orange' | 'neutral';
export interface StatusTagProps extends Omit<TagProps, 'color'> {
    /** 语义色调，对齐设计稿蓝 / 绿 / 红 / 橙 / 灰。 */
    tone?: StatusTagTone;
    /** 前置图标，12px。 */
    leadingIcon?: ReactNode;
}
/**
 * 普通标签：直接基于 antd Tag 预设色，22px 高、4px 圆角。
 * 支持传入前置图标（有 icon / 无 icon 两种形态）。
 */
export declare function StatusTag({ tone, leadingIcon, children, ...props }: StatusTagProps): import("react").JSX.Element;
