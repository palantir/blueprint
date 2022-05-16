@# Select

<div class="@ns-callout @ns-intent-danger @ns-icon-error">
    <h4 class="@ns-heading">

Deprecated: use [Select2](#select/select2)

</h4>

This component is **deprecated since @blueprintjs/select v4.3.0** in favor of the new
Select2 component, which uses Popover2 instead of Popover under the hood.
You should migrate to the new API which will become the standard in Blueprint v5.

</div>

The `Select<T>` component renders a UI to choose one item from a list. Its children are wrapped in a
[`Popover`](#core/components/popover) that contains the list and an optional `InputGroup` to filter it.
You may provide a predicate to customize the filtering algorithm. The value of a `Select<T>`
(the currently chosen item) is uncontrolled: listen to changes with `onItemSelect`.

The API for this component is nearly identical to that of Select2, except for a slight change in
`popoverProps` and the wrapper element(s) rendered around its children.
Refer to the [Select2 documentation](#select/select2) for full API details.

@## JavaScript API

@interface ISelectProps
