@# Callouts

Callouts visually highlight important content for the user.

@reactExample CalloutExample

@## CSS API

Callouts use the same visual intent modifier classes as buttons. If you need a
heading, use the `<h4>` element with a `.@ns-callout-title` class.

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">
    Note that the title is entirely optional.
</div>

@css callout

@## JavaScript API

The `Callout` component is available in the **@blueprintjs/core** package.
Make sure to review the [getting started docs for installation info](#blueprint/getting-started).

The component is a simple wrapper around the CSS API that provides props for modifiers and the optional title
element. Any additional HTML props will be spread to the rendered `<div>` element. It provides two additional
useful features:

1. Providing an `intent` will set use a default icon per intent, which can be overridden by supplying
   your own `icon`.
1. The React component renders an SVG `Icon` element for the `icon` prop, instead of the `.@ns-icon-*`
   CSS class.

@interface ICalloutProps
