@# Tag inputs

Tag inputs render [`Tag`](#core/components/tag)s inside an input, followed by an actual text input. The container is merely styled to look like a Blueprint input; the actual editable element appears after the last tag. Clicking anywhere on the container will focus the text input for seamless interaction.

<div class="pt-callout pt-intent-primary pt-icon-info-sign">
    <h4>Disabling a tag input</h4>
    <p>Disabling this component requires setting the `disabled` prop to `true` and separately disabling the component's `rightElement` as appropriate (because `TagInput` accepts any `JSX.Element` as its `rightElement`).</p>
    <p>In the example below, when you slide the `Disabled` toggle switch on, the result becomes `<TagInput ... disabled={true} rightElement={<Button ... disabled={true} />} />`</p>
</div>

@reactExample TagInputExample

**`TagInput` must be controlled,** meaning the `values` prop is required and event handlers are strongly suggested. Typing in the input and pressing <kbd class="pt-key">enter</kbd> will **add new items** by invoking callbacks. A `separator` prop is supported to allow multiple items to be added at once; the default splits on commas.

**Tags can be removed** by clicking their <span class="pt-icon-standard pt-icon-cross"></span> buttons, or by pressing <kbd class="pt-key">backspace</kbd> repeatedly. Arrow keys can also be used to focus on a particular tag before removing it. The cursor must be at the beginning of the text input for these interactions.

**`Tag` appearance can be customized** with `tagProps`: supply an object to apply the same props to every tag, or supply a callback to apply dynamic props per tag. Tag `values` must be an array of strings so you may need a transformation step between your state and these props.

`TagInput` provides granular `onAdd` and `onRemove` **event props**, which are passed the added or removed items in response to the user interactions above. It also provides `onChange`, which combines both events and is passed the updated `values` array, with new items appended to the end and removed items filtered away.

The `<input>` element can be controlled directly via the `inputValue` and `onInputChange` props. Additional properties (such as custom event handlers) can be applied to the input via `inputProps`.

<div class="pt-callout pt-intent-primary pt-icon-info-sign">
    <h4>Handling long words</h4>
    Set an explicit `width` on `.pt-tag-input` to cause long words to wrap onto multiple lines. Either supply a specific pixel value, or use `<TagInput className="pt-fill">` to fill its container's width (try this in the example above).
</div>

@interface ITagInputProps
