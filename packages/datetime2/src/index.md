---
reference: datetime2
---

@# Datetime2

The [__@blueprintjs/datetime2__ package](https://www.npmjs.com/package/@blueprintjs/datetime2)
provides next-generation components for interacting with dates & times:

- [DatePicker3](#datetime2/date-picker3)
- DateRangePicker3 (_coming soon_)

### Motivation

These are next-generation variants of components available in the
[__@blueprintjs/datetime__](#datetime) package.
They will become the standard date & time components in a future major version of Blueprint.
You are encouraged to try out the new APIs, provide feedback, and set yourself up for forward compatibility
in the Blueprint ecosystem.

Compared to their "V1" and "V2" counterparts, these components:
- uses [react-day-picker](https://react-day-picker.js.org/) v8 instead of v7
- are easier to localize since date-fns is now a dependency

We use "V3" names to avoid confusion with the "V2" components currently in this package which are legacy
APIs backwards-compatible with @blueprintjs/datetime2 v0.x
(see [this PR](https://github.com/palantir/blueprint/pull/5935) for more info).

### Installation

Make sure to review the [getting started docs for installation info](#blueprint/getting-started).

```sh
npm install --save @blueprintjs/datetime2
```

Import the package stylesheet (for example, in Sass):

```scss
@import "~@blueprintjs/datetime2/lib/css/blueprint-datetime2.css";
```

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign">
    <h5 class="@ns-heading">Additional CSS required</h5>

This library relies on some components from other Blueprint packages, so you will need to pull in those
packages' CSS files as well (if you are not doing this already):

```scss
@import "~@blueprintjs/datetime/lib/css/blueprint-datetime.css";
@import "~@blueprintjs/select/lib/css/blueprint-select.css";
```
</div>

@page date-picker3
