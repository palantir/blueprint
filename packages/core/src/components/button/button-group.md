@# Button groups

Button groups arrange multiple buttons in a horizontal or vertical group.

@reactExample ButtonGroupExample

@## Usage with popovers

`Button`s inside a `ButtonGroup` can trivially be wrapped with a
[`Popover`](#core/components/popover) to create complex toolbars.

@reactExample ButtonGroupPopoverExample

@## Flex layout

`ButtonGroup` is a CSS inline flex row (or column if vertical) and provides
some modifer props for common flexbox patterns:

- Enable the `fill` prop on a button group to make all buttons expand equally to
  fill the available space. Then add the class `Classes.FIXED` to individual
  buttons to revert them to their original default sizes.

- Alternatively, enable the `fill` prop on specific buttons (instead of on the
  group) to expand them equally to fill the available space while other
  buttons retain their original sizes.

You can adjust the specific size of a button with the `flex-basis` or `width`
CSS properties.

@## Vertical layout

Buttons in a vertical group all have the same width as the widest button in the
group.

Use the `alignText` prop to control icon and text alignment in the buttons. Set
this prop on `ButtonGroup` to affect all buttons in the group, or set the prop
on individual buttons directly.

Vertical groups can be combined with other modifier props.

@## Props

This component is a simple wrapper around the CSS API.
It exposes shorthand props for CSS modifier classes and supports the full range of HTML props.

```tsx
<ButtonGroup minimal={true} onMouseEnter={...}>
    <Button icon="database">Queries</Button>
    <Button icon="function">Functions</Button>
    <AnchorButton rightIcon="caret-down">Options</AnchorButton>
</ButtonGroup>
```

@interface IButtonGroupProps

@## CSS

Arrange multiple buttons in a group by wrapping them in `.@ns-button-group`.
You can apply sizing directly on the button group container element.

You should implement interactive segmented controls as button groups.

@css button-group
