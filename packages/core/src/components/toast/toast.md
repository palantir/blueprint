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

1. __Recommended__: use the `OverlayToaster.createAsync()` static method to create a new `Toaster` instance:
    ```ts
    const myToaster: Toaster = await OverlayToaster.createAsync({ position: "bottom" });
    myToaster.show({ ...toastOptions });
    ```

    We recommend calling `OverlayToaster.createAsync` once in your application and [sharing the created instance](#core/components/toast.example) throughout your application.

    A synchronous `OverlayToaster.create()` static method is also available, but will be phased out since React 18+ no longer synchronously renders components to the DOM.

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

__OverlayToaster__ provides the static `createAsync` method that returns a new `Toaster`, rendered into an
element attached to `<body>`. A toaster instance has a collection of methods to show and hide toasts in its given container.

```ts
OverlayToaster.createAsync(props?: OverlayToasterProps, options?: OverlayToasterCreateOptions): Promise<Toaster>;
```

@interface OverlayToasterCreateOptions

The toaster will be rendered into a new element appended to the given `container`.
The `container` determines which element toasts are positioned relative to; the default value of `<body>` allows them to use the entire viewport.

The return type is `Promise<Toaster>`, which is a minimal interface that exposes only the instance methods detailed
below. It can be thought of as `OverlayToaster` minus the `React.Component` methods, because the `OverlayToaster` should
not be treated as a normal React component.

A promise is returned as React components cannot be rendered synchronously after React version 18. If this makes
`Toaster` usage difficult outside of a function that's not `async`, it's still possible to attach `.then()` handlers to
the returned toaster.

```ts
function synchronousFn() {
    const toasterPromise = OverlayToaster.createAsync({});
    toasterPromise.then(toaster => toaster.show({ message: "Toast!" }));
}
```

Note that `OverlayToaster.createAsync()` will throw an error if invoked inside a component lifecycle method, as
`ReactDOM.render()` will return `null` resulting in an inaccessible toaster instance.

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">Beware of memory leaks</h5>

The static `createAsync` and `create` methods create a new `OverlayToaster` instance for the full lifetime of your
application. Since there's no React parent component, these methods create a new DOM node as a container for the
rendered `<OverlayToaster>` component. Every `createAsync` call will add a new DOM node. We do not recommend creating a
new `Toaster` every time a toast needs to be shown. To minimize leaking:

1. Call `OverlayToaster.createAsync` once in an application and [share the instance](#core/components/toast.example).
2. Consider one of the alternative APIs that mount the `<OverlayToaster>` somewhere in the application's React component tree. This provides component lifecycle management out of the box. See [_React component usage_](#core/components/toast.react-component-usage) for an example.

</div>

@interface Toaster

@### Example

Your application can contain several `ToasterInstance`s and easily share them across the codebase as modules.

The following code samples demonstrate our preferred pattern for intergrating a toaster into a React application:

#### `toaster.ts`

```ts
import { OverlayToaster, Position } from "@blueprintjs/core";

/** Singleton toaster instance. Create separate instances for different options. */
export const AppToaster = OverlayToaster.createAsync({
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

    showToast = async () => {
        // create toasts in response to interactions.
        // in most cases, it's enough to simply create and forget (thanks to timeout).
        (await AppToaster).show({ message: "Toasted." });
    }
}
```

The example below uses the `OverlayToaster.createAsync()` static method. Clicking the button will create a new toaster mounted to `<body>`, show a message, and unmount the toaster from the DOM once the message is dismissed.

@reactExample ToastCreateAsyncExample

#### React 18

To maintain backwards compatibility with React 16 and 17, `OverlayToaster.createAsync` uses `ReactDOM.render` out of the box. This triggers a [console warning on React 18](https://react.dev/blog/2022/03/08/react-18-upgrade-guide#updates-to-client-rendering-apis). A future major version of Blueprint will drop support for React versions before 18 and switch the default rendering function from `ReactDOM.render` to `createRoot`.

If you're using React 18, we recommend passing in a custom `domRenderer` function.

```tsx
import { OverlayToaster } from "@blueprintjs/core";
import { createRoot } from "react-dom/client";

const toaster = await OverlayToaster.createAsync(toasterProps, {
    // Use createRoot() instead of ReactDOM.render(). This can be deleted after
    // a future Blueprint version uses createRoot() for Toasters by default.
    domRenderer: (toaster, containerElement) => createRoot(containerElement).render(toaster),
});

toaster.show({ message: "Hello React 18!" })
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
