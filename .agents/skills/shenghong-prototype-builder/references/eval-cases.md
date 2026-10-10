# Skill evaluation cases

Run these cases after changing the skill. Save failures as new regression cases.

| ID | Should trigger | Prompt | Required outcome |
| --- | --- | --- | --- |
| trigger-01 | Yes | 使用盛虹组件库制作一个成员管理列表页 | Uses the skill, maps requirements, and selects `EnterpriseShell` plus `DataTable` |
| trigger-02 | Yes | 做一个表格，行里的字段可以直接填写和下拉选择 | Selects `InlineEditableTable`; editable controls have persistent outlines |
| trigger-03 | Yes | 检查这个企业智能平台页面有没有绕过组件库 | Enters review mode and runs the validator |
| trigger-04 | Yes | 制作数据展示和行内编辑两种表格，并支持两种工具栏 | Uses tabs for table types and right-side buttons for toolbar layouts |
| trigger-05 | Yes | 修复右上角昵称菜单被内容遮挡 | Uses/fixes the owning navigation overlay; does not add arbitrary local z-index |
| trigger-06 | Yes | 使用 `$shenghong-prototype-builder` 做一个经营策略库，最后只给我一个能双击打开的 HTML | Builds from React source with public design-system components, then bundles a standalone HTML; validates the source and opens the built file |
| trigger-07 | Yes | 不用设计工具，直接做 HTML，但要严格使用盛虹组件库 | Treats HTML as the output format; does not replace library tables, icons, buttons, or modals with hand-written lookalikes |
| trigger-08 | Yes | 把这个 skill 复制到没有盛虹项目源码的 agent 里做原型 | Resolves the already-bundled `resources/shenghong-design-system`, reads its catalog, configures a local build alias, and reports missing host runtime dependencies instead of silently dropping component reuse |
| trigger-09 | Yes | 我已经引用了组件库的表格和按钮，但横向滚动时右侧操作列一悬停就透出下面的文字，操作按钮也不像规范 | Checks fixed-column hover background opacity as well as stacking, compares row-action variants/spacing/width with the catalog, and does not claim validator success proves visual parity |
| conflict-01 | Yes | 不用 React，也不要构建步骤，只手写一个 HTML，同时必须直接使用盛虹 React 组件库 | Explains the incompatible implementation constraints and asks for a choice; does not silently drop component reuse |
| negative-01 | No | 优化一个纯 Node.js 数据同步脚本 | Does not invoke this skill |

## Deterministic assertions

- Prototype files do not import `antd` or `@ant-design/*`.
- Prototype files do not contain raw interactive HTML controls or inline `<svg>`.
- Prototype files do not contain hard-coded colors or arbitrary numeric z-index values.
- The implementation imports consumer UI from `@shenghong/design-system`.
- The validator exits unsuccessfully when the target has no React source, imports only `DesignSystemProvider`, or never renders the provider.
- A directory containing only hand-written HTML fails instead of reporting "0 files, 0 errors".
- The validation process exits unsuccessfully when a prohibited pattern is injected.

## Qualitative assertions

- Component choices follow semantics, not visual resemblance.
- Missing components are reported as gaps.
- Page patterns cover important interaction states.
- Table classification and toolbar classification are not conflated.
- Open overlay surfaces are visually inspected.
- Public-component usage and surrounding composition are audited separately; local styles or adjacent panels cannot silently change variants, placement, elevation, or responsive behavior.
