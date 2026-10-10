import { useState } from 'react';
import { Card, Segmented, Space, Typography } from 'antd';
import { AppSwitch, ChartCard, TopCountSelect, type ChartType } from '../index';

const { Text } = Typography;

/* ------------------------------ 演示数据 ------------------------------ */

const MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
const CATEGORIES = ['智能问数', '知识问答', '智能填报', '文件处理', '报表生成', '数据集成', '流程审批', '预警分析', '指标解读', '模型问答', '文档抽取', '语音交互'];

const singleData = MONTHS.map((label, i) => ({
  label,
  value: [32, 48, 44, 71, 66, 88, 96, 84, 102, 118, 110, 132][i],
}));

const multiPoints = MONTHS.map((label, i) => ({
  label,
  values: [
    [32, 48, 44, 71, 66, 88, 96, 84, 102, 118, 110, 132][i],
    [22, 30, 38, 42, 56, 60, 64, 72, 78, 80, 92, 96][i],
    [12, 18, 20, 26, 30, 34, 40, 38, 46, 52, 58, 64][i],
  ],
}));

const SERIES_NAMES = ['智能问数', '知识问答', '文件处理'];

const donutData = CATEGORIES.slice(0, 5).map((label, i) => ({
  label,
  value: [520, 360, 240, 180, 120][i],
}));

const categoryData = CATEGORIES.map((label, i) => ({
  label,
  value: 1280 - i * 96,
}));

const funnelData = ['访问', '注册', '激活', '留存', '付费'].map((label, i) => ({
  label,
  value: [1000, 720, 480, 260, 120][i],
}));

const rankingData = CATEGORIES.map((name, i) => ({
  category: ['数据智能', '数据智能', '知识管理', '知识管理', '流程协同', '流程协同', '经营分析', '经营分析', '生产运营', '生产运营', '设备管理', '设备管理'][i],
  name,
  value: `${(1280 - i * 96).toLocaleString()} 次`,
  change: [12.5, 8.2, 6.4, -2.1, 15.8, 3.6, -5.2, 9.7, 4.8, 18.3, -1.4, 7.9][i],
}));

const TYPE_OPTIONS: { label: string; value: ChartType }[] = [
  { label: '排行榜', value: 'ranking' },
  { label: '折线图', value: 'line' },
  { label: '基础柱状图', value: 'bar' },
  { label: '基础条形图', value: 'horizontalBar' },
  { label: '多系列柱状图', value: 'groupedBar' },
  { label: '堆叠柱状图', value: 'stackedBar' },
  { label: '多系列条形图', value: 'groupedHorizontalBar' },
  { label: '堆叠条形图', value: 'stackedHorizontalBar' },
  { label: '环形图', value: 'donut' },
  { label: '漏斗图', value: 'funnel' },
];

const TITLES: Record<ChartType, { title: string; subtitle: string }> = {
  ranking: { title: '能力调用排行榜', subtitle: '统计周期：近 30 天' },
  line: { title: '能力调用趋势', subtitle: '单位：万次' },
  bar: { title: '月度调用量', subtitle: '单位：万次' },
  horizontalBar: { title: '能力调用分布', subtitle: '单位：次' },
  groupedBar: { title: '各能力月度调用量', subtitle: '单位：万次' },
  stackedBar: { title: '各能力月度调用量', subtitle: '单位：万次（堆叠）' },
  groupedHorizontalBar: { title: '各能力调用分布', subtitle: '单位：万次' },
  stackedHorizontalBar: { title: '各能力调用分布', subtitle: '单位：万次（堆叠）' },
  donut: { title: '能力调用占比', subtitle: '单位：次' },
  funnel: { title: '用户转化漏斗', subtitle: '单位：人' },
};

export function ChartShowcase() {
  const [type, setType] = useState<ChartType>('bar');
  const [categorical, setCategorical] = useState(false);
  const [count, setCount] = useState(6);
  const [donutCount, setDonutCount] = useState(5);

  const isMulti = ['groupedBar', 'stackedBar', 'groupedHorizontalBar', 'stackedHorizontalBar'].includes(type);
  const isDonut = type === 'donut';

  const heading = TITLES[type];

  return (
    <Space orientation="vertical" size={16} style={{ display: 'flex' }}>
      <Card size="small">
        <Space wrap size={[16, 12]}>
          <span>
            <Text type="secondary" style={{ marginRight: 8 }}>图表类别</Text>
            <Segmented options={TYPE_OPTIONS} value={type} onChange={(value) => setType(value as ChartType)} />
          </span>
          {(isDonut || type === 'funnel' || type === 'horizontalBar') && (
            <span>
              <Text type="secondary" style={{ marginRight: 8 }}>多色模式</Text>
              <AppSwitch checked={categorical} onChange={setCategorical} />
            </span>
          )}
          <TopCountSelect value={count} onChange={setCount} />
        </Space>
      </Card>

      <ChartCard
        key={type}
        title={heading.title}
        subtitle={heading.subtitle}
        type={type}
        data={type === 'bar' || type === 'line' ? singleData : type === 'funnel' ? funnelData : isDonut ? donutData : type === 'horizontalBar' ? categoryData : undefined}
        seriesData={multiPoints}
        seriesNames={isMulti ? SERIES_NAMES : []}
        ranking={rankingData}
        colorMode={categorical ? 'categorical' : 'mono'}
        count={count}
      />

      {isDonut && (
        <Card size="small" styles={{ body: { display: 'flex', justifyContent: 'flex-end' } }}>
          <TopCountSelect value={donutCount} onChange={setDonutCount} max={5} />
        </Card>
      )}
      {isDonut && (
        <ChartCard
          title="能力调用占比（多色）"
          subtitle="单位：次"
          type="donut"
          data={donutData}
          colorMode="categorical"
          count={donutCount}
        />
      )}
    </Space>
  );
}
