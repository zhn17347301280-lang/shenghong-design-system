/** 扩展名（小写、不含点）-> 彩色文件类型图标 SVG 文本 */
export declare const fileTypeIcons: Record<string, string>;
/** 根据文件名扩展名取对应彩色文件图标，未命中时返回 undefined。 */
export declare function getFileTypeIcon(fileName: string): string | undefined;
export interface FileTypeIconProps {
    /** 文件名或扩展名，用于匹配对应类型图标 */
    name: string;
    size?: number | string;
    className?: string;
}
/** 渲染与文件扩展名对应的 32px 彩色类型图标。 */
export declare function FileTypeIcon({ name, size, className }: FileTypeIconProps): import("react").JSX.Element | null;
