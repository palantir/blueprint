@# MultiSelect

__MultiSelect__ renders a UI to choose multiple items from a list. It renders a
[__TagInput__](#core/components/tag-input) wrapped in a [__Popover__](#core/components/popover).
Just like with [__Select__](#select/select), you can pass in a predicate to customize the filtering algorithm.

The selection state of a __MultiSelect__ is controlled with the `selectedItems` prop.
You may react to user interactions with the `onItemSelect` and `onRemove` callback props.

@reactExample MultiSelectExample

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">Generic components and custom filtering</h5>

For more information on controlled usage, generic components, creating new items, and custom filtering,
please visit the documentation for [__Select__](#select/select).

</div>

@## Props interface

@interface MultiSelectProps
