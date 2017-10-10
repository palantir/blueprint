@# Callouts

Callouts visually highlight important content for the user.

@## CSS API

Callouts use the same visual intent modifier classes as buttons. If you need a
heading, use the `<h5>` element.

<div class="pt-callout pt-intent-primary pt-icon-info-sign">
    Note that the `<h5>` heading is entirely optional.
</div>

@css pt-callout

@## JavaScript API

The `Callout` component is available in the __@blueprintjs/core__ package.
Make sure to review the [general usage docs for JS components](#blueprint.usage).

The component is a simple wrapper around the CSS API that provides props for modifiers and optional title element.
Any additional HTML props will be spread to the rendered `<div>` element.

@interface ICalloutProps
