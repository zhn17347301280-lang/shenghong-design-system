# Component selection rules

## Authority order

When sources disagree, use this order:

1. Current public exports and TypeScript props in `src/index.ts` and `src/components/index.ts`.
2. Current component behavior and catalog examples in `src/catalog/`.
3. Theme tokens in `src/theme/` and component styles in `src/styles/`.
4. The generated component catalog.
5. This skill's written guidance.
6. External design links or screenshots.

Report the conflict instead of guessing when the first three sources disagree.

## Coverage decisions

| Decision | Meaning | Required action |
| --- | --- | --- |
| `direct` | One public component covers the requirement | Use its public import and documented props |
| `compose` | Multiple public components cover it | Name the approved page pattern and components |
| `gap` | No public API covers it | Stop that portion and propose a library addition |
| `waiver` | The user explicitly accepts an exception | Record scope, reason, owner, and removal condition |

Use the table in `assets/prototype-brief-template.md` before implementation.

## Composition integrity

Component reuse is necessary but not sufficient. For every composed surface, identify which component owns its structure, consumer-supplied content, visual variant, background, stacking, interaction states, and responsive behavior. A public component does not automatically normalize the props or CSS of content supplied through its slots or columns.

- Compare consumer props and rendered states with the component source **and** catalog example. In particular, check button type/size, spacing, disabled states, column widths, and overflow rather than accepting any valid `AppButton` or `DataTable` usage as visually compliant.
- Treat consumer CSS that targets library internals (`.ant-*`, internal `.sh-*` classes) as a review finding. Prefer public props and component-owned styles; if the component cannot express the required visual state, mark a `gap` instead of styling around it.
- Review the composed result at a normal and a constrained width when wrapping, scrolling, fixed/sticky elements, or overlays are present. For a covering surface such as a fixed column, test default, hover, and selected backgrounds while content scrolls underneath; a high z-index alone does not prevent bleed-through if the background is translucent. Inspect overlays separately when they exist.
- The static validator catches prohibited source patterns, not visual parity or stacking. Report its result separately from visual verification; an uninspected relevant state is not a pass.

## Imports and boundaries

- Consumer prototypes import from `@shenghong/design-system` only.
- `antd` and `@ant-design/x` are implementation dependencies of the design system, not consumer APIs.
- Do not deep-import `@shenghong/design-system/dist/*` or `src/components/*`.
- Do not copy files from `src/components/` into a prototype.
- The design-system repository's own component implementations and catalog are exempt from consumer import rules.

## Component choice

- Use `EnterpriseShell` for enterprise-platform application framing rather than assembling top and side navigation independently.
- Use `EnterpriseDetailTemplate`, `EnterpriseDetailContent`, `EnterpriseDetailSection`, and `EnterpriseDetailType` for enterprise detail flows.
- Use `DataTable` for display, selection, filtering, searching, refresh, pagination, category tabs, toolbar composition, and standard operation columns through `rowActions`.
- Use `TableActionCell` when a standard operation cell is needed outside `DataTable`'s `rowActions` configuration. Do not copy the catalog's old private `RowActions` example.
- Use `InlineEditableTable` when every data row is directly editable and fields remain visibly outlined. For its supported fixed field schema, use `requiredFields` and the public `validate()` ref for required-cell errors; do not implement a separate red-border/row-height behavior in product CSS.
- Use `EditableDataTable` only for its supported property/relation editing model.
- Use `AppModal` for modal surfaces and its supported tone instead of styling an Ant Design modal directly.
- Use `AppDrawer` for right-side detail drawers. Select `widthVariant="standard"` (600px) or `"compact"` (400px) independently of content. Its header uses public `DrawerTitle`: pass status through `AppDrawer.status` and let the shell own the 56px header and right-side close control. Compose one or more `DrawerSection` blocks with the needed public content primitive: `DrawerRecordCard`, `DrawerTextBlock`, `DrawerFieldList`, `DrawerTreeContent`, `DrawerActivityLog`, or generic `DrawerContentPanel`. Do not treat the catalog's sample combinations as fixed drawer types.
- Use `AppButton`, `AppFormItem`, `StatusTag`, `FieldTypeTag`, `TableCellContent`, and `CellText` for their corresponding primitives.
- Use `LocalIcon` with SVG assets already present under `src/icons/svg/`.
- Prefer the domain components for chat, SmartFeed, file, chart, card, login, and notification experiences instead of rebuilding their internals.

## Missing primitives

The current public library may not expose every generic input, select, date picker, navigation, or feedback primitive as a consumer component. If a requested prototype needs an unexported primitive:

1. Mark it as `gap`.
2. Describe the states and props required.
3. Add it to the component library first, including catalog coverage.
4. Regenerate the component catalog.
5. Resume the prototype using the new public export.

Do not treat a transitive `antd` dependency as approval to import it directly.

## Exceptions

An exception is valid only when the user explicitly approves it. Put a suppression immediately above the relevant line:

```ts
// sh-design-system-allow: ui-library-import -- temporary DatePicker gap approved in task ABC-123
```

The validator requires a reason after `--`. Keep the exception narrow and list it in the final compliance report.
