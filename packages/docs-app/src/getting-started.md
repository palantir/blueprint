@# Getting started

@## Installing Blueprint

Blueprint is available as a collection of NPM packages under the `@blueprintjs`
scope. Each package appears at the top level of the sidebar to the left, along
with its current version.

Each package contains a CSS file and a collection of CommonJS modules exposing React components.
The `main` module exports all symbols from all modules so you don't have to import individual files
(though you can if you want to). The JavaScript components are stable and their APIs adhere to
[semantic versioning](http://semver.org/).

1.  Install the core package and its peer dependencies with an NPM client like
    `npm` or `yarn`, pulling in all relevant dependencies:

    ```sh
    yarn add @blueprintjs/core react react-dom
    ```

1.  After installation, you'll be able to import the React components in your application:

    ```tsx
    import { Button, Intent, Spinner } from "@blueprintjs/core";

    // using JSX:
    const mySpinner = <Spinner intent={Intent.PRIMARY} />;

    // use React.createElement if you're not using JSX.
    const myButton = React.createElement(Button, { intent: Intent.SUCCESS }, "button content");
    ```

1.  **Don't forget to include the main CSS file from each Blueprint package!** Additionally, the
    `resources/` directory contains supporting media such as fonts and images.

    ```css.scss
    // using node-style package resolution in a CSS file:
    @import "~normalize.css";
    @import "~@blueprintjs/core/lib/css/blueprint.css";
    @import "~@blueprintjs/icons/lib/css/blueprint-icons.css";
    ```

    ```html
    <!-- or using plain old HTML -->
    <head>
      <!-- include dependencies manually -->
      <link href="path/to/node_modules/normalize.css/normalize.css" rel="stylesheet" />
      <link href="path/to/node_modules/@blueprintjs/core/lib/css/blueprint.css" rel="stylesheet" />
      <link href="path/to/node_modules/@blueprintjs/icons/lib/css/blueprint-icons.css" rel="stylesheet" />
      <!-- NOTE: blueprint-icons.css file must be included alongside blueprint.css! -->
    </head>
    ```

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">
    <h4 class="@ns-heading">CDN-only usage</h4>

Blueprint can instead be quickly added to a page using the Unpkg CDN.
[See below for instructions](#blueprint/getting-started.cdn-consumption).
</div>

@## JS environment

@### Language features

Note that since the minimum supported version of React is [v16](https://reactjs.org/blog/2017/09/26/react-v16.0.html),
all of its [JavaScript Environment Requirements](https://reactjs.org/docs/javascript-environment-requirements.html) apply to
Blueprint as well. Blueprint components require the following ES2015 features:

-   `Map`
-   `Set`
-   `Array.fill`
-   `Array.from`

We recommend polyfilling these features using [es6-shim](https://github.com/paulmillr/es6-shim) or
[core-js](https://github.com/zloirock/core-js).

@### DOM4

Blueprint relies on a handful of DOM Level 4 API methods: `el.closest()` and `el.contains()`.
`@blueprintjs/core` depends on a [polyfill library called `dom4`](https://webreflection.github.io/dom4/) to ensure
these methods are available. This module is conditionally loaded if Blueprint is used in a browser environment.

@## TypeScript

Blueprint is written in TypeScript and therefore its own `.d.ts` type definitions are distributed in
the NPM package and should be resolved automatically by the compiler. However, you'll need to
install typings for Blueprint's dependencies before you can consume it:

```sh
# required for all @blueprintjs packages:
npm install --save @types/react @types/react-dom

# @blueprintjs/timezone requires:
npm install --save @types/moment-timezone
```

Blueprint's declaration files require **TypeScript 2.3+** for default generic parameter arguments: `<P = {}>`.

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">

For more information, see [Understanding TypeScript](#blueprint/reading-the-docs.understanding-typescript).
</div>

@## Vanilla JS APIs

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
        intent: Intent.PRIMARY
    }),
    myContainerElement
);
```

To remove the component from the DOM and clean up, unmount it:

```tsx
ReactDOM.unmountComponentAtNode(myContainerElement);
```

Check out the [React API docs](https://facebook.github.io/react/docs/react-api.html) for more details.

@## CDN consumption

Blueprint supports the venerable [unpkg CDN](https://unpkg.com). Each package provides a UMD
`dist/[name].bundle.js` file containing the bundled source code. The UMD wrapper exposes each
library on the `Blueprint` global variable: `Blueprint.Core`, `Blueprint.Datetime`, etc.

These bundles _do not include_ external dependencies; your application will need to ensure that
`normalize.css`, `classnames`, `dom4`, `react`, `react-dom`, `react-transition-group`, `popper.js`, and
`react-popper` are available at runtime.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>Blueprint Starter Kit</title>

    <!-- Style dependencies -->
    <link href="https://unpkg.com/normalize.css@^7.0.0" rel="stylesheet" />
    <!-- Blueprint stylesheets -->
    <link href="https://unpkg.com/@blueprintjs/icons@^3.4.0/lib/css/blueprint-icons.css" rel="stylesheet" />
    <link href="https://unpkg.com/@blueprintjs/core@^3.10.0/lib/css/blueprint.css" rel="stylesheet" />
  </head>
  <body>
    <!-- Blueprint dependencies -->
    <script src="https://unpkg.com/classnames@^2.2"></script>
    <script src="https://unpkg.com/dom4@^1.8"></script>
    <script src="https://unpkg.com/tslib@^1.9.0"></script>
    <script src="https://unpkg.com/react@^16.2.0/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@^16.2.0/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/react-transition-group@^2.2.1/dist/react-transition-group.min.js"></script>
    <script src="https://unpkg.com/popper.js@^1.14.1/dist/umd/popper.js"></script>
    <script src="https://unpkg.com/react-popper@^1.0.0/dist/index.umd.min.js"></script>
    <script src="https://unpkg.com/resize-observer-polyfill@^1.5.0"></script>
    <!-- Blueprint packages (note: icons script must come first) -->
    <script src="https://unpkg.com/@blueprintjs/icons@^3.4.0"></script>
    <script src="https://unpkg.com/@blueprintjs/core@^3.10.0"></script>

    <div id="btn"></div>
    <script>
      const button = React.createElement(Blueprint.Core.Button, {
        icon: "cloud",
        text: "CDN Blueprint is go!",
      });
      ReactDOM.render(button, document.querySelector("#btn"));
    </script>
  </body>
</html>
```
