import type { ReactNode } from 'react';
export interface FieldTypeTagProps {
    /** 字段类型标记，如 str. / int. / bool.，以次级文字色展示 */
    typeLabel: ReactNode;
    /** 字段值 */
    value?: ReactNode;
    className?: string;
}
/**
 * 字段类型标签：20px 高、8px 圆角、#F2F3F7 底。
 * 左侧为字段类型标记（次级灰），右侧为字段值（主要文字色）。
 */
export declare function FieldTypeTag({ typeLabel, value, className }: FieldTypeTagProps): import("react").JSX.Element;
