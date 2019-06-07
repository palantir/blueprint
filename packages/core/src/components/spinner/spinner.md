@# Spinner

Spinners indicate progress in a circular fashion. They're great for ongoing
operations and can also represent known progress.

@reactExample SpinnerExample

@## Props

`Spinner` is a simple stateless component that renders SVG markup. It can be
used safely in DOM and SVG containers as it only renders SVG elements.

The `value` prop determines how much of the track is filled by the head. When
this prop is defined, the spinner head will smoothly animate as `value`
changes. Omitting `value` will result in an "indeterminate" spinner where the
head spins indefinitely (this is the default appearance).

The `size` prop determines the pixel width/height of the spinner. Size constants
are provided as static properties: `Spinner.SIZE_SMALL`,
`Spinner.SIZE_STANDARD`, `Spinner.SIZE_LARGE`. Small and large sizes can be set
by including `Classes.SMALL` or `Classes.LARGE` in `className` instead of the
`size` prop (this prevents an API break when upgrading to 3.x).

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign">
    <h4 class="@ns-heading">IE11 compatibility note</h4>

IE11 [does not support CSS transitions on SVG elements][msdn-css-svg] so spinners with known
`value` will not smoothly transition as `value` changes. Indeterminate spinners still animate
correctly because they rely on CSS animations.

</div>

[msdn-css-svg]: https://developer.microsoft.com/en-us/microsoft-edge/platform/status/csstransitionsforsvgelements/?q=svg

@interface ISpinnerProps
