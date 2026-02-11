---
tag: new
---

@# PopoverNext

PopoverNext displays floating content next to a target element.

The **PopoverNext** component is built on top of the [**Floating UI**](https://floating-ui.com) library.
Floating UI is a modern library that offers powerful, customizable, and performant positioning.

@## Import

```tsx
import { PopoverNext } from "@blueprintjs/core";
```

@reactExample PopoverNextExample

@## Usage

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">

[OverlaysProvider](#core/context/overlays-provider) recommended

</h5>

This component renders an **Overlay2** which works best inside a React tree which includes an
**OverlaysProvider**. Blueprint v5.x includes a backwards-compatibile shim which allows this context
to be optional, but it will be required in a future major version. See the full
[migration guide](https://github.com/palantir/blueprint/wiki/Overlay2-migration) on the wiki.

</div>

**PopoverNext** supports controlled and uncontrolled usage through `isOpen` and `defaultIsOpen`, respectively.
Use `onInteraction` in controlled mode to respond to changes in the `isOpen` state.

Supported user interactions are dictated by the `interactionKind` prop.

This component is quite powerful and has a wide range of features. Explore the
[**Concepts**](#core/components/popover-next.concepts) section below for more advanced
usage guides.

@## Props interface

@interface PopoverNextProps

@## Concepts

@### Structure

When creating a popover, you must specify both its **content** (via the `content` prop) and
its **target** (via the `renderTarget` prop or a single child element).

The **target** is rendered at the location of the PopoverNext component in the React component tree. It acts
as the trigger for the popover; user interaction will show the popover based on the `interactionKind` prop.
In Floating UI terms, this is the "reference" element. There are two ways to render a PopoverNext target, resulting
in different DOM layout depending on your application's needs:

-   The simplest way to specify a target is via `children`. Provide a single React child to
    `<PopoverNext>` and the component will render that child wrapped in a `@ns-popover-target` HTML element.
    This wrapper is configured with event handling logic necessary for the PopoverNext to function. Its tag name
    (e.g. `div`, `span`) and props can be customized with the `targetTagName` and `targetProps` props, respectively.

-   A more advanced API is available through the `renderTarget` prop. Here, PopoverNext calls your render function
    and provides it with all the props necessary to render a functional popover target. You should
    [spread these props](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals)
    onto the target element you return from `renderTarget`.

    -   If the rendered element is _not_ a native HTML element, you must ensure that it supports the
        `className`, `ref`, and `tabIndex` props (i.e. renders them into the DOM).

    -   The benefit to this approach is a simplified DOM structure without an extra wrapper element around
        your popover target.

The **content** will be shown inside the popover itself. When opened, the popover will always be
positioned on the page next to the target; the `placement` prop determines its relative placement (on
which side of the target).

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">Button targets</h5>

Buttons make great popover targets, but the `disabled` attribute on a `<button>` blocks all
events, which interferes with the popover functioning. If you need to disable a button which
triggers a popover, you should use [`AnchorButton`](#core/components/button.anchor-button) instead.
See the [callout here](#core/components/button.props) for more details.

</div>

```tsx
import { Button, Classes, PopoverNext } from "@blueprintjs/core";

export const PopoverNextExample: React.FC = () => {
    // popover content gets no padding by default; add the "@ns-popover-content-sizing"
    // class to the popover to set nice padding between its border and content.
    return (
        <PopoverNext
            interactionKind="click"
            popoverClassName={Classes.POPOVER_CONTENT_SIZING}
            placement="bottom"
            content={
                <div>
                    <h5>Popover title</h5>
                    <p>...</p>
                    <Button className={Classes.POPOVER_DISMISS} text="Dismiss" />
                </div>
            }
            renderTarget={({ isOpen, ...targetProps }) => (
                <Button {...targetProps} intent="primary" text="PopoverNext target" />
            )}
        />
    );
};
```

@### Placement

The `placement` prop controls the popover's position relative to the target. It accepts string values that specify both the side and alignment of the popover.

For more detailed information about placement behavior and edge cases, see the [Floating UI placement documentation](https://floating-ui.com/docs/computePosition#placement).

There are straightforward base placements (`"top"`, `"bottom"`, `"left"`, `"right"`) and their variations, which each consist of two attributes:

-   Which <span class="docs-popover-placement-label-side">**side**</span> of the target the popover should render on.
-   The popover's <span class="docs-popover-placement-label-alignment">**alignment**</span> relative to the target.

These two attributes can be expressed with a single value having the following structure:

<pre class="docs-popover-placement-value-code-block">
    <span class="docs-popover-placement-label-side">[SIDE]</span>-<span class="docs-popover-placement-label-alignment">[ALIGNMENT]</span>
</pre>

#### Supported placement values

The supported placement values are:

**Base placements (centered):**

-   `"top"`, `"bottom"`, `"left"`, `"right"`

**Start-aligned placements:**

-   `"top-start"`, `"bottom-start"`, `"left-start"`, `"right-start"`

**End-aligned placements:**

-   `"top-end"`, `"bottom-end"`, `"left-end"`, `"right-end"`

When no alignment is specified (e.g., just `"top"`), the popover will be centered relative to the target.

The following example shows how each placement value behaves in practice:

@reactExample PopoverNextPlacementExample

#### Automatic placement

If a `placement` prop is not specified (default behavior), PopoverNext will use automatic placement to choose the side with the best available space and continually update the position to avoid overflowing the boundary element (when scrolling within it, for instance).

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">

You can also specify a specific initial placement (e.g. `"left"`, `"bottom-start"`) and still allow PopoverNext to update its position automatically when there isn't enough space. [See below](#core/components/popover-next.middleware) for information about customizing positioning behavior.

</div>

@### Middleware

Middleware allow us to customize Floating UI's positioning behavior. **PopoverNext** configures several of Floating UI's built-in middleware to handle things such as flipping, preventing overflow from a boundary element, and positioning the arrow.

You may override the default middleware with the `middleware` prop, which is an object with key-value pairs representing the middleware name and its options object, respectively. See the [Floating UI middleware docs page](https://floating-ui.com/docs/middleware) for more info.

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">Auto placement requires autoPlacement or flip middleware</h5>

Be careful when disabling the "autoPlacement" or "flip" middleware, since automatic placement relies on them. If you _do_ decide to disable these middleware, be sure to also specify a placement which is specific (not automatic).

</div>

#### Default middleware configuration

PopoverNext comes with sensible defaults:

-   **`autoPlacement`** (when no `placement` is specified): Automatically chooses the best placement
-   **`flip`** (when `placement` is specified): Changes placement when there's not enough space
-   **`shift`**: Prevents overflow by shifting the popover within the viewport
-   **`arrow`** (when `arrow={true}`): Positions the popover arrow
-   **`offset`** (when `arrow={true}`): Adds spacing between target and popover
-   **`size`** (when `matchTargetWidth={true}`): Makes popover width match target width

You can customize any of these by providing your own configuration:

```tsx
<PopoverNext
    middleware={{
        flip: { boundary: document.querySelector("#container") },
        shift: { padding: 10 },
        offset: { mainAxis: 15 },
    }}
    placement="top"
>
    {/* ... */}
</PopoverNext>
```

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
if the `nextOpenState` is not the same as the **PopoverNext**'s current state).

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">Disabling controlled popovers</h5>

If `disabled={true}`, a controlled popover will remain closed even if `isOpen={true}`.
The popover will re-open when `disabled` is set to `false`.

</div>

#### Example controlled usage

```tsx
import { useState } from "react";
import { Button, Classes, PopoverNext } from "@blueprintjs/core";

export const ControlledPopoverNextExample: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleInteraction = (nextOpenState: boolean) => {
        setIsOpen(nextOpenState);
    };

    return (
        <PopoverNext
            content={
                <div>
                    <h5>Popover Title</h5>
                    <p>...</p>
                    <Button className={Classes.POPOVER_DISMISS} text="Close popover" />
                </div>
            }
            interactionKind="click"
            isOpen={isOpen}
            onInteraction={handleInteraction}
            placement="right"
        >
            <Button intent="primary" text="Popover target" />
        </PopoverNext>
    );
};
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
    -   **Opens when:** the target is clicked, or when Enter or Shift key are pressed while target is focused
    -   **Closes when:** the user clicks anywhere outside of the popover (including the target)
-   `CLICK_TARGET_ONLY`:
    -   **Opens when:** the target is clicked, or when Enter or Shift key are pressed while target is focused
    -   **Closes when:** the target is clicked

The following example demonstrates the various interaction kinds (note: these PopoverNext contain
[MenuItem](#core/components/menu.menu-item)s with `shouldDismissPopover={false}`, for clarity):

@reactExample PopoverNextInteractionKindExample

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">Conditionally styling popover targets</h5>

When a popover is open, `Classes.POPOVER_OPEN` is applied to the target.
You can use this to style the target differently when the popover is open.

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
`.@ns-popover-backdrop` to customize the appearance of the backdrop (for example, you could give it
a translucent background color, like the backdrop for the [`Dialog`](#core/components/dialog) component).

The backdrop element has the same opacity-fade transition as the `Dialog` backdrop.

<div class="@ns-callout @ns-intent-danger @ns-icon-error @ns-callout-has-body-content">
    <h5 class="@ns-heading">Dangerous edge case</h5>

Rendering a `<PopoverNext isOpen={true} hasBackdrop={true}>` outside the viewport bounds can easily break your application
by covering the UI with an invisible non-interactive backdrop. This edge case must be handled by your application code
or (if possible) avoided entirely.

</div>

@### Portal rendering

By default, popover contents are rendered in a [**Portal**](#core/components/portal) appended to `document.body`. This
allows the popover contents to "escape" the application DOM tree to avoid incompatible styles on ancestor elements.
(Incompatible styles typically include hidden `overflow` or complex `position` logic.) It also ensures that the popover
will appear above all other content, as its container element appears after the application container in the DOM.

Disable the `usePortal` prop to render popover contents in the normal document flow as a sibling of the target.
This behavior can be desirable to inherit CSS styles from surrounding elements, and can result in smoother performance
when scrolling. Not using a **Portal** works well for most layouts, because popovers style themselves to appear above
everything else on the page without needing to manually adjust z-indices, and Floating UI will keep them nicely positioned.

@reactExample PopoverNextPortalExample

@## Style

@### Dark theme

**PopoverNext** automatically detects whether its trigger is nested inside a `.@ns-dark` container and applies the
same class to itself. You can also explicitly apply the dark theme to the React component by providing the prop
`popoverClassName="@ns-dark"`.

As a result, any component that you place inside a **PopoverNext** (such as a `Menu`) automatically inherits the dark theme
styles. Note that [`Tooltip`](#core/components/tooltip) uses **PopoverNext** internally, so it also benefits from this
behavior.

This behavior can be disabled (if the **PopoverNext** uses a **Portal**) via the `inheritDarkTheme` prop.

@### Sizing

Popovers by default have a `max-width` but no `max-height`. To constrain the height of a popover and make its content
scrollable, add a custom class to your popover content element and attach styles to that class:

```tsx
<PopoverNext content={<div className="custom-class">...</div>}>...</PopoverNext>
```

```scss
.custom-class {
    max-height: $pt-grid-size * 15;
    overflow-y: auto;
}
```

@reactExample PopoverNextSizingExample

@### Arrow control

You can control whether the popover shows an arrow pointing to its target using the `arrow` prop:

```tsx
<PopoverNext arrow={false} content="No arrow">
    <Button text="Click me" />
</PopoverNext>
```

@### Animation style

You can control the animation style of the popover using the `animation` prop:

**Available animation styles:**

-   `"scale"` (default): Standard scale transition with transform origin
-   `"minimal"`: Subtle scale transition without transform origin

The minimal animation is recommended for popovers that are not triggered by an obvious action like the
user clicking or hovering over something. For example, a minimal popover is useful for making
typeahead menus where the menu appears almost instantly after the user starts typing.

@reactExample PopoverNextMinimalExample

Minimal popovers are also useful for context menus that require quick enter and leave animations to
support fast workflows. You can see an example in the [context menus](#core/components/context-menu)
documentation.

@## Migrating from Popover

**PopoverNext** is designed as a modern replacement for the legacy **Popover** component. While the API is
largely similar, there are some notable differences to be aware of when migrating:

@### Focus behavior

The `shouldReturnFocusOnClose` prop defaults to `true` in **PopoverNext**, whereas it defaults to
`false` in the legacy **Popover**. This change improves accessibility by ensuring that keyboard
focus returns to the trigger element when a popover closes.

When migrating, if you need to preserve the previous behavior, explicitly set `shouldReturnFocusOnClose={false}`.

**Note:** Regardless of the prop value, **PopoverNext** will:

- Always force `shouldReturnFocusOnClose` to `false` for hover interaction popovers
- Always force `shouldReturnFocusOnClose` to `true` when the popover closes via the Escape key

@### Positioning

**PopoverNext** uses the `placement` prop for positioning, which aligns with Floating UI semantics.
The legacy `position` prop is not supported. Use placement values like `"top-start"` and `"bottom-end"`
instead of position values like `"top-left"` and `"bottom-right"`.
