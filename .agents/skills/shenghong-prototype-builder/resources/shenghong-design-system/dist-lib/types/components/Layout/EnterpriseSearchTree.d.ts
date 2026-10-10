export type EnterpriseSearchTreeType = 'organization' | 'files';
export interface EnterpriseSearchTreeNode {
    key: string;
    title: string;
    children?: EnterpriseSearchTreeNode[];
}
/** MasterGo「树-搜索」：组织树与知识库文件夹树共用行、展开和搜索行为。 */
export declare function EnterpriseSearchTree({ type, selectedKey, onSelect, className }: {
    type: EnterpriseSearchTreeType;
    selectedKey?: string;
    onSelect?: (key: string) => void;
    className?: string;
}): import("react").JSX.Element;
