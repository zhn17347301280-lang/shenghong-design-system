export type EditableDataTableKind = 'property' | 'relation';
/** 可编辑单元格表格；沿用通用 DataTable 的表头、行、勾选列与操作列。 */
export declare function EditableDataTable({ kind, showHeading }: {
    kind: EditableDataTableKind;
    showHeading?: boolean;
}): import("react").JSX.Element;
