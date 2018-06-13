@# MultiSelect

Use `MultiSelect<T>` for choosing multiple items in a list. The component
renders a [`TagInput`](#core/components/tag-input) wrapped in a `Popover`.
Similarly to [`Select`](#select/select-component), you can pass in a predicate to
customize the filtering algorithm. Selection of a `MultiSelect<T>` is
controlled: listen to changes with `onItemSelect`.

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">
    [Read the `Select` documentation](#select/select-component) for more advanced usage documentation.
</div>

@reactExample MultiSelectExample

@interface IMultiSelectProps
