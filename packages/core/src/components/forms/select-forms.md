@# Selects

Styling HTML `<select>` tags requires a wrapper element to customize the dropdown caret.
Put class modifiers on the wrapper and attribute modifiers directly on the `<select>`.

<div class="@ns-callout @ns-intent-success @ns-icon-info-sign">
    The [`Select`](#select/multi-select) component in the [**@blueprintjs/select**](#select) package provides a
    React [dropdown menu](#core/components/menu.dropdown-menus) instead of using the native HTML `<select>`
    tag. It supports filtering and custom item rendering.
</div>

@css select

@## Labeled static dropdown

You can label `<select>` tags, similar to how you label any other form control.

@css select-inline
