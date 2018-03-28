@# Tags

Tags are great for lists of strings.

@reactExample TagExample

@## CSS API

An optional "remove" button can be added inside a tag as a `button.@ns-tag-remove`. Also add the
class `.@ns-tag-removable` to the `.@ns-tag` itself to adjust padding. The button is a separate
element to support interaction handlers in your framework of choice.

A simple `.@ns-tag` without the remove button can easily function as a badge.

@css tag

@### Minimal tags

Add the `.@ns-minimal` modifier for a lighter tag appearance. The translucent background color
will adapt to its container's background color.

@css tag-minimal

@## JavaScript API

The `Tag` component is available in the __@blueprintjs/core__ package.
Make sure to review the [getting started docs for installation info](#blueprint/getting-started).

Tag components render `.@ns-tag` elements with optional close buttons. Provide tag content as `children`.

You can provide your own props to these components as if they were regular JSX HTML elements. If
you provide a `className` prop, the class names you provide will be added alongside of the default
Blueprint class name.

```tsx
<Tag intent={Intent.PRIMARY} onRemove={this.deleteTag}>Done</Tag>
// renders:
<span class="@ns-tag @ns-intent-primary @ns-tag-removable">
    Done
    <button class="@ns-tag-remove" onClick={this.deleteTag}></button>
</span>
```

@interface ITagProps

