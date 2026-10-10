import { Modal, type ModalProps } from 'antd';

export interface AppModalProps extends ModalProps {
  tone?: 'default' | 'success' | 'warning' | 'danger';
}

export function AppModal({ tone = 'default', className, ...props }: AppModalProps) {
  return (
    <Modal
      width={520}
      centered
      className={['sh-modal', `sh-modal--${tone}`, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
}

