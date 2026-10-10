import type { CSSProperties, KeyboardEvent, MouseEvent, ReactNode } from 'react';

/**
 * 纯文字单元格的三种语义类型（MasterGo 61:185130）：
 * - normal：普通文本，rgba(0,0,0,0.88)；
 * - link：跳转文本，链接色 #1677FF，可点击跳转；
 * - disabled：失效文本，rgba(0,0,0,0.25)，不可点击。
 */
export type CellTextType = 'normal' | 'link' | 'disabled';

export interface CellTextProps {
  children: ReactNode;
  /** 纯文字语义，默认 normal。 */
  type?: CellTextType;
  /** type="link" 时的点击回调。 */
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  className?: string;
  style?: CSSProperties;
  title?: string;
}

/**
 * 表格单元格内的纯文字。三种语义只改变颜色与可交互性，
 * 字号统一 14px / 行高 22px，与设计稿 Base Normal 一致。
 */
export function CellText({ children, type = 'normal', onClick, className, style, title }: CellTextProps) {
  const isLink = type === 'link';
  const isDisabled = type === 'disabled';

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (isDisabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!isLink || isDisabled) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      (event.currentTarget as HTMLElement).click();
    }
  };

  const classes = ['sh-cell-text', `sh-cell-text--${type}`, className].filter(Boolean).join(' ');

  if (isLink) {
    return (
      <a
        aria-disabled={isDisabled || undefined}
        className={classes}
        href="#"
        onClick={(event) => {
          event.preventDefault();
          handleClick(event);
        }}
        onKeyDown={handleKeyDown}
        role="link"
        style={style}
        title={title}
      >
        {children}
      </a>
    );
  }

  return (
    <span aria-disabled={isDisabled || undefined} className={classes} style={style} title={title}>
      {children}
    </span>
  );
}
