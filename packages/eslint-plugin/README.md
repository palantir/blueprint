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

Simply add this plugin in your `.eslintrc` file to use the add the plugin. The plugin includes Blueprint-specific rules which enforce semantics particular to usage with `@blueprintjs` packages, but does not turn them on by default.

`.eslintrc`

```json
plugins: [
    "@blueprintjs"
]
```

### Rules-only usage

To enable the Blueprint-specific rules, extend the `plugin:@blueprintjs/recommended` config inside the package:

`tslint.json`

```diff
extends: [
+    "plugin:@blueprintjs/recommended"
]
```

## Rules

### `@blueprintjs/classes-constants`

Enforce usage of `Classes` constants over namespaced string literals.

Each `@blueprintjs` package exports a `Classes` object that contains constants for every CSS class defined by the package. While the values of the constants may change between releases, the names of the constants will remain more stable.

```json
{
    "rules": {
        "@blueprintjs/classes-constants": ["error"]
    }
}
```

```diff
-const element = <div className="pt-navbar" />;
+const element = <div className={Classes.NAVBAR} />;
```

### `@blueprintjs/html-components`

Enforce usage of Blueprint components over regular html components.

-   h1-6 -> H1-6
-   code -> Code
-   pre -> Pre
-   blockquote -> Blockquote
-   table -> HTMLTable

```js
{
  "rules": {
    "@blueprintjs/html-components": ["error"],
  }
}
```

### `@blueprintjs/icon-components`

Enforce usage of JSX `Icon` components over `IconName` string literals (or vice-versa) in `icon` JSX props. Note that this rule only supports hardcoded values in the `icon` prop; it does not handle expressions or conditionals.

A fixer is available for this rule that will convert between string literals and named `Icon` components. Note that the implementation is naive and may require intervention, such as to import a component or fix an invalid name.

Named icon components (`TickIcon`, `GraphIcon`, etc) can be imported from the `@blueprintjs/icons` package.

This rule is disabled in the `blueprint-rules` config as it is most useful to ensure that the `@blueprintjs/icons` package can be tree-shaken (an opt-in process which requires using components and _never_ `IconName` literals).

```js
{
  "rules": {
    // default uses "component"
    "@blueprintjs/icon-components": ["error"],
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

### [Full Documentation](http://blueprintjs.com/docs) | [Source Code](https://github.com/palantir/blueprint)
