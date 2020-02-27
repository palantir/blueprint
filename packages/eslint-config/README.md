<img height="204" src="https://cloud.githubusercontent.com/assets/464822/20228152/d3f36dc2-a804-11e6-80ff-51ada2d13ea7.png">

# [Blueprint](http://blueprintjs.com/) [ESLint](https://eslint.org/) Configuration

Blueprint is a React UI toolkit for the web.

This package contains the [ESLint](https://eslint.org/) configuration for Blueprint. It enables lint rules which enforce code style conventions and enables the `@blueprintjs/eslint-plugin-blueprint` plugin.

## Installation

```
yarn add @blueprintjs/eslint-plugin-blueprint
```

## Usage

Enable this configuration in your ESLint configuration file (e.g. `.eslintrc.json`):

```json
{
    "extends": [
        "@blueprintjs/eslint-config"
    ]
}
```

### Disabling rules with inline code comments

This configuration runs TSLint rules through typescript-eslint, which means inline rule flags look a little different from [TSLint's rule flags](https://palantir.github.io/tslint/usage/rule-flags/).

To disable a TSLint rule, follow the ESLint [documentation](https://eslint.org/docs/user-guide/configuring#disabling-rules-with-inline-comments) and insert code comments like this (substituing `<tslint-rule-name>` with the snake-case TSLint rule name):

```ts
/* eslint-disable @typescript-eslint/tslint/<tslint-rule-name> */
...
/* eslint-enable @typescript-eslint/tslint/<tslint-rule-name> */

/* eslint-disable @typescript-eslint/tslint/<tslint-rule-name> */
```
