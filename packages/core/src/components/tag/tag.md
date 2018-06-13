@# Tags

Tags are great for lists of strings.

@reactExample TagExample

@## Props

The `Tag` component is available in the __@blueprintjs/core__ package.
Make sure to review the [getting started docs for installation info](#blueprint/getting-started).

Tag components render `.@ns-tag` elements with optional close buttons. Provide tag content as `children`.

You can provide your own props to these components as if they were regular JSX HTML elements. If
you provide a `className` prop, the class names you provide will be added alongside of the default
Blueprint class name.

@interface ITagProps

@## CSS

An optional "remove" button can be added inside a tag with a
`button.@ns-tag-remove` as the last child. The button is a separate element to
support interaction handlers in your framework of choice.

@css tag
