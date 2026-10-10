export interface EnterprisePermissionNode {
    key: string;
    title: string;
    options?: string[];
    children?: EnterprisePermissionNode[];
}
export declare const ENTERPRISE_PERMISSION_GROUPS: EnterprisePermissionNode[];
/** MasterGo 一级、二级、三级「表单树卡片」共用的递归组件。 */
export declare function EnterprisePermissionCard({ node, level, selectedKeys, onSelectedKeysChange }: {
    node: EnterprisePermissionNode;
    level?: 1 | 2 | 3;
    selectedKeys?: string[];
    onSelectedKeysChange?: (keys: string[]) => void;
}): import("react").JSX.Element;
export declare function EnterprisePermissionTree({ groups }: {
    groups?: EnterprisePermissionNode[];
}): import("react").JSX.Element;
