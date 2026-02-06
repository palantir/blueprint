@# Button group

A horizontal or vertical layout for grouping related action buttons.

@reactCodeExample ButtonGroupBasicExample

@## Import

```ts
import { ButtonGroup } from "@blueprintjs/core";
```

@## Examples

@### Intent

Use the `intent` prop on individual buttons to convey purpose.

@reactCodeExample ButtonGroupIntentExample

@### Variant

Use the `variant` prop to change the visual style of buttons in the group. Setting props on ButtonGroup applies the same value to all buttons; most modifiers cannot be overridden on child buttons due to CSS cascading.

@reactCodeExample ButtonGroupVariantExample

@### Outlined and minimal

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign">
    <h5 class="@ns-heading">

Deprecated: use [`variant`](#core/components/buttons.variant) instead

</h5>

</div>

Use the `outlined` and `minimal` props to change the visual style of buttons in the group.

@reactCodeExample ButtonGroupOutlinedMinimalExample

@### Size

Use the `size` prop to control the size of all buttons in the group.

@reactCodeExample ButtonGroupSizeExample

@### Flex layout

Use the `fill` prop to make buttons expand to fill available space. Add the `Classes.FIXED` class to specific buttons to maintain their initial size, or enable `fill` on individual buttons for selective expansion.

@reactCodeExample ButtonGroupFlexExample

@### Vertical layout

Use the `vertical` prop to stack buttons vertically. Use the `alignText` prop to control text and icon alignment.

@reactCodeExample ButtonGroupVerticalExample

@### With Popover

Wrap buttons with [**Popover**](#core/components/popover) to create complex toolbars.

@reactExample ButtonGroupPopoverExample

@## Interactive Playground

@reactExample ButtonGroupPlaygroundExample

@## Props interface

@interface ButtonGroupProps
