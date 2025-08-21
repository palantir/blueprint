@# Progress bar

**ProgressBar** indicates progress towards the completion of a task or an indeterminate loading state.

@## Import

```tsx
import { ProgressBar } from "@blueprintjs/core";
```

@reactExample ProgressExample

@## Props interface

**ProgressBar** is a simple stateless component that renders the appropriate HTML markup. It supports a `value` prop
between 0 and 1 that determines the width of the progress meter. Omitting `value` will result in an "indeterminate"
progress meter that fills the entire bar.

@interface ProgressBarProps
