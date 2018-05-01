@# Numeric inputs

The `NumericInput` component provides controls for easily inputting,
incrementing, and decrementing numeric values.

@## Interactions

Values in numeric inputs can be incremented or decremented using both keyboard and mouse interactions.

##### Keyboard interactions

- `↑/↓` - change the value by one step (default: `±1`)
- `Shift + ↑/↓` - change the value by one major step (default: `±10`)
- `Alt + ↑/↓` - change the value by one minor step (default: `±0.1`)

##### Mouse interactions

- `Click ⌃/⌄` - change the value by one step (default: `±1`)
- `Shift + Click ⌃/⌄` - change the value by one major step (default: `±10`)
- `Alt + Click ⌃/⌄` - change the value by one minor step (default: `±0.1`)

@## Basic example

This example shows how `NumericInput` works out of the box. It supports the
basic keyboard and mouse interactions listed above, as well as basic keyboard
entry:

@reactExample NumericInputBasicExample

@## Extended example

This example shows how `NumericInput` can be extended beyond its core
functionality. It supports the basic interactions above as well as each of the
following types of input:

- **Number abbreviations** (e.g. `2.1k`, `-0.3m`)
- **Scientific notation** (e.g. `2.1e3`, `-0.3e6`)
- **Addition and subtraction expressions** (e.g. `3+2`, `0.1m - 5k + 1`)

These special-case inputs are evaluated when `Enter` is pressed (via a
custom `onKeyDown` callback) and when the field loses focus (via a custom
`onBlur` callback). If the input is invalid when either of these callbacks is
trigged, the field will be cleared.

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">
    This example contains non-core functionality that is meant to demonstrate
    the extensibility of the `NumericInput` component. The correctness of the
    custom evaluation code has not been tested robustly.
</div>

@reactExample NumericInputExtendedExample

@## JavaScript API

The `NumericInput` component is available in the __@blueprintjs/core__ package.
Make sure to review the [getting started docs for installation info](#blueprint/getting-started).

@interface INumericInputProps

@### Responsive numeric inputs

`NumericInput` can be styled with the same set of CSS classes that modify
regular [control groups](#core/components/forms/control-group). The most appropriate
such modifier for `NumericInput` is `@ns-fill`, which when passed as a
`className` will make the component expand to fill all available width.

@### Uncontrolled mode

By default, this component will function in uncontrolled mode, managing all of
its own state. In uncontrolled mode, simply provide an `onValueChange` callback
in the props to access the value as the user manipulates it. The value will be
provided to the callback both as a number and as a string.

```tsx
import { NumericInput } from "@blueprintjs/core";

export class NumericInputExample extends React.Component<{}, {}> {
    public render() {
        return (
            <NumericInput onValueChange={this.handleValueChange} />
        );
    }

    private handleValueChange = (valueAsNumber: number, valueAsString: string) => {
        console.log("Value as number:", valueAsNumber);
        console.log("Value as string:", valueAsString);
    }
}
```

@### Controlled mode

If you prefer to have more control over your numeric input's behavior, you can
specify the `value` property to use the component in **controlled mode**.
numeric input supports arbitrary text entry--not just numeric digits–-so the
`value` can be provided as either a number or a string.

The combined support of arbitrary text entry, controlled mode, and custom
callbacks makes it possible to extend the numeric input's basic functionality in
powerful ways. As shown in the example above, one could extend the numeric input
component with support for mathematical expressions as follows:

```tsx
import { NumericInput } from "@blueprintjs/core";
import * as SomeLibrary from "some-library";

export class NumericInputExample extends React.Component<{}, { value?: number |
string }> {
    public state = { value: null };

    public render() {
        return (
            <NumericInput
                onValueChange={this.handleValueChange}
                value={this.state.value}
            />
        );
    }

    private handleValueChange = (_valueAsNumber: number, valueAsString: string) {
        const result = SomeLibrary.evaluateMathExpression(valueAsString);
        this.setState({ value: result });
    }
}
```
