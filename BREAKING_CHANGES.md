# Breaking Changes — ng-hub-ui-milestones

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
