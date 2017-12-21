@# Button groups

Button groups arrange multiple buttons in a horizontal or vertical group.

@## CSS API

Arrange multiple buttons in a group by wrapping them in `.pt-button-group`.
You can apply sizing directly on the button group container element.

You should implement interactive segmented controls as button groups.

@css pt-button-group

@### Responsive button groups

Add the class `pt-fill` to a button group to make all buttons expand equally to fill the
available space. Then add the class `pt-fixed` to individual buttons to revert them to their
original default sizes.

Alternatively, add the class `pt-fill` to an individual button (instead of to the container)
to expand it to fill the available space while other buttons retain their original sizes.

You can adjust the specific size of a button with the `flex-basis` CSS property.

@css pt-button-group.pt-fill

@### Vertical button groups

Add the class `pt-vertical` to create a vertical button group. The buttons in a vertical
group all have the same size as the widest button in the group.

Add the modifier class `pt-align-left` to left-align all button text and icons.

You can also combine vertical groups with the `pt-fill` and `pt-minimal` class modifiers.

@css pt-button-group.pt-vertical

@## JavaScript API

The `ButtonGroup` component is available in the __@blueprintjs/core__ package.
Make sure to review the [general usage docs for JS components](#blueprint.usage).

This component is a simple wrapper around the CSS API, and supports the full range of HTML props.

```tsx
<ButtonGroup minimal={true} large={false} onMouseEnter={...}>
    <Button iconName="database">Queries</Button>
    <Button iconName="function">Functions</Button>
    <AnchorButton rightIconName="caret-down">Options</AnchorButton>
</ButtonGroup>
```

@reactExample ButtonGroupExample

@### Usage with Popovers

`Button`s inside a `ButtonGroup` can optionally be wrapped with a [`Popover`](#core/components/popover). The following example demonstrates this composition:

```tsx
<ButtonGroup className={Classes.ALIGN_LEFT}>
    <Popover content={...}>
        <Button iconName="document" rightIconName="caret-down" text="File" />
    </Popover>
    <Popover content={...}>
        <Button iconName="edit" rightIconName="caret-down" text="Edit" />
    </Popover>
    <Popover content={...}>
        <Button iconName="eye-open" rightIconName="caret-down" text="View" />
    </Popover>
</ButtonGroup>
```

@reactExample ButtonGroupPopoverExample

<div class="pt-callout pt-intent-primary pt-icon-info-sign">
    In vertical button groups, button content will be centered by default. You can align button content to the left or right using `pt-align-left` and `pt-align-right`, respectively.
</div>

@interface IButtonGroupProps
