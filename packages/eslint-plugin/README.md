<img height="204" src="https://cloud.githubusercontent.com/assets/464822/20228152/d3f36dc2-a804-11e6-80ff-51ada2d13ea7.png">

# [Blueprint](http://blueprintjs.com/) [ESLint](https://eslint.org/) plugin

Blueprint is a React UI toolkit for the web.

This package contains the [ESLint](https://eslint.org/) plugin for Blueprint. It provides custom rules which are useful when developing against Blueprint libraries.

**Key features:**

-   [Blueprint-specific rules](#Rules) for use with `@blueprintjs` components.

## Installation

```
yarn add --dev @blueprintjs/eslint-plugin
```

## Usage

Add the `"@blueprintjs"` plugin to your ESLint config:

```json
{
    "plugins": [
        "@blueprintjs"
    ]
}
```

### Configure all built-in rules

To enable _all_ rules provided by the plugin the Blueprint-specific rules, extend the `plugin:@blueprintjs/recommended` configuration:

```json
{
    "extends": [
        "plugin:@blueprintjs/recommended"
    ]
}
```

### Configure specific rules

Alternatively, you may enable specific rules provided the plugin:

```json
{
    "rules": {
        "@blueprintjs/classes-constants"
        "@blueprintjs/no-deprecated-components": "error"
    }
}
```

## Rules

### `@blueprintjs/classes-constants`

Enforce usage of class names exported as public API via the `Classes` object instead of string literals like `"bp4-dark"`.

Each `@blueprintjs` package exports a `Classes` object which contains constants for every CSS class defined by the package.

__Rationale__: This is useful to avoid typos in styling or creating Blueprint components, and also helps future-proof your code for major
version bumps of Blueprint where the class namespace (e.g. `bp4-`) changes.

```json
{
    "rules": {
        "@blueprintjs/classes-constants":"error"
    }
}
```

__Has auto-fixer__: ✅

```diff
- const element = <div className="pt-navbar" />;
+ const element = <div className={Classes.NAVBAR} />;
```

### `@blueprintjs/html-components`

Enforce usage of Blueprint components over regular HTML JSX tags:

-   h1-6 -> H1-6
-   code -> Code
-   pre -> Pre
-   blockquote -> Blockquote
-   table -> HTMLTable

__Rationale__: This is uesful to ensure consistent styling of common typographic elements and other basic markup.

__Has auto-fixer__: ✅

```json
{
    "rules": {
        "@blueprintjs/html-components": ["error"]
    }
}
```

### `@blueprintjs/icon-components`

:warning: DEPRECATED: this rule is no longer recommended. Icons modularity / tree shaking will be a first-class feature of Blueprint v5.0.

Enforce usage of JSX `Icon` components instead of `IconName` string literals (or vice-versa) in `icon` JSX props.
Note that this rule only supports hardcoded values in the `icon` prop; it does not handle expressions or conditionals.

A fixer is available for this rule that will convert between string literals and named `Icon` components. Note that the implementation is naive and may require intervention, such as to import a component or fix an invalid name.

Named icon components (`TickIcon`, `GraphIcon`, etc) can be imported from the `@blueprintjs/icons` package.

This rule is disabled in the `blueprint-rules` config as it is most useful to ensure that the `@blueprintjs/icons` package can be tree-shaken (an opt-in process which requires using components and _never_ `IconName` literals).

```js
{
  "rules": {
    // default uses "component"
    "@blueprintjs/icon-components"
    // expanded syntax
    "@blueprintjs/icon-components": ["error", "component" | "literal"] // choose one
  }
}
```

`"component"`

```diff
-<Button icon="tick" />
+<Button icon={<TickIcon />} />
```

`"literal"`

```diff
-<Button icon={<GraphIcon />} />
+<Button icon="graph" />
```

### `@blueprintjs/no-deprecated-components`

Ban usage of deprecated Blueprint components, including:

- AbstractComponent
- AbstractPureComponent
- Breadcrumbs
- CollapsibleList
- DateInput
- DateRangeInput
- DateTimePicker
- MenuItem
- MultiSelect
- PanelStack
- Popover
- Select
- Suggest
- TimezonePicker
- Tooltip

__Rationale__: Many Blueprint components have "V2" variants as a part of their natural API evolution.
Blueprint consumers are recommended to migrate from the deprecated V1 components to their newer V2 counterparts
in order to future-proof their code for the next major version of Blueprint, where the V2 components will become the
only available API and the V1 variants will be removed. Flagging usage of deprecated APIs can be done with other
ESLint rules like `deprecation/deprecation`, but that rule is often too broad to enable as an "error" globally across
a large code base. `@blueprintjs/no-deprecated-components` provides a simpler, more scoped rule which only flags
usage of deprecated Blueprint components in JSX. The idea here is that you can enable this rule as an "error" in ESLint
to prevent any backwards progress in your Blueprint migration as you move from V1 -> V2 APIs in preparation for v5.0.

### `@blueprintjs/no-deprecated-core-components`

Similar to `@blueprintjs/no-deprecated-components`, but only flags usage of deprecated components from the
`@blueprintjs/core` package instead of all `@blueprintjs/` packages.

__Rationale__: In migrations of large code bases, it may be useful to apply more granular rule configuration of
"no-deprecated-components" to make incremental progress towards the newer APIs. This allows you, for example, to flag
deprecated `@blueprintjs/core` component usage as errors while allowing deprecated components from other packages
to pass as lint warnings.

### `@blueprintjs/no-deprecated-datetime-components`

Similar to `@blueprintjs/no-deprecated-components`, but only flags usage of deprecated components from the
`@blueprintjs/core` package instead of all `@blueprintjs/` packages.

__Rationale__: In migrations of large code bases, it may be useful to apply more granular rule configuration of
"no-deprecated-components" to make incremental progress towards the newer APIs. This allows you, for example, to flag
deprecated `@blueprintjs/datetime` component usage as errors while allowing deprecated components from other packages
to pass as lint warnings.

### `@blueprintjs/no-deprecated-select-components`

Similar to `@blueprintjs/no-deprecated-components`, but only flags usage of deprecated components from the
`@blueprintjs/core` package instead of all `@blueprintjs/` packages.

__Rationale__: In migrations of large code bases, it may be useful to apply more granular rule configuration of
"no-deprecated-components" to make incremental progress towards the newer APIs. This allows you, for example, to flag
deprecated `@blueprintjs/select` component usage as errors while allowing deprecated components from other packages
to pass as lint warnings.

### `@blueprintjs/no-deprecated-table-components`

Similar to `@blueprintjs/no-deprecated-components`, but only flags usage of deprecated components from the
`@blueprintjs/table` package instead of all `@blueprintjs/` packages.

__Rationale__: In migrations of large code bases, it may be useful to apply more granular rule configuration of
"no-deprecated-components" to make incremental progress towards the newer APIs. This allows you, for example, to flag
deprecated `@blueprintjs/table` component usage as errors while allowing deprecated components from other packages
to pass as lint warnings.

### `@blueprintjs/no-deprecated-type-references`

Ban usage of deprecated types & interfaces. In most cases, these symbols are deprecated as a result of our new
TypeScript interface naming convention where we've _dropped_ the "I" prefix from interface names. For example,
`IProps` is now `Props`.

__Auto-fixable__.

__Rationale__: Ensure forwards-comaptibility with the next major version of Blueprint and use the auto-fixer as
a codemod.


### [Full Documentation](http://blueprintjs.com/docs) | [Source Code](https://github.com/palantir/blueprint)
