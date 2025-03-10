---
tag: new
---

@# Overlay

**Overlay** is a generic low-level component for rendering content _on top of_ its siblings or
above the entire application.

It combines the functionality of the [**Portal**](#core/components/portal) component (which allows
React elements to escape their current DOM hierarchy) with a
[**CSSTransitionGroup**](https://reactcommunity.org/react-transition-group/)
(to show elegant enter and leave transitions).

An optional "backdrop" element can be rendered behind the overlaid children to provide modal
behavior, whereby the overlay prevents interaction with anything behind it.

**Overlay** is the backbone of all the components listed in the "Overlays" group in the sidebar.
Using **Overlay** directly should be rare in your application; it should only be necessary if no
existing component meets your needs.

@reactExample OverlayExample

@## Usage

**Overlay** is a controlled component that renders its children only when `isOpen={true}`.
The optional backdrop element will be inserted before the children if `hasBackdrop={true}`.

The `onClose` callback prop is invoked when user interaction causes the overlay to close, but your
application is responsible for updating the state that actually closes the overlay.

**Overlay** _strongly recommends_ usage only within a React subtree which has an
[**OverlaysProvider**](#core/context/overlays-provider). In Blueprint v5.x, the component
implements backwards-compatibilty (via the [`useOverlayStack()` hook](#core/hooks/use-overlay-stack))
such that it will work without one, but this functionality will be removed in a future major version.

```tsx
import { Button, Overlay, OverlaysProvider } from "@blueprintjs/core";
import { useCallback, useState } from "react";

function Example() {
    const [isOpen, setIsOpen] = useState(false);
    const toggleOverlay = useCallback(() => setIsOpen(open => !open), [setIsOpen]);

    return (
        <OverlaysProvider>
            <div>
                <Button text="Show overlay" onClick={toggleOverlay} />
                <Overlay isOpen={isOpen} onClose={toggleOverlay}>
                    Overlaid contents...
                </Overlay>
            </div>
        </OverlaysProvider>
    );
}
```

@## DOM layout

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">A note about overlay content positioning</h5>

When rendered inline, content will automatically be set to `position: absolute` to respect
document flow. Otherwise, content will be set to `position: fixed` to cover the entire viewport.

</div>

Overlays rely on fixed and absolute CSS positioning. By default, an overlay larger than the viewport
will not be scrollable, so any overflowing content will be hidden. Fortunately, making an overlay
scrollable is very easy: pass `Classes.OVERLAY_SCROLL_CONTAINER` in the Overlay `className` prop,
and the component will take care of the rest.

```tsx
<Overlay className={Classes.OVERLAY_SCROLL_CONTAINER} />
```

Note that the [**Dialog**](https://blueprintjs.com/docs/#core/components/dialog) component applies
this modifier class automatically.

@## Child refs

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">DOM ref(s) required</h5>

Overlay needs to be able to attach DOM refs to its child elements, so the children of this
component _must be a native DOM element_ or utilize
[`React.forwardRef()`](https://reactjs.org/docs/forwarding-refs.html) to forward any
injected ref to the underlying DOM element.

</div>

**Overlay** utilizes the react-transition-group library to declaratively configure "enter" and
"exit" transitions for its contents; it does so by individually wrapping its child nodes with
[**CSSTransition**](https://reactcommunity.org/react-transition-group/css-transition). This
third-party component requires a DOM ref to its child node in order to work correctly in React 18
strict mode (where `ReactDOM.findDOMNode()` is not available). **Overlay** can manage this ref for
you automatically in some cases, but it requires some user help to handle more advanced use cases:

### Single child with automatic ref

If you provide a _single_ child element to `<Overlay>` and _do not_ set its `ref` prop, you
don't need to do anything. The component will generate a child ref and happily pass it along
to the underlying `<CSSTransition>`.

```tsx
function Example() {
    const [isOpen, setIsOpen] = React.useState<boolean>(true);
    return (
        <Overlay isOpen={isOpen}>
            <div>Contents</div>
        </Overlay>
    );
}
```

### Single child with manual ref

If you provide a _single_ child element to `<Overlay>` and _do_ set its `ref` prop, you must
pass the same ref to `<Overlay childRef={..}>`.

```tsx
function Example() {
    const [isOpen, setIsOpen] = React.useState<boolean>(true);
    const myRef = React.useRef<HTMLElement>();

    return (
        <Overlay isOpen={isOpen} childRef={myRef}>
            <div ref={myRef}>Contents</div>
        </Overlay>
    );
}
```

### Multiple children

If you provide _multiple_ child elements to `<Overlay>`, you must enumerate a collection of
refs for each of those elements and pass those along as a record (keyed by the elements'
corresponding React `key` values) to `<Overlay childRefs={...}>`.

```tsx
import { uniqueId } from "../utils";

function Example() {
    const [isOpen, setIsOpen] = React.useState<boolean>(true);
    const [childRefs, setChildRefs] = React.useState<Record<string, React.RefObject<HTMLDivElement>>>({});
    const [children, setChildren] = React.useState<Array<{ key: string }>>([]);
    const addChild = React.useCallback(() => {
        const newRef = React.createRef<HTMLDivElement>();
        const newKey = uniqueId();
        setChildren(oldChildren => [...oldChildren, { key: newKey }]);
        setChildRefs(oldRefs => ({ ...oldRefs, [newKey]: newRef }));
    }, []);

    return (
        <div>
            <Button onClick={addChild}>Add child</Button>
            <Overlay isOpen={isOpen} childRefs={childRefs}>
                {children.map(child => (
                    <div key={child.key} ref={childRefs[child.key]} />
                ))}
            </Overlay>
        </div>
    );
}
```

@## Props interface

@interface OverlayProps
