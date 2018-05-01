@# Button groups

Button groups arrange multiple buttons in a horizontal or vertical group.

@## CSS API

Arrange multiple buttons in a group by wrapping them in `.@ns-button-group`.
You can apply sizing directly on the button group container element.

You should implement interactive segmented controls as button groups.

@css button-group

@### Responsive button groups

Add the class `@ns-fill` to a button group to make all buttons expand equally to fill the
available space. Then add the class `@ns-fixed` to individual buttons to revert them to their
original default sizes.

Alternatively, add the class `@ns-fill` to an individual button (instead of to the container)
to expand it to fill the available space while other buttons retain their original sizes.

You can adjust the specific size of a button with the `flex-basis` CSS property.

@css button-group-fill

@### Vertical button groups

Add the class `Classes.VERTICAL` to create a vertical button group. The buttons in a vertical
group all have the same size as the widest button in the group.

Add the modifier class `Classes.ALIGN_LEFT` (or `align={Alignment.LEFT}` in the React component) to
left-align button text and icon and right-align `rightIcon`.

You can also combine vertical groups with the `Classes.FILL` and `Classes.MINIMAL` class modifiers.

@css button-group-vertical

@## JavaScript API

The `ButtonGroup` component is available in the **@blueprintjs/core** package.
Make sure to review the [getting started docs for installation info](#blueprint/getting-started).

This component is a simple wrapper around the CSS API.
It exposes shorthand props for CSS modifier classes and supports the full range of HTML props.

```tsx
<ButtonGroup minimal={true} large={false} onMouseEnter={...}>
    <Button icon="database">Queries</Button>
    <Button icon="function">Functions</Button>
    <AnchorButton rightIcon="caret-down">Options</AnchorButton>
</ButtonGroup>
```

@reactExample ButtonGroupExample

@### Usage with Popovers

`Button`s inside a `ButtonGroup` can optionally be wrapped with a [`Popover`](#core/components/popover). The following example demonstrates this composition:

```tsx
<ButtonGroup className={Classes.ALIGN_LEFT}>
    <Popover content={...}>
        <Button icon="document" rightIcon="caret-down" text="File" />
    </Popover>
    <Popover content={...}>
        <Button icon="edit" rightIcon="caret-down" text="Edit" />
    </Popover>
    <Popover content={...}>
        <Button icon="eye-open" rightIcon="caret-down" text="View" />
    </Popover>
</ButtonGroup>
```

@reactExample ButtonGroupPopoverExample

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">
    In vertical button groups, button content will be centered by default. You can align button content to the left or right using `@ns-align-left` and `@ns-align-right`, respectively.
</div>

@interface IButtonGroupProps
