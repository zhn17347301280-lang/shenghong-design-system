/** MasterGo 设计规范中除颜色之外的基础设计变量。 */
export declare const typographyTokens: {
    readonly fontFamilyLabel: 'Ant Design 系统字体栈（macOS：San Francisco / SF Pro）';
    readonly fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
    readonly fontSize: 14;
    readonly fontSizeSM: 12;
    readonly fontSizeLG: 16;
    readonly fontSizeHeading1: 38;
    readonly fontSizeHeading2: 30;
    readonly fontSizeHeading3: 24;
    readonly lineHeight: 1.5715;
    readonly lineHeightSM: 1.6667;
    readonly lineHeightHeading: 1.32;
};
export declare const spacingTokens: {
    readonly spaceXXS: 4;
    readonly spaceXS: 8;
    readonly spaceSM: 12;
    readonly spaceMD: 16;
    readonly spaceLG: 24;
    readonly spaceXL: 32;
    readonly spaceXXL: 48;
};
export declare const radiusTokens: {
    readonly radiusSM: 4;
    readonly radiusMD: 6;
    readonly radiusLG: 8;
    readonly radiusXL: 12;
};
export declare const shadowTokens: {
    readonly shadowCard: '0 1px 2px rgba(0, 0, 0, 0.03), 0 4px 12px rgba(0, 0, 0, 0.04)';
    readonly shadowPopover: '0 6px 16px rgba(0, 0, 0, 0.08), 0 3px 6px rgba(0, 0, 0, 0.05)';
    readonly shadowModal: '0 12px 36px rgba(0, 0, 0, 0.14)';
};
export declare const motionTokens: {
    readonly motionFast: '120ms';
    readonly motionBase: '200ms';
    readonly motionSlow: '300ms';
    readonly easingStandard: 'cubic-bezier(0.2, 0, 0, 1)';
};
/**
 * Chart 图表 token，来源：MasterGo《设计规范》/ Chart图表（组件集 158:109693）
 * - primary：柱/条/单线主色 #6495F6
 * - categorical：多色板（多系列、多色单系列循环取色）
 * - blueScale：单色模式下的蓝色阶梯，多系列按系列取色，深 → 浅
 * - donutMonoScale：环形图单色模式由深到浅的扇区色
 */
export declare const chartTokens: {
    readonly primary: '#6495F6';
    readonly categorical: readonly ['#6495F6', '#5FE7E7', '#9564F6', '#64F695', '#F664F6', '#95F664'];
    readonly blueScale: readonly ['#2D63D9', '#4579EA', '#6495F6', '#7AA5F8', '#A8C7FC', '#C9DDFF'];
    readonly donutMonoScale: readonly ['#2D63D9', '#4579EA', '#6495F6', '#7AA5F8', '#A8C7FC'];
    readonly sequentialBlue: readonly ['#F4F8FF', '#D2E3FE', '#A8C7FC', '#7AA5F8', '#4579EA'];
    readonly title: '#243044';
    readonly axis: '#6B778C';
    readonly grid: '#E7EDF6';
    readonly border: '#DFE8F9';
    readonly cardRadius: 16;
    readonly tooltipShadow: '0 3px 8px rgba(0,0,0,0.16)';
};
