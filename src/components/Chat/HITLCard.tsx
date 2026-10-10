import { useState } from 'react';
import { Button, Flex, Input, Segmented, Tabs, Tag, TimePicker, Typography } from 'antd';
import dayjs from 'dayjs';
import { HITLDialogConfirmation, HITLFormConfirmation, type HITLDialogKind, type HITLDialogStage, type HITLFormStage } from './HITLConfirmationCard';
import { LocalIcon } from '../Icon/LocalIcon';
import resultFileIconSvg from '../../icons/svg/link-file/link-txt.svg?raw';

const { Paragraph, Text, Title } = Typography;

type Count = 'single' | 'multiple';

const kinds: Array<{ id: HITLDialogKind; label: string }> = [
  { id: 'multi-input', label: '多选 + 输入框' },
  { id: 'radio', label: '单选' },
  { id: 'radio-input', label: '单选 + 输入框' },
  { id: 'input', label: '输入框' },
];
const stageNames: Record<HITLDialogStage, string> = { before: '提交前', during: '输入中', after: '提交后' };

export function HITLCard() {
  const [activeType, setActiveType] = useState('dialog');
  const [kind, setKind] = useState<HITLDialogKind>('radio-input');
  const [stage, setStage] = useState<HITLDialogStage>('before');
  const [count, setCount] = useState<Count>('single');
  const chooseKind = (value: HITLDialogKind) => {
    setKind(value);
    if (value === 'radio' && stage === 'during') setStage('before');
  };

  const dialogDemo = (
    <div className="metric-card-showcase sh-hitl-demo">
      <article className="metric-card-showcase__preview sh-hitl-demo__preview" aria-label="交互预览">
        <Text className="metric-card-showcase__label">交互预览 · {kinds.find((item) => item.id === kind)?.label} · {stageNames[stage]} · {count === 'single' ? '单个' : '多个'}</Text>
        <div className="sh-hitl-demo__card-stage">
          <HITLDialogConfirmation key={`${kind}-${count}`} kind={kind} stage={stage} count={count} onSubmit={() => setStage('after')} onStop={() => setStage('after')} />
        </div>
      </article>
      <aside className="metric-card-showcase__controls sh-hitl-demo__controls" aria-label="HITL 卡片状态控制">
        <div>
          <Title level={4}>状态控制</Title>
          <Paragraph type="secondary">通过按钮切换卡片类型、提交阶段和确认项数量。</Paragraph>
        </div>
        <div className="metric-card-showcase__control-group">
          <Text strong>1. 卡片类型</Text>
          <Flex wrap gap={8}>{kinds.map((option) => <Button key={option.id} aria-pressed={kind === option.id} type={kind === option.id ? 'primary' : 'default'} onClick={() => chooseKind(option.id)}>{option.label}</Button>)}</Flex>
        </div>
        <div className="metric-card-showcase__control-group">
          <Text strong>2. 状态阶段</Text>
          <Flex wrap gap={8}>{(Object.keys(stageNames) as HITLDialogStage[]).filter((value) => value !== 'during' || kind !== 'radio').map((value) => <Button key={value} aria-pressed={stage === value} type={stage === value ? 'primary' : 'default'} onClick={() => setStage(value)}>{stageNames[value]}</Button>)}</Flex>
        </div>
        <div className="metric-card-showcase__control-group">
          <Text strong>3. 确认项数量</Text>
          <Flex wrap gap={8}>{(['single', 'multiple'] as Count[]).map((value) => <Button key={value} aria-pressed={count === value} type={count === value ? 'primary' : 'default'} onClick={() => setCount(value)}>{value === 'single' ? '单个' : '多个'}</Button>)}</Flex>
        </div>
        <Text type="secondary">共 22 种组合</Text>
      </aside>
    </div>
  );

  return <section className="sh-hitl-type-switch">
    <Tabs activeKey={activeType} onChange={setActiveType} items={[
      { key: 'dialog', label: '对话修改', children: dialogDemo },
      { key: 'form', label: '表单修改', children: <FormHITLDemo /> },
      { key: 'schedule', label: '定时任务', children: <ScheduleTaskDemo /> },
    ]} />
  </section>;
}

