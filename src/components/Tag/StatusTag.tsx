import type { ReactNode } from 'react';
import { Tag, type TagProps } from 'antd';

export type StatusTagTone = 'info' | 'success' | 'error' | 'warning' | 'orange' | 'neutral';

const toneColor: Record<StatusTagTone, TagProps['color']> = {
  info: 'processing',
  success: 'success',
  error: 'error',
  warning: 'warning',
  orange: 'orange',
  neutral: 'default',
};

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
export function StatusTag({ tone = 'neutral', leadingIcon, children, ...props }: StatusTagProps) {
  return (
    <Tag className="sh-status-tag" color={toneColor[tone]} icon={leadingIcon} {...props}>
      {children}
    </Tag>
  );
}
