@# Portal

The `Portal` component renders its children into a new "subtree" outside of the current component
hierarchy. It is an essential piece of [`Overlay`](#core/components/overlay), responsible for ensuring that
the overlay contents cover the application below. In most cases you do not need to use a `Portal`
directly; this documentation is provided simply for reference.

@## React 15

In a **React 15** environment, `Portal` will use `ReactDOM.unstable_renderSubtreeIntoContainer` to achieve the teleportation effect, which has a few caveats:

1. `Portal` `children` are wrapped in an extra `<div>` inside the portal container element.
1. Test harnesses such as `enzyme` cannot trivially find elements "through" Portals as they're not in the same React tree.
1. React `context` _is_ preserved (this one's a good thing).

In a **React 16+** environment, the `Portal` component will use [`ReactDOM.createPortal`](https://reactjs.org/docs/portals.html) which preserves the React tree perfectly and does not require any of the above caveats.

@## React context

`Portal` supports the following options on its [React context](https://facebook.github.io/react/docs/context.html).
To use them, supply a child context to a subtree that contains the Portals you want to customize.

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">

Blueprint uses the React 15-compatible `getChildContext()` API instead of the newer React 16.3 `React.createContext()` API.

</div>

@interface IPortalContext

@## Props

The `Portal` component functions like a declarative `appendChild()`, or jQuery's
`$.fn.appendTo()`. The children of a `Portal` component are inserted into a new
child of the `<body>`.

`Portal` is used inside [`Overlay`](#core/components/overlay) to actually overlay the content on the
application.

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign">
    <h4 class="@ns-heading">A note about responsive layouts</h4>

For a single-page app, if the `<body>` is styled with `width: 100%` and `height: 100%`, a `Portal`
may take up extra whitespace and cause the window to undesirably scroll. To fix this, instead
apply `position: absolute` to the `<body>` tag.

</div>

@interface IPortalProps
