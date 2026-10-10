import type { CSSProperties, ReactNode } from 'react';
import { type CellTextType } from './CellText';
/**
 * 单元格内容（MasterGo 61:185300）由三个正交槽位组合而成，
 * 槽位之间 8px 间距、垂直居中，顺序固定为 icon → text → tag：
 * - icon：前置图标，16 × 16；
 * - text：主体文字，纯文字时再用 textType 区分普通/跳转/失效；
 * - tag：尾部标签（如「需要登录」），蓝底蓝字，22px 高。
 *
 * 任意槽位都可缺省，因此覆盖设计稿中的 6 种合法形态：
 * 纯文字 / 图标+文字 / 文字+标签 / 图标+文字+标签 / 仅图标 / 仅标签。
 */
export interface TableCellContentProps {
    /** 前置图标，建议传 16px 的 LocalIcon。 */
    icon?: ReactNode;
    /** 主体文字；与 textType 搭配使用。 */
    text?: ReactNode;
    /** 纯文字语义，仅在传入 text 时生效，默认 normal。 */
    textType?: CellTextType;
    /** 点击跳转文字时触发，仅 textType="link" 有意义。 */
    onTextClick?: () => void;
    /** 尾部标签内容，建议传 StatusTag。 */
    tag?: ReactNode;
    className?: string;
    style?: CSSProperties;
}
/** 表格单元格内容容器，负责 icon / text / tag 三个槽位的排版。 */
export declare function TableCellContent({ icon, text, textType, onTextClick, tag, className, style, }: TableCellContentProps): import("react").JSX.Element;
