@# MultiSelect

Use `MultiSelect<T>` for choosing multiple items in a list. The component renders a [`TagInput`](#core/components/tag-input) wrapped in a `Popover`. Similarly to [`Select`](#select/select-component), you can pass in a predicate to customize the filtering algorithm.

Selection state of a `MultiSelect<T>` is controlled with the `selectedItems` prop. React to user interactions with `onItemSelect` and `onRemove`.

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">
    <h4 class="@ns-heading">Generic components and custom filtering</h4>

For more information on controlled usage, generic components, creating new items, and custom filtering, visit the documentation for [`Select<T>`](#select/select-component).
</div>

@reactExample MultiSelectExample

@interface IMultiSelectProps

@interface ISelectItemRendererProps
