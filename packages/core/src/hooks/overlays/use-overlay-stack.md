@# useOverlayStack

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">Internal API</h5>

This hook is mainly intended to be an internal Blueprint API used by the **Overlay2** component.
Its usage outside of `@blueprintjs/` packages is not fully supported.

</div>

The `useOverlayStack()` hook allows Blueprint components to interact with the global overlay stack
in an application. Compared to the deprecated [**Overlay**](#core/components/overlay) component,
this hook avoids storing global state at the JS module level.

@## Usage

First, make sure [**OverlaysProvider**](#core/context/overlays-provider) is configured correctly at
the root of your React application.

Then, use the hook to interact with the global overlay stack:

```tsx
import { OverlayInstance, OverlayProps, Portal, useOverlayStack, usePrevious } from "@blueprintjs/core";
import * as React from "react";
import { useUID } from "react-uid";

export function Example(props: OverlayProps) {
    const { autoFocus, children, enforceFocus, hasBackdrop, isOpen, usePortal } = props;
    const { openOverlay, closeOverlay } = useOverlayStack();

    const containerElement = React.useRef<HTMLDivElement>(null);

    const bringFocusInsideOverlay = React.useCallback(() => {
        // TODO: implement
    }, []);

    const handleDocumentFocus = React.useCallback((e: FocusEvent) => {
        // TODO: implement
    }, []);

    const id = useUID();
    const instance = React.useMemo<OverlayInstance>(
        () => ({
            bringFocusInsideOverlay,
            containerElement,
            handleDocumentFocus,
            id,
            props: {
                autoFocus,
                enforceFocus,
                hasBackdrop,
                usePortal,
            },
        }),
        [autoFocus, bringFocusInsideOverlay, enforceFocus, handleDocumentFocus, hasBackdrop, id, usePortal],
    );

    const prevIsOpen = usePrevious(isOpen) ?? false;
    React.useEffect(() => {
        if (!prevIsOpen && isOpen) {
            // just opened
            openOverlay(instance);
        }

        if (prevIsOpen && !isOpen) {
            // just closed
            closeOverlay(instance);
        }
    }, [isOpen, openOverlay, closeOverlay, prevIsOpen, instance]);

    // run once on unmount
    React.useEffect(() => {
        return () => {
            if (isOpen) {
                closeOverlay(instance);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return usePortal ? <Portal>{children}</Portal> : children;
}
```
