---
tag: new
---

@# Link

**Link** is a component that wraps an anchor tag with themed styles.

@## Import

```tsx
import { Link } from "@blueprintjs/core";
```

@## Usage

Use **Link** for navigation within your application or to external resources.

@reactCodeExample LinkBasicExample

@## Within text

Use **Link** within a paragraph or block of text to create a hyperlink. It is suggested to use `color="inherit"` to make the link match surrounding text color.

@reactCodeExample LinkWithinTextExample

@## Underline

The `underline` prop controls when the link displays an underline:

- `"always"` (default): The link always shows an underline
- `"hover"`: The link displays an underline only on hover
- `"none"`: The link never displays an underline

@reactCodeExample LinkUnderlineExample

@## Color

The `color` prop controls the link's text color:

- `"primary"` (default): Uses the primary intent color
- `"success"`, `"warning"`, `"danger"`: Uses the respective intent colors
- `"inherit"`: Inherits the color from surrounding text

@reactCodeExample LinkColorExample

@## External links

When linking to external resources, use the `target="_blank"` attribute to open the link in a new tab. You can also include an icon to help signify that the link is external or to make it stand out visually.

@reactCodeExample LinkExternalExample

@## Props interface

@interface LinkComponentProps
