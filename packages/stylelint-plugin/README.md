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
    "plugins": ["@blueprintjs/stylelint-plugin"],
    "rules": {
        "@blueprintjs/no-color-literal": true,
        "@blueprintjs/no-prefix-literal": true,
        "@blueprintjs/prefer-spacing-variable": true
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
+ @use "@blueprintjs/core/lib/scss/variables.scss" as bp;
+
+.my-class {
+    border: 1px solid bp.$blue3;
+}
```

Optional secondary options:

-   `disableFix: boolean` - if true, autofix will be disabled
-   `variablesImportPath: { less?: string, sass?: string }` - can be used to configure a custom path for importing Blueprint variables when autofixing.

### `@blueprintjs/no-prefix-literal` (autofixable)

Enforce usage of the `bp-ns` constant over namespaced string literals.

The `@blueprintjs` package exports a `bp-ns` CSS variable which contains the prefix for the current version of Blueprint (`bp3` for Blueprint 3, `bp4` for Blueprint 4, and etc).
Using the variable instead of hardcoding the prefix means that your code will still work when new major version of Blueprint is released.

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
+ @use "@blueprintjs/core/lib/scss/variables.scss" as bp;
+
+.#{bp.$ns}-button > div {
+    border: 1px solid black;
+}
```

Optional secondary options:

-   `disableFix: boolean` - if true, autofix will be disabled
-   `variablesImportPath: { less?: string, sass?: string }` - can be used to configure a custom path for importing Blueprint variables when autofixing.

### `@blueprintjs/prefer-spacing-variable` (autofixable)

Enforce usage of the new `$pt-spacing` variable instead of the deprecated `$pt-grid-size` variable.

Blueprint is migrating from a 10px-based grid system (`$pt-grid-size`) to a 4px-based spacing system (`$pt-spacing`) to provide more flexible spacing options and improve consistency. This rule helps automate the migration by detecting deprecated variable usage and automatically converting expressions with proper multiplier adjustments.

```json
{
    "rules": {
        "@blueprintjs/prefer-spacing-variable": true
    }
}
```

```diff
-.my-class {
-    padding: $pt-grid-size;
-    margin: $pt-grid-size * 2;
-    width: $pt-grid-size / 2;
-}
+.my-class {
+    padding: $pt-spacing * 2.5;
+    margin: $pt-spacing * 5;
+    width: $pt-spacing / 0.8;
+}
```

The rule automatically converts mathematical expressions by applying the 2.5x conversion factor (since `$pt-grid-size` is 10px and `$pt-spacing` is 4px).

**Conversion examples:**

-   `$pt-grid-size` → `$pt-spacing * 2.5`
-   `$pt-grid-size * 2` → `$pt-spacing * 5`
-   `2 * $pt-grid-size` → `5 * $pt-spacing`
-   `$pt-grid-size / 2` → `$pt-spacing / 0.8`
-   `bp.$pt-grid-size * 1.5` → `bp.$pt-spacing * 3.75`
-   `calc($pt-grid-size * 1.5)` → `calc($pt-spacing * 3.75)`

Optional secondary options:

-   `disableFix: boolean` - if true, autofix will be disabled
-   `variablesImportPath: { less?: string, sass?: string }` - can be used to configure a custom path for importing Blueprint variables when autofixing.

**See also:** [Spacing System Migration Guide](https://github.com/palantir/blueprint/wiki/Spacing-System-Migration:-10px-to-4px)

### [Full Documentation](http://blueprintjs.com/docs) | [Source Code](https://github.com/palantir/blueprint)
