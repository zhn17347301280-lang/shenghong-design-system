import { LocalIcon } from '../Icon/LocalIcon';

const rawIcons = import.meta.glob('../../icons/svg/file/*.svg', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

function cleanSvg(svg: string) {
  return svg.replace(/<\?xml[\s\S]*?\?>/gi, '').replace(/<!doctype[\s\S]*?>/gi, '');
}

/** 扩展名（小写、不含点）-> 彩色文件类型图标 SVG 文本 */
export const fileTypeIcons: Record<string, string> = Object.fromEntries(
  Object.entries(rawIcons).map(([path, svg]) => {
    const key = path.split('/').pop()?.replace(/\.svg$/i, '').toLowerCase() ?? '';
    return [key, cleanSvg(svg)];
  }),
);

/** 同一图标的不同扩展名别名 */
const extensionAliases: Record<string, string> = {
  xls: 'excel',
  xlsx: 'excel',
  doc: 'word',
  docx: 'word',
  pptx: 'ppt',
  jpg: 'img',
  jpeg: 'img',
  png: 'img',
  gif: 'img',
  webp: 'img',
  markdown: 'md',
  htm: 'html',
};

/** 根据文件名扩展名取对应彩色文件图标，未命中时返回 undefined。 */
export function getFileTypeIcon(fileName: string): string | undefined {
  const ext = fileName.split('.').pop()?.toLowerCase() ?? '';
  return fileTypeIcons[ext] ?? fileTypeIcons[extensionAliases[ext] ?? ''];
}

export interface FileTypeIconProps {
  /** 文件名或扩展名，用于匹配对应类型图标 */
  name: string;
  size?: number | string;
  className?: string;
}

/** 渲染与文件扩展名对应的 32px 彩色类型图标。 */
export function FileTypeIcon({ name, size = 32, className }: FileTypeIconProps) {
  const svg = getFileTypeIcon(name);
  if (!svg) return null;
  return <LocalIcon svg={svg} size={size} className={className} />;
}
