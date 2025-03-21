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
<kbd>tab</kbd> key is pressed to begin keyboard navigation. Try this out for yourself
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
**@blueprintjs/core** package. It supports the following public methods:

-   `FocusStyleManager.isActive(): boolean`: Returns whether the `FocusStyleManager` is currently running.
-   `FocusStyleManager.onlyShowFocusOnTabs(): void`: Enable behavior which hides focus styles during mouse interaction.
-   `FocusStyleManager.alwaysShowFocus(): void`: Stop this behavior (focus styles are always visible).

@### Ignoring focus style manager

There is an escape hatch to allow components to selectively ignore the focus style manager. This
can be useful when you do want to always show the focus outline, but only for certain
components, like a tree. This is done by applying `Classes.FOCUS_STYLE_MANAGER_IGNORE`
to a container element.

```tsx
import { Classes } from "@blueprintjs/core";

const MyComponent = () => ({
    <div classname={Classes.FOCUS_STYLE_MANAGER_IGNORE}>
        // Any components here will always show the focus outline when clicked.
    </div>
})
```

@## Color contrast

Colors have been designed to be accessible to as many people as possible, even those who are
visually impaired or experiencing any kind of colorblindness. Our colors have not only been chosen
to go well together, but to also adhere to [WCAG 2.0](https://www.w3.org/TR/WCAG20/) standards.

@### Focus indication contrast
Focus indication states generally adhere to
[WCAG 2.2 focus appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html).
Default focus indication states should support a minimum 3:1 contrast ratio on
[background colors](#core/colors) up to `$light-gray1` in light theme, and `$dark-gray5` in dark theme.

Components that appear with an `intent` outline, such as [`InputGroup`](#core/components/input-group),
[`EditableText`](#core/components/editable-text), [`NumericInput`](#core/components/numeric-input), and other
similarly styled components have some exceptions to this rule. In light theme, all intents support a minimum contrast
ratio of 3:1 for the full range of background colors up to `$light-gray1`, besides `"warning"`,
which supports a 3:1 contrast ratio up to `$light-gray4`.
In dark theme, all intents support a minimum contrast ratio of 3:1 up to `$dark-gray4`, expect for `"warning"`,
which supports the full range of background colors up to `$dark-gray5`.
