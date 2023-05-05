@# Blueprint

#### Blueprint is a React-based UI toolkit for the web.

It is optimized for building complex data-dense interfaces for desktop applications.

@reactDocs Welcome

<div class="@ns-callout @ns-intent-primary @ns-icon-star">
<h5 class="@ns-heading">Blueprint v5 is almost here!</h5>

[Check out the new features and migration guides to upgrade from v4.x &rarr;](https://github.com/palantir/blueprint/wiki/Blueprint-5.0)

</div>

@## Quick start

### Install

[**@blueprintjs/core**](https://www.npmjs.com/package/@blueprintjs/core) is the primary Blueprint library package,
home to over 40 UI components.
Install it with your Node.js package manager of choice ([Yarn](https://yarnpkg.com/) is used in this example):

```sh
yarn add @blueprintjs/core react react-dom
```

Additional UI components and APIs are available in these packages:
- [**@blueprintjs/icons**](https://www.npmjs.com/package/@blueprintjs/icons)
- [**@blueprintjs/datetime**](https://www.npmjs.com/package/@blueprintjs/datetime)
- [**@blueprintjs/select**](https://www.npmjs.com/package/@blueprintjs/select)
- [**@blueprintjs/table**](https://www.npmjs.com/package/@blueprintjs/table)

The navigation sidebar lists all the available packages, separated by use case and significant dependencies.
All have peer dependencies on **react** and **react-dom**.

### Import

Import React components from the appropriate package.

```tsx
import { Button } from "@blueprintjs/core";

<Button intent="success" text="button content" onClick={incrementCounter} />
```

For this button to be styled correctly in the DOM, it needs its associated CSS to be loaded on the page.
Don't forget to include the **main CSS file from each Blueprint package** and their dependencies!
The following example shows an `index.html` file; the same stylesheets should be loaded if you use a bundler like Webpack.

```html
<link href="path/to/node_modules/normalize.css/normalize.css" rel="stylesheet" />
<!-- blueprint-icons.css file must be included alongside blueprint.css! -->
<link href="path/to/node_modules/@blueprintjs/icons/lib/css/blueprint-icons.css" rel="stylesheet" />
<link href="path/to/node_modules/@blueprintjs/core/lib/css/blueprint.css" rel="stylesheet" />
<!-- add other blueprint-*.css files here -->
```

@page getting-started
@page reading-the-docs
@page principles
