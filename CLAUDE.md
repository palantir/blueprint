# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Blueprint is a React UI toolkit shipped as a set of npm packages from one pnpm + Nx monorepo.
`packages/core` holds most components; the others build on it (`select`, `datetime`,
`datetime2`, `table`, `labs`) or support it (`icons`, `colors`, `eslint-plugin`,
`node-build-scripts`).

Every component is a pair: a React component in `packages/<pkg>/src/components/<name>/` and a
Sass partial next to it. The TypeScript emits class names and the Sass styles them — neither
half works alone, so a visual change usually touches both.

`develop` is the integration branch; PRs target it.

## Setup

Node **>= 24.14.1** (see `.nvmrc`) and pnpm 11 are both enforced by `engines`. `nvm use` picks
up the right Node.

```bash
pnpm install
pnpm compile      # required before tests: packages import each other's built lib/ output
```

`pnpm compile` is not optional on a fresh clone. Tests and Sass builds resolve
`@blueprintjs/icons` and `@blueprintjs/colors` through their built `lib/` directories, so
before the first build you get errors like `Failed to resolve entry for package
"@blueprintjs/icons"` or `Can't find stylesheet to import: @blueprintjs/colors/...`. Those mean
"not built yet", not "broken code".

Prefer Nx over running a package script directly, because Nx builds dependencies first:

```bash
pnpm nx compile @blueprintjs/core       # builds colors + icons first
pnpm nx test @blueprintjs/core
```

## Commands

```bash
pnpm verify            # compile + dist + test + lint + format-check (the full gate)
pnpm compile           # build all packages
pnpm lint              # eslint + stylelint across packages
pnpm lint-fix          # autofix both
pnpm format            # prettier --write (lint does NOT check formatting)
pnpm format-check      # prettier --check
pnpm dev:core          # watch core + icons + docs app on http://localhost:9000
pnpm storybook         # component playground on http://localhost:6006
```

Formatting is deliberately separate from linting: `pnpm lint` will pass on badly formatted
code, and CI fails it in a distinct `format-check` job. Run `pnpm format` before pushing.

Inside a package, `pnpm test` runs type-check, isotests, and Vitest. For one file:

```bash
cd packages/core && pnpm exec vitest run src/components/tabs/tabs.test.tsx
pnpm exec vitest                                    # watch mode
```

CI is CircleCI (`.circleci/config.yml`), with separate `compile`, `dist`, `lint`,
`format-check`, and test jobs. **Do not enable CircleCI on a fork** — CONTRIBUTING explains
that Palantir's pipeline builds PR branches itself and a fork pipeline interferes.

## Architecture

### Class names are the contract

`packages/core/src/common/classes.ts` defines every class name as a constant (`Classes.TAB`,
`Classes.INTENT_DANGER`, …) built from the `bp6-` namespace, plus helpers like
`intentClass(intent)`, `sizeClass(size)`, and `positionClass(position)`. Components compose
them with `classNames()`; Sass reads the same namespace through `$ns`. Never write a literal
`"bp6-…"` on either side.

### Sass conventions

Partials are `_<component>.scss`, imported by `packages/core/src/blueprint.scss`. They
`@import "../../common/variables"` and `"../../common/mixins"`, and a file that calls
`map.get` must declare its own `@use "sass:map"` at the top — `@use` does not travel through
`@import`.

Intents come from maps in `common/_mixins.scss`: `$pt-intent-colors`,
`$pt-intent-text-colors`, `$pt-intent-active-text-colors`, `$pt-dark-intent-text-colors`. The
standard shape is

```scss
@each $intent, $color in $pt-intent-colors {
    .#{$ns}-thing.#{$ns}-intent-#{$intent} {
        color: map.get($pt-intent-text-colors, $intent);
    }
}
```

Dark theme is a `.#{$ns}-dark` ancestor selector, not a media query. Many rules also carry a
`@media (forced-colors: active) and (prefers-color-scheme: dark)` block for Windows High
Contrast — if you add a more specific rule that sets `color` or `background-color`, carry the
forced-colors override with it or you will silently regress high contrast.

### Props

Props interfaces extend `Props` (className) and usually an HTML props type. Public props need
a JSDoc comment with `@default` where applicable: `packages/docs-app` renders the interface
into the docs site from the `@interface FooProps` directive in the component's `.mdx`, so
documenting the prop is what publishes it. Optional visual props are typed `intent?: Intent`,
`size?: Size`, and so on, and read through the matching `Classes` helper.

When spreading rest props onto a DOM node, destructure every non-HTML prop out first (or use
`removeNonHTMLProps`), otherwise React warns about unknown attributes.

## Conventions

**Tests** use Vitest with Enzyme (`mount`) and the `assert` style from
`@blueprintjs/test-commons/vitest`. Tests live next to the component as `<name>.test.tsx`.

**Stories** are `<Name>.stories.tsx` in the component directory, with a JSDoc comment above
each export that becomes the story's description. A new visual feature should get a story —
it is how the change is reviewed and how Chromatic picks it up.

**Branches** follow `[initials]/[short-name]`, e.g. `bd/refactor-buttons`.

**Never `push --force`.** CONTRIBUTING is explicit that amending and force-pushing breaks PR
history; add more commits instead, since each PR is squashed on merge.

A husky pre-commit hook runs `lint-staged` over staged files, so commits may reformat what you
staged.
