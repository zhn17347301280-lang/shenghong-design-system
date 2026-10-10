import { type ModalProps } from 'antd';
export interface AppModalProps extends ModalProps {
    tone?: 'default' | 'success' | 'warning' | 'danger';
}
export declare function AppModal({ tone, className, ...props }: AppModalProps): import("react").JSX.Element;
