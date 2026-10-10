import { useState } from 'react';
import { Typography } from 'antd';
import { AppButton, SmartFeedCard, SmartFeedDetailPage, SmartFeedHeader, type SmartFeedConfirmationKind, type SmartFeedStatus } from '../index';

type FeedFilter = 'all' | 'pending' | 'unread' | 'running';
type FeedItem = { id: string; status: SmartFeedStatus; reminder: boolean; title: string; hasResults?: boolean; resultNames?: string[] };

const filters: Array<{ key: FeedFilter; label: string }> = [
  { key: 'all', label: '全部(23)' },
  { key: 'pending', label: '待处理(2)' },
  { key: 'unread', label: '待查看(2)' },
  { key: 'running', label: '进行中(2)' },
];

const allCards: FeedItem[] = [
  { id: 'complete-reminder', status: 'complete', reminder: true, title: '任务Summary' },
  { id: 'failed-reminder', status: 'failed', reminder: true, title: '任务Summary', resultNames: ['审批结果'] },
  { id: 'complete-normal-1', status: 'complete', reminder: false, title: '任务Summary' },
  { id: 'complete-normal-2', status: 'complete', reminder: false, title: '任务Summary' },
  { id: 'pending-reminder', status: 'pending', reminder: true, title: '任务Summary', hasResults: false },
  { id: 'running-reminder', status: 'running', reminder: true, title: '任务Summary', hasResults: false },
  { id: 'stopped-normal', status: 'stopped', reminder: false, title: '任务Summary', resultNames: ['智能填报结果'] },
  { id: 'complete-normal-3', status: 'complete', reminder: false, title: '任务Summary' },
];

const filterCards: Record<Exclude<FeedFilter, 'all'>, FeedItem[]> = {
  pending: [
    { id: 'pending-1', status: 'pending', reminder: true, title: '任务Summary', hasResults: false },
    { id: 'pending-2', status: 'pending', reminder: true, title: '任务Summary', hasResults: false },
    { id: 'pending-3', status: 'pending', reminder: true, title: '任务Summary', resultNames: ['智能填报结果'] },
    { id: 'pending-4', status: 'pending', reminder: true, title: '任务Summary', hasResults: false },
  ],
  unread: [
    { id: 'unread-1', status: 'complete', reminder: true, title: '任务Summary' },
    { id: 'unread-2', status: 'complete', reminder: true, title: '任务Summary', hasResults: false },
    { id: 'unread-3', status: 'complete', reminder: true, title: '任务Summary' },
    { id: 'unread-4', status: 'complete', reminder: true, title: '任务Summary', hasResults: false },
  ],
  running: [
    { id: 'running-1', status: 'running', reminder: true, title: '任务Summary', hasResults: false },
    { id: 'running-2', status: 'running', reminder: true, title: '任务Summary', hasResults: false },
    { id: 'running-3', status: 'running', reminder: true, title: '任务Summary', hasResults: false },
    { id: 'running-4', status: 'running', reminder: true, title: '任务Summary', hasResults: false },
  ],
};

