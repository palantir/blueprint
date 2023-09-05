@# Tag input

__TagInput__ displays [__Tag__](#core/components/tag) elements inside an input, followed by an interactive text input.
The container is styled to look like a Blueprint input; the actual editable element appears after the last tag.
Clicking anywhere on the container will focus the text input.

@reactExample TagInputExample

<div class="@ns-callout @ns-intent-success @ns-icon-info-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">Looking for a dropdown menu?</h5>

[The __MultiSelect__ component in the **@blueprintjs/select** package](#select/multi-select)
composes this component with a dropdown menu.

</div>

@## Usage

__TagInput__ must be controlled, which means the `values` prop is required and event handlers are strongly suggested.
Typing in the input and pressing <kbd>Enter</kbd> will **add new items** by invoking callbacks. If `addOnBlur` is
set to `true`, clicking outside of the component will also trigger the callback to add new items. A `separator` prop is
supported to allow multiple items to be added at once; the default splits on commas and newlines.

__Tags__ may be removed by clicking their <span class="@ns-icon-standard @ns-icon-cross"></span> buttons or by pressing
either <kbd>backspace</kbd> or <kbd>delete</kbd> repeatedly. Pressing <kbd>delete</kbd> mimics the behavior of deleting
in a text editor, where trying to delete at the end of the line will do nothing. Arrow keys can also be used to focus
on a particular tag before removing it. The cursor must be at the beginning of the text input for these interactions.

__Tag__ appearance can be customized with `tagProps`: supply an object to apply the same props to every tag, or supply
a callback to apply dynamic props per tag. Tag `values` must be an array of strings so you may need a transformation
step between your state and these props.

__TagInput__ provides granular `onAdd` and `onRemove` **event props** which are passed the added or removed items in
response to the user interactions above. It also provides `onChange`, which combines both events and is passed the
updated `values` array, with new items appended to the end and removed items filtered away.

The `<input>` element can be controlled directly via the `inputValue` and `onInputChange` props. Additional properties
(such as custom event handlers) can be forwarded to the input via `inputProps`.

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">Handling long words</h5>

Set an explicit `width` on the container element to cause long tags to wrap onto multiple lines.
Either supply a specific pixel value, or use `<TagInput className={Classes.FILL}>`
to fill its container's width (try this in the example above).

</div>

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">Disabling a tag input</h5>

Disabling this component requires setting the `disabled` prop to `true`
and separately disabling the component's `rightElement` as appropriate
(because `TagInput` accepts any `JSX.Element` as its `rightElement`).

</div>

@## Props interface

@interface TagInputProps
