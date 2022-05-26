@# MultiSelect

<div class="@ns-callout @ns-intent-danger @ns-icon-error">
    <h4 class="@ns-heading">

Deprecated: use [MultiSelect2](#select/multi-select2)

</h4>

This component is **deprecated since @blueprintjs/select v4.3.0** in favor of the new
MultiSelect2 component, which uses Popover2 instead of Popover under the hood.
You should migrate to the new API which will become the standard in Blueprint v5.

</div>

Use `MultiSelect<T>` for choosing multiple items in a list. The component renders a [`TagInput`](#core/components/tag-input) wrapped in a `Popover`. Similarly to [`Select`](#select/select-component), you can pass in a predicate to customize the filtering algorithm.

Selection state of a `MultiSelect<T>` is controlled with the `selectedItems` prop. React to user interactions with `onItemSelect` and `onRemove`.

The API for this component is nearly identical to that of MultiSelect2, except for a slight change in
`popoverProps` and the wrapper element(s) rendered around its children.
Refer to the [MultiSelect2 documentation](#select/multi-select2) for full API details.

@## Props interface

@interface IMultiSelectProps
