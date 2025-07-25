@# Getting started

@## Installing Blueprint

Blueprint is available as a collection of NPM packages under the `@blueprintjs` scope. Each package is listed at the
top level of the navigation sidebar to the left of this page, along with its current version.

Each package contains a CSS file and a collection of ES modules exposing React components (CommonJS modules are
also available, for backwards-compatibility). The `main` module exports all symbols that are considered public API.
The JavaScript components are stable and their APIs adhere to [semantic versioning](http://semver.org/).

1.  Install the core package and its peer dependencies with an NPM client like `npm` or `yarn`,
    pulling in all relevant dependencies:

    ```sh
    yarn add @blueprintjs/core react react-dom
    ```

2.  After installation, you'll be able to import the React components in your application:

    ```tsx
    import { Button, Spinner } from "@blueprintjs/core";

    // using JSX:
    const mySpinner = <Spinner intent="primary" />;

    // use React.createElement if you're not using React.JSX.
    const myButton = React.createElement(Button, { intent: "success" }, "button text");
    ```

3.  **Don't forget to include the main CSS file from each Blueprint package!** Additionally, the `resources/` directory
    contains supporting media such as fonts and images.

    ```scss
    // using Node.js-style package resolution in a CSS file:
    @import "normalize.css";
    @import "@blueprintjs/core/lib/css/blueprint.css";
    // include blueprint-icons.css for icon font support
    @import "@blueprintjs/icons/lib/css/blueprint-icons.css";
    ```

    ```ts
    // or using a ESM bundler which resolves CSS files as modules:
    import "normalize.css";
    import "@blueprintjs/core/lib/css/blueprint.css";
    // include blueprint-icons.css for icon font support
    import "@blueprintjs/icons/lib/css/blueprint-icons.css";
    ```

    ```html
    <!-- or using plain old HTML -->
    <head>
        <link href="path/to/node_modules/normalize.css/normalize.css" rel="stylesheet" />
        <link href="path/to/node_modules/@blueprintjs/core/lib/css/blueprint.css" rel="stylesheet" />
        <!-- include blueprint-icons.css for icon font support -->
        <link href="path/to/node_modules/@blueprintjs/icons/lib/css/blueprint-icons.css" rel="stylesheet" />
    </head>
    ```

@## JS environment

@### Language features

Blueprint components use common ES2015+ language features which are implemented in all modern browsers (Chrome, Firefox,
Edge, Safari). As of v5.0, Blueprint no longer supports IE11, so you do _not_ need to polyfill these features.

-   `Map`
-   `Set`
-   `Array.prototype.fill`
-   `Array.prototype.from`
-   `String.prototype.startsWith`
-   `Object.assign`
-   `Object.entries`
-   `Object.values`

Some of Blueprint's dependencies also have relevant guidance on browser support, see:

-   [Popper.js docs](https://popper.js.org/docs/v2/browser-support/)

@## TypeScript

Blueprint is written in TypeScript and therefore its own `.d.ts` type definitions are distributed in
the NPM package and should be resolved automatically by the compiler. However, you'll need to
install typings for Blueprint's dependencies before you can consume it:

```sh
# required for all @blueprintjs packages:
npm install --save @types/react @types/react-dom
```

Blueprint's declaration files require **TypeScript 4.0 or newer** for certain language features (like type-only
imports/exports). We strive to be compatible with most TypeScript versions, but sometimes there are `lib.d.ts` changes
which can create compiler incompatibilities if you are using a `tsc` version different from the one used to build
Blueprint (see the current version in [`package.json`](https://github.com/palantir/blueprint/blob/develop/package.json)).

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">

For more information, see [Understanding TypeScript](#blueprint/reading-the-docs.understanding-typescript).

</div>

@## Vanilla JS APIs

JS components are built using React, but that does not limit their usage to only React applications.
You can render any component in any JavaScript application with `render`. Think of it like
using a jQuery plugin.

```tsx
import { Classes, Spinner } from "@blueprintjs/core";
import { createRoot } from "react-dom/client";

const domNode = document.getElementById("root");
const root = createRoot(domNode);

// with JSX
root.render(<Spinner className={Classes.SMALL} intent="primary" />);

// with vanilla JS, use React.createElement
root.render(React.createElement(Spinner, { className: Classes.SMALL, intent: "primary" }));
```

To remove the component from the DOM and clean up, unmount it:

```tsx
root.unmount();
```

Check out the [React API docs](https://facebook.github.io/react/docs/react-api.html) for more details.
