/**
 * 颜色规范 Token。
 *
 * 来源：MasterGo《设计规范》/ Theme colors
 * file: 201408686860424
 * layer: 50:067684
 *
 * Token 名和值按设计稿表格原样维护。`*Base` 是设计规范中的基础色命名，
 * 在 theme.ts 中会映射到 Ant Design 对应的 seed token。
 */
export const colorTokens = {
  // Primary
  colorPrimaryBg: '#F0F7FF',
  colorPrimaryBgHover: '#0000000D',
  colorPrimaryBorder: '#E3EFFF',
  colorPrimaryBorderHover: '#BAD6FF',
  colorPrimaryHover: '#91BAFF',
  colorPrimaryBase: '#6495F6',
  colorPrimaryActive: '#4A72CF',
  colorPrimaryTextHover: '#91BAFF',
  colorPrimaryText: '#6495F6',
  colorPrimaryTextActive: '#4A72CF',

  // Success
  colorSuccessBg: '#f6ffed',
  colorSuccessBgHover: '#d9f7be',
  colorSuccessBorder: '#b7eb8f',
  colorSuccessBorderHover: '#95de64',
  colorSuccessHover: '#73d13d',
  colorSuccessBase: '#52c41a',
  colorSuccessActive: '#389e0d',
  colorSuccessTextHover: '#237804',
  colorSuccessText: '#135200',
  colorSuccessTextActive: '#092b00',

  // Warning
  colorWarningBg: '#fffbe6',
  colorWarningBgHover: '#fff1b8',
  colorWarningBorder: '#ffe58f',
  colorWarningBorderHover: '#ffd666',
  colorWarningHover: '#ffc53d',
  colorWarningBase: '#faad14',
  colorWarningActive: '#d48806',
  colorWarningTextHover: '#ad6800',
  colorWarningText: '#874d00',
  colorWarningTextActive: '#613400',

  // Error
  colorErrorBg: '#fff1f0',
  colorErrorBgHover: '#ffccc7',
  colorErrorBorder: '#ffa39e',
  colorErrorBorderHover: '#ff7875',
  colorErrorHover: '#ff7875',
  colorErrorBase: '#ff4d4f',
  colorErrorActive: '#cf1322',
  colorErrorTextHover: '#a8071a',
  colorErrorText: '#820014',
  colorErrorTextActive: '#5c0011',

  // Info
  colorInfoBg: '#e6f4ff',
  colorInfoBgHover: '#bae0ff',
  colorInfoBorder: '#91caff',
  colorInfoBorderHover: '#69b1ff',
  colorInfoHover: '#4096ff',
  colorInfoBase: '#1677ff',
  colorInfoActive: '#0958d9',
  colorInfoTextHover: '#003eb3',
  colorInfoText: '#002c8c',
  colorInfoTextActive: '#001d66',

  // Text & icons
  colorText: '#000000e0',
  colorTextHeading: '#000000e0',
  colorTextDescription: '#00000073',
  colorTextPlaceholder: '#00000040',
  colorTextDisabled: '#00000040',
  // 深色背景上的禁用内容（例如幽灵按钮），避免黑色禁用文字不可见。
  colorTextDisabledInverse: '#ffffff73',
  colorIcon: '#00000073',
  colorIconHover: '#000000e0',

  // Backgrounds
  colorBgContainer: '#ffffff',
  colorBgContainerDisabled: '#0000000a',
  colorBgLayout: '#f5f5f5',
  colorBgElevated: '#ffffff',
  controlItemBgHover: '#0000000a',
  controlItemBgActive: '#e6f4ff',
  controlItemBgActiveHover: '#bae0ff',

  // Borders & dividers
  colorBorder: '#00000026',
  colorBorderSecondary: '#0000000f',
  colorSplit: '#0000000f',
} as const;

/** 保留原有调用方式；品牌主色对应规范中的 colorPrimaryBase。 */
export const brandTokens = {
  colorPrimary: colorTokens.colorPrimaryBase,
} as const;

export type ColorTokenName = keyof typeof colorTokens;
