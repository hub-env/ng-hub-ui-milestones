# Changelog

All notable changes to `ng-hub-ui-milestones` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [22.4.0] - 2026-09-07

### Fixed

- **The trail follows a per-node accent again, which both READMEs have always promised.** The
  connector read `--hub-milestone-connector-bg`, and that token was declared at the root as
  `var(--hub-milestone-node-color)`. A custom property resolves its own `var()` on the element that
  declares it, so the fallback was already resolved at the root, where no per-node value exists: a
  milestone given its own `color` painted a coloured node and left the trail on the global accent.
  The pair is gone from the root block and the connector now reads
  `var(--hub-milestone-connector-bg, var(--hub-milestone-node-color))` where it paints, which is
  the shape `--hub-milestone-pulse-color` next to it already had. Setting the token from the
  application still wins, and now a per-node `color` reaches the trail.

- **A `:root` in the application now outranks the library's token defaults.** The component is
  unencapsulated, so its `:root` block of `--hub-milestone-*` defaults lands in the global
  stylesheet — same element, same specificity as the application's own `:root`, which leaves the
  tie to injection order. The component's sheet is injected last, so it won every time and a
  product could not re-theme a timeline from `:root`, which is precisely where the README told it
  to. The block is now `:where(:root)`, specificity zero, so the consumer's rule wins on merit and
  nothing needs `!important`. Same tokens, same values; only what wins changed. See
  `BREAKING_CHANGES.md`.

### Changed

- **The Styling section of both READMEs says where a redefinition actually lands.** It listed
  `:root`, a `hub-milestones` selector and the per-node `color` input as equivalent, when the
  first of the three did nothing. It now says all three reach the component and which one wins
  where.

## [22.3.3] - 2026-09-06

### Fixed

- **The documentation no longer denies the `ng-hub-ui-utils` dependency the package requires.** Both READMEs advertised "zero runtime dependencies" and an install line naming this package alone, while `peerDependencies` has demanded `ng-hub-ui-utils >=22.7.0` since 22.3.0 — so a reader installing by hand, exactly as documented, ended up with an application that cannot resolve `resolveHubAccent`. The install block now names both packages and states the peer range.
- **`hubMilestoneNode` is described as what it is: an attribute directive.** Calling it structural set the wrong expectation about where its content appears. It only tags a template; `<hub-milestone>` is what renders it inside the circle, so nothing is created or removed at the place the directive is written.
- **`HUB_MILESTONES_CONFIG` is in the API reference.** The token is exported from `public-api.ts` and is the only way to read the resolved application defaults, yet neither README named it.
- **The Styling section documents the SCSS the package ships.** `hub-milestones-theme()` and the `ng-hub-ui-milestones/styles` entry point have been published since 22.2.0 with no trace in either README, leaving the one-call theming path visible only to whoever read the changelog.

## [22.3.2] - 2026-09-01

### Added

- **`BREAKING_CHANGES.md`.** In this family the major version tracks the Angular major, so semver cannot signal a breaking change and that file is the warning in its place. The peer dependency added in 22.3.0 breaks manual installs and had no such entry.

### Changed

- **The `homepage` in the manifest points at this library's own documentation page** rather than at
  the site root. It is the link a registry shows beside the package and the one a reader clicks from
  it, and landing on a front page they then have to search is a worse answer than landing on the
  reference for the package they were already looking at. Metadata only — no code, no types, no
  styles change, and nothing a consumer imports is affected.

## [22.3.1] - 2026-08-08

### Fixed

- Documentation links now point at the canonical localized URLs. The README linked to `https://hubui.dev/<path>` with no locale prefix and no trailing slash, and both forms are 301-redirected, so every reader arriving from npm or GitHub landed on a redirect instead of the canonical page.

## [22.3.0] - 2026-07-28

### Changed

- **Accent resolution now imports the canonical `resolveHubAccent` from `ng-hub-ui-utils`.** The private copy under `src/lib/shared/resolve-hub-accent.ts` has been deleted in favour of the single, tested implementation shared family-wide. Behaviour is identical (the copy had not diverged): a bareword resolves to `var(--hub-sys-color-<name>, <name>)`, a literal colour passes through unchanged, an empty value yields `null`.

### Added

- **NEW peer dependency: `ng-hub-ui-utils` `>=22.7.0`.** Consumers must have `ng-hub-ui-utils` installed alongside this library (it is where `resolveHubAccent` lives). Users installing via `ng add ng-hub-ui` get it automatically; manual installs need `npm i ng-hub-ui-utils`.

## [22.2.1] - 2026-07-28

### Fixed

- Each `hub-milestone` now exposes `role="listitem"` (the container already declared `role="list"`) and the active node announces `aria-current="step"`, so screen readers convey both the list structure and the current position.

## [22.2.0] - 2026-07-07

### Added

