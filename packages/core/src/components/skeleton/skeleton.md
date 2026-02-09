@# Skeleton

A CSS class that masks content with a shimmering loading animation.

@reactCodeExample SkeletonBasicExample

@## Import

```tsx
import { Classes } from "@blueprintjs/core";
```

@## Usage

Apply the `Classes.SKELETON` class to any element to cover its content with a loading animation. The skeleton inherits the dimensions of the element it is applied to, so you should supply placeholder content to approximate the shape of your real content.

```tsx
<div className={Classes.SKELETON}>
    Placeholder content that defines the skeleton's size
</div>
```

@## Examples

@### Basic

Use the `Classes.SKELETON` class on individual elements within a layout to create a loading placeholder that mimics the shape of your content.

@reactCodeExample SkeletonBasicExample

@### With text

The skeleton animation adapts to the width of the content it covers. Use placeholder text of varying lengths to approximate the shape of your real content.

@reactCodeExample SkeletonTextExample

@### With Card

Wrap multiple skeletonized elements in a [Card](#core/components/card) to create a realistic loading placeholder for complex layouts.

@reactCodeExample SkeletonCardExample

@### Disabled focusable elements

When applying `.@ns-skeleton` to focusable elements such as inputs and buttons, disable the element via `disabled` or `tabIndex={-1}` to prevent focus while loading.

@reactCodeExample SkeletonDisabledExample

@## CSS

@css skeleton

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">Manually disable focusable elements</h5>

When using the `.@ns-skeleton` class on focusable elements such as inputs and buttons, be sure to disable the element,
via either the `disabled` or `tabindex="-1"` attributes. Failing to do so will allow these skeleton elements to be
focused when they shouldn't be.

</div>
