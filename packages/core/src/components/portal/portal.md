@# Portal

The Portal component renders its children into a new "subtree" outside of the current component
hierarchy. It is an essential piece of [Overlay](#core/components/overlay), responsible for ensuring that
the overlay contents cover the application below. In most cases you do not need to use a Portal
directly; this documentation is provided simply for reference.

For the most part, Portal is a thin wrapper around [`ReactDOM.createPortal`](https://reactjs.org/docs/portals.html).

@## React context (legacy)

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign">
    <h4 class="@ns-heading">

React legacy API

</h4>

This feature uses React's legacy context API. Support for the
[newer React context API](https://reactjs.org/docs/context.html) will be coming soon
in Blueprint v5.x.

</div>

Portal supports the following options on its [React (legacy) context](https://reactjs.org/docs/legacy-context.html).
To use them, supply a child context to a subtree that contains the Portals you want to customize.

@interface PortalLegacyContext

<!--
@## React context

Portal supports the following options on its [React context](https://reactjs.org/docs/context.html)
via [PortalProvider](#core/context/portal-provider).
-->

<!-- @interface PortalContextOptions -->

@## Props

The Portal component functions like a declarative `appendChild()`, or jQuery's
`$.fn.appendTo()`. The children of a `Portal` component are inserted into a new
child of the `<body>`.

Portal is used inside [Overlay](#core/components/overlay) to actually overlay the content on the
application.

<div class="@ns-callout @ns-intent-warning @ns-icon-move">
    <h4 class="@ns-heading">A note about responsive layouts</h4>

For a single-page app, if the `<body>` is styled with `width: 100%` and `height: 100%`, a `Portal`
may take up extra whitespace and cause the window to undesirably scroll. To fix this, instead
apply `position: absolute` to the `<body>` tag.

</div>

@interface IPortalProps
