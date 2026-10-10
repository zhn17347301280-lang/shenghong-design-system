import type { ReactNode } from 'react';
import { type UploadProps } from 'antd';
export type ModalFileUploadState = 'idle' | 'success' | 'error';
export interface ModalFileUploadIdleProps extends Omit<UploadProps, 'children'> {
    state?: 'idle';
    /** 主提示文案，默认含可点击上传语义。 */
    title?: ReactNode;
    /** 格式 / 大小等描述文案。 */
    hint?: ReactNode;
}
export interface ModalFileUploadResultProps {
    state: 'success' | 'error';
    /** 上传完成的文件名。 */
    fileName: string;
    /** 点击右上角关闭按钮的回调。 */
    onRemove?: () => void;
    className?: string;
}
export type ModalFileUploadProps = ModalFileUploadIdleProps | ModalFileUploadResultProps;
/**
 * 弹窗内的文件上传组件（440 × 192）。
 * - idle：虚线边框的点击 / 拖拽上传区
 * - success：主色描边 + 浅蓝底，展示文件
 * - error：错误色描边 + 浅红底，展示文件
 */
export declare function ModalFileUpload(props: ModalFileUploadProps): import("react").JSX.Element;
