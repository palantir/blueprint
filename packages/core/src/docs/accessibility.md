@# Accessibility

Blueprint strives to provide accessible components out of the box. Many of the JS components
will apply accessible HTML attributes to support different modes of usage.

@## Focus management

Focus states (that glowy blue outline around the active element) are essential for keyboard
navigation to indicate which element is currently active. They are less important, and
occasionally outright intrusive, when using a mouse because you can click wherever you want at
any time.

Blueprint includes a utility that manages the appearance of focus styles. When enabled, focus styles
will be hidden while the user interacts using the mouse and will appear when the
<kbd class="@ns-key">tab</kbd> key is pressed to begin keyboard navigation. Try this out for yourself
below.

**You must explictly enable this feature in your app (and you probably want to):**

```ts
import { FocusStyleManager } from "@blueprintjs/core";

FocusStyleManager.onlyShowFocusOnTabs();
```

Note that the focus style for text inputs (a slightly thicker colored border) is not removed by this
utility because it is always useful to know where you're typing.

@reactExample FocusExample

@### JavaScript API

This behavior is controlled by a singleton instance called `FocusStyleManager` that lives in the
__@blueprintjs/core__ package. It supports the following public methods:

- `FocusStyleManager.isActive(): boolean`: Returns whether the `FocusStyleManager` is currently running.
- `FocusStyleManager.onlyShowFocusOnTabs(): void`: Enable behavior which hides focus styles during mouse interaction.
- `FocusStyleManager.alwaysShowFocus(): void`: Stop this behavior (focus styles are always visible).

@## Color contrast

Colors have been designed to be accessible to as many people as possible, even those who are
visually impaired or experiencing any kind of colorblindness. Our colors have not only been chosen
to go well together but to also adhere to [WCAG 2.0](https://www.w3.org/TR/WCAG20/) standards.
