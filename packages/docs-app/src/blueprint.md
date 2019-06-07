@# Blueprint

#### Blueprint is a React-based UI toolkit for the web.

It is optimized for building complex data-dense interfaces for desktop applications.

@reactDocs Welcome

<div class="@ns-callout @ns-intent-success @ns-icon-endorsed">
<h4 class="@ns-heading">

Blueprint v3 is available now! [See what's new.](#blueprint/whats-new-3.0)

</h4>
</div>

@## Quick start

### Install

**@blueprintjs/core** is the primary Blueprint package on NPM and home to over 40 components.

```sh
yarn add @blueprintjs/core react react-dom
```

Additional components live in the **@blueprintjs/icons**, **@blueprintjs/datetime**, **@blueprintjs/select**, **@blueprintjs/table**, and **@blueprintjs/timezone** packages, separated by use case and significant dependencies. All have peer dependencies on **react** and **react-dom**, so these two packages must be installed alongside Blueprint.

### Import

Import React components from the appropriate package.

```tsx
import { Button } from "@blueprintjs/core";

<Button intent="success" text="button content" onClick={incrementCounter} />
```

Don't forget to include the **main CSS file** from each Blueprint package!

```html
<!-- in index.html, or however you manage your CSS files -->
<link href="path/to/node_modules/normalize.css/normalize.css" rel="stylesheet" />
<!-- blueprint-icons.css file must be included alongside blueprint.css! -->
<link href="path/to/node_modules/@blueprintjs/icons/lib/css/blueprint-icons.css" rel="stylesheet" />
<link href="path/to/node_modules/@blueprintjs/core/lib/css/blueprint.css" rel="stylesheet" />
<!-- add other blueprint-*.css files here -->
```

@## Browser support

**Blueprint supports Chrome, Firefox, Safari, IE 11, and Microsoft Edge.**

You may experience degraded visuals in IE.
IE 10 and below are unsupported due to their lack of support for CSS Flexbox Layout.
These browsers were deprecated by Microsoft (end of support) in [January 2016](https://www.microsoft.com/en-us/WindowsForBusiness/End-of-IE-support).

@page getting-started
@page reading-the-docs
@page whats-new-2.0
@page whats-new-3.0
