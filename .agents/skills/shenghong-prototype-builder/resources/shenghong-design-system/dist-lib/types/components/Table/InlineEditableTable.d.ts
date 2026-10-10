export interface InlineEditableRow {
    id: number;
    fieldName: string;
    fieldCode: string;
    dataType?: 'text' | 'number' | 'date';
    required?: 'yes' | 'no';
    defaultValue: string;
    description: string;
}
export type InlineEditableRequiredField = 'fieldName' | 'fieldCode' | 'dataType' | 'required' | 'defaultValue' | 'description';
export interface InlineEditableTableProps {
    toolbarVariant?: 'titled' | 'actions';
    initialRows?: InlineEditableRow[];
    onChange?: (rows: InlineEditableRow[]) => void;
    /** 需要校验非空的列；默认字段名称、字段编码、数据类型、是否必填。 */
    requiredFields?: readonly InlineEditableRequiredField[];
}
export interface InlineEditableTableHandle {
    /** 保存前调用；失败时展示单元格红框和提示。编辑后会实时重新校验。 */
    validate: () => boolean;
    getRows: () => InlineEditableRow[];
    clearValidation: () => void;
}
/** 数据单元格始终有描边；错误提示位始终预留，校验前后不改变行高。 */
export declare const InlineEditableTable: import("react").ForwardRefExoticComponent<InlineEditableTableProps & import("react").RefAttributes<InlineEditableTableHandle>>;
