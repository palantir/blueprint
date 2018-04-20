@# Portals

The `Portal` component renders its children into a new "subtree" outside of the current component
hierarchy. It is essential piece of [`Overlay`](#core/components/overlay), responsible for ensuring that
the overlay contents cover the application below. In most cases you do not need to use a `Portal`
directly; this documentation is provided simply for reference.

@## JavaScript API

The `Portal` component is available in the __@blueprintjs/core__ package. Make sure to review the
[getting started docs for installation info](#blueprint/getting-started).

The `Portal` component functions like a declarative `appendChild()`, or jQuery's `$.fn.appendTo()`.
The children of a `Portal` component are appended to the `<body>` element.

`Portal` is used inside [`Overlay`](#core/components/overlay) to actually overlay the content on the
application.

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign">
    <h4 class="@ns-callout-title">A note about responsive layouts</h4>
    For a single-page app, if the `<body>` is styled with `width: 100%` and `height: 100%`, a `Portal`
    may take up extra whitespace and cause the window to undesirably scroll. To fix this, instead
    apply `position: absolute` to the `<body>` tag.
</div>

@interface IPortalProps

@### React context

`Portal` supports the following options on its [React context](https://facebook.github.io/react/docs/context.html).
To use them, supply a child context to a subtree that contains the Portals you want to customize.

@interface IPortalContext
