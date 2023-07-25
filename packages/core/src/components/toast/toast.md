@# Toast

A __Toast__ is a lightweight, ephemeral notice from an application in direct response to a user's action.

__Toasts__ can be configured to appear at either the top or the bottom of an application window, and it is possible to
have more than one toast onscreen at a time.

@reactExample ToastExample

@## Usage

@### Toast

__Toasts__ have a built-in timeout of five seconds. Users can also dismiss them manually by clicking the &times; button.
Hovering the cursor over a toast prevents it from disappearing. When the cursor leaves the toast, the toast's timeout restarts.
Similarly, focusing the toast (for example, by hitting the `tab` key) halts the timeout, and blurring restarts the timeout.

You can add one additional action button to a toast. You might use this to provide an undo button, for example.

You can also apply the same visual intent styles to `Toast`s that you can to [`Button`s](#core/components/button.css).

@interface ToastProps

@### OverlayToaster

The __OverlayToaster__ component (previously named __Toaster__) is a stateful container for a single list of toasts.
Internally, it uses [__Overlay__](#core/components/overlay) to manage children and transitions. It can be vertically
aligned along the top or bottom edge of its container (new toasts will slide in from that edge) and
horizontally aligned along the left edge, center, or right edge of its container.

There are three ways to use __OverlayToaster__:

1. __Recommended__: use the `OverlayToaster.create()` static method to create a new `Toaster` instance:
    ```ts
    const myToaster: Toaster = OverlayToaster.create({ position: "bottom" });
    myToaster.show({ ...toastOptions });
    ```
2. Render an `<OverlayToaster>` with `<Toast>` children:
    ```ts
    render(
        <OverlayToaster>
            <Toast {...toastOptions} />
        </OverlayToaster>,
        targetElement,
    );
    ```
3. Use a ref callback or object to access toaster instance methods.
    - Example with ref callback:
    ```ts
    render(<OverlayToaster ref={(ref: Toaster | null) => ref?.show({ ...toastOptions })} />, targetElement);
    ```
    - Example with ref object (note that React type constraints require us to use the more specific `OverlayToaster` type):
    ```ts
    const myToaster = React.createRef<OverlayToaster>();
    render(<OverlayToaster ref={myToaster} />, targetElement);
    myToaster.current?.show({ ...toastOptions });
    ```

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">Working with multiple toasters</h5>

You can have multiple toasters in a single application, but you must ensure that each has a unique `position` to
prevent overlap.

</div>

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">Toaster focus</h5>

__OverlayToaster__ always disables Overlay's `enforceFocus` behavior (meaning that you're not blocked
from accessing other parts of the application while a toast is active), and by default also
disables `autoFocus` (meaning that focus will not switch to a toast when it appears). You can
enable `autoFocus` for an individual `OverlayToaster` via a prop, if desired.

</div>


@interface OverlayToasterProps

@## Static usage

__OverlayToaster__ provides the static `create` method that returns a new `Toaster`, rendered into an
element attached to `<body>`. A toaster instance has a collection of methods to show and hide toasts in its given container.

```ts
OverlayOverlayToaster.create(props?: ToasterProps, container = document.body): Toaster
```

The toaster will be rendered into a new element appended to the given `container`.
The `container` determines which element toasts are positioned relative to; the default value of `<body>` allows them to use the entire viewport.

Note that the return type is `Toaster`, which is a minimal interface that exposes only the instance
methods detailed below. It can be thought of as `OverlayToaster` minus the `React.Component` methods,
because the `OverlayToaster` should not be treated as a normal React component.

Note that `OverlayToaster.create()` will throw an error if invoked inside a component lifecycle method, as
`ReactDOM.render()` will return `null` resulting in an inaccessible toaster instance.

@interface Toaster

@### Example

Your application can contain several `ToasterInstance`s and easily share them across the codebase as modules.

The following code samples demonstrate our preferred pattern for intergrating a toaster into a React application:

#### `toaster.ts`

```ts
import { OverlayToaster, Position } from "@blueprintjs/core";

/** Singleton toaster instance. Create separate instances for different options. */
export const AppToaster = OverlayToaster.create({
    className: "recipe-toaster",
    position: Position.TOP,
});
```

#### `application.tsx`

```tsx
import { Button } from "@blueprintjs/core";
import * as React from "react";
import { AppToaster } from "./toaster";

export class App extends React.PureComponent {
    render() {
        return <Button onClick={this.showToast} text="Toast please" />;
    }

    showToast = () => {
        // create toasts in response to interactions.
        // in most cases, it's enough to simply create and forget (thanks to timeout).
        AppToaster.show({ message: "Toasted." });
    }
}
```

@## React component usage

Render the `<OverlayToaster>` component like any other element and supply `<Toast>` elements as `children`. You can
optionally attach a `ref` handler to access the instance methods, but we strongly recommend using the
[`OverlayToaster.create` static method](#core/components/toast.static-usage) documented above instead. Note that
`children` and `ref` can be used together, but `children` will always appear _after_ toasts created with
`ref.show()`.

```tsx
import { Button, OverlayToaster, Position, Toast, Toaster } from "@blueprintjs/core";
import * as React from "react";

class MyComponent extends React.PureComponent {
    public state = { toasts: [ /* ToastProps[] */ ] }

    private toaster: Toaster;
    private refHandlers = {
        toaster: (ref: Toaster) => this.toaster = ref,
    };

    public render() {
        return (
            <div>
                <Button onClick={this.addToast} text="Procure toast" />
                <OverlayToaster position={Position.TOP_RIGHT} ref={this.refHandlers.toaster}>
                    {/* "Toasted!" will appear here after clicking button. */}
                    {this.state.toasts.map(toast => <Toast {...toast} />)}
                </OverlayToaster>
            </div>
        )
    }

    private addToast = () => {
        this.toaster.show({ message: "Toasted!" });
    }
}
```
