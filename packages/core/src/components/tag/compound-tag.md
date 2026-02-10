@# Compound Tag

A variant of [**Tag**](#core/components/tag) that displays content as a visually segmented key-value pair.

@reactCodeExample CompoundTagBasicExample

@## Import

```tsx
import { CompoundTag } from "@blueprintjs/core";
```

@## Usage

Content for the left side of the tag is specified with the `leftContent` prop, while `children` are rendered on the right side. CompoundTag supports all valid `<span>` DOM attributes.

```tsx
<CompoundTag leftContent="City">London</CompoundTag>
```

@## Examples

@### Intent

Use the `intent` prop to apply a semantic color that conveys the purpose or status of the tag.

@reactCodeExample CompoundTagIntentExample

@### Minimal

Use the `minimal` prop to render a tag with reduced visual weight, without a filled background.

@reactCodeExample CompoundTagMinimalExample

@### Size

Use the `size` prop to adjust the tag dimensions. CompoundTag supports `"medium"` (default) and `"large"`.

@reactCodeExample CompoundTagSizeExample

@### Fill

Use the `fill` prop to make the tag expand to the full width of its container.

@reactCodeExample CompoundTagFillExample

@### Round

Use the `round` prop to render the tag with rounded ends.

@reactCodeExample CompoundTagRoundExample

@### Icons

Use the `icon` prop to render an icon before the left content and the `endIcon` prop to render an icon after the right content.

@reactCodeExample CompoundTagIconExample

@### Removable

Define the `onRemove` prop to render a remove button on the right side of the tag. The remove button will only appear when this handler is provided.

@reactCodeExample CompoundTagRemovableExample

@### Interactive

Use the `interactive` prop to enable hover and cursor styling. This is recommended when pairing with an `onClick` handler.

@reactCodeExample CompoundTagInteractiveExample

@## Interactive Playground

@reactExample CompoundTagPlaygroundExample

@### Best practices

**Do:**
- Use CompoundTag to display key-value metadata, such as `Region: US East` or `Status: Active`.
- Use `intent` to reflect the semantic meaning of the value (e.g. `danger` for an error state, `success` for a healthy state).
- Set `interactive` to `true` when the tag is clickable, so users receive appropriate visual feedback.
- Pair `onRemove` with filter or selection interfaces where users need to dismiss individual tags.

**Don't:**
- Don't use CompoundTag when a simple [**Tag**](#core/components/tag) would suffice. CompoundTag is specifically for paired content.
- Don't use `intent` purely for color decoration. Each intent carries a semantic meaning that should match the context.
- Don't set `interactive` without also providing an `onClick` handler, as the hover styling would imply interactivity that does not exist.
- Don't use the deprecated `large` prop. Use `size="large"` instead.
- Don't use the deprecated `rightIcon` prop. Use `endIcon` instead.

@## Props interface

@interface CompoundTagProps
