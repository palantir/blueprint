<img height="204" src="https://cloud.githubusercontent.com/assets/464822/20228152/d3f36dc2-a804-11e6-80ff-51ada2d13ea7.png">

# [Blueprint](http://blueprintjs.com/) [TSLint](https://palantir.github.io/tslint) configuration

Blueprint is a React UI toolkit for the web.

This package contains configuration for [TSLint](https://palantir.github.io/tslint) (the TypeScript linter) and a handful of new rules specifically for use when developing against Blueprint libraries

## Installation

```
yarn add @blueprintjs/tslint-config tslint
```

## Basic usage

Simply extend this package in your `tslint.json` to use the default rules configuration. This configuration is applicable to any codebase (you do not have to use Blueprint packages).

`tslint.json`
```json
{
  "extends": "@blueprintjs/tslint-config"
}
```

## Advanced usage

To enable the Blueprint-specific rules which enforce semantics particular to `@blueprintjs` packages, add another `extends` entry.

`tslint.json`
```json
{
  "extends": [
    "@blueprintjs/tslint-config",
    "@blueprintjs/tslint-config/blueprint-rules"
  ]
}
```

### Rules

#### `blueprint-classes-constants`
Enforce usage of `Classes` constants over namespaced string literals.

```tsx
// Bad
const element = <div className="pt-navbar" />;

// Good
const element = <div className={Classes.NAVBAR} />;
```

```json
{
    "rules": {
        // enable:
        "blueprint-classes-constants": true,
        // disable:
        "blueprint-classes-constants": false,
    }
}
```

#### `blueprint-icon-components`

Enforce usage of JSX `Icon` components over `IconName` string literals (or vice-versa) in `icon` JSX props. Note that this rule only supports hardcoded values in the `icon` prop; it does not handle expressions or conditionals.

This rule is disabled in the `blueprint-rules` config as it is most useful to ensure that the `@blueprintjs/icons` package can be tree-shaken (an opt-in process which requires using components and _never_ `IconName` literals).

**Rule options:** `["component", "literal"]`

```json
{
    "rules": {
        // enforce `icon={<TickIcon />}` usage:
        "blueprint-icon-components": [true, "component"],
        // enforce `icon="tick"` usage:
        "blueprint-icon-components": [true, "literal"],
        // allow either usage:
        "blueprint-icon-components": [false],
    }
}
```


### [Full Documentation](http://blueprintjs.com/docs) | [Source Code](https://github.com/palantir/blueprint)
