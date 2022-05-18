@# Suggest

<div class="@ns-callout @ns-intent-danger @ns-icon-error">
    <h4 class="@ns-heading">

Deprecated: use [Suggest2](#select/suggest2)

</h4>

This component is **deprecated since @blueprintjs/select v4.3.0** in favor of the new
Suggest2 component, which uses Popover2 instead of Popover under the hood.
You should migrate to the new API which will become the standard in Blueprint v5.

</div>

`Suggest` behaves similarly to [`Select`](#select/select-component), except it
renders a text input as the `Popover` target instead of arbitrary children. This
text [`InputGroup`](#core/components/text-inputs.input-group) can be customized
using `inputProps`.

Refer to the Suggest2 documentation for an interactive component demo.

@## Props interface

@interface ISuggestProps

@interface ISelectItemRendererProps
