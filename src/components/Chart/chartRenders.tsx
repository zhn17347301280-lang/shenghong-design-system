import { useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { chartTokens } from '../../theme/foundations';
import { LocalIcon } from '../Icon/LocalIcon';
import goldTrophySvg from '../../icons/svg/ranking/排行榜-冠军.svg?raw';
import silverTrophySvg from '../../icons/svg/ranking/排行榜-亚军.svg?raw';
import bronzeTrophySvg from '../../icons/svg/ranking/排行榜-季军.svg?raw';
import type { ChartDatum, ChartSeriesPoint, RankingItem, TooltipState } from './types';

/* ------------------------------------------------------------------ */
/* 共用布局 token                                                       */
/* ------------------------------------------------------------------ */

const VIEW_W = 452;
const VIEW_H = 258;
const M = { top: 16, right: 12, bottom: 30, left: 40 };
const PLOT_W = VIEW_W - M.left - M.right;
const PLOT_H = VIEW_H - M.top - M.bottom;
const BAR_R = 6;

const TEXT_FILL = chartTokens.axis;
const GRID = chartTokens.grid;

function nodeText(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  return '';
}

/** 计算「整齐」的坐标轴最大值，按 1 / 2 / 2.5 / 5 × 10ⁿ 进位。 */
function niceMax(rawMax: number): number {
  const max = Math.max(rawMax, 1);
  const mag = 10 ** Math.floor(Math.log10(max));
  const norm = max / mag;
  const step = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10;
  return step * mag;
}

function formatTick(v: number): string {
  if (v >= 10000) return `${v / 10000}万`;
  return String(v);
}

/** 仅顶部圆角的柱形 path。 */
function roundedTopRect(x: number, y: number, w: number, h: number, r: number): string {
  const rr = Math.min(r, w / 2, h);
  return `M ${x} ${y + h} L ${x} ${y + rr} Q ${x} ${y} ${x + rr} ${y} L ${x + w - rr} ${y} Q ${x + w} ${y} ${x + w} ${y + rr} L ${x + w} ${y + h} Z`;
}

/** 将 SVG viewBox 坐标转换为相对浏览器视口的像素坐标。 */
function svgPointToClient(svg: SVGSVGElement | null, x: number, y: number): { x: number; y: number } {
  if (!svg) return { x: 0, y: 0 };
  const pt = svg.createSVGPoint();
  pt.x = x;
  pt.y = y;
  const ctm = svg.getScreenCTM();
  if (!ctm) return { x: 0, y: 0 };
  const mapped = pt.matrixTransform(ctm);
  return { x: mapped.x, y: mapped.y };
}

const TOOLTIP_GAP = 10;
const TOOLTIP_MARGIN = 8;

interface TooltipPos {
  left: number;
  top: number;
  placement: 'top' | 'bottom';
  arrowLeft: number;
}

/**
 * BI 风格数据提示：以 fixed 浮层渲染到 body，锚点为数据元素（柱顶 / 折线点 / 扇区），
 * 自动根据视口边缘决定出现在锚点上方还是下方，并用小箭头指向数据点；
 * 滚动 / 缩放时实时跟随数据点位置。
 */
function Tooltip({ tip, svgRef }: { tip: TooltipState | null; svgRef?: React.RefObject<SVGSVGElement | null> }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<TooltipPos | null>(null);

  useLayoutEffect(() => {
    if (!tip) {
      setPos(null);
      return;
    }
    const compute = () => {
      const box = boxRef.current;
      // 有 svgRef 时 tip 坐标为 SVG viewBox 坐标，需实时转换（滚动 / 缩放跟随）；否则直接视为视口坐标。
      const anchor = svgRef ? svgPointToClient(svgRef.current, tip.x, tip.y) : { x: tip.x, y: tip.y };
      if (!box) return;
      const rect = box.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const aboveTop = anchor.y - TOOLTIP_GAP - rect.height;
      const belowTop = anchor.y + TOOLTIP_GAP;
      const placement: TooltipPos['placement'] =
        aboveTop >= TOOLTIP_MARGIN || belowTop + rect.height > vh - TOOLTIP_MARGIN ? 'top' : 'bottom';

      const rawLeft = anchor.x - rect.width / 2;
      const left = Math.max(TOOLTIP_MARGIN, Math.min(rawLeft, vw - rect.width - TOOLTIP_MARGIN));
      const top = placement === 'top' ? aboveTop : belowTop;
      const arrowLeft = Math.max(12, Math.min(anchor.x - left, rect.width - 12));

      setPos({ left, top, placement, arrowLeft });
    };
    compute();
    if (svgRef) {
      window.addEventListener('scroll', compute, true);
      window.addEventListener('resize', compute);
      return () => {
        window.removeEventListener('scroll', compute, true);
        window.removeEventListener('resize', compute);
      };
    }
  }, [tip, svgRef]);

  if (!tip) return null;

  return createPortal(
    <div
      ref={boxRef}
      className={`sh-chart-tooltip sh-chart-tooltip--${pos?.placement ?? 'top'}`}
      style={{ left: pos?.left ?? -9999, top: pos?.top ?? -9999, visibility: pos ? 'visible' : 'hidden' }}
    >
      <div className="sh-chart-tooltip__title">{tip.title}</div>
      {tip.rows.map((row, i) => (
        <div className="sh-chart-tooltip__row" key={i}>
          <span className="sh-chart-tooltip__dot" style={{ background: row.color }} />
          <span className="sh-chart-tooltip__name">{row.name}</span>
          <span className="sh-chart-tooltip__value">{row.value}</span>
        </div>
      ))}
      <span className="sh-chart-tooltip__arrow" style={{ left: pos?.arrowLeft }} />
    </div>,
    document.body,
  );
}

/* ------------------------------------------------------------------ */
/* 直角坐标系（柱状 / 多系列柱 / 折线）共用网格与坐标轴                  */
/* ------------------------------------------------------------------ */

interface CartesianSpec {
  categories: ReactNode[];
  series: { name: ReactNode; values: number[]; color: string }[];
  top: number;
  band: number;
  xAt: (i: number) => number;
  yAt: (v: number) => number;
}

function useCartesian(
  categories: ReactNode[],
  series: { name: ReactNode; values: number[]; color: string }[],
): CartesianSpec {
  return useMemo(() => {
    const top = niceMax(Math.max(1, ...series.flatMap((s) => s.values)));
    const n = Math.max(categories.length, 1);
    const band = PLOT_W / n;
    return {
      categories,
      series,
      top,
      band,
      xAt: (i) => M.left + band * (i + 0.5),
      yAt: (v) => M.top + PLOT_H * (1 - v / top),
    };
  }, [categories, series]);
}

function GridLayer({ spec }: { spec: CartesianSpec }) {
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * spec.top);
  return (
    <g>
      {ticks.map((t, i) => {
        const y = M.top + PLOT_H * (1 - t / spec.top);
        return (
          <g key={i}>
            <line x1={M.left} x2={VIEW_W - M.right} y1={y} y2={y} stroke={GRID} strokeWidth={1} />
            <text x={M.left - 8} y={y + 4} textAnchor="end" fontSize={12} fill={TEXT_FILL}>
              {formatTick(t)}
            </text>
          </g>
        );
      })}
      {spec.categories.map((label, i) => (
        <text key={i} x={spec.xAt(i)} y={VIEW_H - 10} textAnchor="middle" fontSize={12} fill={TEXT_FILL}>
          {label}
        </text>
      ))}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* 基础柱状图                                                           */
/* ------------------------------------------------------------------ */

export function BarChart({ data }: { data: ChartDatum[] }) {
  const spec = useCartesian(
    data.map((d) => d.label),
    [{ name: '', values: data.map((d) => d.value), color: chartTokens.primary }],
  );
  const svgRef = useRef<SVGSVGElement>(null);
  const [tip, setTip] = useState<TooltipState | null>(null);
  const barW = Math.min(24, spec.band * 0.5);

  return (
    <div className="sh-chart-plot">
      <svg ref={svgRef} viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="sh-chart-svg" role="img">
        <GridLayer spec={spec} />
        {data.map((d, i) => {
          const h = Math.max((d.value / spec.top) * PLOT_H, d.value > 0 ? 3 : 0);
          const x = spec.xAt(i) - barW / 2;
          const y = M.top + PLOT_H - h;
          return (
            <path
              key={i}
              d={roundedTopRect(x, y, barW, h, BAR_R)}
              fill={chartTokens.primary}
              className="sh-chart-bar"
              onMouseEnter={() =>
                setTip({ x: spec.xAt(i), y, title: d.label, rows: [{ name: '数值', value: d.value, color: chartTokens.primary }] })
              }
              onMouseLeave={() => setTip(null)}
            />
          );
        })}
      </svg>
      <Tooltip tip={tip} svgRef={svgRef} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 多系列柱状图（分组 / 堆叠）                                          */
/* ------------------------------------------------------------------ */

export function GroupedBarChart({ points, names, colors, stacked }: {
  points: ChartSeriesPoint[];
  names: ReactNode[];
  colors: string[];
  stacked?: boolean;
}) {
  const series = names.map((name, s) => ({
    name,
    color: colors[s],
    values: points.map((p) => p.values[s] ?? 0),
  }));
  const categories = points.map((p) => p.label);
  const totals = points.map((p) => p.values.reduce((a, b) => a + (b || 0), 0));
  const spec = useCartesian(categories, stacked ? [{ name: '', values: totals, color: colors[0] }, ...series] : series);
  const svgRef = useRef<SVGSVGElement>(null);
  const [tip, setTip] = useState<TooltipState | null>(null);

  const count = series.length;
  const slotW = Math.min(18, (spec.band * 0.62) / Math.max(count, 1));
  const groupW = slotW * count + (count - 1) * 4;

  const showTip = (i: number) => {
    const p = points[i];
    const anchorValue = stacked ? totals[i] : Math.max(0, ...p.values);
    const py = M.top + PLOT_H - (anchorValue / spec.top) * PLOT_H;
    setTip({
      x: spec.xAt(i),
      y: py,
      title: p.label,
      rows: series.map((s, si) => ({ name: s.name, value: p.values[si] ?? 0, color: s.color })),
    });
  };

  return (
    <div className="sh-chart-plot">
      <svg ref={svgRef} viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="sh-chart-svg" role="img">
        <GridLayer spec={spec} />
        {points.map((p, i) => {
          const cx = spec.xAt(i);
          if (stacked) {
            let acc = 0;
            return (
              <g key={i} onMouseEnter={() => showTip(i)} onMouseLeave={() => setTip(null)}>
                {series.map((s, si) => {
                  const v = p.values[si] ?? 0;
                  const h = (v / spec.top) * PLOT_H;
                  const y = M.top + PLOT_H - ((acc + v) / spec.top) * PLOT_H;
                  acc += v;
                  const isTop = si === series.length - 1;
                  return (
                    <path
                      key={si}
                      d={roundedTopRect(cx - slotW / 2, y, slotW, h, isTop ? BAR_R : 0)}
                      fill={s.color}
                      className="sh-chart-bar"
                    />
                  );
                })}
              </g>
            );
          }
          return (
            <g key={i} onMouseEnter={() => showTip(i)} onMouseLeave={() => setTip(null)}>
              {series.map((s, si) => {
                const v = p.values[si] ?? 0;
                const h = Math.max((v / spec.top) * PLOT_H, v > 0 ? 3 : 0);
                const x = cx - groupW / 2 + si * (slotW + 4);
                const y = M.top + PLOT_H - h;
                return <path key={si} d={roundedTopRect(x, y, slotW, h, BAR_R)} fill={s.color} className="sh-chart-bar" />;
              })}
            </g>
          );
        })}
      </svg>
      <Tooltip tip={tip} svgRef={svgRef} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 折线图（单线 / 多线）                                                */
/* ------------------------------------------------------------------ */

export function LineChart({ points, names, colors }: {
  points: ChartSeriesPoint[];
  names: ReactNode[];
  colors: string[];
}) {
  const series = names.map((name, s) => ({
    name,
    color: colors[s],
    values: points.map((p) => p.values[s] ?? 0),
  }));
  const spec = useCartesian(points.map((p) => p.label), series);
  const svgRef = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState<number | null>(null);

  const single = series.length === 1;
  const lineOf = (values: number[]) => values.map((v, i) => `${i === 0 ? 'M' : 'L'} ${spec.xAt(i)} ${spec.yAt(v)}`).join(' ');
  const areaOf = (values: number[]) =>
    `${lineOf(values)} L ${spec.xAt(values.length - 1)} ${M.top + PLOT_H} L ${spec.xAt(0)} ${M.top + PLOT_H} Z`;

  // hover 锚点：取该列最高数据点（y 值最小），提示框出现在折线点附近
  const anchor =
    active !== null
      ? (() => {
          const topValue = Math.max(...series.map((s) => s.values[active] ?? 0));
          return { x: spec.xAt(active), y: spec.yAt(topValue) };
        })()
      : null;

  return (
    <div className="sh-chart-plot">
      <svg ref={svgRef} viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="sh-chart-svg" role="img">
        <defs>
            <linearGradient id="sh-line-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartTokens.primary} stopOpacity={0.18} />
              <stop offset="100%" stopColor={chartTokens.primary} stopOpacity={0} />
            </linearGradient>
        </defs>
        <GridLayer spec={spec} />
        {single && <path d={areaOf(series[0].values)} fill="url(#sh-line-area)" />}
        {series.map((s, si) => (
          <path key={si} d={lineOf(s.values)} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        ))}
        {/* hover 感应列 */}
        {points.map((p, i) => (
          <rect
            key={i}
            x={spec.xAt(i) - spec.band / 2}
            y={M.top}
            width={spec.band}
            height={PLOT_H}
            fill="transparent"
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
          />
        ))}
        {active !== null && (
          <line x1={spec.xAt(active)} x2={spec.xAt(active)} y1={M.top} y2={M.top + PLOT_H} stroke={chartTokens.primary} strokeWidth={1} strokeDasharray="4 3" />
        )}
        {series.map((s, si) =>
          s.values.map((v, i) => (
            <circle
              key={`${si}-${i}`}
              cx={spec.xAt(i)}
              cy={spec.yAt(v)}
              r={active === i ? 4.5 : 3.5}
              fill="#fff"
              stroke={s.color}
              strokeWidth={2}
              pointerEvents="none"
            />
          )),
        )}
      </svg>
      {active !== null && anchor && (
        <Tooltip
          svgRef={svgRef}
          tip={{
            x: anchor.x,
            y: anchor.y,
            title: points[active].label,
            rows: series.map((s) => ({ name: nodeText(s.name) || '数值', value: s.values[active], color: s.color })),
          }}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 基础条形图（HTML 实现，对齐设计稿：标签 + 轨道 + 数值）               */
/* ------------------------------------------------------------------ */

export function HorizontalBarChart({ data, colors }: { data: ChartDatum[]; colors: string[] }) {
  const top = niceMax(Math.max(1, ...data.map((d) => d.value)));
  const [tip, setTip] = useState<TooltipState | null>(null);
  return (
    <div className="sh-chart-plot sh-hbar" onMouseLeave={() => setTip(null)}>
      {data.map((d, i) => (
        <div
          className="sh-hbar__row"
          key={i}
          onMouseEnter={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setTip({ x: r.left + r.width / 2, y: r.top, title: d.label, rows: [{ name: '数值', value: d.value, color: colors[i % colors.length] }] });
          }}
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setTip({ x: e.clientX, y: r.top, title: d.label, rows: [{ name: '数值', value: d.value, color: colors[i % colors.length] }] });
          }}
        >
          <span className="sh-hbar__label">{d.label}</span>
          <div className="sh-hbar__track">
            <div className="sh-hbar__fill" style={{ width: `${Math.max((d.value / top) * 100, d.value > 0 ? 2 : 0)}%`, background: colors[i % colors.length] }} />
          </div>
          <span className="sh-hbar__value">{d.value}</span>
        </div>
      ))}
      <Tooltip tip={tip} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 多系列条形图（分组）                                                  */
/* ------------------------------------------------------------------ */

export function GroupedHorizontalBarChart({ points, names, colors, stacked }: {
  points: ChartSeriesPoint[];
  names: ReactNode[];
  colors: string[];
  stacked?: boolean;
}) {
  const maxTotal = Math.max(1, ...points.map((p) => (stacked ? p.values.reduce((a, b) => a + (b || 0), 0) : Math.max(...p.values))));
  const top = niceMax(maxTotal);
  return (
    <div className="sh-chart-plot sh-hbar sh-hbar--group">
      {points.map((p, i) => (
        <div className="sh-hbar__row" key={i}>
          <span className="sh-hbar__label">{p.label}</span>
          <div className={`sh-hbar__track sh-hbar__track--${stacked ? 'stack' : 'group'}`}>
            {p.values.map((v, si) => (
              <div
                key={si}
                className="sh-hbar__seg"
                title={`${nodeText(names[si]) || '数值'}：${v}`}
                style={{ width: `${(v / top) * 100}%`, background: colors[si] }}
              />
            ))}
          </div>
          <span className="sh-hbar__value">{p.values.reduce((a, b) => a + (b || 0), 0)}</span>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 环形图                                                               */
/* ------------------------------------------------------------------ */

function arcPath(cx: number, cy: number, rOuter: number, rInner: number, start: number, end: number): string {
  const large = end - start > Math.PI ? 1 : 0;
  const so = [cx + rOuter * Math.sin(start), cy - rOuter * Math.cos(start)];
  const eo = [cx + rOuter * Math.sin(end), cy - rOuter * Math.cos(end)];
  const si = [cx + rInner * Math.sin(end), cy - rInner * Math.cos(end)];
  const ei = [cx + rInner * Math.sin(start), cy - rInner * Math.cos(start)];
  return [
    `M ${so[0]} ${so[1]}`,
    `A ${rOuter} ${rOuter} 0 ${large} 1 ${eo[0]} ${eo[1]}`,
    `L ${si[0]} ${si[1]}`,
    `A ${rInner} ${rInner} 0 ${large} 0 ${ei[0]} ${ei[1]}`,
    'Z',
  ].join(' ');
}

export function DonutChart({ data, colors, unit }: { data: ChartDatum[]; colors: string[]; unit?: ReactNode }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [tip, setTip] = useState<TooltipState | null>(null);
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  const cx = 96;
  const cy = 96;
  const rOuter = 92;
  const rInner = 58;
  const gap = 0.025; // 扇区间隙（弧度）
  let angle = -Math.PI / 2;
  const arcs = data.map((d, i) => {
    const sweep = (d.value / total) * Math.PI * 2;
    const start = angle + gap / 2;
    const end = angle + sweep - gap / 2;
    angle += sweep;
    return { d, i, start, end, color: colors[i % colors.length] };
  });

  const tipFor = (i: number, anchorX: number, anchorY: number) => {
    const d = data[i];
    setTip({
      x: anchorX,
      y: anchorY,
      title: d.label,
      rows: [{ name: '占比', value: `${d.value}（${((d.value / total) * 100).toFixed(1)}%）`, color: colors[i % colors.length] }],
    });
  };

  return (
    <div className="sh-chart-plot sh-donut">
      <svg ref={svgRef} viewBox="0 0 192 192" className="sh-donut__svg" role="img">
        {arcs.map(({ d, i, start, end, color }) => {
          const mid = (start + end) / 2;
          return (
            <path
              key={i}
              d={arcPath(cx, cy, rOuter, rInner, start, Math.max(end, start + 0.002))}
              fill={color}
              className="sh-donut__arc"
              data-active={active === i || undefined}
              onMouseEnter={() => {
                setActive(i);
                const p = svgPointToClient(svgRef.current, cx + rOuter * Math.sin(mid), cy - rOuter * Math.cos(mid));
                tipFor(i, p.x, p.y);
              }}
              onMouseLeave={() => {
                setActive(null);
                setTip(null);
              }}
            />
          );
        })}
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize={12} fill={TEXT_FILL}>
          {active === null ? '总计' : nodeText(data[active].label) || '数值'}
        </text>
        <text x={cx} y={cy + 18} textAnchor="middle" fontSize={22} fontWeight={600} fill={chartTokens.title}>
          {active === null ? total : data[active].value}
        </text>
        {unit && (
          <text x={cx} y={cy + 36} textAnchor="middle" fontSize={12} fill={TEXT_FILL}>
            {nodeText(unit).replace(/^单位[:：]/, '')}
          </text>
        )}
      </svg>
      <ul className="sh-donut__legend">
        {data.map((d, i) => (
          <li
            key={i}
            className="sh-donut__legend-item"
            data-active={active === i || undefined}
            onMouseEnter={(e) => {
              setActive(i);
              const r = e.currentTarget.getBoundingClientRect();
              tipFor(i, r.left + r.width / 2, r.top);
            }}
            onMouseLeave={() => {
              setActive(null);
              setTip(null);
            }}
          >
            <span className="sh-donut__legend-dot" style={{ background: colors[i % colors.length] }} />
            <span className="sh-donut__legend-name">{d.label}</span>
            <span className="sh-donut__legend-value">{d.value}</span>
            <span className="sh-donut__legend-percent">{((d.value / total) * 100).toFixed(1)}%</span>
          </li>
        ))}
      </ul>
      <Tooltip tip={tip} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 漏斗图                                                               */
/* ------------------------------------------------------------------ */

export function FunnelChart({ data, colors }: { data: ChartDatum[]; colors: string[] }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const rowH = 40;
  const gap = 8;
  const height = data.length * rowH + (data.length - 1) * gap;
  const halfAt = (ratio: number) => (ratio * (VIEW_W - 140)) / 2;

  return (
    <div className="sh-chart-plot sh-funnel">
      <svg viewBox={`0 0 ${VIEW_W} ${height}`} width="100%" role="img">
        {data.map((d, i) => {
          const topRatio = i === 0 ? 1 : data[i - 1].value / max;
          const ratio = d.value / max;
          const y = i * (rowH + gap);
          const topHalf = halfAt(Math.max(topRatio, 0.06));
          const bottomHalf = halfAt(Math.max(ratio, 0.06));
          const cx = (VIEW_W - 120) / 2;
          const path = [
            `M ${cx - topHalf} ${y}`,
            `L ${cx + topHalf} ${y}`,
            `L ${cx + bottomHalf} ${y + rowH}`,
            `L ${cx - bottomHalf} ${y + rowH}`,
            'Z',
          ].join(' ');
          return (
            <g key={i}>
              <path d={path} fill={colors[i % colors.length]} className="sh-funnel__layer" />
              <text x={cx} y={y + rowH / 2 + 4} textAnchor="middle" fontSize={14} fontWeight={600} fill="#fff">
                {d.label}
              </text>
              <text x={VIEW_W - 8} y={y + rowH / 2 + 4} textAnchor="end" fontSize={12} fill={TEXT_FILL}>
                {d.value}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 排行榜                                                               */
/* ------------------------------------------------------------------ */

/** 前三名奖杯：金 / 银 / 铜，与图标库 ranking 目录一致。 */
const TROPHY_SVGS = [goldTrophySvg, silverTrophySvg, bronzeTrophySvg];

function RankMedal({ index }: { index: number }) {
  if (index < 3) {
    return <LocalIcon className="sh-ranking__trophy" svg={TROPHY_SVGS[index]} size={22} />;
  }
  return <em>{index + 1}</em>;
}

export function RankingChart({ data }: { data: RankingItem[] }) {
  return (
    <div className="sh-chart-plot sh-ranking">
      <div className="sh-ranking__head">
        <span>大类</span>
        <span>小类</span>
        <span className="sh-ranking__num">计量</span>
        <span className="sh-ranking__num">环比</span>
      </div>
      <ul className="sh-ranking__body">
        {data.map((item, i) => {
          const change = item.change ?? 0;
          return (
            <li className="sh-ranking__row" key={i}>
              <span className="sh-ranking__rank">
                <RankMedal index={i} />
                <span className="sh-ranking__category">{item.category}</span>
              </span>
              <span className="sh-ranking__name">{item.name}</span>
              <span className="sh-ranking__num sh-ranking__value">{item.value}</span>
              <span className="sh-ranking__num" data-direction={change > 0 ? 'up' : change < 0 ? 'down' : 'flat'}>
                {change > 0 ? '↑' : change < 0 ? '↓' : '—'} {Math.abs(change)}%
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
