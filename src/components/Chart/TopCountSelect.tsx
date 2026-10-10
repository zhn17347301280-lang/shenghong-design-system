import { Select } from 'antd';

export interface TopCountSelectProps {
  /** 当前展示条数。 */
  value: number;
  /** 条数变化回调。 */
  onChange: (count: number) => void;
  /** 可选最小值，默认 1。 */
  min?: number;
  /** 可选最大值，默认 10。 */
  max?: number;
  /** 前缀文案，默认「显示」。 */
  label?: string;
  /** 后缀单位，默认「条」。 */
  suffix?: string;
}

/** Top N 数量选择器：放在图表卡片外部，下拉选择展示前 N 条数据（默认 1-10）。 */
export function TopCountSelect({ value, onChange, min = 1, max = 10, label = '显示', suffix = '条' }: TopCountSelectProps) {
  const options = [];
  for (let i = min; i <= max; i += 1) {
    options.push({ value: i, label: `${i} ${suffix}` });
  }
  return (
    <span className="sh-top-count">
      {label && <span className="sh-top-count__label">{label}</span>}
      <Select
        className="sh-top-count__select"
        size="small"
        value={value}
        options={options}
        onChange={onChange}
        getPopupContainer={(trigger) => trigger.parentElement ?? document.body}
      />
    </span>
  );
}
