@# Control group

A **ControlGroup** renders multiple distinct form controls as one unit, with a small margin between elements. It
supports any number of buttons, text inputs, input groups, numeric inputs, and HTML selects as direct children.

<div class="@ns-callout @ns-intent-success @ns-icon-comparison @ns-callout-has-body-content">
    <h5 class="@ns-heading">Control group vs. input group</h5>

Both components group multiple elements into a single unit, but their usage patterns are quite different.

Think of **ControlGroup** as a parent with multiple children, with each one a separate control.

Conversely, an [**InputGroup**](#core/components/input-group) is a single control, and should behave like
so. A button inside of an input group should only affect that input; if its reach is further, then it should be
promoted to live in a control group.

</div>

@## Import

```tsx
import { ControlGroup } from "@blueprintjs/core";
```

@reactExample ControlGroupExample

@## Flex layout

**ControlGroup** is a CSS inline flex row (or column if vertical) and provides some modifer props for common flexbox
patterns:

-   Enable the `fill` prop on a control group to make all controls expand equally to fill the available space.
    -   Controls will expand horizontally by default, or vertically if the `vertical` prop is enabled.
    -   Add the class `Classes.FIXED` to individual controls to revert them to their initial sizes.
-   In addition, you may enable the `fill` prop on specific controls inside the group to expand them fill more space while other controls retain their original sizes.

You can adjust the specific size of a control with the `flex-basis` or `width` CSS properties.

@## Usage

This component is a lightweight wrapper around its children. It supports all HTML `<div>` attributes in addition to
those listed in the props interface below.

```tsx
<ControlGroup fill={true} vertical={false}>
    <Button icon="filter">Filter</Button>
    <InputGroup placeholder="Find filters..." />
</ControlGroup>
```

@## Props interface

@interface ControlGroupProps
