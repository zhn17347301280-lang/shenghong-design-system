import { useState } from 'react';
import { Segmented, Typography } from 'antd';
import linkPdfSvg from '../icons/svg/link-file/link-pdf.svg?raw';
import linkPptSvg from '../icons/svg/link-file/link-ppt.svg?raw';
import { AppSwitch, ChatBubble, LocalIcon, MessageActions, SourceCitation, SourceCitationDetail, getFileTypeIcon, type CitationKind, type CitationRecord } from '../index';

const { Paragraph, Title } = Typography;

export const citationRecords: Record<CitationKind, CitationRecord[]> = {
  knowledge: [
    { id: 'knowledge-1', title: 'PDH工艺操作规程.ppt', source: '个人知识库', segmentCount: 3, excerpt: '本月经营指标整体保持增长。销售额较上月提升 8.4%，主要来自华东区域重点客户的集中采购。' },
    { id: 'knowledge-2', title: 'PDH工艺和安全技术规程.ppt', source: 'xxxx知识库', segmentCount: 2, excerpt: '库存周转天数增加 3.2 天。华东仓部分原料备货高于实际需求，建议先核查未交付订单与安全库存口径。' },
  ],
  web: [
    { id: 'web-1', title: 'PDH企业出路在哪?_中国化工信息周刊', source: '今日头条', brand: 'toutiao', segmentCount: 3, excerpt: '行业需求和区域采购变化带动本月销售增长，重点客户集中采购是主要影响因素。' },
    { id: 'web-2', title: '一种丙烷脱氢与氢甲酰化耦合系统和工艺', source: 'X技术', brand: 'xtech', segmentCount: 2, excerpt: '原料库存水平应结合未交付订单、安全库存和在途物料综合判断。' },
  ],
  case: [
    { id: 'case-1', title: '某公司1申请某公司2房屋租赁合同纠纷.pdf', source: '公开案件', segmentCount: 3, excerpt: '相关案例指出，履约争议需结合合同约定、交付记录和双方确认材料进行核实。' },
    { id: 'case-2', title: '某公司1申请某公司2房屋租赁合同纠纷.pdf', source: '法律法规', segmentCount: 2, excerpt: '处理合同履约争议时，应核对约定期限、交付情况及相应凭证。' },
  ],
};

const citationKindLabels: Record<CitationKind, string> = {
  knowledge: '知识库',
  web: '联网搜索',
  case: '类案检索',
};

export function CitationMarker({ record, selected, onClick, index }: {
  record: CitationRecord;
  selected: boolean;
  onClick: () => void;
  index: number;
}) {
  const fileTypeIcon = getFileTypeIcon(record.title);
  const linkedFileIcon = record.title.toLowerCase().endsWith('.ppt') ? linkPptSvg
    : record.title.toLowerCase().endsWith('.pdf') ? linkPdfSvg : fileTypeIcon;

  return (
    <span className="sh-citation-demo__marker-anchor" data-selected={selected || undefined} data-index={index}>
      <button
        type="button"
        className="sh-citation-demo__inline-marker"
        data-selected={selected || undefined}
        aria-label={`查看引用 ${index + 1}`}
        aria-pressed={selected}
        onClick={onClick}
      >
        {index + 1}
      </button>
      <span className="sh-citation-demo__marker-tooltip" role="tooltip">
        <span className="sh-citation-demo__marker-tooltip-title">
          {linkedFileIcon
            ? <LocalIcon svg={linkedFileIcon} size={16} className="sh-citation-demo__marker-tooltip-icon" />
            : <span className={`sh-citation-demo__marker-brand sh-citation-demo__marker-brand--${record.brand ?? 'xtech'}`}>{record.brand === 'toutiao' ? '头条' : 'X'}</span>}
          <span>{record.title.replace(/\.[^.]+$/, '')}</span>
        </span>
        <span className="sh-citation-demo__marker-tooltip-meta">
          <span>{record.source}</span><span className="sh-citation-demo__marker-tooltip-divider" />
          <span>引用{record.segmentCount ?? 1}个分段</span>
        </span>
      </span>
    </span>
  );
}

