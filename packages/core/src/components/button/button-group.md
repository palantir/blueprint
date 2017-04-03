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
