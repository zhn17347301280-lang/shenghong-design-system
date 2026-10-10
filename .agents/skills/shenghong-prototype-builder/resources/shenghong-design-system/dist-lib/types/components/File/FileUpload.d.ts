import type { ReactNode } from 'react';
import { type UploadProps } from 'antd';
export interface FileUploadProps extends Omit<UploadProps, 'children'> {
    title?: ReactNode;
    hint?: ReactNode;
}
/** 上传前：可点击 / 拖拽的上传区，虚线边框。 */
export declare function FileUpload({ title, hint, ...props }: FileUploadProps): import("react").JSX.Element;
export type FileUploadState = 'idle' | 'uploading' | 'error' | 'success' | 'partial';
export interface FileUploadStatusProps {
    /** 当前上传状态，默认 idle（上传前）。 */
    state?: FileUploadState;
    /** 上传中的文件名，用于展示对应类型图标。 */
    fileName?: string;
    /** 上传进度 0-100，仅 uploading 生效。 */
    percent?: number;
    /** 上传失败时的错误文案。 */
    errorText?: ReactNode;
    /** 上传中的主提示文案。 */
    uploadingText?: ReactNode;
    /** 上传中进度条下方的提示文案。 */
    uploadingHint?: ReactNode;
    /** 成功导入的数量。 */
    successCount?: number;
    /** 失败导入的数量，仅 partial 生效。 */
    failCount?: number;
    /** 结果态（成功 / 部分成功）主文案后的计量单位。 */
    unit?: ReactNode;
    /** 结果态描述文案。 */
    resultHint?: ReactNode;
    /** 点击「重新上传」的回调，仅 error 生效。 */
    onRetry?: () => void;
    /** 结果态描述里「下载错误报告」的回调。 */
    onDownloadReport?: () => void;
}
/**
 * 文件上传的结果态组件，覆盖上传中 / 上传失败 / 上传成功 / 部分成功。
 * 上传前请使用 FileUpload。
 */
export declare function FileUploadStatus({ state, fileName, percent, errorText, uploadingText, uploadingHint, successCount, failCount, unit, resultHint, onRetry, onDownloadReport, }: FileUploadStatusProps): import("react").JSX.Element;
export interface AttachmentCardProps {
    name: ReactNode;
    meta?: ReactNode;
    icon?: ReactNode;
    status?: 'normal' | 'uploading' | 'success' | 'error' | 'warning';
    percent?: number;
    actions?: ReactNode;
}
export declare function AttachmentCard({ name, meta, icon, status, percent, actions, }: AttachmentCardProps): import("react").JSX.Element;
