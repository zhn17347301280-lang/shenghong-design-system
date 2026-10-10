import { useMemo, useState } from 'react';
import { Input, Progress, Tabs } from 'antd';
import { LocalIcon } from '../Icon/LocalIcon';
import searchIconSvg from '../../icons/svg/通用-搜索.svg?raw';

const rankingRows = [
  { name: '生产管理部', count: 3280, change: 18.4 },
  { name: '技术研发部', count: 2560, change: 8.4 },
  { name: '市场营销部', count: 1710, change: 8.4 },
  { name: '人力资源部', count: 1150, change: -8.4 },
  { name: '财务部', count: 720, change: 8.4 },
  { name: '销售部', count: 720, change: 8.4 },
];

const dimensions = ['使用人数', '使用次数', '人均使用次数', '员工覆盖率'];

export function RankingContent() {
  const [dimension, setDimension] = useState('使用人数');
  const [query, setQuery] = useState('');
  const rows = useMemo(() => rankingRows.filter((row) => row.name.includes(query)), [query]);

  return (
    <div className="sh-ranking-dialog">
      <Tabs
        activeKey={dimension}
        className="sh-ranking-dialog__tabs"
        items={dimensions.map((item) => ({ key: item, label: item }))}
        onChange={setDimension}
        size="large"
      />
      <Input allowClear aria-label="搜索部门" placeholder="请输入部门名称" suffix={<LocalIcon svg={searchIconSvg} size={16} />} value={query} onChange={(event) => setQuery(event.target.value)} />
      <div className="sh-ranking-dialog__header" aria-hidden="true">
        <span>排行</span><span>部门名称</span><span>{dimension}</span><span>环比变化</span>
      </div>
      <ol className="sh-ranking-dialog__list">
        {rows.map((row, index) => (
          <li key={row.name}>
            <span className={`sh-ranking-dialog__rank sh-ranking-dialog__rank--${index + 1}`}>{index + 1}</span>
            <strong>{row.name}</strong>
            <span className="sh-ranking-dialog__metric">
              <Progress percent={(row.count / 3280) * 100} showInfo={false} size={[150, 6]} strokeColor="#6495F6" railColor="#F0F0F0" />
              <span>{row.count.toLocaleString('zh-CN')}人</span>
            </span>
            <span className={row.change >= 0 ? 'is-up' : 'is-down'}>{row.change >= 0 ? '较上月 ↑' : '较上月 ↓'} {Math.abs(row.change)}%</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
