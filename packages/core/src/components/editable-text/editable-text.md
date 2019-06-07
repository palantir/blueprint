@# Editable text

`EditableText` appears as normal UI text but transforms into a text input field
when the user focuses it.

The text input inherits all font styling from its ancestors, making for a
seamless transition between reading and editing text.

You might use this component for inline renaming, or for an
[editable multiline description](#core/components/editable-text.multiline-mode).
You should not use `EditableText` when a static always-editable `<input>` or
`<textarea>` tag would suffice.

@reactExample EditableTextExample

<div class="@ns-callout @ns-intent-danger @ns-icon-error">
    <h4 class="@ns-heading">Centering the component</h4>

**Do not center this component** using `text-align: center`, as it will cause an infinite loop
in the browser ([more details](https://github.com/JedWatson/react-select/issues/540)). Instead,
you should center the component via flexbox or with `position` and `transform: translateX(-50%)`.

</div>


@## Multiline mode

By default, `EditableText` supports _exactly one line of text_ and will grow or
shrink horizontally based on the length of text.

Enable the `multiline` prop to use a `<textarea>` that spans multiple lines
instead of an `<input type="text">`. Multiline mode always appears at 100% width
and adjusts _vertically_ based on length of text. Use the `minLines` and
`maxLines` props to constrain the height of the component.

```tsx
<EditableText multiline={true} minLines={3} maxLines={12} {...props} />
```

Users confirm text in multiline mode by pressing `ctrl`+`enter` or `cmd`+`enter`
rather than simply `enter`. (Pressing the `enter` key by itself moves the cursor
to the next line.) This behavior can be inverted with the `confirmOnEnterKey`
prop.

@## Props

`EditableText` is used like an [`input`
element](https://facebook.github.io/react/docs/forms.html) and supports
controlled or uncontrolled usage through the `value` or `defaultValue` props,
respectively. Use `onChange` to listen to ongoing updates and use `onConfirm`
and `onCancel` to listen only to completed or canceled edits.

The `onConfirm` and `onCancel` callbacks are invoked based on user interaction.
The user presses `enter` (or `cmd`+`enter` when multiline) or blurs the input to
confirm the current value, or presses `esc` to cancel. Canceling resets the
field to the last confirmed value. Neither callback is invoked if the value is
unchanged.

@interface IEditableTextProps
