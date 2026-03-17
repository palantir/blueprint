@# Tag

**Tag** is a lightweight visual container for short strings of text. This flexible component may be used to label an
entity, display a list of selected items, and much more. **Tag** supports a range of visual modifiers for many
different situations; its colors are designed to be accessible in almost any context.

@## Usage

```tsx
import { Tag } from "@blueprintjs/core";
```

```tsx
<Tag>London</Tag>
```

The `<Tag>` component is a stateless wrapper around its children with support for an optional close button.
It supports all valid `<span>` DOM attributes.

@## Examples

@### Basic

Use **Tag** to display short strings of text as compact labels.

@reactCodeExample TagBasicExample

@### Intent

The `intent` prop sets the visual color of the **Tag**, reflecting its purpose or severity.

@reactCodeExample TagIntentExample

@### Minimal

Enable the `minimal` prop to remove the background color fill from the **Tag**.

@reactCodeExample TagMinimalExample

@## Interactive Playground

@reactExample TagPlaygroundExample

@## Props interface

@interface TagProps
