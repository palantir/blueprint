---
tag: new
---

@# Overlay2

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">

Migrating from [Overlay](#core/components/overlay)?

</h5>

**Overlay2** is a replacement for **Overlay**. It will become the standard API in a future major version of
Blueprint. You are encouraged to use this new API now for forwards-compatibility. See the full
[migration guide](https://github.com/palantir/blueprint/wiki/Overlay2-migration) on the wiki.

</div>

**Overlay2** is a generic low-level component for rendering content _on top of_ its siblings or
above the entire application.

It combines the functionality of the [**Portal**](#core/components/portal) component (which allows
React elements to escape their current DOM hierarchy) with a
[**CSSTransitionGroup**](https://reactcommunity.org/react-transition-group/)
(to show elegant enter and leave transitions).

An optional "backdrop" element can be rendered behind the overlaid children to provide modal
behavior, whereby the overlay prevents interaction with anything behind it.

**Overlay2** is the backbone of all the components listed in the "Overlays" group in the sidebar.
Using **Overlay2** directly should be rare in your application; it should only be necessary if no
existing component meets your needs.

@reactExample Overlay2Example

@## Usage

**Overlay2** is a controlled component that renders its children only when `isOpen={true}`.
The optional backdrop element will be inserted before the children if `hasBackdrop={true}`.

The `onClose` callback prop is invoked when user interaction causes the overlay to close, but your
application is responsible for updating the state that actually closes the overlay.

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">A note about overlay content positioning</h5>

When rendered inline, content will automatically be set to `position: absolute` to respect
document flow. Otherwise, content will be set to `position: fixed` to cover the entire viewport.

</div>

```tsx
import { useCallback, useState } from "react";

function Example() {
    const [isOpen, setIsOpen] = useState(false);
    const toggleOverlay = useCallback(() => setIsOpen(open => !open), [setIsOpen]);

    return (
        <div>
            <Button text="Show overlay" onClick={toggleOverlay} />
            <Overlay2 isOpen={isOpen} onClose={toggleOverlay}>
                Overlaid contents...
            </Overlay2>
        </div>
    );
}
```

@## Scrolling interactions

Overlays rely on fixed and absolute CSS positioning. By default, an overlay larger than the viewport
will not be scrollable, so any overflowing content will be hidden. Fortunately, making an overlay
scrollable is very easy: pass `Classes.OVERLAY_SCROLL_CONTAINER` in the Overlay2 `className` prop,
and the component will take care of the rest.

```tsx
<Overlay2 className={Classes.OVERLAY_SCROLL_CONTAINER} />
```

Note that the [**Dialog**](https://blueprintjs.com/docs/#core/components/dialog) component applies
this modifier class automatically.

@## DOM refs

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">DOM ref required</h5>

Overlay2's implementation (via `react-css-transition`) relies on a React ref being attached to a DOM
element, so the children of this component _must be a native DOM element_ or utilize
[`React.forwardRef()`](https://reactjs.org/docs/forwarding-refs.html) to forward any
injected ref to the underlying DOM element.

</div>

TODO(@adidahiya)

@## Props interface

@interface Overlay2Props
