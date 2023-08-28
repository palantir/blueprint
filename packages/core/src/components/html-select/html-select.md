@# HTML select

Styling HTML `<select>` tags requires a wrapper element to customize the dropdown caret, so Blueprint provides
a __HTMLSelect__ component to streamline this process.

<div class="@ns-callout @ns-intent-success @ns-icon-info-sign @ns-callout-has-body-content">

The [__Select__](#select/select-component) component in the [**@blueprintjs/select**](#select)
package provides a more full-features alternative to the native HTML `<select>` tag. Notably, it
supports custom filtering logic and item rendering.

</div>

@## Usage

Use __HTMLSelect__ exactly like you would use a native `<select>` with `value` (or `defaultValue`) and `onChange`.
Options can be passed as `<option>` children for full flexibility or via the `options` prop for simple shorthand.

@reactExample HTMLSelectExample

@## Props interface

@interface HTMLSelectProps

@## CSS API

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">

Deprecated API: use [`<HTMLSelect>`](#core/components/html-select)

</h5>

CSS APIs for Blueprint components are considered deprecated, as they are verbose, error-prone, and they
often fall out of sync as the design system is updated. You should use the React component APIs instead.

</div>

Put class modifiers on the wrapper and attribute modifiers and event handlers directly on the `<select>`.

@css select
