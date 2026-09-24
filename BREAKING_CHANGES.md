# Breaking Changes — ng-hub-ui-milestones

## [22.7.0] - 2026-09-24

### A milestone node's ink follows its colour instead of always being white

- **Change**: `.hub-milestone__node` no longer paints its content with a fixed white. It reads
  `var(--hub-milestone-node-text, oklch(from var(--hub-milestone-node-color) clamp(0, (0.62 - l) * 1000, 1) 0 h))`,
  which is black on a light disc and white on a dark one. `--hub-milestone-node-text` is
  accordingly no longer declared in the root token block.

- **Why**: the disc's colour belongs to the consumer and the ink did not follow it. Every accent
  lighter than mid-grey printed white on a bright circle: `#f59e0b` measured 2.15:1, `#0ea5e9`
  2.77:1 and `#16a34a` 3.30:1 against the 4.5:1 that text of that size has to reach. It is the
  same decision the design system already makes for `--hub-sys-color-*-on`, now made here too so
  one accent cannot take two different inks.

- **Impact — visible, and only on light discs.** A node whose colour is dark keeps white ink and
  does not move; the nine ds accents all keep the ink they had. A node coloured with a light or
  mid accent flips from white to black, which is the point. Anything that read
  `var(--hub-milestone-node-text)` expecting a value to be there now gets the fallback it wrote,
  since the token is no longer declared by default.

- **What happens if you do nothing**: light-accented nodes become readable. If you need the old
  behaviour — white on everything — declare `--hub-milestone-node-text: #ffffff` yourself; it is
  read before the derivation and still wins.

## [22.6.0] - 2026-09-23

### Angular below 17.3.0 is no longer supported

- **Change**: the `@angular/*` peer ranges move from `>=17.2.0` to `>=17.3.0`.

- **Why**: Its published `.d.ts` names `InputSignalWithTransform` or `OutputEmitterRef`, which Angular did not ship until 17.3.

- **Impact — an application below 17.3.0 gets a peer warning where it used to get a build error.**
  Nothing that worked stops working: those versions never compiled against this package. Upgrade
  Angular to 17.3.0 or stay on the previous release.

## [22.4.0] - 2026-09-07

### An application's own `:root` now outranks the token defaults

- **Change**: the component is unencapsulated, so its `:root` block of `--hub-milestone-*`
  defaults lands in the global stylesheet and matches the same element, with the same
  specificity, as the application's own `:root`. Ties go to whichever sheet was injected last,
  which is the component's — always. The block is now `:where(:root)`, which scores zero, so the
  consumer's rule wins on specificity instead of on injection order.
- **Impact**: a `:root` rule for this library that had no effect now has one, and the timeline
  changes on screen. Everything else is untouched: same tokens, same declarations, same values,
  and a `hub-milestones { … }` rule or the per-node `color` input behave exactly as before —
  those already won, because they declare on the element rather than relying on inheritance.
- **Migration**: none, unless a `:root` block for this library was written, found ineffective and
  left behind. Delete it, or make it say what you mean.

## [22.3.0] - 2026-07-28

### `ng-hub-ui-utils` is now a required peer dependency

- **Change**: accent resolution moved to the canonical `resolveHubAccent` from `ng-hub-ui-utils`.
  The private copy under `src/lib/shared/resolve-hub-accent.ts` was deleted, so the package now
  declares `"ng-hub-ui-utils": ">=22.7.0"` in its `peerDependencies`.
- **Impact**: an application that installed `ng-hub-ui-milestones` on its own no longer builds —
  the import cannot be resolved. npm 7+ installs missing peers automatically, so the breakage
  shows up on the setups that do not: pnpm and yarn with strict peers, a CI install from a
  lockfile written before 22.3.0, or any workspace that keeps `legacy-peer-deps` on. Rendering
  and the resolved colours are unchanged: the deleted copy had not diverged from the canonical
  helper.
- **Migration**: install the package alongside this one.

    ```bash
    npm install ng-hub-ui-utils
    ```

    Applications set up through `ng add ng-hub-ui` already have it and need no change.

## [21.0.0] - 2026-06-14

Initial release. No breaking changes.

The major version starts at `21` to match the rest of the `ng-hub-ui` family, whose major always
tracks the targeted Angular major — it does not imply twenty earlier releases of this library.
