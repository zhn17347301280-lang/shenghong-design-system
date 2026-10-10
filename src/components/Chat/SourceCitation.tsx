import { useId, useState, type ReactNode } from 'react';
import { Button } from 'antd';
import { LocalIcon } from '../Icon/LocalIcon';
import linkPptSvg from '../../icons/svg/link-file/link-ppt.svg?raw';
import linkPdfSvg from '../../icons/svg/link-file/link-pdf.svg?raw';
import linkWordSvg from '../../icons/svg/link-file/link-word.svg?raw';

export type CitationKind = 'knowledge' | 'web' | 'case';

export interface CitationRecord {
  id: string;
  title: string;
  source: string;
  excerpt?: string;
  segmentCount?: number;
  /** 网站来源可传入站点标识；传入 icon 时优先使用自定义图标。 */
  brand?: 'toutiao' | 'xtech';
  icon?: ReactNode;
}

export interface SourceCitationProps {
  kind: CitationKind;
  records: CitationRecord[];
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  selectedIndex?: number | null;
  defaultSelectedIndex?: number;
  onSelect?: (record: CitationRecord, index: number) => void;
}

function RecordIcon({ kind, record }: { kind: CitationKind; record: CitationRecord }) {
  if (record.icon) return <span className="sh-source-citation__record-icon">{record.icon}</span>;
  if (kind === 'web') {
    return <span className={`sh-source-citation__brand sh-source-citation__brand--${record.brand ?? 'xtech'}`}>{record.brand === 'toutiao' ? '头条' : 'X'}</span>;
  }
  const fileIcon = record.title.toLowerCase().endsWith('.ppt') ? linkPptSvg
    : record.title.toLowerCase().endsWith('.doc') ? linkWordSvg : linkPdfSvg;
  return <LocalIcon svg={fileIcon} size={16} className="sh-source-citation__record-icon" />;
}

export function SourceCitation({
  kind,
  records,
  expanded,
  defaultExpanded = false,
  onExpandedChange,
  selectedIndex,
  defaultSelectedIndex = 0,
  onSelect,
}: SourceCitationProps) {
  const listId = useId();
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const [internalSelectedIndex, setInternalSelectedIndex] = useState(defaultSelectedIndex);
  const isExpanded = expanded ?? internalExpanded;
  const activeIndex = selectedIndex === undefined ? internalSelectedIndex : selectedIndex;
  const summary = kind === 'knowledge' ? `引用内部知识库的${records.length}个资料作为参考`
    : kind === 'web' ? `引用外部网站的${records.length}个资料作为参考`
      : '检索到以下相关案件及法条';

  const toggleExpanded = () => {
    const next = !isExpanded;
    if (expanded === undefined) setInternalExpanded(next);
    onExpandedChange?.(next);
  };

  return (
    <div className="sh-source-citation" data-kind={kind} data-expanded={isExpanded}>
      <Button type="text" className="sh-source-citation__toggle" aria-expanded={isExpanded} aria-controls={listId} onClick={toggleExpanded}>
        <span>{summary}</span>
        <span className="sh-source-citation__chevron" aria-hidden="true" />
      </Button>
      {isExpanded && (
        <div className="sh-source-citation__records" id={listId}>
          {records.map((record, index) => {
            const selected = activeIndex === index;
            return (
              <Button
                type="text"
                className="sh-source-citation__record"
                key={record.id}
                aria-pressed={selected}
                title={`${record.title} · ${record.source}`}
                onClick={() => {
                  if (selectedIndex === undefined) setInternalSelectedIndex(index);
                  onSelect?.(record, index);
                }}
              >
                <span className="sh-source-citation__index" data-selected={selected || undefined}>{index + 1}</span>
                <RecordIcon kind={kind} record={record} />
                <span className="sh-source-citation__title">{record.title}</span>
                <span className="sh-source-citation__source">{record.source}</span>
                {selected && <span className="sh-source-citation__selected-mark" aria-hidden="true" />}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}
