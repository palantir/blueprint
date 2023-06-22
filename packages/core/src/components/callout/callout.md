@# Callout

Callouts visually highlight important content for the user. They can contain
a title, an icon and content. Each intent has a default icon associated with it.

@reactExample CalloutExample

@## Props interface

The `<Callout>` component is a simple wrapper around the CSS API that provides props for
modifiers and an optional title element. Any additional HTML props will be spread to the
rendered `<div>` element.

@interface CalloutProps

@## CSS

Callouts use the same visual intent modifier classes as buttons. If you need a
heading, use the `<h5>` element with a `.@ns-heading` class.

@css callout
