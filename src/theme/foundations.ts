/** MasterGo 设计规范中除颜色之外的基础设计变量。 */
export const typographyTokens = {
  fontFamilyLabel: 'Ant Design 系统字体栈（macOS：San Francisco / SF Pro）',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
  fontSize: 14,
  fontSizeSM: 12,
  fontSizeLG: 16,
  fontSizeHeading1: 38,
  fontSizeHeading2: 30,
  fontSizeHeading3: 24,
  lineHeight: 1.5715,
  lineHeightSM: 1.6667,
  lineHeightHeading: 1.32,
} as const;

export const spacingTokens = {
  spaceXXS: 4,
  spaceXS: 8,
  spaceSM: 12,
  spaceMD: 16,
  spaceLG: 24,
  spaceXL: 32,
  spaceXXL: 48,
} as const;

export const radiusTokens = {
  radiusSM: 4,
  radiusMD: 6,
  radiusLG: 8,
  radiusXL: 12,
} as const;

export const shadowTokens = {
  shadowCard: '0 1px 2px rgba(0, 0, 0, 0.03), 0 4px 12px rgba(0, 0, 0, 0.04)',
  shadowPopover: '0 6px 16px rgba(0, 0, 0, 0.08), 0 3px 6px rgba(0, 0, 0, 0.05)',
  shadowModal: '0 12px 36px rgba(0, 0, 0, 0.14)',
} as const;

export const motionTokens = {
  motionFast: '120ms',
  motionBase: '200ms',
  motionSlow: '300ms',
  easingStandard: 'cubic-bezier(0.2, 0, 0, 1)',
} as const;

/**
 * Chart 图表 token，来源：MasterGo《设计规范》/ Chart图表（组件集 158:109693）
 * - primary：柱/条/单线主色 #6495F6
 * - categorical：多色板（多系列、多色单系列循环取色）
 * - blueScale：单色模式下的蓝色阶梯，多系列按系列取色，深 → 浅
 * - donutMonoScale：环形图单色模式由深到浅的扇区色
 */
export const chartTokens = {
  primary: '#6495F6',
  categorical: ['#6495F6', '#5FE7E7', '#9564F6', '#64F695', '#F664F6', '#95F664'],
  blueScale: ['#2D63D9', '#4579EA', '#6495F6', '#7AA5F8', '#A8C7FC', '#C9DDFF'],
  donutMonoScale: ['#2D63D9', '#4579EA', '#6495F6', '#7AA5F8', '#A8C7FC'],
  sequentialBlue: ['#F4F8FF', '#D2E3FE', '#A8C7FC', '#7AA5F8', '#4579EA'],
  title: '#243044',
  axis: '#6B778C',
  grid: '#E7EDF6',
  border: '#DFE8F9',
  cardRadius: 16,
  tooltipShadow: '0 3px 8px rgba(0,0,0,0.16)',
} as const;
