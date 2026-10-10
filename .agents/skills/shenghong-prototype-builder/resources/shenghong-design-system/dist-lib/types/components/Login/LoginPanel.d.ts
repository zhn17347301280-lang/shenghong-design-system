import { type ReactNode } from 'react';
export type LoginMethod = 'password' | 'code';
export type LoginStage = 'before-input' | 'after-input' | 'input-error' | 'account-abnormal' | 'forgot-password' | 'forgot-password-error-1' | 'forgot-password-error-2' | 'set-password';
export interface LoginValues {
    account: string;
    password?: string;
    code?: string;
}
export interface LoginPanelProps {
    /** MasterGo 属性：登陆方式。 */
    method?: LoginMethod;
    /** 兼容旧调用，等同于 method。 */
    mode?: LoginMethod;
    /** MasterGo 属性：登陆阶段。 */
    stage?: LoginStage;
    title?: ReactNode;
    account?: string;
    password?: string;
    code?: string;
    loading?: boolean;
    error?: ReactNode;
    onModeChange?: (mode: LoginMethod) => void;
    onSubmit?: (values: LoginValues) => void;
    onForgotPassword?: () => void;
    onBack?: () => void;
    onSkipSetPassword?: () => void;
    onSetPassword?: (password: string, confirmPassword: string) => void;
    onConfirmAccountAbnormal?: () => void;
    onProblem?: () => void;
    supportQrValue?: string;
}
export declare function LoginPanel({ method, mode, stage, title, account, password, code, loading, error, onModeChange, onSubmit, onForgotPassword, onBack, onSkipSetPassword, onSetPassword, onConfirmAccountAbnormal, onProblem, supportQrValue, }: LoginPanelProps): import("react").JSX.Element;
