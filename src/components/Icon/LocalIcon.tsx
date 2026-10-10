import { useId, useMemo, type CSSProperties } from 'react';

export interface LocalIconProps {
  /** 来自组件库 src/icons/svg 的 SVG 源文本。 */
  svg: string;
  label?: string;
  size?: number | string;
  className?: string;
}

function namespaceSvgIds(svg: string, namespace: string) {
  const ids = new Map(
    [...svg.matchAll(/\bid=(["'])([^"']+)\1/g)].map((match) => [match[2], `${namespace}-${match[2]}`]),
  );
  if (ids.size === 0) return svg;

  return svg
    .replace(/\bid=(["'])([^"']+)\1/g, (match, quote: string, id: string) => ids.has(id) ? `id=${quote}${ids.get(id)}${quote}` : match)
    .replace(/url\(#([^)]+)\)/g, (match, id: string) => ids.has(id) ? `url(#${ids.get(id)})` : match)
    .replace(/\b((?:xlink:)?href)=(["'])#([^"']+)\2/g, (match, attribute: string, quote: string, id: string) => ids.has(id) ? `${attribute}=${quote}#${ids.get(id)}${quote}` : match);
}

/** 渲染本地 SVG；单色图标通过 currentColor 跟随按钮文字颜色。 */
export function LocalIcon({ svg, label, size = '1em', className }: LocalIconProps) {
  const instanceId = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const uniqueSvg = useMemo(() => namespaceSvgIds(svg, `sh-icon-${instanceId}`), [svg, instanceId]);
  const style = { '--sh-local-icon-size': typeof size === 'number' ? `${size}px` : size } as CSSProperties;

  return (
    <span
      aria-hidden={label ? undefined : true}
      aria-label={label}
      className={['sh-local-icon', className].filter(Boolean).join(' ')}
      role={label ? 'img' : undefined}
      style={style}
      dangerouslySetInnerHTML={{ __html: uniqueSvg }}
    />
  );
}
