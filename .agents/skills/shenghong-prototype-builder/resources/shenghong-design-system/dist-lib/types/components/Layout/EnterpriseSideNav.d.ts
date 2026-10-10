export declare const ENTERPRISE_NAV_GROUPS: readonly [{
    readonly key: 'organization';
    readonly label: '组织与权限';
    readonly icon: string;
    readonly children: readonly [{
        readonly key: 'organization-management';
        readonly label: '组织管理';
    }, {
        readonly key: 'member-management';
        readonly label: '成员管理';
    }, {
        readonly key: 'role-management';
        readonly label: '角色与权限管理';
    }];
}, {
    readonly key: 'knowledge';
    readonly label: '知识中枢';
    readonly icon: string;
    readonly children: readonly [{
        readonly key: 'knowledge-base';
        readonly label: '知识库管理';
    }, {
        readonly key: 'knowledge-qa';
        readonly label: '知识问答';
    }];
}, {
    readonly key: 'ontoforge';
    readonly label: 'OntoForge';
    readonly icon: string;
    readonly children: readonly [{
        readonly key: 'semantic-canvas';
        readonly label: '语义画布';
    }, {
        readonly key: 'ontology-modeling';
        readonly label: '本体建模';
    }, {
        readonly key: 'logic-modeling';
        readonly label: '逻辑建模';
    }, {
        readonly key: 'self-update';
        readonly label: '智能创建与自更新';
    }];
}, {
    readonly key: 'capability';
    readonly label: '智能能力与资源';
    readonly icon: string;
    readonly children: readonly [{
        readonly key: 'skills';
        readonly label: '技能管理';
    }, {
        readonly key: 'mcp';
        readonly label: 'MCP管理';
    }, {
        readonly key: 'templates';
        readonly label: '模板管理';
    }, {
        readonly key: 'information-source';
        readonly label: '信息源';
    }];
}, {
    readonly key: 'integration';
    readonly label: '集成与渠道管理';
    readonly icon: string;
    readonly children: readonly [{
        readonly key: 'message-channel';
        readonly label: '消息渠道';
    }];
}, {
    readonly key: 'usage';
    readonly label: '用量管理';
    readonly icon: string;
    readonly children: readonly [{
        readonly key: 'usage-statistics';
        readonly label: '用量统计';
    }, {
        readonly key: 'resource-consumption';
        readonly label: '资源消耗';
    }];
}];
export type EnterpriseNavKey = (typeof ENTERPRISE_NAV_GROUPS)[number]['children'][number]['key'];
export interface EnterpriseSideNavProps {
    selectedKey?: EnterpriseNavKey;
    collapsed?: boolean;
    onSelect?: (key: EnterpriseNavKey) => void;
    onCollapseChange?: (collapsed: boolean) => void;
    className?: string;
}
export declare function EnterpriseSideNav({ selectedKey, collapsed, onSelect, onCollapseChange, className, }: EnterpriseSideNavProps): import("react").JSX.Element;
