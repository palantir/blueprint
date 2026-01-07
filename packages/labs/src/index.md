---
reference: labs
---

@# Labs

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign">
    <h5 class="@ns-heading">Under construction</h5>
</div>

The **[@blueprintjs/labs](https://www.npmjs.com/package/@blueprintjs/labs)** NPM package contains **unstable React components under active development by team members**. We're excited for this space to be used for experimentation of components that can help us augment the current Blueprint offerings, and support a faster iteration cycle with early feedback.

Labs is an incubator and staging area for components as we refine the API design; as such, every minor version should be considered breaking. This has started at version 6.0.0 to signal resurrection of the package after a hiatus, and to align with the current major version of the core Blueprint package. Blueprint Labs will follow the same major versioning as the core Blueprint package moving forward.

The goal for the labs package is to eventually graduate components into the core package. The criteria to evaluate promotion into core will be as follows:

- It should have a stable and well-designed API
- It should be well-tested
- It should have documentation and examples
- It should match the code quality of the stable components

While we make no guarantees with respect to API breaks, we will be communicating changes clearly in the changelog and release notes. Please provide feedback on the components in this package by opening issues or contributing PRs to help us improve them!

Make sure to review the [getting started docs for installation info](#blueprint/getting-started).

```sh
npm install --save @blueprintjs/labs
```

Import the package stylesheet in Sass:

```scss
@import "@blueprintjs/labs/lib/css/blueprint-labs.css";
```

...or in plain HTML:

```html
<link href="path/to/node_modules/@blueprintjs/labs/lib/css/blueprint-labs.css" rel="stylesheet" />
```

@page box
@page flex
