@# Blueprint

Blueprint is a React-based UI toolkit for the web.

Development and issue tracking occurs in [github.com/palantir/blueprint](https://github.com/palantir/blueprint).

Releases are tagged and documented [here on GitHub](https://github.com/palantir/blueprint/releases).

Use the [**blueprintjs** tag on Stack Overflow](http://stackoverflow.com/questions/tagged/blueprintjs)
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
    yarn add @blueprintjs/core
    ```

1. If you see `UNMET PEER DEPENDENCY` errors, you should manually install React:

    ```sh
    yarn add react react-dom react-transition-group
    ```

1. Note that since the minimum supported version of React is [v16](https://reactjs.org/blog/2017/09/26/react-v16.0.html),
   all of its [JavaScript Environment Requirements](https://reactjs.org/docs/javascript-environment-requirements.html) apply to
   Blueprint as well. Blueprint components require the following ES2015 features:

    * `Map`
    * `Set`
    * `Array.fill`
    * `Array.from`

    We recommend polyfilling these features using [es6-shim](https://github.com/paulmillr/es6-shim) or
    [core-js](https://github.com/zloirock/core-js).

1. After installation, you'll be able to import the React components in your application:

    ```tsx
    // extract specific components
    import { Button, Intent, Spinner } from "@blueprintjs/core";
    // or just take everything!
    import * as Blueprint from "@blueprintjs/core";

    // using JSX:
    const mySpinner = <Spinner intent={Intent.PRIMARY} />;

    // using the namespace import:
    const anotherSpinner = <Blueprint.Spinner intent={Blueprint.Intent.PRIMARY} />;

    // use React.createElement if you're not using JSX.
    const myButton = React.createElement(Button, { intent: Intent.SUCCESS }, "button content");
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
        <link href="path/to/node_modules/@blueprintjs/core/lib/css/blueprint.css" rel="stylesheet" />
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
`normalize.css`, `react`, `react-dom`, `react-transition-group`, `classnames`, `popper.js`, and
`react-popper`are available at runtime.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>Blueprint Starter Kit</title>
    <link href="https://unpkg.com/normalize.css@^7.0.0" rel="stylesheet" />
    <link href="https://unpkg.com/@blueprintjs/core@^2.0.0/lib/css/blueprint.css" rel="stylesheet" />
  </head>
  <body>
    <script src="https://unpkg.com/classnames@^2.2"></script>
    <script src="https://unpkg.com/dom4@^1.8"></script>
    <script src="https://unpkg.com/react@^16.2.0/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@^16.2.0/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/react-transition-group@^2.2.1/dist/react-transition-group.min.js"></script>
    <script src="https://unpkg.com/popper.js@^1.12.6/dist/umd/popper.js"></script>
    <script src="https://unpkg.com/react-popper@~0.7.4/dist/react-popper.min.js"></script>
    <script src="https://unpkg.com/@blueprintjs/core@^2.0.0"></script>

    <div id="btn"></div>
    <script>
      const button = React.createElement(Blueprint.Core.Button, {
        icon: "predictive-analysis",
        text: "CDN Blueprint is go!",
      });
      ReactDOM.render(button, document.querySelector("#btn"));
    </script>
  </body>
</html>
```

@### DOM4

Blueprint relies on a handful of DOM Level 4 API methods: `el.closest()` and `el.contains()`.
`@blueprintjs/core` depends on a [polyfill library called `dom4`](https://webreflection.github.io/dom4/) to ensure
these methods are available. This module is conditionally loaded if Blueprint is used in a browser environment.

@### TypeScript

Blueprint is written in TypeScript and therefore its own `.d.ts` type definitions are distributed in
the NPM package and should be resolved automatically by the compiler. However, you'll need to
install typings for Blueprint's dependencies before you can consume it:

```sh
# required for all @blueprintjs packages:
npm install --save @types/react @types/react-dom @types/react-transition-group

# @blueprintjs/datetime requires:
npm install --save @types/moment
```

Blueprint's declaration files require **TypeScript 2.3+** for default generic parameter arguments: `<P = {}>`.

<div class="pt-callout pt-intent-primary pt-icon-info-sign">
  For more information, see [Understanding TypeScript](#blueprint.understanding-typescript) below.
</div>

@### Vanilla JS APIs

JS components are built using React, but that does not limit their usage to just React applications.
You can render any component in any JavaScript application with `ReactDOM.render`. Think of it like
using a jQuery plugin.

```tsx
import { Classes, Intent, Spinner } from "@blueprintjs/core";

const myContainerElement = document.getElementById("container");

// with JSX
ReactDOM.render(<Spinner className={Classes.SMALL} intent={Intent.PRIMARY} />, myContainerElement);

// with vanilla JS, use React.createElement
ReactDOM.render(
    React.createElement(Spinner, {
        className: Classes.SMALL,
        intent: Intent.PRIMARY,
    }),
    myContainerElement,
);
```

To remove the component from the DOM and clean up, unmount it:

```tsx
ReactDOM.unmountComponentAtNode(myContainerElement);
```

Check out the [React API docs](https://facebook.github.io/react/docs/react-api.html) for more details.

You'll need to install **React 16.2+** alongside Blueprint.

```sh
npm install --save @blueprintjs/core react react-dom react-transition-group
```

Import components from the `@blueprintjs/core` module into your project.
Don't forget to include the main CSS stylesheet too!

**Review the [general usage docs](#blueprint.usage) for more complete installation instructions.**

@## Understanding TypeScript

Blueprint is written in [TypeScript](https://www.typescriptlang.org/), a statically typed superset
of JavaScript that compiles to plain JavaScript. All the code samples throughout this site and
all interactive examples are also written in TypeScript. TypeScript code looks exactly like ES2015+
code with the addition of type signatures, which typically appear after colons and are _italicized_
in our syntax theme.

```ts
// variables
const variableName: varType;
const name: string;
const disabled: boolean;

// functions (and function variables)
function funcName(arg1: argType, arg2: argType): returnType {}
const funcName: (arg1: argType) => returnType;
function split(str: string, delim: string): string[] {}
function map<T, U>(array: T[], iterator: (item: T, index: number) => U): U[];

// interfaces describe plain objects
// (we use the convention that interfaces begin with "I")
interface IOption {
    label: string;
    value: string;
}
const option: IOption = { label: "Name", value: "Gilad" };
```

**You do not need to use TypeScript to consume Blueprint** (but major "props" if you do).
Simply ignoring the type annotations (any italics in code blocks) will produce valid ES2015 code.
Familiarity with the syntax is suggested so you can follow our examples source code.

<div class="pt-callout pt-intent-primary pt-icon-info-sign">
  For more information, see the TypeScript Handbook for [basic types][basic-types]
  and [consuming declaration files][decl-files].
</div>

[basic-types]: https://www.typescriptlang.org/docs/handbook/basic-types.html
[decl-files]: https://www.typescriptlang.org/docs/handbook/declaration-files/consumption.html

@## Development & contributions

Most dev-related information is on [our GitHub wiki](https://github.com/palantir/blueprint/wiki),
including our [coding guidelines](https://github.com/palantir/blueprint/wiki/Coding-guidelines)
and our [development practices](https://github.com/palantir/blueprint/wiki/Development-Practices).
