import { useState, type ReactNode } from 'react';
import { CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import { FileTypeIcon, getFileTypeIcon } from './FileTypeIcon';

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

function CloseBadge({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      className="sh-input-file-card__close"
      aria-label="删除"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      <CloseOutlined />
    </button>
  );
}

/**
 * 输入框内的文件 / 图片卡片，对齐设计稿「输入框文件卡片」。
 * 文件 160×72，图片 72×72；hover 显示右上角删除按钮。
 * 外层 wrap 不裁切以容纳越界的删除按钮，内层 card 统一 overflow:hidden 裁切蒙层与缩略图。
 */
export function InputFileCard(props: InputFileCardProps | InputImageCardProps) {
  const { closable = true, onClose, className = '' } = props;
  const [hovered, setHovered] = useState(false);

  const close = closable ? <CloseBadge onClick={onClose} /> : null;

  const card = (() => {
    if (props.kind === 'image') {
      const uploading = props.status === 'uploading';
      return (
        <div className="sh-input-file-card sh-input-file-card--image">
          <img
            className={`sh-input-file-card__thumb${uploading ? ' is-uploading' : ''}`}
            src={props.src}
            alt={props.alt ?? ''}
          />
          {uploading && (
            <div className="sh-input-file-card__image-mask">
              <span className="sh-input-file-card__image-loading"><LoadingOutlined /></span>
            </div>
          )}
        </div>
      );
    }

    const { name, status = 'normal', size, percent = 0, icon } = props;
    const resolvedIcon = icon ?? (getFileTypeIcon(name) ? <FileTypeIcon name={name} size={32} /> : null);

    let meta: ReactNode;
    if (status === 'uploading') meta = <><span>上传中...</span><span>{percent}%</span></>;
    else if (status === 'parsing') meta = <span>解析中...</span>;
    else if (status === 'error') meta = <span className="is-error">上传失败</span>;
    else meta = <span>{size}</span>;

    return (
      <div className="sh-input-file-card sh-input-file-card--file" data-status={status}>
        {status === 'uploading' && (
          <span className="sh-input-file-card__progress" style={{ width: `${Math.min(100, Math.max(0, percent))}%` }} />
        )}
        <span className="sh-input-file-card__icon">{resolvedIcon}</span>
        <span className="sh-input-file-card__body">
          <span className="sh-input-file-card__name" title={name}>{name}</span>
          <span className="sh-input-file-card__meta">{meta}</span>
        </span>
      </div>
    );
  })();

  return (
    <span
      className={`sh-input-file-card-wrap ${className}`.trim()}
      data-hovered={hovered || undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {card}
      {hovered && close}
    </span>
  );
}
