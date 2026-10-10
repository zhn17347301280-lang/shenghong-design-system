# Design-token rules

The source of truth is `src/theme/`. Import public tokens from `@shenghong/design-system` rather than copying their values.

## Public token groups

- `colorTokens`: brand, semantic, text, icon, background, border, divider, and control-state colors.
- `brandTokens`: brand primary alias.
- `typographyTokens`: font family, font sizes, and line heights.
- `spacingTokens`: 4, 8, 12, 16, 24, 32, and 48 spacing steps.
- `radiusTokens`: 4, 6, 8, and 12 radius steps.
- `shadowTokens`: card, popover, and modal elevation.
- `motionTokens`: durations and standard easing.
- `chartTokens`: chart palette, axes, grid, border, radius, and tooltip elevation.
- `appTheme`: the Ant Design theme configuration consumed by `DesignSystemProvider`.

## Usage rules

- Prefer component props and variants over styling a component externally.
- When layout styling is necessary, use exported spacing, typography, radius, shadow, and color tokens.
- Do not copy token values such as `#6495F6` into prototype code.
- Do not introduce a new token from a prototype. Add it to the design system with rationale and usage documentation first.
- Use `shadowPopover` or `shadowModal` only for the matching elevation role.
- Use chart colors only through `ChartCard` props or `chartTokens`.
- Preserve the provider so component-level and static feedback APIs receive the same theme.

## Overlay levels

Overlay layering must be owned by the component library. A prototype must not solve clipping or stacking by adding values such as `zIndex: 9999`. If the existing user menu, dropdown, modal, or notification surface is underneath another layer, record a component-library defect and fix the owning component/token.
