@# Colors

@## Gray scale

Black, white and everything in between.

The gray scale should be used for the main UI frame: containers, headers, sections, boxes, etc.

If you need to call attention to a particular element (buttons, icons, tooltips, etc.),
use one of the [core colors](#core/colors.core-colors) instead.

@reactDocs BlackWhitePalette
@reactDocs GrayscalePalette

@## Core colors

Core colors are used to support user interface design by calling
attention to specific elements, such as buttons, callouts, icons, etc.

Each core color is mapped to what we call a __visual intent__. Intents
are used to convey the status and tone of UI elements:

- _Blue_ (intent: primary) elevates elements from the typical gray scale UI frame.
- _Green_ (intent: success) indicates successful operations.
- _Orange_ (intent: warning) indicates warnings and intermediate states.
- _Red_ (intent: danger) indicates errors and potentially destructive operations.

Blueprint's core colors are designed to:

- go well together and be used alongside each other in any application.
- adhere to [WCAG 2.0](https://www.w3.org/TR/WCAG20/) standards, and therefore are
highly accessible to visually impaired and color blind users.

Many Blueprint components support the `intent` prop, which may be set to a string
literal constant such as `intent="primary"`.

@reactDocs CoreColorsPalette

@## Extended colors

Extended colors should typically be reserved for data visualizations: any time
you need to represent data of some sort, you can use these.
These colors are less strict on [WCAG 2.0](https://www.w3.org/TR/WCAG20/)
accessibility standards and should therefore not be used for typical user
interface design — take a look at [core colors](#colors.core-colors) instead.

@reactDocs ExtendedColorsPalette

@## Usage

Blueprint provides variables for colors in Sass, Less, and JavaScript.
[Semantic aliases for common colors](#core/variables.color-aliases) are also provided in Sass and Less.

Example in Sass:

```scss
@import "@blueprintjs/core/lib/scss/variables";

.rule {
    color: $pt-link-color;
    background: $black;
}
```

Example in Less:

```less
@import "@blueprintjs/core/lib/less/variables";

.rule {
    color: @pt-link-color;
    background: @black;
}
```

Hex values for these colors can be accessed in JavaScript through the `Colors` export.
Note that aliases are not currently available in JavaScript.

```tsx
import { Colors } from "@blueprintjs/core";

<div style={{ color: Colors.BLUE3, background: Colors.BLACK }} />
```

@## Color schemes

Use the following color scheme generators to produce color schemes for your data visualizations.
First, choose the kind of scheme based on the type of your data, then customize the number of values
using the forms below. Finally, copy the colors array into your application and make it live!

The following schemes have been carefully crafted to be visually striking and easily understandable
while remaining accessible to visually impaired and color blind users.

@### Sequential color schemes

Sequential color schemes imply order and are best suited for representing data that
ranges from low-to-high values either on an ordinal or on a numerical scale.

@reactDocs SequentialSchemePalette

@### Diverging color schemes

Diverging color schemes put equal emphasis on mid-range values and extremes
at both ends of the data range.

@reactDocs DivergingSchemePalette

@### Qualitative color schemes

Qualitative color schemes use a series of unrelated colors to create a
scheme that does not imply order, merely difference in kind.

@reactDocs QualitativeSchemePalette

