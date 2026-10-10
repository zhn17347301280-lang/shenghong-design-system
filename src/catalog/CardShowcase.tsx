import { useState } from 'react';
import { Flex, Tabs, Typography } from 'antd';
import { AppButton, EntityCard, LocalIcon, MetricCard, OptionCard, ReportCard, StatusTag } from '../index';
import type { MetricCardStatus, MetricTrendDirection } from '../index';
import hintIconSvg from '../icons/svg/通用-问号提示.svg?raw';
import downloadIconSvg from '../icons/svg/通用-下载.svg?raw';
import entityIconSvg from '../icons/svg/企业智能平台-OntoForge-企业、本体.svg?raw';

const { Paragraph, Text, Title } = Typography;

const states: Array<{ label: string; status: MetricCardStatus }> = [
  { label: '普通', status: 'normal' },
  { label: '数据缺失', status: 'data-missing' },
  { label: '同环比缺失', status: 'comparison-missing' },
  { label: '加载', status: 'loading' },
];

function DownloadAction() {
  return <LocalIcon svg={downloadIconSvg} size={16} label="下载" />;
}

function ReportExample({ isNew, hasTag, selected, onSelectedChange }: { isNew: boolean; hasTag: boolean; selected: boolean; onSelectedChange: (value: boolean) => void }) {
  return (
    <ReportCard
      title="经营指标分析报告"
      isNew={isNew}
      tag={hasTag ? <span className="sh-report-card__type">经营分析</span> : undefined}
      date="2026-09-18 12:20"
      description="基于当期经营数据，提供核心指标变化、问题定位及决策建议。"
      meta="企业经营  |  创建人 A"
      actions={<DownloadAction />}
      selectable
      selected={selected}
      onSelectedChange={onSelectedChange}
    />
  );
}

