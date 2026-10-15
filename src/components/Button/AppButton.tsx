import { Button, type ButtonProps } from 'antd';
import { colorTokens } from '../../theme/colors';

export type AppButtonProps = ButtonProps;

/**
 * MasterGo Button 的研发入口。
 * 透传 antd ButtonProps：五种 type、三档 size、danger/ghost、loading/disabled、
 * icon/iconPlacement、shape/block，以及 href/htmlType 等语义能力。
 * 默认尺寸 medium（32px），large 40px，small 24px。
 * 纯图标按钮由调用方提供 aria-label；危险操作的确认流程由业务负责。
 * 视觉差异统一由根主题控制，避免业务页面重复覆盖样式。
 */
export function AppButton({ style, ...props }: AppButtonProps) {
  // antd 的默认禁用文字为半透明黑色；幽灵按钮用于深色背景，需使用反色。
  const ghostDisabledStyle = props.ghost && props.disabled ? {
    color: colorTokens.colorTextDisabledInverse,
    borderColor: colorTokens.colorTextDisabledInverse,
    backgroundColor: 'transparent',
  } : undefined;
  return <Button {...props} style={ghostDisabledStyle ? { ...ghostDisabledStyle, ...style } : style} />;
}
