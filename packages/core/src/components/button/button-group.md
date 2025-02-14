@# Button group

The **ButtonGroup** component arranges related buttons in a horizontal row or
vertical stack, providing alignment and consistent spacing for a layout of related actions.

Most of **ButtonGroup**'s props are also supported by [**Button**](#core/components/buttons) directly. Setting these props on **ButtonGroup** will apply the same value to all buttons in the group. Note that most modifiers, once enabled on the group, cannot be overridden on child buttons (due to the cascading nature of CSS).

@## Import

```ts
import { ButtonGroup } from "@blueprintjs/core";
```

@## Usage

Wrap buttons in a **ButtonGroup** to arrange them together horizontally.

@reactCodeExample ButtonGroupBasicExample

@## Intent

Use the `intent` prop on individual buttons to convey purpose. For a consistent
visual style, it’s recommended to apply the same `intent` to all buttons within the same group.

@reactCodeExample ButtonGroupIntentExample

@## Variant

Use the `variant` prop to change the visual style of button child elements within the group.

@reactCodeExample ButtonGroupVariantExample

@## Outlined and minimal

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign">
    <h5 class="@ns-heading">

Deprecated: use [`variant`](#core/components/buttons.variant) instead

</h5>

</div>

Use the `outlined` and `minimal` props to change the visual style of button child elements within the group.

@reactCodeExample ButtonGroupOutlinedMinimalExample

@## Size

The `size` prop can be used to control the size of all child buttons within the button group.

@reactCodeExample ButtonGroupSizeExample

@## Flex layout

**ButtonGroup** renders a CSS flex row (or column if `vertical` is enabled) and
includes modifier props for common flexbox patterns:

-   Use the `fill` prop to make all buttons expand equally to fill the available space.
    -   Buttons will expand horizontally by default or vertically if `vertical` is enabled.
    -   Add the `Classes.FIXED` class to specific buttons to maintain their initial sizes.
-   Alternatively, enable `fill` on specific buttons to selectively expand them while others retain their original size.

For precise size adjustments, use the `flex-basis` or `width` CSS properties on individual buttons.

@reactCodeExample ButtonGroupFlexExample

@## Vertical layout

Enable the `vertical` prop to stack buttons vertically. Buttons in a vertical
group automatically adjust to the width of the widest button in the group.

Use the `alignText` prop to control text and icon alignment within the buttons.
Set it at the group level for uniform alignment or on individual buttons for specific adjustments.

@reactCodeExample ButtonGroupVerticalExample

@## Usage with popovers

**Button** elements inside a **ButtonGroup** can be wrapped with a
[**Popover**](#core/components/popover) to create complex toolbars.

@reactExample ButtonGroupPopoverExample

@## Interactive Playground

@reactExample ButtonGroupPlaygroundExample

@## Props interface

@interface ButtonGroupProps

@## CSS API

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">

Deprecated API: use [`<ButtonGroup>`](#core/components/button-group)

</h5>

CSS APIs for Blueprint components are considered deprecated, as they are verbose, error-prone, and they
often fall out of sync as the design system is updated. You should use the React component APIs instead.

</div>

Arrange multiple buttons in a group by wrapping them in `.@ns-button-group`.
You can apply sizing directly on the button group container element.

You should implement interactive segmented controls as button groups.

@css button-group
