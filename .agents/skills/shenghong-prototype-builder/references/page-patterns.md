# Approved page and interaction patterns

## Enterprise application shell

- Use `EnterpriseShell` as the primary frame.
- Use `EnterpriseTopNav` and `EnterpriseSideNav` only when the shell API requires explicit composition.
- Keep page content below the navigation stacking context.
- Open the user nickname menu and notification panel through the existing navigation APIs. Overlay surfaces must appear above the top navigation, page content, sticky headers, tables, and drawers they are intended to cover.
- Do not repair overlay visibility from a prototype with arbitrary local `z-index`. Fix or use the design-system overlay token/component.

## List and display table

- Use `DataTable` for non-editable business data.
- Table category differences may use the table's category tabs.
- Search, filter, refresh, selection, actions, and pagination belong to the table toolbar or table API.
- Standard row actions use `DataTable.rowActions` / `rowActionMore`, which render the public `TableActionCell`; business code supplies labels and callbacks, not button markup.
- Cell content uses `CellText`, `TableCellContent`, `StatusTag`, `FieldTypeTag`, and `LocalIcon` as applicable.
- Check row-action labels, width, fixed behavior, and disabled state against the catalog's scrollable fixed-column example.
- With horizontal scrolling, inspect the fixed action column at default, hover, and selected states. Its background must remain visually opaque over text scrolling underneath; verify this in the rendered page, not just by reading `z-index`.

## Directly editable table

- Use `InlineEditableTable` when row data can be edited without entering a separate edit mode.
- For the supported field-configuration model, set `requiredFields` as needed and call the public ref `validate()` before saving. It returns `false` and shows red borders with cell-level helper text for empty required fields; `getRows()` returns the current rows. Do not recreate required-cell errors in a prototype's local CSS.
- Error and normal cells reserve the same helper-text space. Verify that validation, editing, hover, and horizontal scrolling do not change row heights or override the red border. Use `clearValidation()` only when explicitly resetting the validation state.
- Editable text, selection, date, and other field controls must retain a visible outline so editability is apparent before hover or focus.
- Table type may be switched with tabs, for example `数据展示表格` and `行内编辑表格`.
- Toolbar layouts are not table types. Switch toolbar layouts with buttons on the right side of the tab bar or toolbar; never represent toolbar layout choices as tabs.
- Preserve keyboard focus, disabled, validation, and overflow behavior for every editable cell.

## Detail page

- Use `DetailPage` for a general detail surface.
- Use the `EnterpriseDetail*` family for enterprise detail pages with form, cards, table, tree, permission, and section patterns.
- Put page-level primary actions in the template action area, not inside arbitrary cards.

## Forms

- Use `AppFormItem` modes to express read-only, read-edit, editing, edit, switch, and error states.
- Labels, validation feedback, help text, and actions must remain part of the form structure.
- If a required field control is not publicly exported, record a gap instead of inserting a raw HTML or Ant Design control.

## Modal and picker flows

- Use `AppModal` for modal framing.
- Use `ResourcePickerContent`, `RankingContent`, `DetailFieldGroup`, and `ModalItemCard` when their domain matches.
- Confirm destructive actions explicitly and preserve loading/disabled states.
- Inspect the open modal and nested dropdown/popover states for stacking and clipping.

## Cards and dashboards

- Use `MetricCard` for key metrics and trends.
- Use `ChartCard` with supported chart types and `TopCountSelect` for chart ranking/count control.
- Use `ReportCard`, `InformationCard`, `OptionCard`, or `EntityCard` according to content semantics; do not select cards by appearance alone.
- Use chart tokens and component props rather than custom chart palettes.

## Chat, SmartFeed, and files

- Compose chat experiences from `ChatBubble`, `ChatSender`, `MessageActions`, `MessageQueue`, `ThinkingProcess`, citation components, and HITL components.
- Compose SmartFeed flows from the exported SmartFeed components.
- Use the exported file upload and file-card components for their supported contexts and states.

## Required state review

For every pattern used, inspect the states relevant to the request:

- default and hover;
- focus-visible and keyboard navigation;
- selected and active;
- disabled;
- loading or processing;
- empty;
- validation/error;
- long text and overflow;
- open dropdown, popover, drawer, or modal;
- narrow viewport when responsive behavior is in scope.
