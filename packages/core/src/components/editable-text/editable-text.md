@# Editable text

__EditableText__ is an interactive component which appears as normal UI text. It transforms into an interactive
text input field when a user hovers and/or focuses on it.

The text input inherits all font styling from its ancestors, making for a seamless transition between reading and
editing text.

You might use this component for inline renaming, or for an
[editable multiline description](#core/components/editable-text.multiline-mode).
You should not use __EditableText__ when a more static, always-editable
[__InputGroup__](#core/components/input-group) or [__TextArea__](#core/components/text-area)
component would suffice.

@reactExample EditableTextExample

<div class="@ns-callout @ns-intent-danger @ns-icon-error @ns-callout-has-body-content">
    <h5 class="@ns-heading">Centering EditableText</h5>

**Do not center this component** using `text-align: center`, as it will cause an infinite loop
in the browser ([more details](https://github.com/JedWatson/react-select/issues/540)). Instead,
you should center the component via flexbox or with `position` and `transform: translateX(-50%)`.

</div>


@## Multiline mode

By default, __EditableText__ supports _exactly one line of text_ and will grow or shrink horizontally based on the
length of text.

You may enable the `multiline` prop to use a `<textarea>` which spans multiple lines instead of a single-line
`<input type="text">`. Multiline mode always appears at 100% width and adjusts _vertically_ based on length of text.
Use the `minLines` and `maxLines` props to constrain the height of the component.

```tsx
<EditableText multiline={true} minLines={3} maxLines={12} {...props} />
```

Users may confirm text in multiline mode by pressing <kbd>Ctrl + Enter</kbd> or <kbd>Command + Enter</kbd> rather than
<kbd>Enter</kbd>. (Pressing the <kbd>Enter</kbd> key by itself moves the cursor to the next line.) This behavior
can be inverted with the `confirmOnEnterKey` prop.

@## Usage

__EditableText__ is used like an [`<input>` element](https://facebook.github.io/react/docs/forms.html) and supports
controlled or uncontrolled usage through the `value` or `defaultValue` props, respectively. Use `onChange` to listen to
ongoing updates and use `onConfirm` and `onCancel` to listen only to completed or canceled edits.

The `onConfirm` and `onCancel` callbacks are invoked based on user interaction. The user presses <kbd>Enter</kbd>
(or <kbd>Command + Enter</kbd> when multiline) or blurs the input to confirm the current value, or presses
<kbd>Escape</kbd> to cancel. Canceling resets the field to the last confirmed value. Neither callback is invoked if the
value is unchanged.

@## Props interface

@interface EditableTextProps
