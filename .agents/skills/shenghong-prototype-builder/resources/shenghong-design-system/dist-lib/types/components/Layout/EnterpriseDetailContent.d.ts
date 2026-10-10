import type { EnterpriseSearchTreeType } from './EnterpriseSearchTree';
export type EnterpriseDetailContentMode = 'table' | 'form' | 'cards' | 'details';
export type EnterpriseDetailFormType = 'role' | 'ontology' | 'member' | 'resource';
export type EnterpriseDetailTreeType = 'none' | EnterpriseSearchTreeType;
export declare function EnterpriseDetailTable({ withTree }: {
    withTree?: boolean;
}): import("react").JSX.Element;
export declare function EnterpriseDetailForm({ type }: {
    type: EnterpriseDetailFormType;
}): import("react").JSX.Element;
