---
parent: components
---

@# Tags

Tags are great for lists of strings.

@## CSS API

An optional "remove" button can be added inside a tag as a `button.pt-tag-remove`. Also add the
class `.pt-tag-removable` to the `.pt-tag` itself to adjust padding. The button is a separate
element to support interaction handlers in your framework of choice.

A simple `.pt-tag` without the remove button can easily function as a badge.

Markup:
<p>
<span class="pt-tag {{.modifier}}">125</span>
<span class="pt-tag {{.modifier}}">Done</span>
<span class="pt-tag pt-tag-removable {{.modifier}}">
Tracking
<button class="pt-tag-remove"></button>
</span>
<span class="pt-tag pt-tag-removable {{.modifier}}">
Crushed
<button class="pt-tag-remove"></button>
</span>
</p>
<span class="pt-tag pt-tag-removable {{.modifier}}">
A rather long string of text that wraps to multiple lines
demonstrates the position of the remove button.
<button class="pt-tag-remove"></button>
</span>

.pt-large - Large
.pt-round - Rounded corners, ideal for badges
.pt-intent-primary - Primary intent
.pt-intent-success - Success intent
.pt-intent-warning - Warning intent
.pt-intent-danger  - Danger intent

@### Minimal tags

Add the `.pt-minimal` modifier for a lighter tag appearance. The translucent background color
will adapt to its container's background color.

Markup:
<div class="pt-tag pt-minimal {{.modifier}}">125</div>
<div class="pt-tag pt-minimal {{.modifier}}">Done</div>
<div class="pt-tag pt-minimal pt-tag-removable {{.modifier}}">
Tracking
<button class="pt-tag-remove"></button>
</div>

.pt-large - Large
.pt-round - Rounded corners, ideal for badges
.pt-intent-primary - Primary intent
.pt-intent-success - Success intent
.pt-intent-warning - Warning intent
.pt-intent-danger  - Danger intent

@## JavaScript API

The `Tag` component is available in the __@blueprintjs/core__ package.
Make sure to review the [general usage docs for JS components](#components.usage).

Tag components render `.pt-tag` elements with optional close buttons. Provide tag content as `children`.

You can provide your own props to these components as if they were regular JSX HTML elements. If
you provide a `className` prop, the class names you provide will be added alongside of the default
Blueprint class name.

```
<Tag intent={Intent.PRIMARY} onRemove={this.deleteTag}>Done</Tag>
// renders:
<span class="pt-tag pt-intent-primary pt-tag-removable">
Done
<button class="pt-tag-remove" onClick={this.deleteTag}></button>
</span>
```

@interface ITagProps

@reactExample TagExample
