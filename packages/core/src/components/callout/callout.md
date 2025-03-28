@# Callout

**Callouts** visually highlight important content for the user. They may contain
a title, an icon and content. Each intent has a default icon associated with it.

@## Import

```tsx
import { Callout } from "@blueprintjs/core";
```

@## Usage

A **Callout** highlights important content with an optional title and body text.

@reactCodeExample CalloutBasicExample

@## Intent

The `intent` prop sets the visual style of the **Callout**, reflecting its purpose or severity. Each intent applies a unique color and includes a default icon.

@reactCodeExample CalloutIntentExample

@## Minimal

The `minimal` prop offers a callout without a background color, ideal for less prominent information that shouldn't draw too much attention.

@reactCodeExample CalloutMinimalExample

@## Icon

The `icon` prop allows customization of the **Callout** icon. Provide a custom
icon, or disable it by setting `icon={false}`.

@reactCodeExample CalloutIconExample

@## Compact

Enable the `compact` prop to reduce the padding of the **Callout** for a more condensed appearance.

@reactCodeExample CalloutCompactExample

@## Interactive Playground

@reactExample CalloutPlaygroundExample

@## Props interface

@interface CalloutProps
