@# Callouts

Callouts visually highlight important content for the user.

@reactExample CalloutExample

@## CSS API

Callouts use the same visual intent modifier classes as buttons. If you need a
heading, use the `<h4>` element.

<div class="pt-callout pt-intent-primary pt-icon-info-sign">
    Note that the `<h4>` heading is entirely optional.
</div>

@css pt-callout

@## JavaScript API

The `Callout` component is available in the **@blueprintjs/core** package.
Make sure to review the [general usage docs for JS components](#blueprint.usage).

The component is a simple wrapper around the CSS API that provides props for modifiers and the optional title
element. Any additional HTML props will be spread to the rendered `<div>` element. It provides two additional
useful features:

1. Providing an `intent` will set use a default icon per intent, which can be overridden by supplying
   your own `icon`.
1. The React component renders an SVG `Icon` element for the `icon` prop, instead of the `.pt-icon-*`
   CSS class.

@interface ICalloutProps
