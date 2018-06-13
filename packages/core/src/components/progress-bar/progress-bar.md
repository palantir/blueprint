@# Progress bar

Progress bars indicate progress towards the completion of a task or an
indeterminate loading state.

@reactExample ProgressExample

@## Props

`ProgressBar` is a simple stateless component that renders the appropriate HTML
markup. It supports a `value` prop between 0 and 1 that determines the width of
the progress meter. Omitting `value` will result in an "indeterminate" progress
meter that fills the entire bar.

@interface IProgressBarProps

@## CSS

Set the current progress of the bar via a `width` style rule on the inner
`.@ns-progress-meter` element. This is a very simple CSS-only component, and
input validation for `width` values is limited: values above `100%` appear as
100% progress and values below `0%` appear as 0%.

Omitting `width` will result in an "indeterminate" progress meter that fills the
entire bar.

@css progress-bar