function FormHITLDemo() {
  const [stage, setStage] = useState<HITLFormStage>('draft');

  return <div className="metric-card-showcase sh-hitl-demo">
    <article className="metric-card-showcase__preview sh-hitl-demo__preview" aria-label="表单修改卡片预览">
      <Text className="metric-card-showcase__label">交互预览 · 表单修改 · {stage === 'draft' ? '提交前' : stage === 'complete' ? '填写完成' : '提交后'}</Text>
      <div className="sh-hitl-demo__card-stage">
        <HITLFormConfirmation stage={stage} onSubmit={() => setStage('submitted')} />
      </div>
    </article>
    <aside className="metric-card-showcase__controls sh-hitl-demo__controls" aria-label="表单卡片状态控制">
      <div><Title level={4}>状态控制</Title><Paragraph type="secondary">切换表单填写状态，查看提交前、填写完成与提交后的卡片表现。</Paragraph></div>
      <div className="metric-card-showcase__control-group">
        <Text strong>1. 表单状态</Text>
        <Flex wrap gap={8}>
          {([{ value: 'draft', label: '提交前' }, { value: 'complete', label: '填写完成' }, { value: 'submitted', label: '提交后' }] as const).map(({ value, label }) => <Button key={value} type={stage === value ? 'primary' : 'default'} aria-pressed={stage === value} onClick={() => setStage(value)}>{label}</Button>)}
        </Flex>
      </div>
    </aside>
  </div>;
}

type ScheduleKind = 'create' | 'view' | 'history' | 'edit' | 'delete';
type ScheduleStage = 'before' | 'after';

const scheduleKinds: Array<{ value: ScheduleKind; label: string }> = [
  { value: 'create', label: '创建定时任务' },
  { value: 'view', label: '查看定时任务' },
  { value: 'history', label: '执行历史' },
  { value: 'edit', label: '修改定时任务' },
  { value: 'delete', label: '删除定时任务' },
];

