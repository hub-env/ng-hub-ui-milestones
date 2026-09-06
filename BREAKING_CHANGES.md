# Breaking Changes — ng-hub-ui-milestones

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
