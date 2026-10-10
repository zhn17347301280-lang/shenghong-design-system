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
export declare const colorTokens: {
    readonly colorPrimaryBg: '#F0F7FF';
    readonly colorPrimaryBgHover: '#0000000D';
    readonly colorPrimaryBorder: '#E3EFFF';
    readonly colorPrimaryBorderHover: '#BAD6FF';
    readonly colorPrimaryHover: '#91BAFF';
    readonly colorPrimaryBase: '#6495F6';
    readonly colorPrimaryActive: '#4A72CF';
    readonly colorPrimaryTextHover: '#91BAFF';
    readonly colorPrimaryText: '#6495F6';
    readonly colorPrimaryTextActive: '#4A72CF';
    readonly colorSuccessBg: '#f6ffed';
    readonly colorSuccessBgHover: '#d9f7be';
    readonly colorSuccessBorder: '#b7eb8f';
    readonly colorSuccessBorderHover: '#95de64';
    readonly colorSuccessHover: '#73d13d';
    readonly colorSuccessBase: '#52c41a';
    readonly colorSuccessActive: '#389e0d';
    readonly colorSuccessTextHover: '#237804';
    readonly colorSuccessText: '#135200';
    readonly colorSuccessTextActive: '#092b00';
    readonly colorWarningBg: '#fffbe6';
    readonly colorWarningBgHover: '#fff1b8';
    readonly colorWarningBorder: '#ffe58f';
    readonly colorWarningBorderHover: '#ffd666';
    readonly colorWarningHover: '#ffc53d';
    readonly colorWarningBase: '#faad14';
    readonly colorWarningActive: '#d48806';
    readonly colorWarningTextHover: '#ad6800';
    readonly colorWarningText: '#874d00';
    readonly colorWarningTextActive: '#613400';
    readonly colorErrorBg: '#fff1f0';
    readonly colorErrorBgHover: '#ffccc7';
    readonly colorErrorBorder: '#ffa39e';
    readonly colorErrorBorderHover: '#ff7875';
    readonly colorErrorHover: '#ff7875';
    readonly colorErrorBase: '#ff4d4f';
    readonly colorErrorActive: '#cf1322';
    readonly colorErrorTextHover: '#a8071a';
    readonly colorErrorText: '#820014';
    readonly colorErrorTextActive: '#5c0011';
    readonly colorInfoBg: '#e6f4ff';
    readonly colorInfoBgHover: '#bae0ff';
    readonly colorInfoBorder: '#91caff';
    readonly colorInfoBorderHover: '#69b1ff';
    readonly colorInfoHover: '#4096ff';
    readonly colorInfoBase: '#1677ff';
    readonly colorInfoActive: '#0958d9';
    readonly colorInfoTextHover: '#003eb3';
    readonly colorInfoText: '#002c8c';
    readonly colorInfoTextActive: '#001d66';
    readonly colorText: '#000000e0';
    readonly colorTextHeading: '#000000e0';
    readonly colorTextDescription: '#00000073';
    readonly colorTextPlaceholder: '#00000040';
    readonly colorTextDisabled: '#00000040';
    readonly colorIcon: '#00000073';
    readonly colorIconHover: '#000000e0';
    readonly colorBgContainer: '#ffffff';
    readonly colorBgContainerDisabled: '#0000000a';
    readonly colorBgLayout: '#f5f5f5';
    readonly colorBgElevated: '#ffffff';
    readonly controlItemBgHover: '#0000000a';
    readonly controlItemBgActive: '#e6f4ff';
    readonly controlItemBgActiveHover: '#bae0ff';
    readonly colorBorder: '#00000026';
    readonly colorBorderSecondary: '#0000000f';
    readonly colorSplit: '#0000000f';
};
/** 保留原有调用方式；品牌主色对应规范中的 colorPrimaryBase。 */
export declare const brandTokens: {
    readonly colorPrimary: "#6495F6";
};
export type ColorTokenName = keyof typeof colorTokens;
