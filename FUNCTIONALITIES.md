# Functionalities of Milestones Library

This table details the functionalities of the `ng-hub-ui-milestones` library and indicates which ones are covered by interactive examples.

The library ships two components — `hub-milestones` (the container that lays out the rail) and `hub-milestone` (one node) — plus the `hubMilestoneNode` template directive and the `provideHubMilestones()` environment provider.

## Container (`hub-milestones`)

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **Layout** | Vertical timeline (`orientation="vertical"`) | ✅ |
| | Horizontal progress steps (`orientation="horizontal"`) | ✅ |
| | Automatic 1-based numbering of the projected nodes in DOM order | ✅ |
| | Connector drawn edge to edge between consecutive nodes | ✅ |
| | Accent trail stopping at the `active` node | ✅ |
| **Animation** | Active-node pulse (`[pulse]`) | ✅ |
| | Viewport reveal, on by default | ❌ |
| | Reveal turned off or forced per instance (`[reveal]`) | ❌ |
| | Reveal disabled under `prefers-reduced-motion` | ❌ |
| **Accessibility** | `role="list"` on the container | ❌ |
| **SSR** | Full trail rendered without JavaScript (no `IntersectionObserver` on the server) | ❌ |
| **RTL** | Layout, connectors and reveal mirrored under `dir="rtl"` | ❌ |

## Node (`hub-milestone`)

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **State** | `complete` | ✅ |
| | `active` | ✅ |
| | `pending` | ✅ |
| | `error` | ✅ |
| **Node content** | Auto-generated number when nothing else is given | ✅ |
| | `label` fallback | ✅ |
| | Custom in-circle content (`<ng-template hubMilestoneNode>`) | ✅ |
| | Projected body content beside (vertical) or below (horizontal) the circle | ✅ |
| **Colour** | Literal per-node colour (`#hex`, `rgb()`, `oklch()`, `var()`) | ✅ |
| | Semantic accent name resolved through `resolveHubAccent` (`color="success"`) | ❌ |
| **Accessibility** | `role="listitem"` on each node | ❌ |
| | `aria-current="step"` on the `active` node | ❌ |
| | Rail marked `aria-hidden="true"` so the decorative circle is not announced | ❌ |

## Configuration

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **Provider** | `provideHubMilestones({ reveal })` for application-wide defaults | ❌ |
| | `HUB_MILESTONES_CONFIG` injected directly to read the resolved defaults | ❌ |

## Theming

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **CSS variables** | `--hub-milestone-node-size` | ✅ |
| | `--hub-milestone-node-font-size` | ❌ |
| | `--hub-milestone-node-color` / `-node-text` | ✅ |
| | `--hub-milestone-pending-bg` / `-pending-color` / `-pending-border` | ✅ |
| | `--hub-milestone-error-bg` | ✅ |
| | `--hub-milestone-connector-bg` / `-connector-pending-bg` / `-connector-thickness` | ✅ |
| | `--hub-milestone-gap` / `-spacing` | ✅ |
| | `--hub-milestone-body-color` / `-body-muted` | ❌ |
| | `--hub-milestone-pulse-color` / `-pulse-duration` / `-pulse-spread` | ❌ |
| | `--hub-milestone-reveal-duration` / `-reveal-stagger` | ❌ |
| **Sass** | `hub-milestones-theme()` mixin from `ng-hub-ui-milestones/styles` | ✅ |

---

_Note: ✅ indicates an active interactive example or playground control is available in the documentation. ❌ indicates functionality exists but is only shown as a code snippet, or not shown at all._