function ScheduleTaskDemo() {
  const [kind, setKind] = useState<ScheduleKind>('create');
  const [stage, setStage] = useState<ScheduleStage>('before');
  const [frequency, setFrequency] = useState('每天');
  const isCreate = kind === 'create';
  const canChangeStage = kind === 'create' || kind === 'edit' || kind === 'delete';
  const confirmed = stage === 'after';

  const createCard = <article className={`sh-hitl-schedule-card ${confirmed ? 'is-confirmed' : ''}`}>
    <div className="sh-hitl-schedule-card__header"><span className="sh-hitl-schedule-card__clock" aria-hidden="true" /><span>创建定时任务</span></div>
    <div className="sh-hitl-schedule-card__body">
      <div className="sh-hitl-schedule-card__field">
        <label><i>*</i>任务名称：</label>
        {confirmed ? <span>原油日报定时任务</span> : <div><Input aria-label="任务名称" placeholder="原油日报定时任务" maxLength={50} /><small>0/50</small></div>}
      </div>
      <div className="sh-hitl-schedule-card__field sh-hitl-schedule-card__command">
        <label><i>*</i>执行指令：</label>
        {confirmed ? <p>获取今日华东与山东市场纯苯现货价格（参考 <Tag color="blue">@原油收盘价</Tag>），分析价格走势与影响因素，按照 <Tag color="blue">@化工行情日报模板</Tag> 生成完整市场行情日报，输出标准 Markdown 格式。</p> : <div className="sh-hitl-schedule-card__command-input"><div>获取今日华东与山东市场纯苯现货价格（参考 <Tag color="blue">@原油收盘价</Tag>），分析价格走势与影响因素，按照 <Tag color="blue">@化工行情日报模板</Tag> 生成完整市场行情日报，输出标准 Markdown 格式。</div><small>0/1000</small></div>}
      </div>
      <div className="sh-hitl-schedule-card__field sh-hitl-schedule-card__frequency">
        <label><i>*</i>重复频率：</label>
        <div><Segmented block options={['每天', '每周', '每月']} value={frequency} onChange={(value) => setFrequency(String(value))} /><div className="sh-hitl-schedule-card__time"><TimePicker defaultValue={dayjs('14:09', 'HH:mm')} format="HH:mm" minuteStep={1} /><span>在{frequency}的 14：09 重复</span></div></div>
      </div>
    </div>
    <div className="sh-hitl-schedule-card__footer">{confirmed ? <><Button disabled>取消</Button><Button disabled>试运行</Button><Button type="primary" disabled>确认创建</Button></> : <><Button>取消</Button><Button>试运行</Button><Button type="primary" onClick={() => setStage('after')}>确认创建</Button></>}</div>
  </article>;

  const simpleCard = kind === 'delete' ? <article className="sh-hitl-schedule-card sh-hitl-schedule-card--simple">
    <div className="sh-hitl-schedule-card__header"><span className="sh-hitl-schedule-card__clock" aria-hidden="true" /><span>删除定时任务</span></div>
    <div className="sh-hitl-schedule-card__message">确认删除定时任务：「<a>原油日报定时任务</a>」吗，删除后将不可恢复。</div>
    <div className="sh-hitl-schedule-card__footer">{confirmed ? <><Button disabled>取消</Button><Button type="primary" disabled>确认删除</Button></> : <><Button>取消</Button><Button type="primary" onClick={() => setStage('after')}>确认删除</Button></>}</div>
  </article> : kind === 'view' ? <article className="sh-hitl-schedule-card sh-hitl-schedule-card--simple">
    <div className="sh-hitl-schedule-card__header"><span className="sh-hitl-schedule-card__clock" aria-hidden="true" /><span>查看定时任务</span></div>
    <div className="sh-hitl-schedule-card__view"><strong>原油日报定时任务 <Tag color="green">已启用</Tag></strong><p>获取今日华东与山东市场纯苯现货价格（参考 <Tag color="blue">@原油收盘价</Tag>），按照 <Tag color="blue">@化工行情日报模板</Tag> 生成完整市场行情日报，输出标准 Markdown 格式。</p><div><span>重复频率</span><b>每天 14:09</b><span>下次执行</span><b>2026-04-21 14:09</b></div></div>
    <div className="sh-hitl-schedule-card__footer"><Button>关闭</Button><Button type="primary">编辑</Button></div>
  </article> : <article className="sh-hitl-schedule-card sh-hitl-schedule-card--history">
    <div className="sh-hitl-schedule-card__header"><span className="sh-hitl-schedule-card__clock" aria-hidden="true" /><span>执行历史</span></div>
    <div className="sh-hitl-schedule-card__history-body">
      <div className="sh-hitl-schedule-card__task-summary">
        <div className="sh-hitl-schedule-card__task-title">化工市场行情日报(纯苯) <Tag color="green">已启用</Tag></div>
        <p>每日获取纯苯价格并生成日报，发送至 SmartFeed</p>
        <div className="sh-hitl-schedule-card__stats">{[['重复频率','每天 8：00'],['下次执行','2026-04-21 08:00'],['超时时间','10分钟'],['失败重试','1 次']].map(([label, value], index) => <div className={index < 3 ? 'has-divider' : ''} key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
      </div>
      <strong className="sh-hitl-schedule-card__history-title">执行历史</strong>
      <div className="sh-hitl-schedule-card__table">
        <div className="sh-hitl-schedule-card__table-head"><span>执行时间</span><span>状态</span><span>重试次数</span><span>结果摘要</span><span>结果文件</span></div>
        {[
          { status: 'running', label: '执行中', retry: '重试 1次', summary: '纯苯市场行情日报.2026-04-20/今日华东地区纯苯现货价格较昨日小幅回升至7,250元/吨(+120)，主要受下游苯乙烯装置开工率提升带动..' },
          { status: 'failed', label: '失败', retry: '-', summary: '数据源「原油收盘价」连通性校验失败(HTTP403)，1次重试后仍失败，执行终止' },
          { status: 'success', label: '成功', retry: '重试 2次', summary: '纯苯市场行情日报.2026-04-19/今日华东纯苯现货价格持稳于7,130元/吨，市场整体观望情绪较浓，下游采购节奏放缓...' },
        ].map((row) => <div className="sh-hitl-schedule-card__table-row" key={row.status}>
          <span>2025-11-12 12:20:20</span>
          <span className={`sh-hitl-schedule-card__status is-${row.status}`}><i />{row.label}</span>
          <span>{row.retry}</span>
          <span className={`sh-hitl-schedule-card__summary is-${row.status}`}>{row.summary}</span>
          <span className="sh-hitl-schedule-card__file"><LocalIcon svg={resultFileIconSvg} size={16} />营销部周报模板</span>
        </div>)}
      </div>
    </div>
  </article>;

  const editCard = <article className="sh-hitl-schedule-card sh-hitl-schedule-card--edit">
    <div className="sh-hitl-schedule-card__header"><span className="sh-hitl-schedule-card__clock" aria-hidden="true" /><span>修改定时任务</span></div>
    <div className="sh-hitl-schedule-card__edit-grid"><div><strong>修改前</strong><label>原任务名称</label><Input disabled value="原油日报定时任务" /><label>原执行指令</label><Input.TextArea disabled value="获取今日华东与山东市场纯苯现货价格，分析走势，生成完整日报。" autoSize={{ minRows: 3, maxRows: 4 }} /><label>原重复频率</label><Segmented block disabled options={['每天', '每周', '每月']} value="每天" /><Input disabled value="14:09" /></div><div><strong>修改后</strong><label>新任务名称</label>{confirmed ? <p>原油日报定时任务</p> : <Input defaultValue="原油日报定时任务" />}<label>新执行指令</label>{confirmed ? <p>获取今日华东与山东市场纯苯现货价格（参考 @原油收盘价），按照 @化工行情日报模板生成完整市场行情日报。</p> : <Input.TextArea defaultValue="获取今日华东与山东市场纯苯现货价格（参考 @原油收盘价），分析价格走势与影响因素，按照 @化工行情日报模板生成完整市场行情日报，输出标准 Markdown 格式。" autoSize={{ minRows: 3, maxRows: 4 }} />}<label>新重复频率</label>{confirmed ? <p>每天 14:09 重复</p> : <><Segmented block options={['每天', '每周', '每月']} defaultValue="每天" /><TimePicker defaultValue={dayjs('14:09', 'HH:mm')} format="HH:mm" /></>}</div></div>
    <div className="sh-hitl-schedule-card__footer">{confirmed ? <><Button disabled>取消</Button><Button type="primary" disabled>确认更新</Button></> : <><Button>取消</Button><Button type="primary" onClick={() => setStage('after')}>确认更新</Button></>}</div>
  </article>;

  return <div className="metric-card-showcase sh-hitl-demo">
    <article className="metric-card-showcase__preview sh-hitl-demo__preview" aria-label="定时任务卡片预览">
      <Text className="metric-card-showcase__label">交互预览 · {scheduleKinds.find((item) => item.value === kind)?.label}{canChangeStage ? ` · ${confirmed ? '确认后' : '确认前'}` : ''}</Text>
      <div className="sh-hitl-demo__card-stage">{isCreate ? createCard : kind === 'edit' ? editCard : simpleCard}</div>
    </article>
    <aside className="metric-card-showcase__controls sh-hitl-demo__controls" aria-label="定时任务卡片状态控制">
      <div><Title level={4}>状态控制</Title><Paragraph type="secondary">切换定时任务卡片类型与确认状态。</Paragraph></div>
      <div className="metric-card-showcase__control-group"><Text strong>1. 卡片类型</Text><Flex wrap gap={8}>{scheduleKinds.map((item) => <Button key={item.value} type={kind === item.value ? 'primary' : 'default'} aria-pressed={kind === item.value} onClick={() => { setKind(item.value); setStage('before'); }}>{item.label}</Button>)}</Flex></div>
      {canChangeStage && <div className="metric-card-showcase__control-group"><Text strong>2. 状态阶段</Text><Flex wrap gap={8}>{([{ value: 'before', label: '确认前' }, { value: 'after', label: '确认后' }] as const).map((item) => <Button key={item.value} type={stage === item.value ? 'primary' : 'default'} aria-pressed={stage === item.value} onClick={() => setStage(item.value)}>{item.label}</Button>)}</Flex></div>}
    </aside>
  </div>;
}
