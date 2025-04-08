# Yarn Patch Guidelines

This directory contains patches applied to dependencies using Yarn's patching mechanism. While this is a powerful feature, it has caused problems for downstream consumers of Blueprint packages in the past.

## When to Use Yarn Patches

### ✅ ACCEPTABLE

-   **DevDependencies Only**: Only use patches for dependencies that are used during development/build time and are not part of the published package dependencies.
-   **Internal Tooling**: Patches for tools used only within the monorepo.
-   **Temporary Fixes**: As a temporary solution while waiting for an upstream fix to be released.

### ❌ NOT ACCEPTABLE

-   **Runtime Dependencies**: Never patch dependencies that will be included in the published package's dependencies or peerDependencies.
-   **Public Packages**: Avoid patching dependencies for packages that are published to npm and consumed by other applications.

## Why This Matters

The `patch:` protocol used by Yarn is not supported by all package managers (npm, older Yarn versions, etc.). When we publish packages that rely on patched dependencies, downstream consumers may encounter errors like:

-   `EUNSUPPORTEDPROTOCOL`: When a consumer tries to install our package with npm or other package managers
-   Installation failures when the patched dependency cannot be resolved
-   Unpredictable behavior when the patched code doesn't exist in the consumer's environment

## Real-World Issues We've Encountered

-   [#7289](https://github.com/palantir/blueprint/issues/7289) - `@blueprintjs/eslint-config@6.0.10` caused `EUNSUPPORTEDPROTOCOL` errors for consumers
-   [#7172](https://github.com/palantir/blueprint/issues/7172) - Patched `react-day-picker` dependency in `@blueprintjs/datetime@5.3.20` broke app-level installs

## Documentation

For more information about Yarn's patching mechanism, see:

-   [Yarn Package patching](https://yarnpkg.com/features/patching)
-   [Yarn Patch Protocol](https://yarnpkg.com/protocol/patch)
-   [`yarn patch` Documentation](https://yarnpkg.com/cli/patch)
