@# Buttons

A **Button** is a clickable element used to trigger actions or events. Buttons allow users to perform an action or navigate to another page with a single click. They are typically found in forms, toolbars, dialogs, and other areas where users need to make choices or initiate actions.

@## Import

```tsx
import { Button } from "@blueprintjs/core";
```

@## Usage

The `text` prop defines the label displayed on the button. Alternatively, content can be provided as children, allowing for more flexibility, such as including multiple elements or custom markup.

@reactCodeExample ButtonBasicExample

@## Intent

The `intent` prop is used to visually communicate the purpose or importance of the action associated with a button. Blueprint provides several intent options to convey meaning through color:

-   **Primary**: Indicates the main action and is usually styled more prominently.
-   **Success**: Represents a positive outcome or confirmation.
-   **Warning**: Used to alert users to potentially dangerous actions.
-   **Danger**: Signifies a destructive or critical action.

@reactCodeExample ButtonIntentExample

@## Variant

Buttons come in three different variants that support different use cases:

-   `solid` (the default) is useful for the primary action in a set of buttons.
-   `minimal` is useful for subtle actions or secondary options that shouldn't draw too much attention.
-   `outlined` provides a button with an outline, creating a middle ground between a prominent solid button and a subtle minimal button.

@reactCodeExample ButtonVariantExample

@## Minimal

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign">
    <h5 class="@ns-heading">

Deprecated: use [`variant`](#core/components/buttons.variant) instead

</h5>

</div>

The `minimal` prop offers a button without borders or background, ideal for subtle actions or secondary options that shouldn't draw too much attention.

@reactCodeExample ButtonMinimalExample

@## Outlined

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign">
    <h5 class="@ns-heading">

Deprecated: use [`variant`](#core/components/buttons.variant) instead

</h5>

</div>

The `outlined` prop provides a button with an outline, creating a middle ground between a prominent default button and a subtle minimal button.

@reactCodeExample ButtonOutlinedExample

@## Size

The `size` prop allows for adjusting the size of a button to fit different use cases.

@reactCodeExample ButtonSizeExample

@## Fill

The `fill` prop allows a button to expand and fill the available space in its container.

@reactCodeExample ButtonFillExample

@## Aligned text

The `alignText` prop controls the horizontal alignment of a button's text and icons.

@reactCodeExample ButtonAlignTextExample

@## Ellipsized text

The `ellipsizeText` prop allows text within a button to be truncated with an ellipsis if it exceeds the available space. This is useful for cases where the button needs to remain compact without overflowing, especially when the text content is dynamic or potentially lengthy.

@reactCodeExample ButtonEllipsizeTextExample

@## Icons with text

Buttons can include icons alongside text for extra context or visual cues. Icons can be added to either the before or after the  text/children with the `icon` and `endIcon` props respectively. These icons can either be specified as string identifiers (e.g. `"arrow-right"`), dynamically-loaded [`<Icon>` components](#core/components/icon), [static icon components](#core/components/icon.static-components) (e.g. `<ArrowRight />`), or any custom JSX element.

@reactCodeExample ButtonIconWithTextExample

@## Icon buttons

Icon buttons display only an icon without any accompanying text. Icon buttons are used when an action can be clearly conveyed through a visual symbol, making the interface more compact and visually appealing. They are ideal for toolbars or areas with limited space.

@reactCodeExample ButtonIconExample

@## Button states

Buttons have different states to show their interaction status. The `active`, `disabled`, and `loading` props provide visual feedback to help users understand available actions and when to wait.

-   **Active**: Indicates that the button is currently being pressed or interacted with.
-   **Disabled**: Shows that the button is non-interactive.
-   **Loading**: Displays a loading spinner to indicate that an action is in progress.

@reactCodeExample ButtonStatesExample

@## AnchorButton

The **AnchorButton** component behaves like an anchor (`<a>` tag) and is useful for navigation actions. AnchorButton accepts all props of both a standard button and an anchor tag, making it flexible for use as a styled link.

@reactCodeExample ButtonAnchorButtonExample

<div class="@ns-callout @ns-intent-danger @ns-icon-error @ns-callout-has-body-content">
    <h5 class="@ns-heading">Disabled Button elements prevent all interaction</h5>

Use **AnchorButton** if you need mouse interaction events (such as hovering) on a disabled button.

**Button** uses the native `disabled` attribute on the `<button>` tag so the browser disables all interactions.
**AnchorButton** uses the class `.@ns-disabled` because `<a>` tags do not support the `disabled` attribute. As a result,
the **AnchorButton** component will prevent _only_ the `onClick` handler when disabled but permit other events.

</div>

@reactCodeExample ButtonDisabledButtonTooltipExample

@## Interactive Playground

@reactExample ButtonPlaygroundExample

@## Props interface

The two button components each support arbitrary HTML attributes for their underlying DOM element
(`<button>` and `<a>` respectively). These attributes may override the components' default values, such as
`role` on `<AnchorButton>`.

@interface ButtonSharedProps

@## CSS API

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">

Deprecated API: use `<Button>` or `<AnchorButton>`

</h5>

CSS APIs for Blueprint components are considered deprecated, as they are verbose, error-prone, and they
often fall out of sync as the design system is updated. You should use the React component APIs instead.

</div>

Use the `@ns-button` class to access button styles. You should implement buttons using the
`<button>` or `<a>` tags rather than `<div>` for accessibility.

-   Make sure to include `type="button"` on `<button>` tags (use `type="submit"` to submit a
    `<form>`) and `role="button"` on `<a>` tags for accessibility.
-   Add the attribute `tabindex="0"` to make `<a>` tags focusable. `<button>` elements are
    focusable by default.
-   For buttons implemented with `<a>` tags, add `tabindex="-1"` to disabled buttons to prevent the
    user from focusing them by pressing <kbd>tab</kbd> on the keyboard. (This does not happen in the example below.)
-   Note that `<a>` tags do not respond to the `:disabled` attribute; use `.@ns-disabled` instead.

@css button
