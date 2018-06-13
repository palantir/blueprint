@# Tag

Tags are great for lists of strings.

@reactExample TagExample

@## Props

`Tag` is a stateless wrapper around its children with support for an optional
close button. It also supports all HTML `<span>` props.

@interface ITagProps

@## CSS

Create a tag with a `span.@ns-tag`. An optional "remove" button can be added
with a `button.@ns-tag-remove` as the last child. The button is a separate
element to support interaction handlers in your framework of choice.

@css tag
