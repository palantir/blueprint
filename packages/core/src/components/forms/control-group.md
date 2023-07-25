@# Control group

A __ControlGroup__ renders multiple distinct form controls as one unit, with a small margin between elements. It
supports any number of buttons, text inputs, input groups, numeric inputs, and HTML selects as direct children.

<div class="@ns-callout @ns-intent-success @ns-icon-comparison @ns-callout-has-body-content">
    <h5 class="@ns-heading">Control group vs. input group</h5>

Both components group multiple elements into a single unit, but their usage patterns are quite different.

Think of __ControlGroup__ as a parent with multiple children, with each one a separate control.

Conversely, an [__InputGroup__](#core/components/input-group) is a single control, and should behave like
so. A button inside of an input group should only affect that input; if its reach is further, then it should be
promoted to live in a control group.

</div>

@reactExample ControlGroupExample

@## Flex layout

__ControlGroup__ is a CSS inline flex row (or column if vertical) and provides some modifer props for common flexbox
patterns:

- Enable the `fill` prop on a control group to make all controls expand equally to fill the available space.
    - Controls will expand horizontally by default, or vertically if the `vertical` prop is enabled.
    - Add the class `Classes.FIXED` to individual controls to revert them to their initial sizes.

- In addition, you may enable the `fill` prop on specific controls inside the group to expand them fill more space while
 other controls retain their original sizes.

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

@## CSS

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">

Deprecated API: use [`<ControlGroup>`](#core/components/control-group)

</h5>

CSS APIs for Blueprint components are considered deprecated, as they are verbose, error-prone, and they
often fall out of sync as the design system is updated. You should use the React component APIs instead.

</div>

Note that `.@ns-control-group` does not cascade any modifiers to its children. For example, each
child must be marked individually as `.@ns-large` for uniform large appearance.

@css control-group