export function CardShowcase() {
  const [metricCount, setMetricCount] = useState<1 | 2>(1);
  const [metricStatus, setMetricStatus] = useState<MetricCardStatus>('normal');
  const [trendDirection, setTrendDirection] = useState<MetricTrendDirection>('up');
  const [reportIsNew, setReportIsNew] = useState(true);
  const [reportHasTag, setReportHasTag] = useState(true);
  const [reportSelected, setReportSelected] = useState(false);
  const [optionSelected, setOptionSelected] = useState(false);
  const hint = <LocalIcon svg={hintIconSvg} size={16} label="指标说明" />;
  const statusLabel = states.find(({ status }) => status === metricStatus)?.label ?? '普通';
  const isUp = trendDirection === 'up';
  const doubleMetrics = [
    { value: '4,520', unit: '万元', yearOnYear: `${isUp ? '↑' : '↓'} 12.5%`, monthOnMonth: `${isUp ? '↑' : '↓'} 8.6%`, trendDirection },
    { value: '4,520', unit: '万元', yearOnYear: `${isUp ? '↑' : '↓'} 10.8%`, monthOnMonth: `${isUp ? '↑' : '↓'} 6.2%`, trendDirection },
  ];

  const metricPanel = (
    <section className="card-showcase__group">
      <div className="card-showcase__heading"><strong>指标卡</strong><span>数量、数据状态与涨跌方向分层控制；正常状态可点击选中</span></div>
      <div className="metric-card-showcase">
        <article className="metric-card-showcase__preview">
          <Text className="metric-card-showcase__label">交互预览 · {metricCount} 个指标 · {statusLabel} · {isUp ? '上涨' : '下跌'}</Text>
          <MetricCard
            key={`${metricCount}-${metricStatus}`}
            selectable={metricStatus === 'normal'}
            title="智能问数"
            value="4,520"
            unit="万元"
            yearOnYear={`${isUp ? '↑' : '↓'} 12.5%`}
            monthOnMonth={`${isUp ? '↑' : '↓'} 8.6%`}
            trendDirection={trendDirection}
            metrics={metricCount === 2 ? doubleMetrics : undefined}
            hint={hint}
            status={metricStatus}
          />
        </article>

        <aside className="metric-card-showcase__controls" aria-label="指标卡状态控制">
          <div>
            <Title level={4}>状态控制</Title>
            <Paragraph type="secondary">按层级选择卡片结构、数据状态和涨跌方向。</Paragraph>
          </div>
          <div className="metric-card-showcase__control-group">
            <Text strong>1. 指标数量</Text>
            <Flex wrap gap={8}>
              <AppButton aria-pressed={metricCount === 1} type={metricCount === 1 ? 'primary' : 'default'} onClick={() => setMetricCount(1)}>1 个指标</AppButton>
              <AppButton aria-pressed={metricCount === 2} type={metricCount === 2 ? 'primary' : 'default'} onClick={() => setMetricCount(2)}>2 个指标</AppButton>
            </Flex>
          </div>
          <div className="metric-card-showcase__control-group">
            <Text strong>2. 数据状态</Text>
            <Flex wrap gap={8}>
              {states.map(({ label, status }) => (
                <AppButton aria-pressed={metricStatus === status} key={status} type={metricStatus === status ? 'primary' : 'default'} onClick={() => setMetricStatus(status)}>{label}</AppButton>
              ))}
            </Flex>
          </div>
          <div className="metric-card-showcase__control-group">
            <Text strong>3. 涨跌方向</Text>
            <Flex wrap gap={8}>
              <AppButton aria-pressed={trendDirection === 'up'} type={trendDirection === 'up' ? 'primary' : 'default'} onClick={() => setTrendDirection('up')}>上涨</AppButton>
              <AppButton aria-pressed={trendDirection === 'down'} danger={trendDirection === 'down'} type={trendDirection === 'down' ? 'primary' : 'default'} onClick={() => setTrendDirection('down')}>下跌</AppButton>
            </Flex>
          </div>
        </aside>
      </div>
    </section>
  );

  const reportPanel = (
    <section className="card-showcase__group">
      <div className="card-showcase__heading"><strong>报告卡片</strong><span>NEW 与标签组合为四种状态；点击卡片切换选中，Hover 为更浅的描边</span></div>
      <div className="metric-card-showcase report-card-showcase">
        <article className="metric-card-showcase__preview">
          <Text className="metric-card-showcase__label">交互预览 · {reportIsNew ? 'NEW' : '无 NEW'} · {reportHasTag ? '有标签' : '无标签'} · {reportSelected ? '选中' : '未选中'}</Text>
          <ReportExample isNew={reportIsNew} hasTag={reportHasTag} selected={reportSelected} onSelectedChange={setReportSelected} />
        </article>
        <aside className="metric-card-showcase__controls" aria-label="报告卡片状态控制">
          <div>
            <Title level={4}>状态控制</Title>
            <Paragraph type="secondary">默认显示 NEW + 有标签，通过两层按钮组合四种状态；直接点击左侧卡片可在未选中 / 选中之间切换。</Paragraph>
          </div>
          <div className="metric-card-showcase__control-group">
            <Text strong>1. NEW 状态</Text>
            <Flex wrap gap={8}>
              <AppButton aria-pressed={reportIsNew} type={reportIsNew ? 'primary' : 'default'} onClick={() => setReportIsNew(true)}>有 NEW</AppButton>
              <AppButton aria-pressed={!reportIsNew} type={!reportIsNew ? 'primary' : 'default'} onClick={() => setReportIsNew(false)}>无 NEW</AppButton>
            </Flex>
          </div>
          <div className="metric-card-showcase__control-group">
            <Text strong>2. 标签状态</Text>
            <Flex wrap gap={8}>
              <AppButton aria-pressed={reportHasTag} type={reportHasTag ? 'primary' : 'default'} onClick={() => setReportHasTag(true)}>有标签</AppButton>
              <AppButton aria-pressed={!reportHasTag} type={!reportHasTag ? 'primary' : 'default'} onClick={() => setReportHasTag(false)}>无标签</AppButton>
            </Flex>
          </div>
        </aside>
      </div>
    </section>
  );

  const entityPanel = (
    <section className="card-showcase__group">
      <div className="card-showcase__heading"><strong>本体卡片</strong><span>273 × 140，24px 内边距，浅灰渐变填充</span></div>
      <EntityCard icon={<LocalIcon svg={entityIconSvg} size={16} />} />
    </section>
  );

  const optionPanel = (
    <section className="card-showcase__group">
      <div className="card-showcase__heading"><strong>卡片选项</strong><span>点击卡片切换选中态，交互一致、仅状态描边不同</span></div>
      <div className="card-showcase__option-list">
        <OptionCard
          title="经营报告"
          description="卡片选项"
          badge={<StatusTag tone="error">待处理</StatusTag>}
          selectable
          selected={optionSelected}
          onSelectedChange={setOptionSelected}
        />
      </div>
    </section>
  );

  return (
    <div className="card-showcase">
      <Tabs
        className="card-type-tabs"
        defaultActiveKey="metric"
        destroyOnHidden
        items={[
          { key: 'metric', label: '指标卡', children: metricPanel },
          { key: 'report', label: '报告卡片', children: reportPanel },
          { key: 'entity', label: '本体卡片', children: entityPanel },
          { key: 'option', label: '卡片选项', children: optionPanel },
        ]}
      />
    </div>
  );
}