- **`hub-milestones-theme(...)` SCSS mixin** — one-call token theming for `<hub-milestones>`, covering the full `--hub-milestone-*` surface: completed steps (`$node-color`, `$node-text`, `$node-size`, `$node-font-size`, `$connector-bg`, `$connector-thickness`), upcoming steps (`$pending-bg`, `$pending-border`, `$pending-color`, `$connector-pending-bg`), the error state (`$error-bg`), the step body (`$body-color`, `$body-muted`) and layout (`$gap`, `$spacing`). Every parameter is null-defaulted and additive. (The component tokens are singular `--hub-milestone-*`; the library and mixin are plural.)

### Changed

- **Packaging — the library now ships its SCSS at `/styles`.** `src/lib/styles` is emitted to `dist/milestones/styles`, exposing `hub-milestones-theme` as a first-class package entry: `@use 'ng-hub-ui-milestones/styles' as *;`.

## [22.1.0] - 2026-07-07

### Changed

- **`<hub-milestone>` `color` accepts ANY colour.** On top of the built-in semantic accents, the input now also accepts a **registered custom accent** and a **literal colour** (`#ff0000`, `rgb(...)`, `oklch(...)`, a CSS named colour), resolved through the shared `resolveHubAccent` resolver (a local copy of the canonical `ng-hub-ui-utils` helper): a bareword becomes `var(--hub-sys-color-<name>, <name>)`; a literal is used as-is. The single `--hub-<comp>-accent` slot derives the rest of the family, so built-in colours are unchanged.
- **Internal — host bindings moved to the `host` metadata object.** `@HostBinding` / `@HostListener` decorators were replaced by the `host` object in the component/directive metadata (Angular style guide). No public API or behaviour change.

## [22.0.3] - 2026-06-25

### Changed

- Widened the Angular peer dependency range from `^22.0.0` to `>=21.0.0`, so the library installs on Angular 21 projects as well (aligning it with the rest of the `ng-hub-ui` family). No code changes — every API used is available since Angular ≤21.

## [22.0.2] - 2026-06-25

### Added

- **Viewport reveal** — when a `<hub-milestones>` scrolls into view it plays a one-shot animation, filling the accent trail from the first node up to the active node. **On by default**; set it globally with `provideHubMilestones({ reveal: false })` (add the provider to the app config) or per instance with `[reveal]`. Tunable via `--hub-milestone-reveal-duration` / `--hub-milestone-reveal-stagger`, SSR-safe (renders the full trail without JS), and disabled under `prefers-reduced-motion`.
- `provideHubMilestones()` provider + `HubMilestonesConfig` for app-wide defaults.
- `[pulse]` input on `<hub-milestones>` — opt-in soft wave animation on the `active` node to highlight the current step. The wave colour follows the node accent by default (including a per-node `color` override) and is overridable via `--hub-milestone-pulse-color` / `--hub-milestone-pulse-duration` / `--hub-milestone-pulse-spread`. Disabled automatically under `prefers-reduced-motion`.

### Fixed

- **Connectors now reach from node to node.** Previously the connector lived in the node's flex flow so it stopped at the node's content, leaving a gap before the next node (the inter-node spacing sits in the milestone's padding, outside the rail). It is now absolutely positioned and always spans node-edge to next-node-edge, in both vertical and horizontal layouts.
- The connector colour now follows the theme accent (`--hub-milestone-node-color`) instead of a hardcoded purple→orange gradient that clashed with the themed (accent) nodes and rendered as a muddy line in the horizontal layout. Also aligned the node-colour fallback with the canonical `--hub-sys-color-primary` value (`#0d6efd`).
- The accent trail now stops at the active (current) node — connectors from the active node onward are muted, so the timeline reads as a real progress indicator.
- **Full RTL support**: layout, connector positioning and the reveal animation flip correctly under `dir="rtl"` via CSS logical properties (`inset-inline-*`, `padding-inline-end`) and a direction-aware reveal.

## [22.0.1] - 2026-06-25

### Fixed

- Design-token consistency pass: aligned inline fallback defaults with the canonical `ng-hub-ui-ds` values and routed hardcoded literals (z-index, font-weight, line-height, radii and theme-aware colours) through their `--hub-sys-*` / `--hub-ref-*` tokens, so they follow the active theme. No visual change when the ds tokens are loaded.

## [22.0.0] - 2026-06-17

### Changed

- Aligned with Angular 22.
- README documentation standardized.

## [21.0.0] - 2026-06-14

### Added

- Initial release: presentational timeline / progress-steps library.
- `hub-milestones` container with `orientation` (`vertical` | `horizontal`); auto-numbers the nodes and draws the connecting rail.
- `hub-milestone` node with `state` (`complete` | `active` | `pending` | `error`), per-node `color` override and a `label` fallback.
- `hubMilestoneNode` directive to project custom content (number, icon, avatar, any markup) inside the circle, plus projected body content beside/below.
- Full CSS-variable theming through `--hub-milestone-*` tokens (node colours, connector gradient, sizes, spacing). Standalone, signal-based, OnPush, SSR-safe.
