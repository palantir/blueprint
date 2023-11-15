---
reference: datetime2
---

@# Datetime2

The [**@blueprintjs/datetime2** package](https://www.npmjs.com/package/@blueprintjs/datetime2)
provides next-generation components for interacting with dates & times:

-   [**DatePicker3**](#datetime2/date-picker3)
-   [**DateInput3**](#datetime2/date-input3)
-   [**DateRangePicker3**](#datetime2/date-range-picker3)
-   [**DateRangeInput3**](#datetime2/date-range-input3)

There are also legacy APIs which are re-exported aliases for components from [**@blueprintjs/datetime**](#datetime).
These "V2" names are backwards-compatible with the previous major version of @blueprintjs/datetime2:

-   **DateInput2** (alias for [**DateInput**](#datetime/date-input)) (DEPRECATED)
-   **DateRangeInput2** (alias for [**DateRangeInput**](#datetime/date-range-input)) (DEPRECATED)

### Motivation

**DatePicker3** and its related "V3" components are next-generation variants of components currently available in the
[**@blueprintjs/datetime2**](#datetime2) package. They will become the standard date & time components in a
future major version of Blueprint. You are encouraged to try out the new APIs, provide feedback, and set yourself
up for forward compatibility in the Blueprint ecosystem.

Compared to their "V1" and "V2" counterparts, these components:

-   use [react-day-picker](https://react-day-picker.js.org/) v8 instead of v7 (this unblocks React 18 compatibility)
-   are easier to internationalize & localize since date-fns is now a dependency (instead of `localeUtils`, you can specify a locale code and we'll automatically load the date-fns locale object)

### Installation

Make sure to review the [getting started docs for installation info](#blueprint/getting-started).

```sh
npm install --save @blueprintjs/datetime2
```

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">Multiple copies of react-day-picker</h5>

Installing the datetime2 package will transitively install two copies of react-day-picker: v7.x and v8.x.
Note that these two major versions can happily exist together in a single JS bundle, and with the help of tree-shaking,
you can avoid bundling both if you _only_ use the deprecated "V1" / "V2" datetime components or _only_ use the new
"V3" APIs.

</div>

Import the package stylesheet (for example, in Sass):

```scss
@import "~@blueprintjs/datetime2/lib/css/blueprint-datetime2.css";
```

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">Additional CSS required</h5>

This library relies on some components from other Blueprint packages, so you will need to pull in those
packages' CSS files as well (if you are not doing this already):

```scss
@import "~@blueprintjs/datetime/lib/css/blueprint-datetime.css";
@import "~@blueprintjs/select/lib/css/blueprint-select.css";
```

</div>

@page date-picker3
@page date-input3
@page date-range-picker3
@page date-range-input3
