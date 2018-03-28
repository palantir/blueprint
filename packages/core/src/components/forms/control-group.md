@# Control groups

A `.@ns-control-group` renders several distinct controls as one unit, squaring the borders between
them. It supports any number of `.@ns-button`, `.@ns-input`, `.@ns-input-group`, and `.@ns-select`
elements as direct children.

Note that `.@ns-control-group` does not cascade any modifiers to its children. For example, each
child must be marked individually as `.@ns-large` for uniform large appearance.

<div class="@ns-callout @ns-intent-success @ns-icon-comparison">
    <h4 class="@ns-callout-title">Control group vs. input group</h4>
    <p>Both components group multiple elements into a single unit, but their usage patterns are
    different.</p>
    <p>Think of `.@ns-control-group` as a parent with multiple children, each of them a
    "control."</p>
    <p>Conversely, a `.@ns-input-group` is a single control, and should function like so. A
    button inside of an input group should only affect that input; if its reach is further, then it
    should be promoted to live in a control group.</p>
</div>

@css control-group

@## Responsive control groups

Add the class `@ns-fill` to a control group to make all elements expand equally to fill the
available space. Then add the class `@ns-fixed` to individual elements to revert them to their
original default sizes.

Alternatively, add the class `@ns-fill` to an individual element (instead of to the container)
to expand it to fill the available space while other elements retain their original sizes.

You can adjust the specific size of an element with the `flex-basis` CSS property.

@css control-group-fill

@## Vertical control groups

Add the class `@ns-vertical` to create a vertical control group. Controls in a vertical group
will all have the same width as the widest control.

@css control-group-vertical

@## JavaScript API

The `ControlGroup` component is available in the **@blueprintjs/core** package. Make sure to review [getting started docs for installation info](#blueprint/getting-started).

This component is a simple wrapper around the corresponding CSS API. It supports the full range of HTML props.

```tsx
<ControlGroup fill={true} vertical={false}>
    <Button icon="filter">Filter</Button>
    <InputGroup placeholder="Find filters..." />
</ControlGroup>
```

@reactExample ControlGroupExample

@interface IControlGroupProps
