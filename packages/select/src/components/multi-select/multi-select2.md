---
tag: new
---

@# MultiSelect2

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">
    <h5 class="@ns-heading">

Migrating from [MultiSelect](#select/multi-select)?

</h5>

MultiSelect2 is a replacement for MultiSelect and will replace it in Blueprint core v5.
You are encouraged to use this new API now to ease the transition to the next major version of Blueprint.
See the [migration guide](https://github.com/palantir/blueprint/wiki/select-component-migration)
on the wiki.

</div>

MultiSelect2 renders a UI to choose multiple items from a list. It renders a
[TagInput](#core/components/tag-input) wrapped in a [Popover2](#popover2-package/popover2).
Just like with [Select2](#select/select2), you can pass in a predicate to customize the filtering algorithm.

The selection state of a MultiSelect2 is controlled with the `selectedItems` prop.
You may react to user interactions with the `onItemSelect` and `onRemove` callback props.

@reactExample MultiSelectExample

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">
    <h5 class="@ns-heading">Generic components and custom filtering</h5>

For more information on controlled usage, generic components, creating new items, and custom filtering,
please visit the documentation for [Select2](#select/select2).
</div>

@## Props interface

@interface MultiSelect2Props
