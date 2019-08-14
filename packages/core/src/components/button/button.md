@# Button

Buttons trigger actions when clicked.

@reactExample ButtonsExample

### `AnchorButton`

```tsx
<AnchorButton text="Click" />
// renders:
<a class="@ns-button" role="button" tabIndex={0}>Click</a>
```

### `Button`

```tsx
<Button icon="refresh" />
// renders:
<button class="@ns-button" type="button"><svg class="@ns-icon">...</svg></button>
```

<div class="@ns-callout @ns-intent-danger @ns-icon-error">
    <h4 class="@ns-heading">

Disabled `Button` prevents all interaction
</h4>

Use `AnchorButton` if you need mouse interaction events (such as hovering) on a disabled button.

`Button` uses the native `disabled` attribute on the `<button>` tag so the browser disables all interactions.
`AnchorButton` uses the class `.@ns-disabled` because `<a>` tags do not support the `disabled`
attribute. As a result, the `AnchorButton` component will prevent *only* the `onClick` handler
when disabled but permit other events.

</div>

@## Adding icons

`Button` and `AnchorButton` support `icon` and `rightIcon` props to place an
icon on either end of their children. Icons can also be supplied as children
using the `Icon` component.

@reactExample ButtonsIconsExample

@## Props

The two button components each support arbitrary HTML props for their underlying
DOM element (`<button>` and `<a>` respectively). Specifying an HTML prop will
override the component's default for it, such as `role` on `<AnchorButton>`.

@interface IButtonProps

@## CSS

Use the `@ns-button` class to access button styles. You should implement buttons using the
`<button>` or `<a>` tags rather than `<div>` for accessibility.

* Make sure to include `type="button"` on `<button>` tags (use `type="submit"` to submit a
  `<form>`) and `role="button"` on `<a>` tags for accessibility.
* Add the attribute `tabindex="0"` to make `<a>` tags focusable. `<button>` elements are
  focusable by default.
* For buttons implemented with `<a>` tags, add `tabindex="-1"` to disabled buttons to prevent the
  user from focusing them by pressing <kbd>tab</kbd> on the keyboard. (This does not happen in the example below.)
* Note that `<a>` tags do not respond to the `:disabled` attribute; use `.@ns-disabled` instead.

@css button
