import { type ReactNode } from 'react';
export type InputFileStatus = 'normal' | 'uploading' | 'parsing' | 'error';
interface BaseProps {
    /** hover 时右上角是否展示删除按钮，默认 true。 */
    closable?: boolean;
    /** 点击删除按钮回调。 */
    onClose?: () => void;
    className?: string;
}
export interface InputFileCardProps extends BaseProps {
    /** 卡片类型：文件 160×72；图片 72×72。 */
    kind?: 'file';
    /** 文件名（含后缀）。 */
    name: string;
    /** 文件状态。 */
    status?: InputFileStatus;
    /** 文件大小，normal 状态展示（如 119KB）。 */
    size?: ReactNode;
    /** 上传进度 0-100，uploading 状态展示。 */
    percent?: number;
    /** 自定义左侧文件图标，默认按后缀自动匹配。 */
    icon?: ReactNode;
}
export interface InputImageCardProps extends BaseProps {
    kind: 'image';
    /** 图片缩略图地址。 */
    src: string;
    /** 图片替代文本。 */
    alt?: string;
    status?: Extract<InputFileStatus, 'normal' | 'uploading'>;
    percent?: number;
}
/**
 * 输入框内的文件 / 图片卡片，对齐设计稿「输入框文件卡片」。
 * 文件 160×72，图片 72×72；hover 显示右上角删除按钮。
 * 外层 wrap 不裁切以容纳越界的删除按钮，内层 card 统一 overflow:hidden 裁切蒙层与缩略图。
 */
export declare function InputFileCard(props: InputFileCardProps | InputImageCardProps): import("react").JSX.Element;
export {};
