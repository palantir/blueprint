<img height="204" src="https://cloud.githubusercontent.com/assets/464822/20228152/d3f36dc2-a804-11e6-80ff-51ada2d13ea7.png">

# [Blueprint](http://blueprintjs.com/) [ESLint](https://eslint.org/) Configuration

Blueprint is a React UI toolkit for the web.

This package contains the [ESLint](https://eslint.org/) configuration for Blueprint. It enables lint rules which enforce code style conventions and enables the `@blueprintjs/eslint-plugin` plugin.

## Installation

```
yarn add @blueprintjs/eslint-config
```

## Usage

Enable this configuration in your ESLint configuration file (e.g. `.eslintrc.json`):

```json
{
    "extends": ["@blueprintjs/eslint-config"]
}
```

### VSCode

If you use VSCode, install the [dbaeumer.vscode-eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) plugin to lint your code in the editor. We recommend enabling these global VSCode settings:

```json
"editor.formatOnSave": true,
"eslint.format.enable": true
```
