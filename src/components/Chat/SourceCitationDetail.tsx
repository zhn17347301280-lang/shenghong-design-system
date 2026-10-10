import { useState } from 'react';
import { Button, InputNumber } from 'antd';
import { LocalIcon } from '../Icon/LocalIcon';
import type { CitationRecord } from './SourceCitation';
import downloadIconSvg from '../../icons/svg/通用-下载.svg?raw';
import closeIconSvg from '../../icons/svg/通用-取消、关闭.svg?raw';
import leftIconSvg from '../../icons/svg/通用-左.svg?raw';
import rightIconSvg from '../../icons/svg/通用-右.svg?raw';

export interface SourceCitationDetailProps {
  record: CitationRecord;
  selectedIndex: number;
  recordCount: number;
  citationCount?: number;
  onSelect: (index: number) => void;
  onClose: () => void;
}

export function SourceCitationDetail({ record, selectedIndex, recordCount, citationCount = 5, onSelect, onClose }: SourceCitationDetailProps) {
  const [documentPage, setDocumentPage] = useState(11);
  const paragraphs = record.excerpt?.match(/[^。！？]+[。！？]?/gu)?.filter((sentence) => sentence.trim()) ?? [];

  return <aside className="sh-citation-detail" aria-label="引用原文详情">
    <header className="sh-citation-detail__header">
      <div className="sh-citation-detail__file-heading">
        <span className="sh-citation-detail__source">{record.source}</span>
        <span className="sh-citation-detail__slash" aria-hidden="true">/</span>
        <h2 className="sh-citation-detail__filename" title={record.title}>{record.title}</h2>
      </div>
      <div className="sh-citation-detail__actions">
        <Button type="text" className="sh-citation-detail__icon-button" aria-label="下载原文"><LocalIcon svg={downloadIconSvg} size={16} /></Button>
        <Button type="text" className="sh-citation-detail__icon-button" aria-label="关闭原文详情" onClick={onClose}><LocalIcon svg={closeIconSvg} size={16} /></Button>
      </div>
    </header>
    <div className="sh-citation-detail__pagination">
      <div className="sh-citation-detail__citation-pagination">
        <span>共 {citationCount} 处引用</span>
        <Button size="small" disabled={selectedIndex === 0} onClick={() => onSelect(selectedIndex - 1)}>上一个</Button>
        <Button size="small" type="primary" disabled={selectedIndex === recordCount - 1} onClick={() => onSelect(selectedIndex + 1)}>下一个</Button>
      </div>
      <div className="sh-citation-detail__page-pagination" aria-label="文档页码">
        <Button type="text" className="sh-citation-detail__page-arrow" aria-label="上一页" disabled={documentPage <= 1} onClick={() => setDocumentPage((page) => Math.max(1, page - 1))}><LocalIcon svg={leftIconSvg} size={16} /></Button>
        <InputNumber aria-label="当前页码" controls={false} min={1} max={20} value={documentPage} onChange={(value) => setDocumentPage(typeof value === 'number' ? value : 1)} />
        <span>/ 20 页</span>
        <Button type="text" className="sh-citation-detail__page-arrow" aria-label="下一页" disabled={documentPage >= 20} onClick={() => setDocumentPage((page) => Math.min(20, page + 1))}><LocalIcon svg={rightIconSvg} size={16} /></Button>
      </div>
    </div>
    <article className="sh-citation-detail__page-preview" aria-label={`${record.title} 第 ${documentPage} 页原文预览`}>
      <div className="sh-citation-detail__keywords"><strong>关键词：</strong>经营指标、销售额、库存周转、供应链履约</div>
      <div className="sh-citation-detail__page-copy"><h3>前言</h3>{paragraphs.map((paragraph, index) => <p key={`${index}-${paragraph}`}>{paragraph}</p>)}</div>
    </article>
  </aside>;
}
