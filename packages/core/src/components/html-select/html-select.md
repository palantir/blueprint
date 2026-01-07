@# HTML select

Styling HTML `<select>` tags requires a wrapper element to customize the dropdown caret, so Blueprint provides
a **HTMLSelect** component to streamline this process.

<div class="@ns-callout @ns-intent-success @ns-icon-info-sign @ns-callout-has-body-content">

The [**Select**](#select/select-component) component in the [**@blueprintjs/select**](#select)
package provides a more full-features alternative to the native HTML `<select>` tag. Notably, it
supports custom filtering logic and item rendering.

</div>

@## Usage

Use **HTMLSelect** exactly like you would use a native `<select>` with `value` (or `defaultValue`) and `onChange`.
Options can be passed as `<option>` children for full flexibility or via the `options` prop for simple shorthand.

@reactExample HTMLSelectExample

@## Props interface

@interface HTMLSelectProps
