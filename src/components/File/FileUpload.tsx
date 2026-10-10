import type { ReactNode } from 'react';
import { Button, Flex, Progress, Typography, Upload, type UploadProps } from 'antd';
import { CheckCircleFilled, WarningFilled } from '@ant-design/icons';
import { FileTypeIcon, getFileTypeIcon } from './FileTypeIcon';
import uploadIcon from '../../icons/svg/上传2.svg?raw';

const { Dragger } = Upload;
const { Text, Link } = Typography;

export interface FileUploadProps extends Omit<UploadProps, 'children'> {
  title?: ReactNode;
  hint?: ReactNode;
}

/** 上传前：可点击 / 拖拽的上传区，虚线边框。 */
export function FileUpload({ title = '点击或拖拽文件到此处上传', hint, ...props }: FileUploadProps) {
  return (
    <Dragger className="sh-file-upload" {...props}>
      <span className="sh-file-upload__mark" aria-hidden="true" dangerouslySetInnerHTML={{ __html: uploadIcon }} />
      <div className="sh-file-upload__title">{title}</div>
      {hint && <Text type="secondary" className="sh-file-upload__hint">{hint}</Text>}
    </Dragger>
  );
}

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

function StateIcon({ state, fileName }: { state: FileUploadState; fileName?: string }) {
  if (state === 'success') return <CheckCircleFilled className="sh-file-upload-status__icon sh-file-upload-status__icon--success" />;
  if (state === 'partial') return <WarningFilled className="sh-file-upload-status__icon sh-file-upload-status__icon--warning" />;
  if (fileName && getFileTypeIcon(fileName)) return <FileTypeIcon name={fileName} size={36} />;
  return <FileTypeIcon name="default.xlsx" size={36} />;
}

/**
 * 文件上传的结果态组件，覆盖上传中 / 上传失败 / 上传成功 / 部分成功。
 * 上传前请使用 FileUpload。
 */
export function FileUploadStatus({
  state = 'idle',
  fileName = '成员信息.xlsx',
  percent = 50,
  errorText = '上传失败：网络异常，请稍后重试',
  uploadingText = '成员信息导入中，请稍候...',
  uploadingHint = '请勿关闭当前页面，否则将导致任务中断。',
  successCount = 128,
  failCount = 12,
  unit = '个成员',
  resultHint = '您可下载错误报告，修改后重新上传',
  onRetry,
  onDownloadReport,
}: FileUploadStatusProps) {
  return (
    <div className="sh-file-upload-status" data-state={state}>
      <StateIcon state={state} fileName={fileName} />

      <div className="sh-file-upload-status__body">
        {state === 'uploading' && (
          <>
            <div className="sh-file-upload-status__title">{uploadingText}</div>
            <Progress className="sh-file-upload-status__progress" percent={percent} showInfo={false} strokeColor="#6495F6" />
            <Text type="secondary" className="sh-file-upload-status__desc">{uploadingHint}</Text>
          </>
        )}

        {state === 'error' && (
          <>
            <div className="sh-file-upload-status__title sh-file-upload-status__title--error">{errorText}</div>
            <Link className="sh-file-upload-status__link" onClick={onRetry}>重新上传</Link>
          </>
        )}

        {state === 'success' && (
          <>
            <div className="sh-file-upload-status__title">
              导入结果：导入成功 <strong className="is-success">{successCount}</strong> {unit}
            </div>
            <Text type="secondary" className="sh-file-upload-status__desc">全部成员导入完成</Text>
          </>
        )}

        {state === 'partial' && (
          <>
            <div className="sh-file-upload-status__title">
              导入结果：导入成功 <strong className="is-success">{successCount}</strong> {unit}，导入失败 <strong className="is-error">{failCount}</strong> {unit}。
            </div>
            <Text type="secondary" className="sh-file-upload-status__desc">
              您可下载错误报告，修改后重新上传
              {onDownloadReport && (
                <Link className="sh-file-upload-status__link-inline" onClick={onDownloadReport}>下载错误报告</Link>
              )}
            </Text>
          </>
        )}
      </div>
    </div>
  );
}

export interface AttachmentCardProps {
  name: ReactNode;
  meta?: ReactNode;
  icon?: ReactNode;
  status?: 'normal' | 'uploading' | 'success' | 'error' | 'warning';
  percent?: number;
  actions?: ReactNode;
}

export function AttachmentCard({
  name,
  meta,
  icon,
  status = 'normal',
  percent = 0,
  actions,
}: AttachmentCardProps) {
  const fileName = typeof name === 'string' ? name : '';
  const hasTypeIcon = icon === undefined && !!getFileTypeIcon(fileName);
  const resolvedIcon = icon ?? (hasTypeIcon ? <FileTypeIcon name={fileName} size={32} /> : '▤');

  return (
    <div className="sh-attachment-card" data-status={status}>
      <Flex align="center" gap={12}>
        <span className={['sh-attachment-card__icon', hasTypeIcon ? 'sh-attachment-card__icon--type' : ''].filter(Boolean).join(' ')}>
          {resolvedIcon}
        </span>
        <div className="sh-attachment-card__body">
          <Text ellipsis>{name}</Text>
          {meta && <Text type="secondary">{meta}</Text>}
          {status === 'uploading' && <Progress percent={percent} size="small" showInfo={false} />}
        </div>
        {actions ?? <Button type="text" size="small">•••</Button>}
      </Flex>
    </div>
  );
}
