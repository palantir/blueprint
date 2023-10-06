@# Numeric input

**NumericInput** provides controls for inputting, incrementing, and decrementing numeric values.

@## Interactions

The value in a numeric input can be incremented or decremented using both keyboard and mouse interactions.

##### Keyboard interactions

-   `↑/↓` - change the value by one step (default: `±1`)
-   `Shift + ↑/↓` - change the value by one major step (default: `±10`)
-   `Alt + ↑/↓` - change the value by one minor step (default: `±0.1`)

##### Mouse interactions

-   `Click ⌃/⌄` - change the value by one step (default: `±1`)
-   `Shift + Click ⌃/⌄` - change the value by one major step (default: `±10`)
-   `Alt + Click ⌃/⌄` - change the value by one minor step (default: `±0.1`)

@## Basic example

This example shows how **NumericInput** works out of the box. It supports the basic keyboard and mouse interactions
listed above, as well as basic keyboard entry.

@reactExample NumericInputBasicExample

@## Extended example

This example shows how **NumericInput** can be extended beyond its core functionality. It supports the basic
interactions above as well as each of the following types of input:

-   **Number abbreviations** (e.g. `2.1k`, `-0.3m`)
-   **Scientific notation** (e.g. `2.1e3`, `-0.3e6`)
-   **Addition and subtraction expressions** (e.g. `3+2`, `0.1m - 5k + 1`)

These special-case inputs are evaluated when `Enter` is pressed (via a custom `onKeyDown` callback) and when the field
loses focus (via a custom `onBlur` callback). If the input is invalid when either of these callbacks is trigged, the
field will be cleared.

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">

This example contains non-core functionality that is meant to demonstrate the extensibility of the **NumericInput**
component. The correctness of the custom evaluation code has not been tested robustly.

</div>

@reactExample NumericInputExtendedExample

@## Usage

@### Uncontrolled mode

By default, this component will function in uncontrolled mode, managing all of its own state. In uncontrolled mode,
you mus provide an `onValueChange` callback prop to access the value as the user manipulates it. The value will be
provided to the callback both as a number and as a string.

In general, uncontrolled mode is the recommended API for this component, as it allows users to type non-numeric digits
like `.` and `-` (for decimals and negative numbers, respectively) more easily.

```tsx
import { NumericInput } from "@blueprintjs/core";

export class NumericInputExample extends React.Component {
    public render() {
        return <NumericInput onValueChange={this.handleValueChange} />;
    }

    private handleValueChange = (valueAsNumber: number, valueAsString: string) => {
        console.log("Value as number:", valueAsNumber);
        console.log("Value as string:", valueAsString);
    };
}
```

@### Controlled mode

If you need to have more control over your numeric input's behavior, you can specify the `value` property to use the
component in **controlled mode**.

Note that NumericInput supports arbitrary text entry (not only numeric digits) so the `value`
**should always be provided as a string, not a number**. Accordingly, change event handlers should use the same data
type, namely the _second_ parameter of the `onValueChange` callback. This behavior allows users to type non-numeric
characters like decimal points (".") without the component eagerly coercing those strings to their parsed numeric
equivalents (`0.` becomes `0`, fractional data entry impossible).

Exceptions to this rule may occur if your input only supports _positive integers_, which will not
have any non-numeric characters. See the [precision section](#core/components/numeric-input.numeric-precision)
to learn how to enforce this kind of constraint.

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign">

When handling changes in controlled mode, always use the _second_ parameter of the `onValueChange` callback, which
provides the value as a string. This allows users to type non-numeric characters like decimal points (".") without the
component eagerly coercing those strings to their parsed numeric equivalents (`0.` becomes `0`, fractional data entry
impossible).

</div>

The combined support of arbitrary text entry, controlled mode, and custom callbacks makes it possible to extend the
numeric input's basic functionality in powerful ways. As shown in the example above, one could extend the numeric input
component with support for mathematical expressions as follows:

```tsx
import { NumericInput } from "@blueprintjs/core";
import * as SomeLibrary from "some-library";

interface NumericInputExampleState = {
    value?: number | string;
}

class NumericInputExample extends React.Component<{}, NumericInputExampleState> {
    public state = { value: NumericInput.VALUE_EMPTY };

    public render() {
        return (
            <NumericInput
                onValueChange={this.handleValueChange}
                value={this.state.value}
            />
        );
    }

    private handleValueChange = (_valueAsNumber: number, valueAsString: string) {
        // Important: use the string value to allow typing decimal places and negative numbers
        const result = SomeLibrary.evaluateMathExpression(valueAsString);
        this.setState({ value: result });
    }
}
```

@### Numeric precision

**NumericInput** determines its maximum precision by looking at both the `minorStepSize` and `stepSize` props.
If `minorStepSize` is non-null, the number of decimal places in that value will be the maximum precision.
Otherwise, the component will count the decimal places in `stepSize`.

Configuring these props allows you to expand or constrain the precision of the input. For example, to limit
the input to only integers, you can set `minorStepSize={null}` and allow the default `stepSize` of `1` to take
precedence.

@## Styling

**NumericInput** can be styled with the same set of visual modifier props & CSS classes as
[**ControlGroup**](#core/components/control-group). The most appropriate such modifier for **NumericInput** is `fill`,
which will make the component expand to fill all available width.

@## Props interface

@interface NumericInputProps
