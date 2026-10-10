import { Button, type ButtonProps } from 'antd';

export type AppButtonProps = ButtonProps;

/**
 * MasterGo Button 的研发入口。
 * 直接保留 antd 的 primary/default/text/ghost、danger、loading 与 icon 能力，
 * 视觉差异统一由根主题控制，避免业务页面重复覆盖样式。
 */
export function AppButton(props: AppButtonProps) {
  return <Button {...props} />;
}

