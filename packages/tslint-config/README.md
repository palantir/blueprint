<img height="204" src="https://cloud.githubusercontent.com/assets/464822/20228152/d3f36dc2-a804-11e6-80ff-51ada2d13ea7.png">

# [Blueprint](http://blueprintjs.com/) [TSLint](https://palantir.github.io/tslint) configuration

Blueprint is a React UI toolkit for the web.

This package contains configuration for [TSLint](https://palantir.github.io/tslint) (the TypeScript linter) and a handful of new rules specifically for use when developing against Blueprint libraries.

**Key features:**

- React & JSX rules from [tslint-react](https://github.com/palantir/tslint-react).
- [Prettier](https://github.com/prettier/prettier) integration for consistent code style and automatic fixes.
- [Blueprint-specific rules](#Rules) for use with `@blueprintjs` components.

## Installation

```
yarn add @blueprintjs/tslint-config tslint
```

## Usage

Simply extend this package in your `tslint.json` to use the default rules configuration. This configuration includes Blueprint-specific rules which enforce semantics particular to usage with `@blueprintjs` packages.

`tslint.json`
```json
{
  "extends": "@blueprintjs/tslint-config"
}
```

### Rules-only usage

To enable the Blueprint-specific rules _only_ without the full TSLint config, extend the `blueprint-rules` config inside the package:

`tslint.json`
```diff
{
  "extends": [
+   "@blueprintjs/tslint-config/blueprint-rules"
  ]
}
```

### Editor integration

⭐️ **VS Code:** Enable the `tslint.autoFixOnSave` option to fix all fixable failures every time you save. Most importantly, this will automatically apply the Prettier formatting fixes!

## Rules

### `blueprint-classes-constants`

Enforce usage of `Classes` constants over namespaced string literals.

Each `@blueprintjs` package exports a `Classes` object that contains constants for every CSS class defined by the package. While the values of the constants may change between releases, the names of the constants will remain more stable.

```json
{
  "rules": {
    "blueprint-classes-constants": true,
  }
}
```

```diff
-const element = <div className="pt-navbar" />;
+const element = <div className={Classes.NAVBAR} />;
```

### `blueprint-icon-components`

Enforce usage of JSX `Icon` components over `IconName` string literals (or vice-versa) in `icon` JSX props. Note that this rule only supports hardcoded values in the `icon` prop; it does not handle expressions or conditionals.

A fixer is available for this rule that will convert between string literals and named `Icon` components. Note that the implementation is naive and may require intervention, such as to import a component or fix an invalid name.

Named icon components (`TickIcon`, `GraphIcon`, etc) can be imported from the `@blueprintjs/icons` package.

This rule is disabled in the `blueprint-rules` config as it is most useful to ensure that the `@blueprintjs/icons` package can be tree-shaken (an opt-in process which requires using components and _never_ `IconName` literals).

```js
{
  "rules": {
    // default uses "component"
    "blueprint-icon-components": true,
    // expanded syntax
    "blueprint-icon-components": {
      "options": ["component" | "literal"] // choose one
    }
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
