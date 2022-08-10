@# Popover

<div class="@ns-callout @ns-intent-danger @ns-icon-error">
    <h4 class="@ns-heading">

Deprecated: use [Popover2](#popover2-package/popover2)

</h4>

This component is **deprecated since @blueprintjs/core v3.38.0** in favor of the new
Popover2 component available in the `@blueprintjs/popover2` package. You should migrate
to the new API which will become the standard in Blueprint v5.

</div>

Popovers display floating content next to a target element.

`Popover` is built on top of the [**Popper.js**](https://popper.js.org) library.
Popper.js is a small (`~6kb`) library that offers a powerful, customizable
positioning engine and operates at blazing speed (`~60fps`). It currently uses
Popper.js v1; track migration to v2 [here](https://github.com/palantir/blueprint/issues/4023).

@reactExample PopoverExample

@## Props

`Popover` supports controlled and uncontrolled usage through `isOpen` and
`defaultIsOpen`, respectively. Use `onInteraction` in controlled mode to respond
to changes in the `isOpen` state.

Supported user interactions are dictated by the `interactionKind` prop.

This component is quite powerful and has a wide range of features. Explore the
[**Concepts**](#core/components/popover.concepts) section below for more advanced
guides.

@interface IPopoverProps

@## Concepts

@### Structure

When creating a popover, you must specify both its **content** and its **target**.
This can be done a few ways:

1. Provide both the `content` and `target` props, which accept a string or a JSX element.
   Omitting the `target` prop will produce an error.

```tsx
<Popover content={<Content />} target={<Button text="Open" />} />
```

1. Provide one or two `children`. Omitting a `target` element will produce an error.

```tsx
<Popover>
    <Button text="Open" />
    <Content />
</Popover>
```

1. It is possible to mix the two: provide the `content` prop and one React child as the target.
   (Using the `target` prop with `children` is not supported and will produce a warning.)

```tsx
<Popover content={<Content />}>
    <Button text="Open" />
</Popover>
```

The **target** acts as the trigger for the popover; user interaction will show the popover based on
`interactionKind`. The **content** will be shown in the popover itself. The popover's will always be
positioned on the page next to the target; the `position` prop determines the relative position (on
which side of the target).

Internally, the provided target is wrapped in a `span.@ns-popover-target`. This
in turn is wrapped in a `span.@ns-popover-wrapper`. The extra
`@ns-popover-wrapper` is present so that both the popover and target will be
wrapped in a single element when rendering
[popovers without a portal](#core/components/popover.portal-rendering).

```tsx
<span class="@ns-popover-wrapper">
    <span class="@ns-popover-target">
        <Button text="My target" />
    </span>
    <!-- inline Popover would render here -->
</span>
```

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign">
    <h4 class="@ns-heading">Button targets</h4>

Buttons make great popover targets, but the `disabled` attribute on a `<button>` blocks all
events, which interferes with the popover functioning. If you need to disable a button that
triggers a popover, you should use [`AnchorButton`](#core/components/button.anchor-button) instead.
See the [callout here](#core/components/button.props) for more details.

</div>

```tsx
import { Button, Intent, Popover, PopoverInteractionKind, Position } from "@blueprintjs/core";

export class PopoverExample extends React.Component {
    public render() {
        // popover content gets no padding by default; add the "@ns-popover-content-sizing"
        // class to the popover to set nice padding between its border and content,
        // and a default width when inline.
        return (
            <Popover
                interactionKind={PopoverInteractionKind.CLICK}
                popoverClassName="@ns-popover-content-sizing"
                position={Position.RIGHT}
            >
                <Button intent={Intent.PRIMARY}>Popover target</Button>
                <div>
                    <h5>Popover title</h5>
                    <p>...</p>
                    <Button className="@ns-popover-dismiss">Dismiss</Button>
                </div>
            </Popover>
        );
    }
}
```

@### Position

The `position` prop controls the Popover's position relative to the target.
The `Position` enumeration defines the full set of supported values. There are two attributes of positioning to consider:

-   Which <span class="docs-popover-position-label-side">**side**</span> of the target the popover should render on.
-   The popover's <span class="docs-popover-position-label-alignment">**alignment**</span> relative to the target.

These two attributes can be expressed with a single value having the following structure:

<pre class="docs-popover-position-value-code-block">
    <span class="docs-popover-position-label-side">[SIDE]</span>-<span class="docs-popover-position-label-alignment">[ALIGNMENT]</span>
</pre>

The following example shows all supported `Position` values and how each behaves in practice.
Note that if <strong><code>\-<span class="docs-popover-position-label-alignment">[ALIGNMENT]</span></code></strong> is ommitted,
the popover will align to the **center** of the target.

@reactExample PopoverPositionExample

#### Automatic positioning

The Popover's `position` can also be chosen _automatically_ via `"auto"`, `"auto-start"`, or `"auto-end"`.
All of these options choose and continually update the <span class="docs-popover-position-label-side">**side**</span>
for you to avoid overflowing the boundary element (when scrolling within it, for instance).
The options differ in how they handle <span class="docs-popover-position-label-alignment">**alignment**</span>:

-   In `"auto"` mode (the default for `position`), the Popover will align itself to the center of the target as it flips sides.
-   In `"auto-start"` mode, the Popover will align itself to the `start` of the target (i.e., the top edge when the popover is on the left or right, or the left edge when the popover is on the top or bottom).
-   In `"auto-end"` mode, the Popover will align itself to the `end` of the target (i.e., the bottom edge when the popover is on the left or right, or the right edge when the popover is on the top or bottom).

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">

You can also specify a specific initial position (e.g. `LEFT`, `TOP_RIGHT`) and still update the Popover's position
automatically by enabling the modifiers `flip` and `preventOverflow`.
[See below](#core/components/popover.modifiers) for information about modifiers.

</div>

@### Modifiers

Modifiers are the tools through which you customize Popper.js's behavior. Popper.js defines several of its own modifiers
to handle things such as flipping, preventing overflow from a boundary element, and positioning the arrow.
`Popover` defines a few additional modifiers to support itself. You can even define your own modifiers, and customize
the Popper.js defaults, through the `modifiers` prop. (Note: it is not currently possible to configure `Popover`'s modifiers
through the `modifiers` prop, nor can you define your own with the same name.)

**Popper.js modifiers that can be customized via the `modifiers` prop:**

-   [`shift`](https://popper.js.org/docs/v1/#modifiers..shift) applies the `-start`/`-end` portion of placement
-   [`offset`](https://popper.js.org/docs/v1/#modifiers..offset) can be configured to move the popper on both axes using a CSS-like syntax
-   [`preventOverflow`](https://popper.js.org/docs/v1/#modifiers..preventOverflow) prevents the popper from being positioned outside the boundary
-   [`keepTogether`](https://popper.js.org/docs/v1/#modifiers..keepTogether) ensures the popper stays near to its reference without leaving any gap.
-   [`arrow`](https://popper.js.org/docs/v1/#modifiers..arrow) computes the arrow position.
-   [`flip`](https://popper.js.org/docs/v1/#modifiers..flip) flips the popper's placement when it starts to overlap its reference element.
-   [`inner`](https://popper.js.org/docs/v1/#modifiers..inner) makes the popper flow toward the inner of the reference element (disabled by default).
-   [`hide`](https://popper.js.org/docs/v1/#modifiers..hide) hides the popper when its reference element is outside of the popper boundaries.
-   [`computeStyle`](https://popper.js.org/docs/v1/#modifiers..computeStyle) generates the CSS styles to apply to the DOM

**Popper.js modifiers that `Popover` manages and that cannot be customized:**

-   `arrowOffset` moves the popper a little bit to make room for the arrow
-   `updatePopoverState` saves off some popper data to `Popover` React state for fancy things

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">

See [the Popper.js v1 modifiers documentation](https://popper.js.org/docs/v1/#modifiers)
for more details on all the available modifiers.

</div>

@### Controlled mode

If you prefer to have more control over your popover's behavior, you can specify the `isOpen`
property to use the component in **controlled mode**. You are now in charge of the component's
open state.

Providing a non-null value for `isOpen` disables all automatic interaction and instead invokes
the `onInteraction` callback prop any time the opened state _would have changed_ in response to
user interaction under the current `interactionKind`.

Note that there are cases where `onInteraction` is invoked with an unchanged open state.
It is important to pay attention to the value of the `nextOpenState` parameter and determine
in your application logic whether you should care about a particular invocation (for instance,
if the `nextOpenState` is not the same as the `Popover`'s current state).

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign">
    <h4 class="@ns-heading">Disabling controlled popovers</h4>

If `disabled={true}`, a controlled popover will remain closed even if `isOpen={true}`.
The popover will re-open when `disabled` is set to `false`.

</div>

#### Example controlled usage

```tsx
import { Popover, Position } from "@blueprintjs/core";

export class ControlledPopoverExample extends React.Component<{}, { isOpen: boolean }> {
    public state = { isOpen: false };

    public render() {
        let popoverContent = (
            <div>
                <h5>Popover Title</h5>
                <p>...</p>
                <button class="@ns-button @ns-popover-dismiss">Close popover</button>
            </div>
        );

        return (
            <Popover
                content={popoverContent}
                interactionKind={PopoverInteractionKind.CLICK}
                isOpen={this.state.isOpen}
                onInteraction={state => this.handleInteraction(state)}
                position={Position.RIGHT}
            >
                <button className="@ns-button @ns-intent-primary">Popover target</button>
            </Popover>
        );
    }

    private handleInteraction(nextOpenState: boolean) {
        this.setState({ isOpen: nextOpenState });
    }
}
```

@### Interactions

The `interactionKind` prop governs how the popover should open and close in response to user interactions.
The supported values are:

-   `HOVER`
    -   **Opens when:** the target is hovered
    -   **Closes when:** the cursor is no longer inside the target _or_ the popover
-   `HOVER_TARGET_ONLY`:
    -   **Opens when:** the target is hovered
    -   **Closes when:** the cursor is no longer inside the target
-   `CLICK`:
    -   **Opens when:** the target is clicked
    -   **Closes when:** the user clicks anywhere outside of the popover (including the target)
-   `CLICK_TARGET_ONLY`:
    -   **Opens when:** the target is clicked
    -   **Closes when:** the target is clicked

The following example demonstrates the various interaction kinds (note: these Popovers contain
[MenuItem](#core/components/menu.menu-item)s with `shouldDismissPopover={false}`, for clarity):

@reactExample PopoverInteractionKindExample

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">
    <h4 class="@ns-heading">Conditionally styling popover targets</h4>

When a popover is open, `Classes.POPOVER_OPEN` is applied to the target.
You can use this to style the target differently when the popover is open.

</div>

@### Closing on click

Sometimes it is desirable for an element inside a `Popover` to close the popover
on click. `Popover` supports a pair of CSS classes, `Classes.POPOVER_DISMISS`
and `Classes.POPOVER_DISMISS_OVERRIDE`, that can be attached to elements to
describe whether click events should dismiss the enclosing popover.

To mark an element (and its children) as "dismiss elements", simply add the
class `Classes.POPOVER_DISMISS`. For example, the **Cancel** and **Delete** buttons in the
top-level [Popover example](#core/components/popover) have this class, and all
`MenuItem`s receive this class by default (see `shouldDismissPopover` prop). To
enable this behavior on the entire popover body, pass
`popoverClassName={Classes.POPOVER_DISMISS}`.

Cancel the dismiss behavior on subtrees by nesting
`Classes.POPOVER_DISMISS_OVERRIDE` inside `Classes.POPOVER_DISMISS`. Clicks
originating inside disabled elements (either via the `disabled` attribute or
`Classes.DISABLED`) will never dismiss a popover.

Additionally, the prop `captureDismiss` (disabled by default) will prevent click
events from dismissing _grandparent_ popovers (not the `Popover` immediately
containing the dismiss element). `MenuItem` disables this feature such that
clicking any submenu item will close all submenus, which is desirable behavior
for a menu tree.

```tsx
<div className={Classes.POPOVER_DISMISS}>
    <button>Click me to dismiss</button>
    <button disabled={true}>I will not dismiss</button>
    <div className={Classes.POPOVER_DISMISS_OVERRIDE}>
        <button>I too shall not dismiss</button>
    </div>
</div>
```

@reactExample PopoverDismissExample

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">

Dismiss elements won't have any effect in a popover with
`PopoverInteractionKind.HOVER_TARGET_ONLY`, because there is no way to
interact with the popover content itself: the popover is dismissed the
moment the user mouses away from the target.

</div>

@### Backdrop

The `hasBackdrop` prop governs whether a backdrop appears while the popover is open. When `true`:

-   **A transparent backdrop will render beneath the popover**. This backdrop
    covers the entire viewport and prevents interaction with the document until
    the popover is closed. This is useful for preventing stray clicks or hovers in
    your app when the user tries to close a popover.
-   **The popover will receive focus when opened**, allowing for better keyboard accessibility.

Clicking the backdrop will:

-   _in uncontrolled mode_, close the popover.
-   _in controlled mode_, invoke the `onInteraction` callback with an argument of `false`.

This backdrop behavior is only available for popovers having `interactionKind={PopoverInteractionKind.CLICK}`.
An error is thrown if used otherwise.

#### Styling the backdrop

By default, the popover backdrop is invisible, but you can easily add your own styles to
`.@ns-popover-backdrop` to customize the appearance of the backdrop (for example, you could give it
a translucent background color, like the backdrop for the [`Dialog`](#core/components/dialog) component).

The backdrop element has the same opacity-fade transition as the `Dialog` backdrop.

<div class="@ns-callout @ns-intent-danger @ns-icon-error">
    <h4 class="@ns-heading">Dangerous edge case</h4>

Rendering a `<Popover isOpen={true} hasBackdrop={true}>` outside the viewport bounds can easily break
your application by covering the UI with an invisible non-interactive backdrop. This edge case
must be handled by your application code or simply avoided if possible.

</div>

@### Portal rendering

By default, popover contents are rendered in a [`Portal`](#core/components/portal) appended to `document.body`. This
allows the popover contents to "escape" the application DOM tree to avoid incompatible styles on ancestor elements.
(Incompatible styles typically include hidden `overflow` or complex `position` logic.) It also ensures that the popover
will appear above all other content, as its container element appears after the application container in the DOM.

Disable the `usePortal` prop to render popover contents in the normal document flow as a sibling of the target.
This behavior can be desirable to inherit CSS styles from surrounding elements, and can result in smoother performance
when scrolling. Not using a `Portal` works well for most layouts, because popovers style themselves to appear above
everything else on the page without needing to manually adjust z-indices, and Popper.js will keep them nicely positioned.

@reactExample PopoverPortalExample

@## Style

@### Dark theme

The `Popover` component automatically detects whether its trigger is nested inside a `.@ns-dark`
container and applies the same class to itself. You can also explicitly apply the dark theme to
the React component by providing the prop `popoverClassName="@ns-dark"`.

As a result, any component that you place inside a `Popover` (such as a `Menu`) automatically
inherits the dark theme styles. Note that [`Tooltip`](#core/components/tooltip) uses `Popover` internally, so it also benefits
from this behavior.

This behavior can be disabled (if the `Popover` uses a `Portal`) via the `inheritDarkTheme` prop.

@### Sizing

Popovers by default have a `max-width` but no `max-height`. To constrain the height of a popover
and make its content scrollable, add a custom class to your popover content element and attach
styles to that class:

```tsx
<Popover content={<div class="custom-class">...</div>}>...</Popover>
```

```css.scss
.custom-class {
    max-height: $pt-grid-size * 15;
    overflow-y: auto;
}
```

@reactExample PopoverSizingExample

@### Minimal style

You can create a minimal popover by setting `minimal={true}`.
This removes the arrow from the popover and makes the transitions more subtle.

@reactExample PopoverMinimalExample

This minimal style is recommended for popovers that are not triggered by an obvious action like the
user clicking or hovering over something. For example, a minimal popover is useful for making
typeahead menus where the menu appears almost instantly after the user starts typing.

Minimal popovers are also useful for context menus that require quick enter and leave animations to
support fast workflows. You can see an example in the [context menus](#core/components/context-menu)
documentation.

@## Testing

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">

Your best resource for strategies in popover testing is
[its own unit test suite.](https://github.com/palantir/blueprint/blob/develop/packages/core/test/popover/popoverTests.tsx)

</div>

#### Animation delays

`Popover` can be difficult to test because it uses `Portal` to inject its contents elsewhere in the
DOM (outside the usual flow); this can be simplified by setting `usePortal={false}` in tests.
Hover interactions can also be tricky due to delays and transitions; this can be resolved by
zeroing the default hover delays.

```tsx
<Popover {...yourProps} usePortal={false} hoverCloseDelay={0} hoverOpenDelay={0}>
    {yourTarget}
</Popover>
```

#### Rendering delays

`Popover` delays rendering updates triggered on `mouseleave`, because the mouse might have moved from the popover to the target, which may require special handling depending on the current [`interactionKind`](#core/components/popover.interactions). Popper.js also throttles rendering updates to improve performance. If your components are not updating in a synchronous fashion as expected, you may need to introduce a `setTimeout` to wait for asynchronous Popover rendering to catch up:

```tsx
import { Classes, Overlay, Popover, PopoverInteractionKind } from "@blueprintjs/core";
import { assert } from "chai";
import { mount } from "enzyme";
import { Target } from "react-popper";

wrapper = mount(
    <Popover usePortal={false} interactionKind={PopoverInteractionKind.HOVER}>
        <div>Target</div>
        <div>Content</div>
    </Popover>,
);

wrapper.find(Target).simulate("mouseenter");

// hostNodes() is an Enzyme 3 helper that retains only native-HTML nodes.
wrapper.find(`.${Classes.POPOVER}`).hostNodes().simulate("mouseenter");
wrapper.find(`.${Classes.POPOVER}`).hostNodes().simulate("mouseleave");

setTimeout(() => {
    // Popover delays closing using setTimeout, so need to defer this check too.
    const isOpen = wrapper.find(Overlay).prop("isOpen");
    assert.equal(isOpen, false);
});
```

#### Element refs

If `usePortal={false}` rendering is not an option, `Popover` instances expose `popoverElement` and
`targetElement` refs of the actual DOM elements. Importantly, `popoverElement` points to the
`.@ns-popover` element inside the `Portal` so you can use it to easily query popover contents without
knowing precisely where they are in the DOM. These properties exist primarily to simplify testing;
do not rely on them for feature work.

```tsx
// using mount() from enzyme
const wrapper = mount(<Popover content={<div className="test">test</div>} />);
const { popoverElement } = wrapper.instance();
// popoverElement is the parent element of .@ns-popover
popoverElement.querySelector(".test").textContent; // "test"
```
