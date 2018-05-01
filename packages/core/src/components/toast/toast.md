@# Toasts

A toast is a lightweight, ephemeral notice from an application in direct response to a user's action.


Toasts can be configured to appear at either the top or the bottom of an application window, and it is possible to
have more than one toast onscreen at a time.

@reactExample ToastExample

@## JavaScript API

The `Toast` and `Toaster` components are available in the __@blueprintjs/core__ package.
Make sure to review the [getting started docs for installation info](#blueprint/getting-started).

@### Toast

`Toast`s have a built-in timeout of five seconds. Users can also dismiss them manually by clicking the &times; button.
Hovering the cursor over a toast prevents it from disappearing. When the cursor leaves the toast, the toast's timeout restarts.
Similarly, focusing the toast (for example, by hitting the `tab` key) halts the timeout, and blurring restarts the timeout.

You can add one additional action button to a toast. You might use this to undo the user's action, for example.

You can also apply the same visual intent styles to `Toast`s that you can to [`Button`s](#core/components/button.css-api).

@interface IToastProps

@### Toaster

The `Toaster` React component is a stateful container for a single list of toasts. Internally, it
uses [`Overlay`](#core/components/overlay) to manage children and transitions. It can be vertically
aligned along the top or bottom edge of its container (new toasts will slide in from that edge) and
horizontally aligned along the left edge, center, or right edge of its container.

There are three ways to use the `Toaster` component:

1. `Toaster.create(props)` static method returns a new `IToaster` instance. Use the instance method `toaster.show()` to manipulate this instance. __(recommended)__
1. `<Toaster><Toast />...</Toaster>`: Render a `<Toaster>` element with React `children`.
1. `<Toaster ref={ref => ref.show({ ...toast })} />`: Render a `<Toaster>` element and use the `ref` prop to access its instance methods.

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">
    <h4 class="@ns-callout-title">Working with multiple toasters</h4>
    You can have multiple toasters in a single application, but you must ensure that each has a unique
    `position` to prevent overlap.
</div>

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">
    <h4 class="@ns-callout-title">Toaster focus</h4>
    `Toaster` always disables `Overlay`'s `enforceFocus` behavior (meaning that you're not blocked
    from accessing other parts of the application while a toast is active), and by default also
    disables `autoFocus` (meaning that focus will not switch to a toast when it appears). You can
    enable `autoFocus` for a `Toaster` via a prop, if desired.
</div>


@interface IToasterProps

@## Static usage

The `Toaster` component provides the static `create` method that returns a new `Toaster` instance, rendered into an
element attached to `<body>`. A `Toaster` instance
has a collection of methods to show and hide toasts in its given container.

```ts
Toaster.create(props?: IToasterProps, container = document.body): IToaster
```


The `Toaster` will be rendered into a new element appended to the given `container`. The `container` determines which element toasts are positioned relative to; the default value of `<body>` allows them to use the entire viewport.

Note that the return type is `IToaster`, which is a minimal interface that exposes only the instance
methods detailed below. It can be thought of as `Toaster` minus the `React.Component` methods,
because the `Toaster` should not be treated as a normal React component.

@interface IToaster

@### Example

Your application can contain several `Toaster` instances and easily share them across the codebase as modules.

The following code samples demonstrate our preferred pattern for intergrating a toaster into a React application:

#### `toaster.ts`
```tsx
import { Position, Toaster } from "@blueprintjs/core";

/** Singleton toaster instance. Create separate instances for different options. */
export const AppToaster = Toaster.create({
    className: "recipe-toaster",
    position: Position.TOP,
});
```

#### `application.ts`
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

Render the `<Toaster>` component like any other element and supply `<Toast>` elements as `children`. You can
optionally attach a `ref` handler to access the instance methods, but we strongly recommend using the
[`Toaster.create` static method](#core/components/toast.static-usage) documented above instead. Note that
`children` and `ref` can be used together, but `children` will always appear _after_ toasts created with
`ref.show()`.

```tsx
import { Button, Position, Toast, Toaster } from "@blueprintjs/core";
import * as React from "react";

class MyComponent extends React.PureComponent {
    public state = { toasts: [ /* IToastProps[] */ ] }

    private toaster: Toaster;
    private refHandlers = {
        toaster: (ref: Toaster) => this.toaster = ref,
    };

    public render() {
        return (
            <div>
                <Button onClick={this.addToast} text="Procure toast" />
                <Toaster position={Position.TOP_RIGHT} ref={this.refHandlers.toaster}>
                    {/* "Toasted!" will appear here after clicking button. */}
                    {this.state.toasts.map(toast => <Toast {...toast} />)}
                </Toaster>
            </div>
        )
    }

    private addToast = () => {
        this.toaster.show({ message: "Toasted!" });
    }
}
```
