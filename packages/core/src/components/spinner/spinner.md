@# Spinners

Spinners indicate indeterminate progress.

@## CSS API

You can create spinners manually by inserting their whole markup into your HTML.
Spinners created via markup use same modifier classes as the
[React `Spinner` component](#components.progress.spinner.js).

@css pt-spinner

@## JavaScript API

The `Spinner` component is available in the __@blueprintjs/core__ package.
Make sure to review the [general usage docs for JS components](#components.usage).

A `Spinner` is a simple stateless component that renders HTML/SVG markup.
It supports a `value` prop between 0 and 1 that determines how much of the track is filled by the
head. When this prop is defined, the spinner head will not spin but it will smoothly animate as
`value` updates. Omitting `value` will result in an "indeterminate" spinner where the head spins
indefinitely (this is the default appearance).

Note that the CSS modifiers described in the [CSS API](#components.progress.spinner.css)
are supported via the `className` prop.

<div class="pt-callout pt-intent-warning pt-icon-warning-sign">
    <h5>IE11 compatibility note</h5>
    IE11 [does not support CSS transitions on SVG elements][msdn-css-svg] so spinners with known
    `value` will not smoothly transition as `value` changes. Indeterminate spinners still animate
    correctly because they rely on CSS animations, not transitions.
</div>

@interface ISpinnerProps

@reactExample SpinnerExample

[msdn-css-svg]: https://developer.microsoft.com/en-us/microsoft-edge/platform/status/csstransitionsforsvgelements/?q=svg

@### SVG spinner

Use the `SVGSpinner` component to render a spinner inside an SVG element.

<div class="pt-callout pt-intent-primary pt-icon-info-sign">
    <h5>Sizing note</h5>
    Because of the way SVG elements are sized, you may need to manually scale the spinner inside your
    SVG to make it an appropriate size.
</div>
