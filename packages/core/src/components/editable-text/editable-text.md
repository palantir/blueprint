@# Editable text

`EditableText` looks like normal UI text, but transforms into a text input field when the user
focuses it.

The text input inherits all font styling from its ancestors, making the transition between reading
and editing text seamless.

You might use this component for inline renaming, or for an
[editable multiline description](#core/components/editable-text.multiline-mode).
You should not use `EditableText` when a static always-editable `<input>` or
`<textarea>` tag would suffice.

<div class="@ns-callout @ns-intent-danger @ns-icon-error">
    <h4 class="@ns-callout-title">Centering the component</h4>
    **Do not center this component** using `text-align: center`, as it will cause an infinite loop
    in the browser ([more details](https://github.com/JedWatson/react-select/issues/540)). Instead,
    you should center the component via flexbox or with `position` and `transform: translateX(-50%)`.
</div>

@reactExample EditableTextExample

@## JavaScript API

The `EditableText` component is available in the __@blueprintjs/core__ package. Make sure to review
the [getting started docs for installation info](#blueprint/getting-started).

`EditableText` can be used like an [`input`
element](https://facebook.github.io/react/docs/forms.html) and supports controlled or uncontrolled
usage through the `value` or `defaultValue` props, respectively.

The `onConfirm` and `onCancel` callbacks are invoked based on user interaction. The user presses
`enter` or blurs the input to confirm the current value, or presses `esc` to cancel. Canceling resets
the field to the last confirmed value. Neither callback is invoked if the value is unchanged.

`EditableText` by default supports _exactly one line of text_ and will grow or shrink horizontally
based on the length of text. See below for information on [multiline
support](#core/components/editable-text.multiline-mode).

@interface IEditableTextProps

@## Multiline mode

```tsx
<EditableText multiline minLines={3} maxLines={12} {...props} />
```

Provide the `multiline` prop to create an `EditableText` field that spans multiple lines. Multiline
mode uses a `<textarea>` instead of an `<input type="text">` to support multiple lines of text.

Users confirm text in multiline mode by pressing `ctrl` `enter` or `cmd` `enter` rather than
simply `enter`. (Pressing the `enter` key by itself moves the cursor to the next line.)

Additionally, in multiline mode the component's width is fixed at 100%. It grows or shrinks
_vertically_ instead, based on the number of lines of text. You can use the `minLines` and
`maxLines` props to constrain the vertical size of the component.

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign">
    <h4 class="@ns-callout-title">Multiline prop format</h4>
    You should declare `multiline` as a valueless boolean prop, as in the example above
    (`<EditableText multiline ...>`). This prevents you from changing the value after declaring it,
    which would provide a sub-optimal experience for users (multiline text does not always render
    cleanly into a single line).
</div>
