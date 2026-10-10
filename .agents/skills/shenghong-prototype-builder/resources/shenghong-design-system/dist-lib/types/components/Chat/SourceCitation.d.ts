import { type ReactNode } from 'react';
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
export declare function SourceCitation({ kind, records, expanded, defaultExpanded, onExpandedChange, selectedIndex, defaultSelectedIndex, onSelect, }: SourceCitationProps): import("react").JSX.Element;
