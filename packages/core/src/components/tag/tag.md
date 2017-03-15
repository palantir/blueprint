@# Tags

Tags are great for lists of strings.

@## CSS API

An optional "remove" button can be added inside a tag as a `button.pt-tag-remove`. Also add the
class `.pt-tag-removable` to the `.pt-tag` itself to adjust padding. The button is a separate
element to support interaction handlers in your framework of choice.

A simple `.pt-tag` without the remove button can easily function as a badge.

@css pt-tag

@### Minimal tags

Add the `.pt-minimal` modifier for a lighter tag appearance. The translucent background color
will adapt to its container's background color.

@css pt-tag.pt-minimal

@## JavaScript API

The `Tag` component is available in the __@blueprintjs/core__ package.
Make sure to review the [general usage docs for JS components](#components.usage).

Tag components render `.pt-tag` elements with optional close buttons. Provide tag content as `children`.

You can provide your own props to these components as if they were regular JSX HTML elements. If
you provide a `className` prop, the class names you provide will be added alongside of the default
Blueprint class name.

```tsx
<Tag intent={Intent.PRIMARY} onRemove={this.deleteTag}>Done</Tag>
// renders:
<span class="pt-tag pt-intent-primary pt-tag-removable">
    Done
    <button class="pt-tag-remove" onClick={this.deleteTag}></button>
</span>
```

@interface ITagProps

@reactExample TagExample