export function SmartFeedPageTab() {
  const [filter, setFilter] = useState<FeedFilter>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<FeedItem | null>(null);
  const [confirmationKind, setConfirmationKind] = useState<SmartFeedConfirmationKind>('dialog');
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState('');
  const source = filter === 'all' ? allCards : filterCards[filter];
  const cards = source.filter((item) => !removedIds.includes(item.id) && item.title.toLowerCase().includes(search.trim().toLowerCase()));
  const midpoint = Math.ceil(cards.length / 2);

  const renderCard = (item: FeedItem) => <SmartFeedCard
    key={item.id}
    title={item.title}
    status={item.status}
    reminder={item.reminder}
    hasResults={item.hasResults}
    resultNames={item.resultNames}
    onMore={(key) => {
      if (key === 'detail') setSelected(item);
      if (key === 'remove') setRemovedIds((current) => [...current, item.id]);
    }}
    onAction={(action, value) => {
      if (action === 'detail' || action === 'progress' || action === 'confirm' || action === 'result') setSelected(item);
      if (action === 'stop') setSelected({ ...item, status: 'stopped' });
      if (action === 'retry') setSelected({ ...item, status: 'running' });
      if (action === 'result') setFeedback(`已选择结果文件：${value}`);
    }}
    onDiscuss={() => setFeedback('已进入该任务的讨论')}
  />;

  return (
    <div className="sh-smart-feed-page-catalog">
      <div className="sh-smart-feed-page-demo">
        <section className="sh-smart-feed-page-demo__preview" aria-label="SmartFeed 整页预览">
          <div className="sh-smart-feed-demo__preview-header"><span>整页交互预览</span><span>{selected ? '任务详情' : filters.find((item) => item.key === filter)?.label}</span></div>
          <div className="sh-smart-feed-page-demo__stage">
            {selected ? <SmartFeedDetailPage status={selected.status} confirmationKind={confirmationKind} onClose={() => setSelected(null)} onStatusChange={(status) => setSelected((current) => current ? { ...current, status } : null)} /> : (
              <div className="sh-smart-feed-page">
                <SmartFeedHeader search={search} onSearchChange={setSearch} />
                <div className="sh-smart-feed-page__body">
                  <div className="sh-smart-feed-page__filters" role="group" aria-label="任务筛选">
                    {filters.map((item) => <AppButton key={item.key} type="default" size="small" className={filter === item.key ? 'is-active' : ''} data-filter={item.key} aria-pressed={filter === item.key} onClick={() => setFilter(item.key)}>{item.key !== 'all' && <span className="sh-smart-feed-page__filter-dot" aria-hidden="true" />}{item.label}</AppButton>)}
                  </div>
                  <div className="sh-smart-feed-page__columns">
                    <div>{cards.slice(0, midpoint).map(renderCard)}</div>
                    <div>{cards.slice(midpoint).map(renderCard)}</div>
                  </div>
                  {cards.length === 0 && <div className="sh-smart-feed-page__empty">没有匹配的任务</div>}
                </div>
              </div>
            )}
          </div>
          <span className="sh-smart-feed-page-demo__feedback" role="status" aria-live="polite">{feedback}</span>
        </section>
        <aside className="sh-smart-feed-demo__controls" aria-label="SmartFeed 页面控制">
          <div><Typography.Title level={4}>页面控制</Typography.Title><Typography.Paragraph type="secondary">切换页面筛选；点击卡片中的详情、进度、结果或待确认按钮可进入详情。</Typography.Paragraph></div>
          <fieldset className="sh-smart-feed-demo__group"><legend>任务筛选</legend><div className="sh-smart-feed-demo__buttons">{filters.map((item) => <AppButton key={item.key} size="small" type={filter === item.key ? 'primary' : 'default'} onClick={() => { setSelected(null); setFilter(item.key); }}>{item.label}</AppButton>)}</div></fieldset>
          <fieldset className="sh-smart-feed-demo__group"><legend>详情页面</legend><div className="sh-smart-feed-demo__buttons"><AppButton size="small" disabled={!selected} onClick={() => setSelected(null)}>返回列表</AppButton><AppButton size="small" onClick={() => setSelected(allCards[0])}>查看详情</AppButton></div></fieldset>
          <fieldset className="sh-smart-feed-demo__group"><legend>待确认类型</legend><div className="sh-smart-feed-demo__buttons"><AppButton size="small" type={confirmationKind === 'dialog' ? 'primary' : 'default'} onClick={() => { setConfirmationKind('dialog'); setSelected(allCards[4]); }}>文字 / 选项</AppButton><AppButton size="small" type={confirmationKind === 'form' ? 'primary' : 'default'} onClick={() => { setConfirmationKind('form'); setSelected(allCards[4]); }}>表单</AppButton></div></fieldset>
          <AppButton size="small" onClick={() => { setRemovedIds([]); setSearch(''); setSelected(null); setFilter('all'); setFeedback(''); }}>重置页面</AppButton>
        </aside>
      </div>
    </div>
  );
}
