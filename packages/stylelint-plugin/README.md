<img height="204" src="https://cloud.githubusercontent.com/assets/464822/20228152/d3f36dc2-a804-11e6-80ff-51ada2d13ea7.png">

# [Blueprint](http://blueprintjs.com/) [stylelint](https://stylelint.io/) plugin

Blueprint is a React UI toolkit for the web.

This package contains the [stylelint](https://stylelint.io/) plugin for Blueprint. It provides custom rules which are useful when developing against Blueprint libraries.

**Key features:**

-   [Blueprint-specific rules](#Rules) for use with `@blueprintjs` components.

## Installation

```
yarn add --dev @blueprintjs/stylelint-plugin
```

## Usage

Simply add this plugin in your `.stylelintrc` file and then pick the rules that you need. The plugin includes Blueprint-specific rules which enforce semantics particular to usage with `@blueprintjs` packages, but does not turn them on by default.

`.stylelintrc`

```json
{
    "plugins": [
        "@blueprintjs/stylelint-plugin"
    ],
    "rules": {
        "@blueprintjs/no-color-literal": true,
        "@blueprintjs/no-prefix-literal": true
    }
}
```

## Rules

### `@blueprintjs/no-color-literal` (autofixable)

Enforce usage of the color variables instead of color literals.

```json
{
    "rules": {
        "@blueprintjs/no-color-literal": true
    }
}
```

```diff
-.my-class {
-    border: 1px solid #137CBD;
-}
+ @import "~@blueprintjs/core/lib/scss/variables";
+
+.my-class {
+    border: 1px solid $blue3;
+}
```

Optional secondary options:

- `disableFix: boolean` - if true, autofix will be disabled
- `variablesImportPath: { less?: string, sass?: string }` - can be used to configure a custom path for importing Blueprint variables when autofixing.


### `@blueprintjs/no-prefix-literal` (autofixable)

Enforce usage of the `bp-ns` constant over namespaced string literals.

The `@blueprintjs` package exports a `bp-ns` CSS variable which contains the prefix for the current version of Blueprint (`bp3` for Blueprint 3, `bp4` for Blueprint 4, and etc). Using the variable instead of hardcoding the prefix means that your code will still work when new major version of Blueprint is released.

```json
{
    "rules": {
        "@blueprintjs/no-prefix-literal": true
    }
}
```

```diff
-.bp3-button > div {
-    border: 1px solid black;
-}
+ @import "~@blueprintjs/core/lib/scss/variables";
+
+.#{$bp-ns}-button > div {
+    border: 1px solid black;
+}
```

Optional secondary options:

- `disableFix: boolean` - if true, autofix will be disabled
- `variablesImportPath: { less?: string, sass?: string }` - can be used to configure a custom path for importing Blueprint variables when autofixing.


### [Full Documentation](http://blueprintjs.com/docs) | [Source Code](https://github.com/palantir/blueprint)
