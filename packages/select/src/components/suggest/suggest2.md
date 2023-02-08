---
tag: new
---

@# Suggest2

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">
    <h5 class="@ns-heading">

Migrating from [Suggest](#select/suggest)?

</h5>

Suggest2 is a replacement for Suggest and will replace it in Blueprint core v5.
You are encouraged to use this new API now to ease the transition to the next major version of Blueprint.
See the [migration guide](https://github.com/palantir/blueprint/wiki/select-component-migration)
on the wiki.

</div>

Suggest2 behaves similarly to [Select2](#select/select2), except it
renders a text input as the [Popover2](#popover2-package/popover2) target instead of arbitrary children.
This text [InputGroup](#core/components/text-inputs.input-group) can be customized using the `inputProps` prop.

@reactExample SuggestExample

@## Props interface

@interface Suggest2Props
