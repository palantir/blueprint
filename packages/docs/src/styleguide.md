@# Blueprint

Blueprint is a React-based UI toolkit for the web.

Development and issue tracking occurs in [github.com/palantir/blueprint](https://github.com/palantir/blueprint).

Releases are tagged and documented [here on GitHub](https://github.com/palantir/blueprint/releases).

Use the [__blueprintjs__ tag on Stack Overflow](http://stackoverflow.com/questions/tagged/blueprintjs)
for support requests.

@## Browser support

**Blueprint supports Chrome, Firefox, Safari, IE 11, and Microsoft Edge.**

You may experience degraded visuals in IE.
IE 10 and below are unsupported due to their lack of support for CSS Flexbox Layout.
These browsers were deprecated by Microsoft (end of support) in [January 2016](https://www.microsoft.com/en-us/WindowsForBusiness/End-of-IE-support).

@## Usage

Blueprint is available as a collection of NPM packages under the `@blueprintjs` scope. The full
package list and their latest versions appear under the _Releases_ dropdown above.

Each package contains a CSS file and a collection of CommonJS modules exposing React components.
The `main` module exports all symbols from all modules so you don't have to import individual files
(though you can if you want to). The JavaScript components are stable and their APIs adhere to
[semantic versioning](http://semver.org/).

@### NPM installation

1. Install the core package with an NPM client like `npm` or `yarn`, pulling in all relevant
dependencies:

  ```sh
  npm install --save @blueprintjs/core
  ```

1. If you see `UNMET PEER DEPENDENCY` errors, you should manually install React:

  ```sh
  npm install --save react react-dom react-addons-css-transition-group
  ```

1. After installation, you'll be able to import the React components in your application:

  ```tsx
  // extract specific components
  import { Intent, Spinner, DatePickerFactory } from "@blueprintjs/core";
  // or just take everything!
  import * as Blueprint from "@blueprintjs/core";

  // using JSX:
  const mySpinner = <Spinner intent={Intent.PRIMARY} />;

  // using the namespace import:
  const anotherSpinner = <Blueprint.Spinner intent={Blueprint.Intent.PRIMARY}/>;

  // use factories for React.createElement shorthand if you're not using JSX.
  // every component provides a corresponding <Name>Factory.
  const myDatePicker = DatePickerFactory();
  ```

1. Don't forget to include the main CSS file from each Blueprint package! Additionally, the
`resources/` directory contains supporting media such as fonts and images.

  ```html
  <!-- in plain old reliable HTML -->
  <!DOCTYPE HTML>
  <html>
    <head>
      ...
      <!-- include dependencies manually -->
      <link href="path/to/node_modules/normalize.css/normalize.css" rel="stylesheet" />
      <link href="path/to/node_modules/@blueprintjs/core/dist/blueprint.css" rel="stylesheet" />
      ...
    </head>
    ...
  </html>
  ```

  ```css.scss
  // or, using node-style package resolution in a CSS file:
  // (dependencies' stylesheets should be resolved automatically)
  @import "~@blueprintjs/core";
  ```

@### CDN consumption

Blueprint supports the venerable [unpkg CDN](https://unpkg.com). Each package provides a UMD
`dist/[name].bundle.js` file containing the bundled source code. The UMD wrapper exposes each
library on the `Blueprint` global variable: `Blueprint.Core`, `Blueprint.Datetime`, etc.

These bundles _do not include_ external dependencies; your application will need to ensure that
`normalize.css`, `React`, `classnames`, and `Tether` are available at runtime.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>Blueprint Starter Kit</title>
    <link href="https://unpkg.com/normalize.css@^4.1.1" rel="stylesheet" />
    <link href="https://unpkg.com/@blueprintjs/core@^1.11.0/dist/blueprint.css" rel="stylesheet" />
  </head>
  <body>
    <script src="https://unpkg.com/classnames@^2.2"></script>
    <script src="https://unpkg.com/tether@^1.4"></script>
    <script src="https://unpkg.com/react@^15.3.1/dist/react-with-addons.min.js"></script>
    <script src="https://unpkg.com/react-dom@^15.3.1/dist/react-dom.min.js"></script>
    <script src="https://unpkg.com/@blueprintjs/core@^1.11.0"></script>

    <div id="btn"></div>
    <script>
      const button = React.createElement(Blueprint.Core.Button, {
        iconName: "predictive-analysis",
        text: "CDN Blueprint is go!",
      });
      ReactDOM.render(button, document.querySelector("#btn"));
    </script>
  </body>
</html>
```

@### DOM4

Blueprint relies on a handful of DOM Level 4 API methods: `el.query`, `el.queryAll`, and
`el.closest()`. `@blueprintjs/core` depends on a [polyfill library called `dom4`][dom4] to ensure
these methods are available. This module is conditionally loaded if Blueprint is used in a browser
environment.

[dom4]: https://webreflection.github.io/dom4/

@### TypeScript

Blueprint is written in TypeScript and therefore its own `.d.ts` type definitions are distributed in
the NPM package and should be resolved automatically by the compiler. However, you'll need to
install typings for Blueprint's dependencies before you can consume it:

```sh
# required for all @blueprintjs packages:
npm install --save @types/pure-render-decorator @types/react @types/react-dom @types/react-addons-css-transition-group

# @blueprintjs/datetime requires:
npm install --save @types/moment

# @blueprintjs/table requires:
npm install --save @types/es6-shim
```

<div class="pt-callout pt-intent-primary pt-icon-info-sign">
  For more information, see the TypeScript Handbook for
  [guidance on consuming declaration files][handbook].
</div>

[handbook]: https://www.typescriptlang.org/docs/handbook/declaration-files/consumption.html

@### Vanilla JS APIs

JS components are built using React, but that does not limit their usage to just React applications.
You can render any component in any JavaScript application with `ReactDOM.render`. Think of it like
using a jQuery plugin.

```tsx
const myContainerElement = document.querySelector(".my-container");

// with JSX
ReactDOM.render(
    <Spinner className="pt-intent-primary pt-small" />,
    myContainerElement
);

// with vanilla JS, use the factory
ReactDOM.render(
    SpinnerFactory({
        className: "pt-intent-primary pt-small"
    }),
    myContainerElement
);
```

To remove the component from the DOM and clean up, unmount it:

```tsx
ReactDOM.unmountComponentAtNode(myContainerElement);
```

Check out the [React API docs](https://facebook.github.io/react/docs/react-api.html) for more details.


You'll need to install React `v15.x` or `v0.14.x` alongside Blueprint.

```sh
npm install --save @blueprintjs/core react react-dom react-addons-css-transition-group
```

Import components from the `@blueprintjs/core` module into your project.
Don't forget to include the main CSS stylesheet too!

**Review the [general usage docs](#components.usage) for more complete installation instructions.**

@## Understanding TypeScript

Blueprint is written in [TypeScript](https://www.typescriptlang.org/), a statically typed superset
of JavaScript that compiles to plain JavaScript. All the code samples throughout this site and
all interactive examples are also written in TypeScript. TypeScript code looks exactly like ES2015+
code with the addition of type signatures, which typically appear after colons and are colored
gold in our syntax theme.

```ts
// variables
const variableName: varType;
const name: string;
const disabled: boolean;

// functions (and function variables)
function funcName(arg1: argType, arg2: argType): returnType { }
const funcName: (arg1: argType) => returnType;
function split(str: string, delim: string): string[] { }
function map<T, U>(array: T[], iterator: (item: T, index: number) => U): U[];

// interfaces describe plain objects
// (we use the convention that interfaces begin with "I")
interface IOption {
  label: string;
  value: string;
}
const option: IOption = { label: "Name", value: "gilad" };
```

**You do not need to use TypeScript to consume Blueprint** (but major "props" if you do). Familiarity
with the syntax is suggested so you can follow our examples
([the handbook](https://www.typescriptlang.org/docs/handbook/basic-types.html) has good documentation
for getting started). Simply ignoring the type annotations in your head will produce valid ES2015 code.

@## Development & contributions

Most dev-related information is on [our GitHub wiki](https://github.com/palantir/blueprint/wiki),
including our [coding guidelines](https://github.com/palantir/blueprint/wiki/Coding-guidelines)
and our [development practices](https://github.com/palantir/blueprint/wiki/Development-Practices).
