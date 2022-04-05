@# Popover2

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">
    <h4 class="@ns-heading">

Migrating from [Popover](#core/components/popover)?

</h4>

Popover2 is a replacement for Popover and will become the standard Popover API in Blueprint core v5.
You are encouraged to use this new API now to ease the transition to the next major version of Blueprint.
See the full [migration guide](https://github.com/palantir/blueprint/wiki/Popover2-migration) on the wiki.

</div>

Popovers display floating content next to a target element.

`Popover2` is built on top of the [**Popper.js**](https://popper.js.org) library.
Popper.js is a small library that offers a powerful, customizable
positioning engine and operates at blazing speed (`~60fps`).

@reactExample Popover2Example

@## Props

`Popover` supports controlled and uncontrolled usage through `isOpen` and
`defaultIsOpen`, respectively. Use `onInteraction` in controlled mode to respond
to changes in the `isOpen` state.

Supported user interactions are dictated by the `interactionKind` prop.

This component is quite powerful and has a wide range of features. Explore the
[**Concepts**](#core/components/popover.concepts) section below for more advanced
guides.

@interface IPopover2Props

@## Concepts

@### Structure

When creating a popover, you must specify both its **content** (via the `content` prop) and
its **target** (via the `renderTarget` prop or a single child element).

The **target** is rendered at the location of the Popover2 component in the React component tree. It acts
as the trigger for the popover; user interaction will show the popover based on the `interactionKind` prop.
In Popper.js terms, this is the popper "reference". There are two ways to render a Popover2 target, resulting
in different DOM layout depending on your application's needs:

-   The simplest way is with `children`, an API unchanged from `<Popover>`. Provide a single React child to
    `<Popover2>` and the component will render that child wrapped in a `@ns-popover2-target` HTML element.
    This wrapper is configured with event handling logic necessary for the Popover to function. Its tag name
    (e.g. `div`, `span`) can be customized with the `targetTagName` prop.

-   A more advanced API is available through the `renderTarget` prop. Here, Popover2 provides you with all the
    information necessary to render a functional popover with a [render prop](https://reactjs.org/docs/render-props.html).
    You are responsible for then propogating that information with an
    [object spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals)
    to the `JSX.Element` returned from `renderTarget`.

    -   If the rendered element is _not_ a native HTML element, you must ensure that it supports the
        `className`, `ref`, and `tabIndex` props (i.e. renders them out to the DOM).

    -   The benefit to this approach is a simplified DOM structure without an extra wrapper element around
        your popover target.

The **content** will be shown inside the popover itself. When opened, the popover will always be
positioned on the page next to the target; the `position` prop determines its relative position (on
which side of the target).

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign">
    <h4 class="@ns-heading">Button targets</h4>

Buttons make great popover targets, but the `disabled` attribute on a `<button>` blocks all
events, which interferes with the popover functioning. If you need to disable a button which
triggers a popover, you should use [`AnchorButton`](#core/components/button.anchor-button) instead.
See the [callout here](#core/components/button.props) for more details.

</div>

```tsx
import { Button } from "@blueprintjs/core";
import { Classes, Popover2 } from "@blueprintjs/popover2";

export class PopoverExample extends React.PureComponent {
    public render() {
        // popover content gets no padding by default; add the "@ns-popover2-content-sizing"
        // class to the popover to set nice padding between its border and content.
        return (
            <Popover2
                interactionKind="click"
                popoverClassName={Classes.POPOVER2_CONTENT_SIZING}
                placement="bottom"
                content={
                    <div>
                        <h5>Popover title</h5>
                        <p>...</p>
                        <Button className={Classes.POPOVER2_DISMISS} text="Dismiss" />
                    </div>
                }
                renderTarget={({ isOpen, ref, ...targetProps }) => (
                    <Button {...targetProps} elementRef={ref} intent="primary" text="Popover target" />
                )}
            />
        );
    }
}
```

@### Placement

The `placement` prop controls the popover's position relative to the target. Popover2 passes this prop directly
to Popper.js; it uses the same semantics and supported values
[as shown here in the docs](https://popper.js.org/docs/v2/constructors/#options).

`import { PopperPlacements } from "@blueprintjs/popover2"` defines the full set of supported values.
There are straightforward base placements (`"top"`, `"bottom"`, `"left"`, `"right"`) and their variations, which
each consist of two attributes:

-   Which <span class="docs-popover-placement-label-side">**side**</span> of the target the popover should render on.
-   The popover's <span class="docs-popover-placement-label-alignment">**alignment**</span> relative to the target.

These two attributes can be expressed with a single value having the following structure:

<pre class="docs-popover-placement-value-code-block">
    <span class="docs-popover-placement-label-side">[SIDE]</span>-<span class="docs-popover-placement-label-alignment">[ALIGNMENT]</span>
</pre>

@reactExample Popover2PlacementExample

#### Automatic placement

Lastly, there is an `"auto"` placement which picks the side with the best available space.
See the [popper.js docs](https://popper.js.org/docs/v2/constructors/#options) for more info.

The Popover's `placement` can also be chosen _automatically_ by specifying `"auto"`, `"auto-start"`, or `"auto-end"`.
All of these options choose and continually update the <span class="docs-popover-placement-label-side">**side**</span>
for you to avoid overflowing the boundary element (when scrolling within it, for instance).
The options differ in how they handle <span class="docs-popover-placement-label-alignment">**alignment**</span>:

-   In `"auto"` mode (the default value for the `placement` prop), the Popover will align itself to the center of the target as it flips sides.
-   In `"auto-start"` mode, the Popover will align itself to the `start` of the target (i.e., the top edge when the popover is on the left or right, or the left edge when the popover is on the top or bottom).
-   In `"auto-end"` mode, the Popover will align itself to the `end` of the target (i.e., the bottom edge when the popover is on the left or right, or the right edge when the popover is on the top or bottom).

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">

You can also specify a specific initial placement (e.g. `"left"`, `"bottom-start"`) and still update the Popover's position
automatically by enabling the modifiers `flip` and `preventOverflow`.
[See below](#core/components/popover.modifiers) for information about modifiers.

</div>

@### Modifiers

Modifiers allow you customize Popper.js's positioning behavior. `Popover2` configures several of Popper.js's built-in modifiers
to handle things such as flipping, preventing overflow from a boundary element, and positioning the arrow.

You may override these default modifiers with the `modifiers` prop, which is an object with key-value pairs representing the
modifier name and its options object, respectively. See the [Popper.js modifiers docs page](https://popper.js.org/docs/v2/modifiers/)
for more info. It is not currently possible to add your own custom modifiers through `Popover2`.

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
if the `nextOpenState` is not the same as the `Popover2`'s current state).

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign">
    <h4 class="@ns-heading">Disabling controlled popovers</h4>

If `disabled={true}`, a controlled popover will remain closed even if `isOpen={true}`.
The popover will re-open when `disabled` is set to `false`.

</div>

#### Example controlled usage

```tsx
import { Button } from "@blueprintjs/core";
import { Classes, Popover2 } from "@blueprintjs/popover2";

export class ControlledPopoverExample extends React.Component<{}, { isOpen: boolean }> {
    public state = { isOpen: false };

    public render() {
        return (
            <Popover2
                content={
                    <div>
                        <h5>Popover Title</h5>
                        <p>...</p>
                        <Button className={Classes.POPOVER2_DISMISS} text="Close popover" />
                    </div>
                }
                interactionKind="click"
                isOpen={this.state.isOpen}
                onInteraction={state => this.handleInteraction(state)}
                placement="right"
            >
                <Button intent="primary" text="Popover target" />
            </Popover2>
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
    -   **Opens when:** the target is clicked, or when Enter key is pressed while target is focused
    -   **Closes when:** the user clicks anywhere outside of the popover (including the target)
-   `CLICK_TARGET_ONLY`:
    -   **Opens when:** the target is clicked, or when Enter key is pressed while target is focused
    -   **Closes when:** the target is clicked

The following example demonstrates the various interaction kinds (note: these Popovers contain [`MenuItem`](#core/components/menu.menu-item)s with `shouldDismissPopover={false}`, for clarity):

@reactExample Popover2InteractionKindExample

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">
    <h4 class="@ns-heading">Conditionally styling popover targets</h4>

When a popover is open, `Classes.POPOVER2_OPEN` is applied to the target.
You can use this to style the target differently when the popover is open.

</div>

@### Closing on click

Sometimes it is desirable for an element inside a `Popover2`'s content to close the popover
on click. `Popover2` supports a pair of CSS classes, `Classes.POPOVER2_DISMISS`
and `Classes.POPOVER2_DISMISS_OVERRIDE`, which can be added to elements to
describe whether click events should dismiss the enclosing popover.

To mark an element (and its children) as "dismiss elements", simply add the
class `Classes.POPOVER2_DISMISS`. For example, the **Cancel** and **Delete** buttons in the
top-level [Popover2 example](#popover2-package/popover2) have this class, and all
`MenuItem`s receive this class by default (see `shouldDismissPopover` prop). To
enable this behavior on the entire popover body, pass
`popoverClassName={Classes.POPOVER2_DISMISS}`.

Cancel the dismiss behavior on subtrees by nesting
`Classes.POPOVER2_DISMISS_OVERRIDE` inside `Classes.POPOVER2_DISMISS`. Clicks
originating inside disabled elements (either via the `disabled` attribute or
`Classes.DISABLED`) will never dismiss a popover.

Additionally, the prop `captureDismiss` (disabled by default) will prevent click
events from dismissing _grandparent_ popovers (not the `Popover2` immediately
containing the dismiss element). `MenuItem` disables this feature such that
clicking any submenu item will close all submenus, which is desirable behavior
for a menu tree.

```tsx
<div className={Classes.POPOVER2_DISMISS}>
    <button>Click me to dismiss</button>
    <button disabled={true}>I will not dismiss</button>
    <div className={Classes.POPOVER2_DISMISS_OVERRIDE}>
        <button>I too shall not dismiss</button>
    </div>
</div>
```

@reactExample Popover2DismissExample

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">

Dismiss elements won't have any effect in a popover with
`interactionKind="hover-target"`, because there is no way to
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

This backdrop behavior is only available for popovers with `interactionKind="click"`.
An error is thrown if used otherwise.

#### Styling the backdrop

By default, the popover backdrop is invisible, but you can easily add your own styles to
`.@ns-popover2-backdrop` to customize the appearance of the backdrop (for example, you could give it
a translucent background color, like the backdrop for the [`Dialog`](#core/components/dialog) component).

The backdrop element has the same opacity-fade transition as the `Dialog` backdrop.

<div class="@ns-callout @ns-intent-danger @ns-icon-error">
    <h4 class="@ns-heading">Dangerous edge case</h4>

Rendering a `<Popover2 isOpen={true} hasBackdrop={true}>` outside the viewport bounds can easily break
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

@reactExample Popover2PortalExample

@## Style

@### Dark theme

`Popover2` automatically detects whether its trigger is nested inside a `.@ns-dark` container and applies the
same class to itself. You can also explicitly apply the dark theme to the React component by providing the prop
`popoverClassName="@ns-dark"`.

As a result, any component that you place inside a `Popover2` (such as a `Menu`) automatically
inherits the dark theme styles. Note that [`Tooltip2`](#popover2-package/tooltip2) uses `Popover2` internally,
so it also benefits from this behavior.

This behavior can be disabled (if the `Popover2` uses a `Portal`) via the `inheritDarkTheme` prop.

@### Sizing

Popovers by default have a `max-width` but no `max-height`. To constrain the height of a popover
and make its content scrollable, add a custom class to your popover content element and attach
styles to that class:

```tsx
<Popover2 content={<div className="custom-class">...</div>}>...</Popover2>
```

```css.scss
.custom-class {
    max-height: $pt-grid-size * 15;
    overflow-y: auto;
}
```

@reactExample Popover2SizingExample

@### Minimal style

You can create a minimal popover by setting `minimal={true}`.
This removes the arrow from the popover and makes the transitions more subtle.

@reactExample Popover2MinimalExample

This minimal style is recommended for popovers that are not triggered by an obvious action like the
user clicking or hovering over something. For example, a minimal popover is useful for making
typeahead menus where the menu appears almost instantly after the user starts typing.

Minimal popovers are also useful for context menus that require quick enter and leave animations to
support fast workflows. You can see an example in the [context menus](#core/components/context-menu)
documentation.

@## Testing

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">

Your best resource for strategies in popover testing is
[its own unit test suite.](https://github.com/palantir/blueprint/blob/develop/packages/popover2/test/popover2/popover2Tests.tsx)

</div>

#### Animation delays

`Popover2` can be difficult to test because it uses `Portal` to inject its contents elsewhere in the
DOM (outside the usual flow); this can be simplified by setting `usePortal={false}` in tests.
Hover interactions can also be tricky due to delays and transitions; this can be resolved by
zeroing the default hover delays.

```tsx
<Popover2 {...yourProps} usePortal={false} hoverCloseDelay={0} hoverOpenDelay={0}>
    {yourTarget}
</Popover2>
```

#### Rendering delays

`Popover2` delays rendering updates triggered on `mouseleave`, because the mouse might have moved from the popover to the target, which may require special handling depending on the current [`interactionKind`](#popover2-package/popover2.interactions). Popper.js also throttles rendering updates to improve performance. If your components are not updating in a synchronous fashion as expected, you may need to introduce a `setTimeout` to wait for asynchronous Popover rendering to catch up:

```tsx
import { Overlay } from "@blueprintjs/core";
import { Classes, Popover2 } from "@blueprintjs/popover2";
import { assert } from "chai";
import { mount } from "enzyme";
import { Target } from "react-popper";

wrapper = mount(
    <Popover2 usePortal={false} interactionKind="hover" content={<div>Content</div>}>
        <div>Target</div>
    </Popover2>,
);

wrapper.find(Target).simulate("mouseenter");

// hostNodes() is an Enzyme 3 helper that retains only native-HTML nodes.
wrapper.find(`.${Classes.POPOVER2}`).hostNodes().simulate("mouseenter");
wrapper.find(`.${Classes.POPOVER2}`).hostNodes().simulate("mouseleave");

setTimeout(() => {
    // Popover delays closing using setTimeout, so need to defer this check too.
    const isOpen = wrapper.find(Overlay).prop("isOpen");
    assert.equal(isOpen, false);
});
```

#### Element refs

If `usePortal={false}` rendering is not an option, `Popover2` instances expose `popoverElement` and
`targetElement` refs of the actual DOM elements. Importantly, `popoverElement` points to the
`.@ns-popover2` element inside the `Portal` so you can use it to easily query popover contents without
knowing precisely where they are in the DOM. These properties exist primarily to simplify testing;
do not rely on them for feature work.

```tsx
// using mount() from enzyme
const wrapper = mount(<Popover2 content={<div className="test">test</div>} />);
const { popoverElement } = wrapper.instance();
// popoverElement is the parent element of .@ns-popover
popoverElement.querySelector(".test").textContent; // "test"
```
