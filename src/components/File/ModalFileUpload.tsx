import type { ReactNode } from 'react';
import { Upload, type UploadProps } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

/** 上传前的云形上传线性图标（45 × 36，主色 #6495F6）。设计稿对该组做了垂直翻转（flipV）。 */
const cloudUploadIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 31.5" width="45" height="31.5">
  <g transform="translate(0,31.5) scale(1,-1)">
  <path d="M10.125,0Q5.8359375,0.140625,2.953125,2.953125Q0.140625,5.8359375,0,10.125Q0.0703125,13.5,1.8984375,16.03125Q3.7265625,18.5625,6.75,19.6875Q6.75,19.96875,6.75,20.25Q6.890625,25.03125,10.054688,28.195312Q13.21875,31.359375,18,31.5Q21.164062,31.429688,23.695312,29.953125Q26.226562,28.40625,27.773438,25.875Q29.390625,27,31.5,27Q34.382812,26.929688,36.28125,25.03125Q38.179688,23.132812,38.25,20.25Q38.25,18.984375,37.828125,17.789062Q40.921875,17.15625,42.960938,14.695312Q44.929688,12.304688,45,9Q44.929688,5.203125,42.398438,2.6015625Q39.796875,0.0703125,36,0L10.125,0Z
M15.679688,15.257812Q14.695312,14.0625,15.679688,12.867188Q16.875,11.882812,18.070312,12.867188L20.8125,15.609375L20.8125,6.1875Q20.953125,4.640625,22.5,4.5Q24.046875,4.640625,24.1875,6.1875L24.1875,15.609375L26.929688,12.867188Q28.125,11.882812,29.320312,12.867188Q30.304688,14.0625,29.320312,15.257812L23.695312,20.882812Q22.5,21.867188,21.304688,20.882812L15.679688,15.257812Z" fill="currentColor"/>
  </g>
</svg>`;

/** 结果态的灰色文件底板（32 × 32），扩展名文字叠在中部 */
const fileBaseIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <path d="M31.500002,14.500001L29.250002,14.500001C29.112499,14.500001,29.000002,14.387501,29.000002,14.250001L29.000002,9.828125C29.000002,9.296875,28.790627,8.7875004,28.4125,8.4125004L20.587502,0.58750004C20.209375,0.20937499,19.703125,0,19.171875,0L4.5000005,0C3.6718752,0,3.0000002,0.67187506,3.0000002,1.5000001L3.0000002,14.250001C3.0000002,14.387501,2.8875,14.500001,2.7500002,14.500001L0.5,14.500001C0.22499999,14.500001,0,14.725001,0,15.000001L0,27.500002C0,27.775002,0.22499999,28.000002,0.5,28.000002L3.0000002,28.000002C3.0000002,29.103127,3.4468753,30.103127,4.1718755,30.828127C4.8968754,31.553125,5.8968754,32,7.0000005,32L27.500002,32C28.328127,32,29.000002,31.328127,29.000002,30.500002L29.000002,28.500002C29.000002,28.225,29.225,28.000002,29.500002,28.000002L31.500002,28.000002C31.775002,28.000002,32,27.775002,32,27.500002L32,15.000001C32,14.725001,31.775002,14.500001,31.500002,14.500001Z
M22.000002,4.828125L24.171877,7.0000005L22.125002,7.0000005C22.056252,7.0000005,22.000002,6.9437504,22.000002,6.8750005L22.000002,4.828125Z
M27.000002,29.750002C27.000002,29.887503,26.887503,30.000002,26.750002,30.000002L7.0000005,30.000002C5.8968754,30.000002,5,29.103127,5,28.000002L26.750002,28.000002C26.887503,28.000002,27.000002,28.112499,27.000002,28.250002L27.000002,29.750002Z
M27.000002,14.250001C27.000002,14.387501,26.887503,14.500001,26.750002,14.500001L5.25,14.500001C5.1125002,14.500001,5,14.387501,5,14.250001L5,2.2500002C5,2.1125,5.1125002,2,5.25,2L18.000002,2C19.103127,2,20,2.8937502,20,4L20,8.500001C20,8.7750006,20.225,9.000001,20.5,9.000001L25.000002,9.000001C26.103127,9.000001,27.000002,9.8937502,27.000002,11.000001L27.000002,14.250001Z" fill="#676767"/>
</svg>`;

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

function getExtension(fileName: string) {
  return fileName.split('.').pop()?.toUpperCase().slice(0, 4) ?? '';
}

/**
 * 弹窗内的文件上传组件（440 × 192）。
 * - idle：虚线边框的点击 / 拖拽上传区
 * - success：主色描边 + 浅蓝底，展示文件
 * - error：错误色描边 + 浅红底，展示文件
 */
export function ModalFileUpload(props: ModalFileUploadProps) {
  if (props.state === 'success' || props.state === 'error') {
    const { state, fileName, onRemove, className } = props;
    return (
      <div className={['sh-modal-file-upload', `sh-modal-file-upload--${state}`, className].filter(Boolean).join(' ')}>
        <button type="button" className="sh-modal-file-upload__close" aria-label="移除文件" onClick={onRemove}>
          <CloseOutlined />
        </button>
        <div className="sh-modal-file-upload__file">
          <span className="sh-modal-file-upload__file-icon">
            <span dangerouslySetInnerHTML={{ __html: fileBaseIcon }} />
            <span className="sh-modal-file-upload__file-ext">{getExtension(fileName)}</span>
          </span>
          <span className="sh-modal-file-upload__file-name" title={fileName}>{fileName}</span>
        </div>
      </div>
    );
  }

  const {
    state: _state,
    title = '拖拽文件到此处；或点击上传',
    hint = '支持 .docx、.pdf、.md 格式，单文件不超过 20MB',
    className,
    ...uploadProps
  } = props as ModalFileUploadIdleProps;

  return (
    <Dragger className={['sh-modal-file-upload', 'sh-modal-file-upload--idle', className].filter(Boolean).join(' ')} {...uploadProps}>
      <span className="sh-modal-file-upload__cloud" aria-hidden="true" dangerouslySetInnerHTML={{ __html: cloudUploadIcon }} />
      <div className="sh-modal-file-upload__title">{title}</div>
      {hint && <div className="sh-modal-file-upload__hint">{hint}</div>}
    </Dragger>
  );
}
