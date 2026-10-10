import { theme as antdTheme, type ThemeConfig } from 'antd';
import { colorTokens } from './colors';
import { radiusTokens, typographyTokens } from './foundations';

const {
  colorPrimaryBase,
  colorSuccessBase,
  colorWarningBase,
  colorErrorBase,
  colorInfoBase,
  ...mappedColorTokens
} = colorTokens;

/**
 * Ant Design 全局主题入口。
 * 设计规范里的 `*Base` 映射为 Ant Design seed token，其余 map/alias token
 * 按设计稿中的明确值覆盖，避免运行时算法与设计规范产生色差。
 */
export const appTheme: ThemeConfig = {
  algorithm: antdTheme.defaultAlgorithm,
  token: {
    colorPrimary: colorPrimaryBase,
    colorSuccess: colorSuccessBase,
    colorWarning: colorWarningBase,
    colorError: colorErrorBase,
    colorInfo: colorInfoBase,
    fontFamily: typographyTokens.fontFamily,
    fontSize: typographyTokens.fontSize,
    fontSizeSM: typographyTokens.fontSizeSM,
    lineHeight: typographyTokens.lineHeight,
    lineHeightSM: typographyTokens.lineHeightSM,
    borderRadius: radiusTokens.radiusMD,
    controlHeight: 32,
    ...mappedColorTokens,
  },
  components: {
    Button: {
      borderRadius: radiusTokens.radiusMD,
      controlHeight: 32,
      paddingInline: 15,
    },
    Card: {
      borderRadiusLG: radiusTokens.radiusLG,
      bodyPadding: 16,
      headerHeight: 48,
    },
    Modal: {
      borderRadiusLG: radiusTokens.radiusLG,
      titleFontSize: 16,
    },
    Table: {
      headerBg: '#FAFAFA',
      headerColor: colorTokens.colorText,
      rowHoverBg: colorTokens.controlItemBgHover,
      cellPaddingBlock: 12,
      cellPaddingInline: 16,
    },
  },
  cssVar: {
    prefix: 'app',
  },
};
