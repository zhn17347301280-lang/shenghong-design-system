export interface LocalIconProps {
    /** 来自组件库 src/icons/svg 的 SVG 源文本。 */
    svg: string;
    label?: string;
    size?: number | string;
    className?: string;
}
/** 渲染本地 SVG；单色图标通过 currentColor 跟随按钮文字颜色。 */
export declare function LocalIcon({ svg, label, size, className }: LocalIconProps): import("react").JSX.Element;
