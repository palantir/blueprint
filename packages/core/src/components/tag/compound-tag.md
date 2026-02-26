@# Compound Tag

CompoundTag is a variant of [**Tag**](#core/components/tag) that displays content as a visually segmented key-value pair.

@## Import

```tsx
import { CompoundTag } from "@blueprintjs/core";
```

@## Usage

Content for the left side of the tag is specified with the `leftContent` prop, while `children` are rendered on the right side. CompoundTag supports all valid `<span>` DOM attributes.

```tsx
<CompoundTag leftContent="City" id="city-tag">
    Chicago
</CompoundTag>
```

@## Examples

@### Basic Usage

@reactCodeExample CompoundTagBasicExample

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

@## Props interface

@interface CompoundTagProps
