@# MultiSelect

<div class="@ns-callout @ns-intent-danger @ns-icon-error">
    <h5 class="@ns-heading">

Deprecated: use [MultiSelect2](#select/multi-select2)

</h5>

This component is **deprecated since @blueprintjs/select v4.3.0** in favor of the new
MultiSelect2 component, which uses Popover2 instead of Popover under the hood.
You should migrate to the new API which will become the standard in Blueprint v5.

</div>

MultiSelect renders a UI to choose multiple items from a list. It renders a
[TagInput](#core/components/tag-input) wrapped in a [Popover](#core/components/popover).

The selection state of a MultiSelect is controlled with the `selectedItems` prop.
You may react to user interactions with the `onItemSelect` and `onRemove` callback props.

The API for this component is nearly identical to that of MultiSelect2, except for a slight change in
`popoverProps` and the wrapper element(s) rendered around its children. Please refer to the
[MultiSelect2](#select/multi-select2) documentation for full API details.

@## Props interface

@interface IMultiSelectProps
