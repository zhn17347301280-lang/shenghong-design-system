import { useEffect, useState } from 'react';
import { Flex, Typography } from 'antd';
import { AppButton, FileUpload, FileUploadStatus } from '../index';
import { CatalogHeading } from './CatalogHeading';

type SelectedFile = { name: string; size: number };
type DemoState = 'idle' | 'uploading' | 'success' | 'error';
const maxFileSize = 50 * 1024 * 1024;

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** 只读取浏览器提供的文件信息，以计时器演示进度，不发送网络请求。 */
export function UploadDemo() {
  const [file, setFile] = useState<SelectedFile | null>(null);
  const [state, setState] = useState<DemoState>('idle');
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    if (state !== 'uploading') return;
    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      const next = Math.min(100, Math.floor((Date.now() - startedAt) / 4500 * 100));
      setPercent(next);
      if (next === 100) {
        window.clearInterval(timer);
        setState('success');
      }
    }, 100);
    return () => window.clearInterval(timer);
  }, [state]);

  function reset() {
    setState('idle');
    setPercent(0);
    setFile(null);
  }

  return (
    <Flex vertical gap={16}>
      <CatalogHeading title="上传演示" description="选择或拖入文件，查看对应图标和上传进度。仅本地演示，不会发送文件。" />
      {state === 'idle' ? (
        <FileUpload
          multiple={false}
          maxCount={1}
          showUploadList={false}
          hint="支持文档、表格、图片等文件，单个文件不超过 50 MB"
          beforeUpload={(selected) => {
            setFile({ name: selected.name, size: selected.size });
            setPercent(0);
            setState(selected.size > maxFileSize ? 'error' : 'uploading');
            return false;
          }}
        />
      ) : file && (
        <>
          <Typography.Text className="upload-demo__filename">{file.name} · {formatSize(file.size)}</Typography.Text>
          <div role="status" aria-live="polite">
            <FileUploadStatus
              state={state}
              fileName={file.name}
              percent={percent}
              showProgressInfo
              uploadingText="正在上传…"
              uploadingHint="根据文件类型显示图标，进度完成后展示上传结果。"
              successCount={1}
              unit="个文件"
              successText="上传完成"
              successHint={`${file.name} 上传完成`}
              errorText="文件超过 50 MB，请选择较小的文件。"
              onRetry={reset}
            />
          </div>
          <Flex gap={8}>
            {state === 'uploading' && <AppButton onClick={reset}>取消上传</AppButton>}
            {state !== 'error' && <AppButton onClick={reset}>{state === 'uploading' ? '重新选择' : '继续上传'}</AppButton>}
          </Flex>
        </>
      )}
    </Flex>
  );
}
