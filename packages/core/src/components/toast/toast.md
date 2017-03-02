@# Toasts

A toast is a lightweight, ephemeral notice from an application in direct response to a user's action.

`Toast`s have a built-in timeout of five seconds. Users can also dismiss them manually by clicking the &times; button.
Hovering the cursor over a toast prevents it from disappearing. When the cursor leaves the toast, the toast's timeout restarts.
Similarly, focusing the toast (for example, by hitting the `tab` key) halts the timeout, and blurring restarts the timeout.

You can add one additional action button to a toast. You might use this to undo the user's action, for example.

You can also apply the same visual intent styles to `Toast`s that you can to [`Button`s](components.button.css).

Toasts can be configured to appear at either the top or the bottom of an application window, and it is possible to
have more than one toast onscreen at a time.

@reactExample ToastExample

@## JavaScript API

The `Toast` and `Toaster` components are available in the __@blueprintjs/core__ package.
Make sure to review the [general usage docs for JS components](#components.usage).

The `Toaster` component provides the static `create` method that returns a new `Toaster` instance, rendered into an
element attached to `<body>`. (You can also specify the element to render into if desired.) A `Toaster` instance
has a collection of methods to show and hide toasts in its given container.

Your application can contain several `Toaster` instances and easily share them across the codebase as modules.

```tsx
// toaster.ts
import { Position, Toaster } from "@blueprintjs/core";

export const OurToaster = Toaster.create({
    className: "my-toaster",
    position: Position.BOTTOM_RIGHT,
});
```

```tsx
// application.ts
import { OurToaster } from "./toaster";

const key = OurToaster.show({ message: "Toasted!" });
OurToaster.update(key, { message: "Still toasted!" });
```

<div class="pt-callout pt-intent-primary pt-icon-info-sign">
    <h5>Working with multiple toasters</h5>
    You can have multiple toasters in a single application, but you must ensure that each has a unique
    `position` to prevent overlap.
</div>

<div class="pt-callout pt-intent-primary pt-icon-info-sign">
    <h5>Toaster focus</h5>
    `Toaster` always disables `Overlay`'s `enforceFocus` behavior (meaning that you're not blocked
    from accessing other parts of the application while a toast is active), and by default also
    disables `autoFocus` (meaning that focus will not switch to a toast when it appears). You can
    enable `autoFocus` for a `Toaster` via a prop, if desired.
</div>

@### Static method

```ts
Toaster.create(props?: IToasterProps, container = document.body): IToaster
```

Create a new `Toaster` instance. The `Toaster` will be rendered into a new element appended to the
given `container`. The `container` determines which element toasts are positioned relative to; the
default value of `<body>` allows them to use the entire viewport.

Note that the return type is `IToaster`, which is a minimal interface that exposes only the instance
methods detailed below. It can be thought of as `Toaster` minus the `React.Component` methods,
because the `Toaster` should not be treated as a normal React component.

@interface IToasterProps

@### Instance methods

<div class="docs-interface-name">IToaster</div>

- `show(props: IToastProps): string` — Show a new toast to the user.
Returns the unique key of the new toast.
- `update(key: string, props: IToastProps): void` —
Updates the toast with the given key to use the new props.
Updating a key that does not exist is effectively a no-op.
- `dismiss(key: string): void` — Dismiss the given toast instantly.
- `clear(): void` — Dismiss all toasts instantly.
- `getToasts(): IToastProps[]` — Returns the options for all current toasts.

@interface IToastProps

@### React component

The `Toaster` React component is a stateful container for a single list of toasts. Internally, it
uses [`Overlay`](#components.overlay) to manage children and transitions. It can be vertically
aligned along the top or bottom edge of its container (new toasts will slide in from that edge) and
horizontally aligned along the left edge, center, or right edge of its container.

You should use [`Toaster.create`](#components.toaster.js.create), rather than using the `Toaster`
component API directly in React, to avoid having to use `ref` to access the instance.

```tsx
import { Button, Position, Toaster } from "@blueprintjs/core";

class MyComponent extends React.Component<{}, {}> {
    private toaster: Toaster;
    private refHandlers = {
        toaster: (ref: Toaster) => this.toaster = ref,
    };

    public render() {
        return (
            <div>
                <Button onClick={this.addToast} text="Procure toast" />
                <Toaster position={Position.TOP_RIGHT} ref={this.refHandlers.toaster} />
            </div>
        )
    }

    private addToast = () => {
        this.toaster.show({ message: "Toasted!" });
    }
}
```
