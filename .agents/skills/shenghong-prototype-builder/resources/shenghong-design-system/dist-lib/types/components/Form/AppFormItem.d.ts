import { type ReactNode } from 'react';
import { type FormItemProps } from 'antd';
export type AppFormItemMode = 'readonly' | 'read-edit' | 'editing' | 'edit' | 'switch' | 'error';
export type AppFormItemProps = Omit<FormItemProps, 'children'> & {
    /** 字段内容的状态，与 layout 完全独立。 */
    mode?: AppFormItemMode;
    /** 只读状态展示的值。 */
    displayValue?: ReactNode;
    /** 标签下方的补充描述。 */
    description?: ReactNode;
    /** 开关状态的默认值，仅在未传入 children 时生效。 */
    defaultChecked?: boolean;
    /** 单项可读可编辑的初始文本值。 */
    editableValue?: string;
    editText?: ReactNode;
    completeText?: ReactNode;
    /** @deprecated 请使用 completeText。 */
    saveText?: ReactNode;
    onEdit?: () => void;
    onValueChange?: (value: string) => void;
    onComplete?: (value: string) => void;
    /** @deprecated 请使用 onComplete。 */
    onSave?: (value: string) => void;
    children?: ReactNode;
};
/**
 * MasterGo Form Item：layout 只描述“字段与内容”的位置关系，mode 只描述内容状态。
 */
export declare function AppFormItem({ mode, displayValue, description, defaultChecked, editableValue, editText, completeText, saveText, onEdit, onValueChange, onComplete, onSave, className, children, label, required, htmlFor, layout, validateStatus, help, ...formItemProps }: AppFormItemProps): import("react").JSX.Element;
