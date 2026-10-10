---
name: shenghong-prototype-builder
description: Build or review 盛虹、企业智能平台、凌霄 React prototypes, including single-HTML deliverables, with the bundled portable @shenghong/design-system components, tokens, icons, and approved page patterns. Use for new pages, flows, forms, tables, dashboards, prototype revisions, or design-system compliance reviews in any agent workspace.
---

# Shenghong Prototype Builder

Create product prototypes from the local design system rather than recreating its UI. Treat exported source code as the component API source of truth and the references in this skill as product rules.

## Required workflow

1. Locate the design-system root. Prefer the nearest package whose `package.json` name is `@shenghong/design-system`.
2. Resolve the component library before planning. Prefer the nearest package whose `package.json` name is `@shenghong/design-system`. If this is a copied skill without the source repository, use the component package already bundled at `resources/shenghong-design-system/`; read its `README.md` and `component-catalog.md`, and configure the prototype build to resolve `@shenghong/design-system` to that local directory through a Vite/webpack alias or workspace path. Do not ask the user to install another design-system package, and do not silently replace it with raw HTML or another UI kit.
3. When the source repository is available, run `node .agents/skills/shenghong-prototype-builder/scripts/generate-component-catalog.mjs` before planning. Read `references/component-catalog.generated.md` after generation. When using the portable package, treat its bundled catalog and version as the API snapshot.
4. Read `references/component-selection-rules.md`. Read only the relevant sections of `references/page-patterns.md` and `references/design-tokens.md` for the requested UI.
5. Before coding, produce a short coverage table with one row per requirement and one of these decisions:
   - `direct`: use an exported component without structural changes;
   - `compose`: combine exported components using an approved page pattern;
   - `gap`: the library lacks a required capability;
   - `waiver`: the user explicitly approved a documented exception.
6. Resolve every `gap` with the user or by adding the missing capability to the design system before using it in a prototype. Do not silently imitate a missing component.
   A component import alone does not prove that consumer-supplied columns, actions, or other composition match the library's visual states.
7. Implement through the public package entry `@shenghong/design-system`. Wrap the app with `DesignSystemProvider` exactly once at the root.
8. If the requested deliverable is one HTML file, build the page from React source using the design-system package, then bundle and inline its runtime, styles, and assets into the HTML. Keep the source and build configuration for validation and future edits; generate the deliverable with the declared build command rather than hand-editing it. "直接做 HTML" describes the deliverable, not permission to hand-code replacements for library components. If the user explicitly forbids React or a build step while also requiring component reuse, explain the incompatibility and request a choice before implementing; do not silently waive the library rules.
9. Run the validator against the prototype **source directory**, not only the generated HTML:

   ```bash
   node .agents/skills/shenghong-prototype-builder/scripts/validate-prototype.mjs <path> [<path> ...]
   ```

10. Treat zero checked source files, a missing design-system import, or a missing `DesignSystemProvider` as a failed check. Fix all errors; explain any warnings or explicitly approved waivers in the delivery report. Never report "0 errors" without confirming a nonzero checked-file count.
11. Build the prototype and review both component usage **and composition fidelity**: compare rendered variants, spacing, placement, layering, and responsive behavior with the owning component's source and catalog example. Inspect the primary page plus open overlays, editable states, loading, empty, error, disabled, and overflow states that are in scope. A passing static validator is not a visual pass. For a single-HTML deliverable, open the built file directly to check that it works without a development server or network-hosted assets.

## Hard constraints

- Import product UI from `@shenghong/design-system`; do not import `antd`, `@ant-design/*`, or another UI kit in prototype code.
- Do not recreate an exported component with raw HTML, CSS, or a local lookalike.
- Use `LocalIcon` and repository SVG assets for icons. Do not draw inline SVG or substitute emoji.
- Use exported theme tokens and approved component variants. Do not invent colors, radii, shadows, or overlay levels.
- Preserve component semantics, states, density, and interaction behavior. Composition is allowed; modifying component internals from a prototype is not.
- Do not use prototype CSS to restyle a public component's internal controls or conceal a component-level visual defect with a local z-index. Fix the owning component or record a gap.
- Do not copy catalog/demo implementation into product code when a public component exists.
- Missing coverage is a design-system backlog item, not permission to improvise.
- A standalone `.html` file containing hand-written lookalike controls does not satisfy this skill, even when its colors resemble the design tokens.
- A copied skill is not portable unless `resources/shenghong-design-system/` is present or the target agent already has a package named `@shenghong/design-system`. If neither is available, stop and report the missing dependency. The bundled directory is the dependency; no separate design-system installation step is required.

## Build and review modes

### Build mode

- Start from `assets/prototype-brief-template.md` when the request is incomplete.
- Implement the smallest coherent flow that covers the brief.
- Keep domain data and navigation outside reusable visual components.

### Review mode

- Inspect imports, component selection, tokens, icons, states, accessibility, responsive behavior, and overlay stacking.
- Run the validator before giving qualitative feedback.
- Use `assets/compliance-report-template.md` for the final review format.

## Definition of done

- All requirements have a recorded `direct`, `compose`, `gap`, or approved `waiver` decision.
- No unresolved component gaps are hidden in local implementations.
- The validator reports zero errors.
- The validator checks at least one React source file and confirms a public design-system import plus the root provider.
- Type-check/build succeeds for the target project.
- Visual inspection covers the relevant interaction states.
- Composed UI matches the catalog/source contract in the tested viewports; fixed/sticky surfaces do not reveal content beneath them in default, hover, or selected states.
- The delivery identifies components used, gaps found, validation command, and remaining warnings.

## Maintenance

When public exports or component behavior change, regenerate the catalog and update only the affected rule or page-pattern reference. Add a case to `references/eval-cases.md` whenever an AI-generated prototype violates a rule that was not caught.
