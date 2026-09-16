# ng-hub-ui-milestones

[Español](./README.es.md) | **English**

[![npm version](https://img.shields.io/npm/v/ng-hub-ui-milestones.svg)](https://www.npmjs.com/package/ng-hub-ui-milestones)
[![license](https://img.shields.io/npm/l/ng-hub-ui-milestones.svg)](https://github.com/hub-env/ng-hub-ui-milestones/blob/main/LICENSE)

A lightweight, presentational timeline / progress-steps component for Angular: lay out milestone nodes vertically or horizontally, project any content into each node, and theme everything with CSS variables.

## Documentation and Live Examples

This package is part of [Hub UI](https://hubui.dev/en/), a collection of Angular component libraries for standalone apps.

- Docs: https://hubui.dev/en/milestones/overview/
- Live examples: https://hubui.dev/en/milestones/examples/
- Hub UI: https://hubui.dev/en/
- Hub UI on GitHub (issues, roadmap and contributing): https://github.com/hub-env/hub-ui

## 🧩 Library Family `ng-hub-ui`

This library is part of the **Hub UI** ecosystem:

- [**ng-hub-ui-accordion**](https://www.npmjs.com/package/ng-hub-ui-accordion) (deprecated — use ng-hub-ui-panels)
- [**ng-hub-ui-action-sheet**](https://www.npmjs.com/package/ng-hub-ui-action-sheet)
- [**ng-hub-ui-avatar**](https://www.npmjs.com/package/ng-hub-ui-avatar)
- [**ng-hub-ui-board**](https://www.npmjs.com/package/ng-hub-ui-board)
- [**ng-hub-ui-breadcrumbs**](https://www.npmjs.com/package/ng-hub-ui-breadcrumbs)
- [**ng-hub-ui-calendar**](https://www.npmjs.com/package/ng-hub-ui-calendar)
- [**ng-hub-ui-dropdown**](https://www.npmjs.com/package/ng-hub-ui-dropdown)
- [**ng-hub-ui-ds**](https://www.npmjs.com/package/ng-hub-ui-ds)
- [**ng-hub-ui-forms**](https://www.npmjs.com/package/ng-hub-ui-forms)
- [**ng-hub-ui-history**](https://www.npmjs.com/package/ng-hub-ui-history)
- [**ng-hub-ui-milestones**](https://www.npmjs.com/package/ng-hub-ui-milestones) ← You are here
- [**ng-hub-ui-modal**](https://www.npmjs.com/package/ng-hub-ui-modal)
- [**ng-hub-ui-nav**](https://www.npmjs.com/package/ng-hub-ui-nav)
- [**ng-hub-ui-paginable**](https://www.npmjs.com/package/ng-hub-ui-paginable)
- [**ng-hub-ui-panels**](https://www.npmjs.com/package/ng-hub-ui-panels)
- [**ng-hub-ui-portal**](https://www.npmjs.com/package/ng-hub-ui-portal)
- [**ng-hub-ui-skeleton**](https://www.npmjs.com/package/ng-hub-ui-skeleton)
- [**ng-hub-ui-sortable**](https://www.npmjs.com/package/ng-hub-ui-sortable)
- [**ng-hub-ui-stepper**](https://www.npmjs.com/package/ng-hub-ui-stepper)
- [**ng-hub-ui-utils**](https://www.npmjs.com/package/ng-hub-ui-utils)

## 📑 Table of Contents

- [Description](#-description)
- [Features](#-features)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Reference](#-api-reference)
- [Styling](#-styling)
- [Changelog](#-changelog)
- [Contributing](#-contributing)
- [Support](#-support)
- [License](#-license)

## 📖 Description

`ng-hub-ui-milestones` renders a timeline (also known as progress steps) made of milestone nodes connected by a rail. It is purely presentational and unopinionated about your data: you compose the timeline declaratively with two components and one directive.

- `hub-milestones` is the container. It lays out its child nodes either vertically or horizontally, draws the connecting rail, and numbers the nodes automatically in DOM order.
- `hub-milestone` is a single node. It exposes a visual `state` (`complete` · `active` · `pending` · `error`), an optional per-node `color` override, and a `label` fallback. Any markup placed inside it is projected as the node's body (title, description, dates, etc.).
- `hubMilestoneNode` is an attribute directive for an `<ng-template>` that lets you project custom content **inside** the node circle — a number, an icon, an avatar, or any markup. When omitted, the node shows the `label` or the auto-generated 1-based index.

Components are standalone, signal-based, use `OnPush` change detection, and are SSR-safe.

## ✨ Features

- **Two orientations**: `vertical` and `horizontal` layouts from a single input.
- **Automatic numbering**: nodes are numbered (1, 2, 3 …) in DOM order, with no manual bookkeeping.
- **Visual states**: `complete`, `active`, `pending`, and `error` states drive node and connector colors.
- **Custom node content**: project numbers, icons, or avatars into the circle via `hubMilestoneNode`.
- **Per-node color override**: set any CSS color on an individual node with the `color` input.
- **Viewport reveal animation**: the accent trail "completes" up to the active node when the timeline scrolls into view — **on by default**, configurable globally with `provideHubMilestones` or per instance with `[reveal]`. SSR-safe and disabled under `prefers-reduced-motion`.
- **Active-node pulse** (opt-in `[pulse]`): a soft wave on the active node to highlight the current step.
- **RTL ready**: layout, connectors and the reveal animation flip correctly under `dir="rtl"`.
- **Full CSS-variable theming**: customize colors, sizes, spacing, and animation timings through `--hub-milestone-*` tokens.
- **Standalone & modern**: standalone components, Angular Signals, `OnPush`, SSR-safe.
- **One extra dependency**: `ng-hub-ui-utils`, where the shared accent resolver lives. Nothing else beyond Angular and `tslib`.

## 📦 Installation

```bash
npm install ng-hub-ui-milestones ng-hub-ui-utils
```

### Peer Dependencies

```json
{
	"@angular/common": ">=21.0.0",
	"@angular/core": ">=21.0.0",
	"ng-hub-ui-utils": ">=22.7.0"
}
```

`ng-hub-ui-utils` has been **required** since 22.3.0: the per-node `color` input resolves its accent through the canonical `resolveHubAccent` helper that lives there. Installing the family with `ng add ng-hub-ui` brings it in for you; a manual install has to name it, or the application fails to resolve the import at build time.

## 🚀 Usage

Import the standalone components (and the directive when projecting custom node content) into your component:

```typescript
import { Component } from '@angular/core';
import { HubMilestonesComponent, HubMilestoneComponent, HubMilestoneNodeDirective } from 'ng-hub-ui-milestones';

@Component({
	selector: 'app-roadmap',
	standalone: true,
	imports: [HubMilestonesComponent, HubMilestoneComponent, HubMilestoneNodeDirective],
	template: `
		<hub-milestones orientation="vertical">
			<hub-milestone state="complete">
				<h4>Project kickoff</h4>
				<p>Requirements gathered and approved.</p>
			</hub-milestone>

			<hub-milestone state="active">
				<h4>Development</h4>
				<p>Building the core features.</p>
			</hub-milestone>

			<hub-milestone state="pending">
				<ng-template hubMilestoneNode>★</ng-template>
				<h4>Release</h4>
				<p>Ship to production.</p>
			</hub-milestone>
		</hub-milestones>
	`
})
export class RoadmapComponent {}
```

### Horizontal orientation

```html
<hub-milestones orientation="horizontal">
	<hub-milestone state="complete"><h4>Step 1</h4></hub-milestone>
	<hub-milestone state="active"><h4>Step 2</h4></hub-milestone>
	<hub-milestone state="pending"><h4>Step 3</h4></hub-milestone>
</hub-milestones>
```

### The state without the colour

An `error` node is the one state a reader must not miss, and colour alone cannot carry it. Two
things are automatic and need no markup from you:

- **A mark on the circle**, light on the node's own fill, so the difference survives greyscale
  and every form of colour blindness.
- **The state as a word in the node body**, clipped out of the page — one pixel, `clip-path`, no
  `display: none` — so it never shows and is always read out with the step.

```html
<hub-milestones>
	<hub-milestone state="complete"><h4>Ordered</h4></hub-milestone>

	<!-- No extra markup: the mark and the announced word come with the state -->
	<hub-milestone state="error"><h4>Payment declined</h4></hub-milestone>

	<!-- Per node, which is one of the two ways to translate the wording -->
	<hub-milestone state="pending" stateLabel="Pendiente"><h4>Delivery</h4></hub-milestone>
</hub-milestones>
```

The defaults are English (`Completed`, `Pending`, `Error`, and nothing for `active`, which
`aria-current="step"` already names). Translate them once for the whole application:

```ts
providers: [
	provideHubMilestones({
		stateLabels: { complete: 'Completado', pending: 'Pendiente', error: 'Error' }
	})
];
```

Each node also carries `data-state`, the same attribute hook `toast`, `badges` and `stepper`
expose, if you would rather select on it than on the modifier class.

### Labels and per-node color

```html
<hub-milestones orientation="vertical">
	<hub-milestone state="complete" label="A">
		<h4>Phase A</h4>
	</hub-milestone>

	<hub-milestone state="active" color="#0d6efd">
		<h4>Phase B</h4>
	</hub-milestone>

	<hub-milestone state="error">
		<h4>Phase C</h4>
		<p>Something went wrong here.</p>
	</hub-milestone>
</hub-milestones>
```

When a node has neither a `hubMilestoneNode` template nor a `label`, it falls back to its auto-generated 1-based number.

### Active-node pulse

Add `[pulse]` to the container to emit a soft wave on the `active` node, drawing attention to the current step. It is opt-in and respects `prefers-reduced-motion`.

```html
<hub-milestones orientation="horizontal" [pulse]="true">
	<hub-milestone state="complete"><h4>Ordered</h4></hub-milestone>
	<hub-milestone state="active"><h4>In transit</h4></hub-milestone>
	<hub-milestone state="pending"><h4>Delivered</h4></hub-milestone>
</hub-milestones>
```

### Viewport reveal animation

When a `<hub-milestones>` scrolls into view, it animates the accent trail filling from the first node up to the active node. **It is on by default** — no setup required. The component only animates in the browser, so SSR / no-JS renders the full trail, and the animation is disabled under `prefers-reduced-motion`.

Turn it off (or back on) globally by adding `provideHubMilestones` to your application config:

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideHubMilestones } from 'ng-hub-ui-milestones';

export const appConfig: ApplicationConfig = {
	providers: [
		// Disable the reveal animation for every <hub-milestones> in the app.
		provideHubMilestones({ reveal: false })
	]
};
```

The per-instance `[reveal]` input always wins over the global default:

```html
<!-- Force the reveal on, even if it is disabled globally -->
<hub-milestones [reveal]="true"> … </hub-milestones>
```

## 📚 API Reference

### `HubMilestonesComponent` — `<hub-milestones>`

#### Inputs

| Input         | Type                       | Default      | Description                                                                                                                            |
| ------------- | -------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| `orientation` | `HubMilestonesOrientation` | `'vertical'` | Layout direction: `'vertical'` or `'horizontal'`.                                                                                     |
| `pulse`       | `boolean`                  | `false`      | Emits a soft wave on the `active` node to highlight the current step. Respects `prefers-reduced-motion`.                              |
| `reveal`      | `boolean`                  | _(global)_   | Plays the viewport reveal animation when the timeline scrolls into view. Defaults to the `provideHubMilestones` value (on if unset). |

> The container also auto-numbers its projected `hub-milestone` nodes in DOM order; no input is required for this.

### `provideHubMilestones(config?)`

An environment provider for application-wide defaults. Add it to your `ApplicationConfig` `providers` array.

| Option   | Type      | Default | Description                                                                              |
| -------- | --------- | ------- | ---------------------------------------------------------------------------------------- |
| `reveal` | `boolean` | `true`  | Default for the viewport reveal animation. Overridden per instance by the `[reveal]` input. |
| `stateLabels` | `Partial<Record<HubMilestoneState, string>>` | _(English)_ | The word each state is announced with. This is where the wording gets translated; `''` silences a state. Overridden per node by `[stateLabel]`. |

### `HubMilestoneComponent` — `<hub-milestone>`

#### Inputs

| Input   | Type                | Default     | Description                                                                                       |
| ------- | ------------------- | ----------- | ------------------------------------------------------------------------------------------------- |
| `state` | `HubMilestoneState` | `'pending'` | Visual state: `'complete'` · `'active'` · `'pending'` · `'error'`. Drives node/connector colors.  |
| `color` | `string`            | `''`        | Per-node color override (any CSS color). Wins over the state color.                               |
| `label` | `string`            | `''`        | Fallback content shown inside the node when no `hubMilestoneNode` template is given.              |
| `stateLabel` | `string \| undefined` | _(global)_ | The word this node is announced with, overriding `stateLabels`. `''` silences it; leave it unset to inherit. |

> Projected (non-template) content placed inside `<hub-milestone>` is rendered as the node body, beside (vertical) or below (horizontal) the node circle.

### `HubMilestoneNodeDirective` — `[hubMilestoneNode]`

An attribute directive applied to an `<ng-template>` to mark the content rendered **inside** the node circle (a number, icon, avatar, or any markup). It has no inputs or outputs, and it renders nothing where it is written: `<hub-milestone>` picks the tagged template up and renders it inside the circle.

```html
<hub-milestone state="complete">
	<ng-template hubMilestoneNode>✓</ng-template>
	<h4>Done</h4>
</hub-milestone>
```

### Exported types and tokens

| Type                       | Values                                           |
| -------------------------- | ------------------------------------------------ |
| `HubMilestonesOrientation` | `'vertical' \| 'horizontal'`                     |
| `HubMilestoneState`        | `'complete' \| 'active' \| 'pending' \| 'error'` |
| `HubMilestonesConfig`      | `{ reveal?: boolean; stateLabels?: Partial<Record<HubMilestoneState, string>> }` |

`HUB_MILESTONES_CONFIG` — the `InjectionToken<HubMilestonesConfig>` that `provideHubMilestones()` fills — is exported as well. Read it with `inject(HUB_MILESTONES_CONFIG, { optional: true })` when you need the resolved application defaults, or provide it yourself to scope them to one part of the tree.

## 🎨 Styling

The library is themed entirely through `--hub-milestone-*` CSS variables, with safe fallbacks so it works standalone and re-themes at runtime. Override them on `:root`, on a `hub-milestones` selector, or per node via the `color` input.

All three reach the component. The defaults ship inside a `:where(:root)` block, which scores zero specificity, so a rule you write anywhere — `:root`, `html`, `hub-milestones`, a wrapper class — outranks them without `!important`. The closer the selector, the narrower the scope: `:root` re-themes every timeline in the application, `hub-milestones` only the ones matching that selector, and the `color` input a single node.

| CSS Variable                           | Default                                        | Description                                                          |
| -------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------- |
| `--hub-milestone-node-size`            | `2.75rem`                                      | Diameter of the node circle.                                        |
| `--hub-milestone-node-font-size`       | `1.05rem`                                      | Font size of the node content.                                      |
| `--hub-milestone-node-color`           | `var(--hub-sys-color-primary, #0d6efd)`        | Node background color (complete/active). Also drives the trail.     |
| `--hub-milestone-node-text`            | `var(--hub-ref-color-white, #ffffff)`          | Node text/content color.                                            |
| `--hub-milestone-pending-bg`           | `var(--hub-sys-surface-elevated, #f8f9fa)`     | Background of a pending node.                                       |
| `--hub-milestone-pending-color`        | `var(--hub-sys-text-muted, #6c757d)`           | Text color of a pending node.                                       |
| `--hub-milestone-pending-border`       | `var(--hub-sys-border-color-default, #dee2e6)` | Border of a pending node.                                          |
| `--hub-milestone-error-bg`             | `var(--hub-sys-color-danger, #dc3545)`         | Background of an error node.                                       |
| `--hub-milestone-connector-thickness`  | `3px`                                          | Thickness of the connecting rail.                                  |
| `--hub-milestone-connector-bg`         | falls back to `--hub-milestone-node-color`     | Connector fill for completed segments. Unset, it follows the node accent, including a per-node `color`. |
| `--hub-milestone-connector-pending-bg` | `var(--hub-sys-border-color-default, #dee2e6)` | Connector fill for segments leading into a pending node.           |
| `--hub-milestone-gap`                  | `1rem`                                         | Gap between the node and its body.                                 |
| `--hub-milestone-spacing`              | `1.75rem`                                      | Spacing between consecutive milestones.                            |
| `--hub-milestone-body-color`           | `var(--hub-sys-text-primary, #212529)`         | Body text color.                                                   |
| `--hub-milestone-body-muted`           | `var(--hub-sys-text-muted, #6c757d)`           | Muted body text color.                                            |
| `--hub-milestone-pulse-color`          | `var(--hub-milestone-node-color)`              | Color of the active-node pulse wave (`[pulse]`).                  |
| `--hub-milestone-pulse-duration`       | `1.6s`                                         | Duration of one pulse cycle.                                      |
| `--hub-milestone-pulse-spread`         | `0.75rem`                                      | How far the pulse wave expands from the node.                    |
| `--hub-milestone-reveal-duration`      | `0.5s`                                         | Duration of each connector's fill during the viewport reveal.    |
| `--hub-milestone-reveal-stagger`       | `0.14s`                                        | Delay between consecutive connectors filling (cascading reveal). |

Framework-agnostic customization example:

```scss
hub-milestones {
	--hub-milestone-node-size: 3rem;
	--hub-milestone-node-color: #2563eb; // also tints the connector trail
	--hub-milestone-spacing: 2rem;
}
```

Bootstrap integration example (optional):

```scss
hub-milestones {
	--hub-milestone-node-color: var(--bs-primary);
	--hub-milestone-error-bg: var(--bs-danger);
	--hub-milestone-pending-bg: var(--bs-secondary-bg);
	--hub-milestone-body-color: var(--bs-body-color);
}
```

### One-call Sass theming

For Sass projects the library ships its stylesheets at `ng-hub-ui-milestones/styles`, where the `hub-milestones-theme()` mixin writes the `--hub-milestone-*` tokens in a single include. Every parameter is optional and defaults to `null`, so only the ones you pass are emitted and the rest keep the component defaults.

```scss
@use 'ng-hub-ui-milestones/styles' as *;

.onboarding {
	@include hub-milestones-theme($node-color: var(--hub-sys-color-primary), $connector-thickness: 3px);
}
```

Available parameters: `$node-color`, `$node-text`, `$node-size`, `$node-font-size`, `$connector-bg`, `$connector-pending-bg`, `$connector-thickness`, `$pending-bg`, `$pending-border`, `$pending-color`, `$error-bg`, `$body-color`, `$body-muted`, `$gap`, `$spacing`.

> The component tokens are singular (`--hub-milestone-*`) while the package and the mixin are plural (`ng-hub-ui-milestones` / `hub-milestones-theme`).

## 📝 Changelog

See the full [CHANGELOG.md](./CHANGELOG.md) for the complete version history.

## 🤝 Contributing

Contributions are welcome. Please open an issue to discuss significant changes before submitting a pull request, and follow the existing code style and conventions.

- Repository: https://github.com/hub-env/ng-hub-ui-milestones
- Issues: https://github.com/hub-env/hub-ui/issues

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/hub-env/hub-ui/issues)
- **Author**: [Carlos Morcillo](https://www.carlosmorcillo.com)

## 📄 License

MIT © [Carlos Morcillo](https://www.carlosmorcillo.com)

---

Made with ❤️ by the Hub UI team
