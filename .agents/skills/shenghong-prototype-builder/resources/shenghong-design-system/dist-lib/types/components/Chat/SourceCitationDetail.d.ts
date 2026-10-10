import type { CitationRecord } from './SourceCitation';
export interface SourceCitationDetailProps {
    record: CitationRecord;
    selectedIndex: number;
    recordCount: number;
    citationCount?: number;
    onSelect: (index: number) => void;
    onClose: () => void;
}
export declare function SourceCitationDetail({ record, selectedIndex, recordCount, citationCount, onSelect, onClose }: SourceCitationDetailProps): import("react").JSX.Element;
