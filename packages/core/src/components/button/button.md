@# Buttons

Buttons trigger actions when clicked.

@## CSS API

Use the `@ns-button` class to access button styles. You should implement buttons using the
`<button>` or `<a>` tags rather than `<div>` for the purposes of HTML accessibility and semantics.

* Make sure to include `type="button"` on `<button>` tags (use `type="submit"` when used in a
  `<form>`) and `role="button"` on `<a>` tags for accessibility.
* Add the attribute `tabindex="0"` to make `<a>` tags focusable. `<button>` elements are
  focusable by default.
* For buttons implemented with `<a>` tags, add `tabindex="-1"` to disabled buttons to prevent the
  user from focusing them by pressing <kbd class="@ns-key">tab</kbd> on the keyboard.
* Note that `<a>` tags do not respond to the `:disabled` attribute; use `.@ns-disabled` instead.

@css button

@### Buttons with icons

Add an icon before the button text with `@ns-icon-*` classes.
You _do not_ need to include an icon sizing class.

@css button-icon

@### Advanced icon layout

You can use a `@ns-icon-*` class on a button to add a single icon before the button
text, but for more advanced icon layouts, use `<span>` tags inside the button.
Add multiple icons to the same button, or move icons after the text.

To adjust margins on right-aligned icons, add the class `@ns-align-right` to the icon.

@css button-icon-advanced

@### Minimal buttons

For a subtler button that appears to fade into the UI, add the `.@ns-minimal` modifier
to any `.@ns-button`. `@ns-minimal` is compatible with all other button modifiers,
except for `.@ns-fill` (due to lack of visual affordances).

@css button-minimal

@## JavaScript API

The `Button` and `AnchorButton` components are available in the **@blueprintjs/core** package.
Make sure to review the [getting started docs for installation info](#blueprint/getting-started).

Button components render buttons with Blueprint classes and attributes.
See the [Buttons CSS docs](#core/components/button.css-api) for styling options.

You can provide your own props to these components as if they were regular JSX HTML elements. If you
provide a `className` prop, the class names you provide will be added alongside of the default
Blueprint class name. If you specify other attributes that the component provides, such as a `role`
for an `<AnchorButton>`, you'll overide the default value.

<div class="@ns-callout @ns-intent-danger @ns-icon-error">
    <h4 class="@ns-callout-title">Interactions with disabled buttons</h4>
    Use `AnchorButton` if you need mouse interaction events (such as hovering) on a disabled button.
    This is because `Button` and `AnchorButton` handle the `disabled` prop differently: `Button` uses
    the native `disabled` attribute on the `<button>` tag so the browser disables all interactions,
    but `AnchorButton` uses the class `.@ns-disabled` because `<a>` tags do not support the `disabled`
    attribute. As a result, the `AnchorButton` component will prevent *only* the `onClick` handler
    when disabled but permit other events.
</div>

@reactExample ButtonsExample

@### Anchor button

```jsx
<AnchorButton text="Click" />
// renders:
<a class="@ns-button" role="button" tabIndex={0}>Click</a>
```

@### Button

```jsx
<Button icon="refresh" />
// renders:
<button class="@ns-button @ns-icon-refresh" type="button"></button>
```

@interface IButtonProps
