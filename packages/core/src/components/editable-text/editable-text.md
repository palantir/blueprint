@# Editable text

**EditableText** is an interactive component that displays as static text but
visually resembles an input field on hover. When clicked or focused,
it transforms into a text input, allowing for inline text editing.

The text input inherits font styling from its parent elements, making for a
seamless transition between reading and editing text. **EditableText** is ideal
for inline renaming, editable descriptions, or simple text updates. You should
not use **EditableText** when a more static, always-editable [**InputGroup**](#core/components/input-group)
or [**TextArea**](#core/components/text-area) component would suffice.

@## Import

```tsx
import { EditableText } from "@blueprintjs/core";
```

@## Usage

**EditableText** can be used in both controlled and uncontrolled modes, similar
to a standard React [`<input>` element](https://react.dev/reference/react-dom/components/input).
Use the `value` prop for controlled usage, and `defaultValue` for uncontrolled usage. Use `onChange` to listen to
ongoing updates and use `onConfirm` and `onCancel` to listen only to completed or canceled edits.

The `onConfirm` callback is invoked when a user presses <kbd>Enter</kbd>
(or <kbd>Mod + Enter</kbd> when multiline) or when the user blurs the input.
The `onCancel` callback is invoked when user presses <kbd>Escape</kbd>.
Canceling resets the field to the last confirmed value. Neither callback is
invoked if the value is unchanged.

@reactCodeExample EditableTextBasicExample

<div class="@ns-callout @ns-intent-danger @ns-icon-error @ns-callout-has-body-content">
    <h5 class="@ns-heading">Centering EditableText</h5>

**Do not center this component** using `text-align: center`, as it will cause an infinite loop
in the browser ([more details](https://github.com/JedWatson/react-select/issues/540)). Instead,
you should center the component via flexbox or with `position` and `transform: translateX(-50%)`.

</div>

@## Multiline mode

By default, **EditableText** supports a single line of text and resizes horizontally as needed.
Enabling the `multiline` prop transforms it into a `<textarea>`, which grows and shrinks vertically
as content changes. Use the `minLines` and `maxLines` props to constrain the height of the component.

Users may confirm text in multiline mode by pressing <kbd>Ctrl + Enter</kbd> or <kbd>Command + Enter</kbd> rather than
<kbd>Enter</kbd>. Pressing the <kbd>Enter</kbd> key by itself moves the cursor to the next line. This behavior
can be inverted with the `confirmOnEnterKey` prop.

@reactCodeExample EditableTextMultilineExample

@## Intent

The `intent` prop controls the visual appearance of **EditableText**, similar to
[**InputGroup**](#core/components/input-group) and [**TextArea**](#core/components/text-area).
This prop is useful for highlighting states like success, warnings, or errors.

-   **Primary** – Indicates primary action or highlight.
-   **Success** – Represents a positive outcome or confirmation.
-   **Warning** – Warns about potential issues.
-   **Danger** – Highlights an error or critical issue.

@reactCodeExample EditableTextIntentExample

@## Select text on focus

Enable `selectAllOnFocus` to automatically select all text when the input is focused.

@reactCodeExample EditableTextSelectExample

@## Interactive Playground

@reactExample EditableTextPlaygroundExample

@## Props interface

@interface EditableTextProps
