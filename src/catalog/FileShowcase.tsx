import { useState } from 'react';
import { Flex, Tabs } from 'antd';
import { CatalogHeading } from './CatalogHeading';
import { UploadDemo } from './UploadDemo';
import {
  AppButton,
  ChatFileCard,
  FileUpload,
  FileUploadStatus,
  InputFileCard,
  ModalFileUpload,
  type FileUploadState,
  type InputFileStatus,
  type ModalFileUploadState,
} from '../index';

const stateOptions: { key: FileUploadState; label: string }[] = [
  { key: 'idle', label: '上传前' },
  { key: 'uploading', label: '上传中' },
  { key: 'error', label: '上传失败' },
  { key: 'success', label: '上传成功' },
  { key: 'partial', label: '部分成功' },
];

function PageFileUpload() {
  const [state, setState] = useState<FileUploadState>('idle');

  return (
    <Flex vertical gap={12} className="sh-file-showcase__panel">
      <Flex gap={8} wrap>
        {stateOptions.map((option) => (
          <AppButton
            key={option.key}
            type={state === option.key ? 'primary' : 'default'}
            onClick={() => setState(option.key)}
          >
            {option.label}
          </AppButton>
        ))}
      </Flex>

      {state === 'idle' ? (
        <FileUpload beforeUpload={() => false} hint="支持 PDF、Word、Excel，单个文件不超过 50 MB" />
      ) : (
        <FileUploadStatus state={state} fileName="成员信息.xlsx" percent={68} onRetry={() => setState('idle')} />
      )}
    </Flex>
  );
}

function ConversationFileCards() {
  return (
    <Flex gap={12} wrap className="sh-file-showcase__panel">
      <ChatFileCard name="乙二醇采购合同.doc" />
      <ChatFileCard name="2026年度经营分析报告.xlsx" />
      <ChatFileCard name="产品需求说明.pdf" />
    </Flex>
  );
}

const fileStates: { key: InputFileStatus; label: string }[] = [
  { key: 'normal', label: 'normal' },
  { key: 'uploading', label: '上传中' },
  { key: 'parsing', label: '解析中' },
  { key: 'error', label: '上传失败' },
];

const demoThumb =
  'https://console.enterprise.trae.cn/api/ide/v1/text_to_image?prompt=' +
  encodeURIComponent('friendly 3D cartoon mascot character facing camera and waving hand in greeting, soft studio lighting, avatar style') +
  '&image_size=square';

function InputFileCards() {
  return (
    <Flex vertical gap={20} className="sh-file-showcase__panel">
      <div>
        <CatalogHeading title="文件" description="鼠标移到卡片上可查看删除按钮。" />
        <div className="sh-input-box-demo">
          {fileStates.map((s) => (
            <InputFileCard
              key={s.key}
              name="乙二醇采购合同.doc"
              status={s.key}
              size="119KB"
              percent={45}
            />
          ))}
        </div>
      </div>

      <div>
        <CatalogHeading title="图片" />
        <div className="sh-input-box-demo">
          <InputFileCard kind="image" src={demoThumb} alt="演示图片" status="normal" />
          <InputFileCard kind="image" src={demoThumb} alt="演示图片" status="uploading" percent={45} />
        </div>
      </div>
    </Flex>
  );
}

const modalStates: { key: ModalFileUploadState; label: string }[] = [
  { key: 'idle', label: '上传前' },
  { key: 'success', label: '上传成功' },
  { key: 'error', label: '上传失败' },
];

function ModalFileUploads() {
  const [state, setState] = useState<ModalFileUploadState>('idle');

  return (
    <Flex vertical gap={12} className="sh-file-showcase__panel">
      <Flex gap={8} wrap>
        {modalStates.map((option) => (
          <AppButton
            key={option.key}
            type={state === option.key ? 'primary' : 'default'}
            onClick={() => setState(option.key)}
          >
            {option.label}
          </AppButton>
        ))}
      </Flex>

      {state === 'idle' ? (
        <ModalFileUpload state="idle" beforeUpload={() => false} />
      ) : (
        <ModalFileUpload state={state} fileName="文书生成 skill.zip" onRemove={() => setState('idle')} />
      )}
    </Flex>
  );
}

export function FileShowcase() {
  return (
    <div className="sh-file-showcase">
      <Tabs
        items={[
          { key: 'demo', label: '上传演示', children: <UploadDemo /> },
          { key: 'page', label: '页面文件上传', children: <PageFileUpload /> },
          { key: 'conversation', label: '对话文件卡片', children: <ConversationFileCards /> },
          { key: 'input', label: '输入框文件卡片', children: <InputFileCards /> },
          { key: 'modal', label: '弹窗文件上传', children: <ModalFileUploads /> },
        ]}
      />
    </div>
  );
}
