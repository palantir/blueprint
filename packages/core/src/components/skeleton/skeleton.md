@# Skeleton

A CSS class that masks content with a pulsing loading animation, inheriting the dimensions of the element it is applied to.

@reactCodeExample SkeletonBasicExample

@## Import

```tsx
import { Classes } from "@blueprintjs/core";
```

@## Usage

Apply `Classes.SKELETON` to an element's `className` to cover its content with a loading animation.
The skeleton inherits the dimensions of whatever element the class is applied to, so supply
placeholder content that approximates the final size.

```tsx
<div className={Classes.SKELETON}>
    Content to be masked
</div>
```

@## Examples

@### Text elements

Apply the skeleton class to text elements to display placeholder loading states. The skeleton
inherits the dimensions of the element, so supply representative placeholder text to approximate
the final content size.

@reactCodeExample SkeletonTextExample

@### Focusable elements

When applying the skeleton class to focusable elements like buttons and inputs, disable the
element via the `disabled` attribute or `tabIndex={-1}` to prevent unintended keyboard focus.

@reactCodeExample SkeletonInteractiveExample

@### With Card

Wrap skeleton elements inside a **Card** to create a realistic content loading placeholder.

@reactCodeExample SkeletonWithCardExample

@## Best practices

- **DO** supply placeholder content that approximates the dimensions of the final content. The skeleton inherits the element's size, so empty elements will produce invisible skeletons.
- **DO** disable focusable elements (buttons, inputs, links) when applying the skeleton class, using the `disabled` attribute or `tabIndex={-1}`.
- **DO** use skeleton states for content that loads asynchronously, giving users a visual indication that data is being fetched.
- **DON'T** apply the skeleton class to elements that are already hidden or have no dimensions — the animation will not be visible.
- **DON'T** leave interactive elements focusable while in a skeleton state. Screen readers and keyboard users could interact with elements that have no meaningful content.
- **DON'T** use skeletons for content that loads instantly. If content appears within a few hundred milliseconds, the skeleton flash can feel more disruptive than a blank space.
