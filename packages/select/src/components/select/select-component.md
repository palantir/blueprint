@# Select

<div class="@ns-callout @ns-intent-danger @ns-icon-error">
    <h5 class="@ns-heading">

Deprecated: use [Select2](#select/select2)

</h5>

This component is **deprecated since @blueprintjs/select v4.3.0** in favor of the new
Select2 component, which uses Popover2 instead of Popover under the hood.
You should migrate to the new API which will become the standard in Blueprint v5.

</div>

The Select component renders a UI to choose one item from a list. Its children are wrapped in a
[Popover](#core/components/popover) that contains the list and an optional
[InputGroup](#core/components/text-inputs.input-group) to filter it.
You may provide a predicate to customize the filtering algorithm. The value of a Select
(the currently chosen item) is uncontrolled: listen to changes with the `onItemSelect` callback prop.

The API for this component is nearly identical to that of Select2, except for a slight change in
`popoverProps` and the wrapper element(s) rendered around its children. Please refer to the
[Select2](#select/select2) documentation for full API details.

@## Props interface

@interface ISelectProps
