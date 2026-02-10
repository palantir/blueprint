@# Progress bar

A horizontal meter that fills to indicate determinate or indeterminate progress.

@reactCodeExample ProgressBarBasicExample

@## Import

```tsx
import { ProgressBar } from "@blueprintjs/core";
```

@## Usage

Use the `value` prop to set progress between 0 and 1. Omit `value` for an indeterminate progress bar that fills the entire meter.

```tsx
<ProgressBar value={0.5} />
```

@## Examples

@### Value

Use the `value` prop to display determinate progress. Values below 0 or above 1 are clamped.

@reactCodeExample ProgressBarValueExample

@### Intent

Use the `intent` prop to apply a semantic color to the progress meter.

@reactCodeExample ProgressBarIntentExample

@### Stripes

By default, ProgressBar renders a striped background. Use the `stripes` prop set to `false` to disable stripes.

@reactCodeExample ProgressBarStripesExample

@### Animate

By default, ProgressBar animates its stripe pattern. Use the `animate` prop set to `false` to disable animation.

@reactCodeExample ProgressBarAnimateExample

@## Interactive Playground

@reactExample ProgressExample

@## Best practices

- Use the indeterminate state (omit `value`) when the duration or percentage of a task is unknown.
- Use a determinate value when you can calculate meaningful progress — avoid updating the value with random or non-monotonic increments.
- Prefer `intent="primary"` for general loading indicators. Reserve `intent="success"` for progress bars that represent a completed or near-complete task.
- Avoid using `intent="danger"` to indicate progress — use it to signal that a process has encountered an error.
- Disable stripes and animation with `stripes={false}` and `animate={false}` when a static appearance is preferred, such as displaying a fixed percentage in a dashboard.

@## Props interface

@interface ProgressBarProps
