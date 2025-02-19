@# MultiSelect

**MultiSelect** renders a UI to choose multiple items from a list. It renders a
[**TagInput**](#core/components/tag-input), or `customTarget` if defined, wrapped in a [**Popover**](#core/components/popover).
Just like with [**Select**](#select/select), you can pass in a predicate to customize the filtering algorithm.

The selection state of a **MultiSelect** is controlled with the `selectedItems` prop.
You may react to user interactions with the `onItemSelect` and `onRemove` callback props.

@reactExample MultiSelectExample

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">Generic components and custom filtering</h5>

For more information on controlled usage, generic components, creating new items, and custom filtering,
please visit the documentation for [**Select**](#select/select-component).

</div>

@## Props interface

@interface MultiSelectProps
