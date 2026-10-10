import { Input, Select, Switch, type InputProps, type SelectProps, type SwitchProps } from 'antd';
import type { TextAreaProps } from 'antd/es/input/TextArea';

/** Public form controls share the provider theme and the design-system component contract. */
export function AppInput(props: InputProps) { return <Input {...props} />; }
export function AppTextArea(props: TextAreaProps) { return <Input.TextArea {...props} />; }
export function AppSelect<ValueType = unknown>(props: SelectProps<ValueType>) { return <Select<ValueType> {...props} />; }
export function AppSwitch(props: SwitchProps) { return <Switch {...props} />; }