export function CitationShowcase() {
  const [kind, setKind] = useState<CitationKind>('knowledge');
  const [expanded, setExpanded] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [componentKind, setComponentKind] = useState<CitationKind>('knowledge');
  const [componentExpanded, setComponentExpanded] = useState(true);
  const [componentSelectedIndex, setComponentSelectedIndex] = useState<number | null>(null);
  const [componentMarkerIndex, setComponentMarkerIndex] = useState<number | null>(null);
  const toggleCitation = (index: number) => setSelectedIndex((current) => current === index ? null : index);
  const selectedRecord = selectedIndex === null ? null : citationRecords[kind][selectedIndex];

  return (
    <div className="sh-citation-demo">
      <section className="sh-citation-demo__preview" aria-label="案例预览">
        <div className="sh-citation-demo__header">
          <span>案例预览 · 对话中的引用</span>
          <span>{citationKindLabels[kind]}</span>
        </div>
        <div className="sh-citation-demo__layout" data-has-detail={selectedRecord !== null || undefined}>
          <div className="sh-citation-demo__conversation">
            <ChatBubble role="user">请分析本月经营指标的变化，并说明需要重点关注的风险。</ChatBubble>
            <div className="sh-citation-demo__answer">
              <ChatBubble role="assistant">
                <span className="sh-citation-demo__sentence" data-highlighted={selectedIndex === 0 || undefined}>
                  本月经营指标整体保持增长。销售额较上月提升 8.4%，主要来自华东区域重点客户的集中采购。
                  <CitationMarker record={citationRecords[kind][0]} selected={selectedIndex === 0} onClick={() => toggleCitation(0)} index={0} />
                </span>
                {' '}
                <span className="sh-citation-demo__sentence" data-highlighted={selectedIndex === 1 || undefined}>
                  库存周转天数增加 3.2 天。华东仓部分原料备货高于实际需求，建议先核查未交付订单与安全库存口径。
                  <CitationMarker record={citationRecords[kind][1]} selected={selectedIndex === 1} onClick={() => toggleCitation(1)} index={1} />
                </span>
                {' '}
                <span>供应链履约率维持在 96.8%，但两家重点供应商存在交付延迟。建议为高风险物料准备替代采购方案。</span>
              </ChatBubble>
              <MessageActions timestamp="2026-09-18 10:36" />
              <SourceCitation
                kind={kind}
                records={citationRecords[kind]}
                expanded={expanded}
                onExpandedChange={setExpanded}
                selectedIndex={selectedIndex}
                onSelect={(_, index) => toggleCitation(index)}
              />
            </div>
          </div>
          {selectedRecord && selectedIndex !== null && <SourceCitationDetail record={selectedRecord} selectedIndex={selectedIndex} recordCount={citationRecords[kind].length} onSelect={setSelectedIndex} onClose={() => setSelectedIndex(null)} />}
        </div>
      </section>

      <div className="sh-citation-demo__standalone">
        <section className="sh-citation-demo__standalone-preview" aria-label="独立组件预览">
          <div className="sh-citation-demo__header">
            <span>独立组件预览</span>
            <span>可分别查看和控制引用标记、来源列表</span>
          </div>
          <div className="sh-citation-demo__component-grid">
            <section className="sh-citation-demo__component-card" aria-label="对话内数字引用标记">
              <div className="sh-citation-demo__component-heading">
                <span>对话内数字标记</span>
                <span>正文引用状态</span>
              </div>
              <div className="sh-citation-demo__marker-stage">
                <p>
                  <span className="sh-citation-demo__sentence" data-highlighted={componentMarkerIndex === 0 || undefined}>
                    本月经营指标整体保持增长，销售额较上月提升 8.4%，主要来自华东区域重点客户的集中采购。
                    <CitationMarker
                      record={citationRecords[componentKind][0]}
                      selected={componentMarkerIndex === 0}
                      onClick={() => setComponentMarkerIndex((current) => current === 0 ? null : 0)}
                      index={0}
                    />
                  </span>
                </p>
                <p>
                  <span className="sh-citation-demo__sentence" data-highlighted={componentMarkerIndex === 1 || undefined}>
                    库存周转天数增加 3.2 天，建议先核查未交付订单与安全库存口径。
                    <CitationMarker
                      record={citationRecords[componentKind][1]}
                      selected={componentMarkerIndex === 1}
                      onClick={() => setComponentMarkerIndex((current) => current === 1 ? null : 1)}
                      index={1}
                    />
                  </span>
                </p>
              </div>
            </section>
            <section className="sh-citation-demo__component-card" aria-label="引用来源列表">
              <div className="sh-citation-demo__component-heading">
                <span>引用来源列表</span>
                <span>列表 hover 可预览间距</span>
              </div>
              <div className="sh-citation-demo__source-stage">
                <SourceCitation
                  kind={componentKind}
                  records={citationRecords[componentKind]}
                  expanded={componentExpanded}
                  onExpandedChange={setComponentExpanded}
                  selectedIndex={componentSelectedIndex}
                  onSelect={(_, index) => setComponentSelectedIndex((current) => current === index ? null : index)}
                />
              </div>
            </section>
          </div>
        </section>

        <aside className="sh-citation-demo__controls" aria-label="独立组件状态切换">
          <div>
            <Title level={4}>组件状态切换</Title>
            <Paragraph type="secondary">下方控制只影响对应的独立组件；上方案例可直接点击交互。</Paragraph>
          </div>
          <div className="sh-citation-demo__control-group">
            <span className="sh-citation-demo__control-label">引用类型</span>
            <Segmented
              block
              size="small"
              value={componentKind}
              options={(['knowledge', 'web', 'case'] as const).map((value) => ({ value, label: citationKindLabels[value] }))}
              onChange={(value) => {
                setComponentKind(value as CitationKind);
                setComponentSelectedIndex(null);
                setComponentMarkerIndex(null);
              }}
            />
          </div>
          <div className="sh-citation-demo__control-group">
            <span className="sh-citation-demo__control-label">数字标记</span>
            <Paragraph type="secondary">点击预览中的编号，在未选中与选中状态间切换。</Paragraph>
          </div>
          <div className="sh-citation-demo__control-group">
            <span className="sh-citation-demo__control-label">来源列表</span>
            <div className="sh-citation-demo__switch-row">
              <Paragraph type="secondary">{componentExpanded ? '显示来源记录' : '隐藏来源记录'}</Paragraph>
              <AppSwitch
                size="small"
                checked={componentExpanded}
                checkedChildren="展开"
                unCheckedChildren="收起"
                onChange={setComponentExpanded}
              />
            </div>
            <Paragraph type="secondary">点击来源记录切换选中状态；再次点击可取消。</Paragraph>
          </div>
        </aside>
      </div>
    </div>
  );
}
