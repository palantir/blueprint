@# Popover2

**Changes from original [`Popover`](#core/components/popover):**

- [Popper.js](https://popper.js.org) is a massive improvement over [Tether](http://tether.io/) in almost every way!
  - all the fancy flipping behavior you could want _enabled by default_
  - endlessly customizable if it isn't perfect _enough_ for you
  - look, it puts the arrow exactly where it's supposed to be. _every time._
- all the classic `Popover` features are still supported, with the same names except...
  - `isModal` &rarr; `hasBackdrop` to match corresponding prop on `Overlay`
  - `isDisabled` &rarr; `disabled` for consistency with HTML elements
- ...and except for the handful of Tether-specific props, which are now Popper.js-specific:
  - `position: Position` &rarr; [`placement: PopperJS.Placement`](#labs.placement)
  - `tetherOptions: ITetherOptions` &rarr; [`modifiers: PopperJS.Modifiers`](#labs.modifiers)
- ...and one special addition:
  - `minimal: boolean` applies minimal styles, which includes removing the arrow and minimizing the transition

@reactExample Popover2Example

@interface IPopover2Props

@## Placement

Valid placements are:

- `auto`
- `top`
- `right`
- `bottom`
- `left`

Each placement can have a suffix from this list, which determines the alignment along the opposite axis:

- `-start`
- <small>_(nothing)_</small>
- `-end`

For `top` and `bottom`, `-start` means left and `-end` means right. For `left` and `right`, `-start` means top and `-end` means bottom.

Therefore, `top-start` places the Popover along the top edge of the target and their left sides will be aligned.
And `right-end` places the Popover along the right edge with their bottom sides aligned.

`auto` will choose the best suitable placement given the Popover's position within its boundary element.

<div class="pt-callout pt-intent-primary pt-icon-info-sign">
    Read more in [the Popper.js Placement documentation](https://popper.js.org/popper-documentation.html#Popper.placements).
</div>

@## Modifiers

Modifiers are the tools through which you customize Popper.js's behavior. Popper.js defines several of its own modifiers to handle things such as flipping, preventing overflow from a boundary element, and positioning the arrow. `Popover2` defines a few additional modifiers to support itself. You can even define your own modifiers, and customize the Popper.js defaults, through the `modifiers` prop. (Note: it is not currently possible to configure `Popover2`'s modifiers through the `modifiers` prop, nor can you define your own with the same name.)

**Popper.js modifiers, which can be customized via the `modifiers` prop:**

- [`shift`](https://popper.js.org/popper-documentation.html#modifiers..shift) applies the `-start`/`-end` portion of placement
- [`offset`](https://popper.js.org/popper-documentation.html#modifiers..offset) can be configured to move the popper on both axes using a CSS-like syntax
- [`preventOverflow`](https://popper.js.org/popper-documentation.html#modifiers..preventOverflow) prevents the popper from being positioned outside the boundary
- [`keepTogether`](https://popper.js.org/popper-documentation.html#modifiers..keepTogether) ensures the popper stays near to its reference without leaving any gap.
- [`arrow`](https://popper.js.org/popper-documentation.html#modifiers..arrow) computes the arrow position.
- [`flip`](https://popper.js.org/popper-documentation.html#modifiers..flip) flips the popper's placement when it starts to overlap its reference element.
- [`inner`](https://popper.js.org/popper-documentation.html#modifiers..inner) makes the popper flow toward the inner of the reference element (disabled by default).
- [`hide`](https://popper.js.org/popper-documentation.html#modifiers..hide) hides the popper when its reference element is outside of the popper boundaries.
- [`computeStyle`](https://popper.js.org/popper-documentation.html#modifiers..computeStyle) generates the CSS styles to apply to the DOM

**`Popover2` modifiers, _which cannot be used by you_:**

- `arrowOffset` moves the popper a little bit to make room for the arrow
- `updatePopoverState` saves off some popper data to `Popover2` React state for fancy things

<div class="pt-callout pt-intent-primary pt-icon-info-sign">
    To understand all the Popper.js modifiers available to you, you'll want to read [the Popper.js Modifiers documentation](https://popper.js.org/popper-documentation.html#modifiers).
</div>

