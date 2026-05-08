## Repository Map
- `src/`: primary source for LCOV parsing, comment generation, GitHub API calls, the local CLI, and unit tests.
- `dist/`: bundled GitHub Action runtime output consumed by `action.yml`; treat `dist/main.js` as a generated release artifact, not a hand-edited source area.
- `.github/workflows/`: PR validation and action self-use in CI.
- `action.yml`: action inputs and runtime contract.
- `README.md`: user-facing usage, contributor commands, and release notes.

## Build, Test, and Development Commands
- Run all commands from the repository root.
- Use `yarn` as the package manager and script entrypoint.
- `yarn`: install dependencies.
- `yarn eslint`: run lint checks for the JavaScript codebase.
- `yarn test`: run Jest tests and generate LCOV coverage output.
- `yarn build`: rebuild `dist/main.js`; run this after source changes that affect action behavior and before opening a PR that changes shipped behavior.
- `yarn format`: apply Prettier to repository JavaScript files.
- `yarn local -- ./coverage/lcov.info [./coverage/lcov-base.info]`: preview the generated coverage comment locally from LCOV files.
- Smallest meaningful validation:
  - For most source changes, run `yarn eslint` and `yarn test`.
  - Run `yarn build` whenever you change action logic, runtime wiring, or anything that can affect `dist/main.js`.
- No separate typecheck command is defined in this repository.

## PR and Commit Conventions
- Contribute through a fork and pull request rather than direct pushes.
- Expect the pre-commit hook to run `lint-staged` on staged `*.js` files.
- Staged JavaScript files are auto-fixed with ESLint and formatted with Prettier before the commit completes.
- Before opening a PR that changes shipped action behavior, ensure the committed `dist/main.js` matches a fresh `yarn build`.

## Constraints and Non-Negotiables
- Keep `dist/main.js` committed and in sync with source changes; CI rebuilds it and fails on drift.
- Keep changes compatible with the published GitHub Action runtime declared in `action.yml` (`node16`), even though CI validates the repo on Node 20.
- Do not treat live PR comment posting as a normal local workflow: the action requires GitHub pull request context and a `github-token`.
- For local development, prefer `yarn test` and the `yarn local` CLI helper instead of trying to exercise GitHub API side effects directly.
- `coverage/` is generated test output ignored by Git; do not treat it as source or a committed artifact.
