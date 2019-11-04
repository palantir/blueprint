@# Tag input

Tag inputs render [`Tag`](#core/components/tag)s inside an input, followed by an
actual text input. The container is merely styled to look like a Blueprint
input; the actual editable element appears after the last tag. Clicking anywhere
on the container will focus the text input for seamless interaction.

@reactExample TagInputExample

<div class="@ns-callout @ns-intent-success @ns-icon-info-sign">
    <h4 class="@ns-heading">Looking for a dropdown menu?</h4>

[`MultiSelect` in the **@blueprintjs/select** package](#select/multi-select)
composes this component with a dropdown menu of suggestions.

</div>

@## Props

**`TagInput` must be controlled,** meaning the `values` prop is required and
event handlers are strongly suggested. Typing in the input and pressing
<kbd>enter</kbd> will **add new items** by invoking callbacks. If `addOnBlur` is
set to true, clicking out of the component will also trigger the callback to add
new items. A `separator` prop is supported to allow multiple items to be added
at once; the default splits on commas and newlines.

**Tags can be removed** by clicking their <span class="@ns-icon-standard @ns-icon-cross"></span>
buttons, or by pressing <kbd>backspace</kbd> repeatedly.
Arrow keys can also be used to focus on a particular tag before removing it. The
cursor must be at the beginning of the text input for these interactions.

**`Tag` appearance can be customized** with `tagProps`: supply an object to
apply the same props to every tag, or supply a callback to apply dynamic props
per tag. Tag `values` must be an array of strings so you may need a
transformation step between your state and these props.

`TagInput` provides granular `onAdd` and `onRemove` **event props**, which are
passed the added or removed items in response to the user interactions above. It
also provides `onChange`, which combines both events and is passed the updated
`values` array, with new items appended to the end and removed items filtered
away.

The `<input>` element can be controlled directly via the `inputValue` and
`onInputChange` props. Additional properties (such as custom event handlers) can
be applied to the input via `inputProps`.

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">
    <h4 class="@ns-heading">Handling long words</h4>

Set an explicit `width` on the container element to cause long tags to wrap onto multiple lines.
Either supply a specific pixel value, or use `<TagInput className={Classes.FILL}>`
to fill its container's width (try this in the example above).

</div>

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">
    <h4 class="@ns-heading">Disabling a tag input</h4>

Disabling this component requires setting the `disabled` prop to `true`
and separately disabling the component's `rightElement` as appropriate
(because `TagInput` accepts any `JSX.Element` as its `rightElement`).

</div>

@interface ITagInputProps
