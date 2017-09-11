@# MultiSelect

Use `MultiSelect<T>` for choosing multiple items in a list. The component renders a `TagInput` wrapped in a `Popover`. Similarly to `Select`, you can pass in a predicate to customize the filtering algorithm. Selection of a `MultiSelect<T>` is controlled: listen to changes with `onItemSelect`.

<div class="pt-callout pt-intent-primary pt-icon-info-sign">
    <h5>Generic components and custom filtering</h5>
    For more information on controlled usage, generic components and custom filtering, visit the documentation for [`Select<T>`](#labs.select).
</div>

@reactExample MultiSelectExample

@interface IMultiSelectProps

@interface ISelectItemRendererProps
