@# Buttons

Buttons trigger actions when clicked.

@## CSS API

Use the `pt-button` class to access button styles. You should implement buttons using the
`<button>` or `<a>` tags rather than `<div>` for the purposes of HTML accessibility and semantics.

- Make sure to include `type="button"` on `<button>` tags (use `type="submit"` when used in a
`<form>`) and `role="button"` on `<a>` tags for accessibility.
- Add the attribute `tabindex="0"` to make `<a>` tags focusable. `<button>` elements are
focusable by default.
- For buttons implemented with `<a>` tags, add `tabindex="-1"` to disabled buttons to prevent the
user from focusing them by pressing <kbd class="pt-key">tab</kbd> on the keyboard.
- Note that `<a>` tags do not respond to the `:disabled` attribute; use `.pt-disabled` instead.

@### Buttons with icons

Add an icon before the button text with `pt-icon-*` classes.
You _do not_ need to include an icon sizing class.

@### Advanced icon layout

You can use a `pt-icon-*` class on a button to add a single icon before the button
text, but for more advanced icon layouts, use `<span>` tags inside the button.
Add multiple icons to the same button, or move icons after the text.

To adjust margins on right-aligned icons, add the class `pt-align-right` to the icon.

@### Minimal buttons

For a subtler button that appears to fade into the UI, add the `.pt-minimal` modifier
to any `.pt-button`. `pt-minimal` is compatible with all other button modifiers,
except for `.pt-fill` (due to lack of visual affordances).

Note that minimal buttons are _not supported_ in button groups at this time.

@## JavaScript API

The `Button` and `AnchorButton` components are available in the __@blueprintjs/core__ package.
Make sure to review the [general usage docs for JS components](#components.usage).

Button components render buttons with Blueprint classes and attributes.
See the [Buttons CSS docs](#components.button.css) for styling options.

You can provide your own props to these components as if they were regular JSX HTML elements. If you
provide a `className` prop, the class names you provide will be added alongside of the default
Blueprint class name. If you specify other attributes that the component provides, such as a `role`
for an `<AnchorButton>`, you'll overide the default value.

<div class="pt-callout pt-intent-danger pt-icon-error">
    <h5>Interactions with disabled buttons</h5>
    Use `AnchorButton` if you need mouse interaction events (such as hovering) on a disabled button.
    This is because `Button` and `AnchorButton` handle the `disabled` prop differently: `Button` uses
    the native `disabled` attribute on the `<button>` tag so the browser disables all interactions,
    but `AnchorButton` uses the class `.pt-disabled` because `<a>` tags do not support the `disabled`
    attribute. As a result, the `AnchorButton` component will prevent *only* the `onClick` handler
    when disabled but permit other events.
</div>

@reactExample ButtonsExample

@### Anchor button

```jsx
<AnchorButton text="Click" />
// renders:
<a class="pt-button" role="button" tabIndex={0}>Click</a>
```

@### Button

```jsx
<Button iconName="refresh" />
// renders:
<button class="pt-button pt-icon-refresh" type="button"></button>
```

@interface IButtonProps
