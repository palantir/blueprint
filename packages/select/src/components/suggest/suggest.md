@# Suggest

<div class="@ns-callout @ns-intent-danger @ns-icon-error">
    <h5 class="@ns-heading">

Deprecated: use [Suggest2](#select/suggest2)

</h5>

This component is **deprecated since @blueprintjs/select v4.3.0** in favor of the new
Suggest2 component, which uses Popover2 instead of Popover under the hood.
You should migrate to the new API which will become the standard in Blueprint v5.

</div>

Suggest behaves similarly to [Select](#select/select-component), except it
renders a text input as the [Popover](#core/components/popover) target instead of arbitrary children.
This text [InputGroup](#core/components/text-inputs.input-group) can be customized
using the `inputProps` prop.

The API for this component is nearly identical to that of Suggest2, except for a slight change in
`popoverProps` and the wrapper element(s) rendered around its InputGroup. Please refer to the
[Suggest2](#select/suggest2) documentation for an interactive component demo.

@## Props interface

@interface ISuggestProps
