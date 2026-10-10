import { type InputProps, type SelectProps, type SwitchProps } from 'antd';
import type { TextAreaProps } from 'antd/es/input/TextArea';
/** Public form controls share the provider theme and the design-system component contract. */
export declare function AppInput(props: InputProps): import("react").JSX.Element;
export declare function AppTextArea(props: TextAreaProps): import("react").JSX.Element;
export declare function AppSelect<ValueType = unknown>(props: SelectProps<ValueType>): import("react").JSX.Element;
export declare function AppSwitch(props: SwitchProps): import("react").JSX.Element;
