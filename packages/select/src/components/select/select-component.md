@# Select

The **Select** component presents the user with a list of items from which to choose. Its children are wrapped in a
[**Popover**](#core/components/popover) that contains the list and an optional
[**InputGroup**](#core/components/input-group) to filter it.

@## Import

```tsx
import { Select } from "@blueprintjs/select";
```

@## Usage

The `items` prop defines an array of items from which the user can select. When an item is selected, the handler defined
by the `onItemSelect` prop is called with the selected item.

The `itemRenderer` prop defines a function that accepts an item and returns how that item should be rendered. Usually,
items will be rendered with a **MenuItem** component. The renderer function will be provided with a `ref` that should be
forwarded to the rendered element, as well as a `handleClick` handler that should be invoked when an item is selected.
Each rendered element should also have a `key` to satisfy React's list-rendering expectations.

@reactCodeExample SelectBasicExample

@## Filtering

By default, **Select** components are filterable, meaning they show an **InputGroup** that users can type into to filter
the dropdown list.

To suppport filtering in a **Select** component, use the `itemPredicate` prop to define a function that accepts the
query and an item and returns a `boolean` indicating whether the item matches the query. Then, in the `itemRenderer`
function, check for the `modifiers.matchesPredicate` value to stop rendering items that don't match the query.

If the query returns no results (or if `items` is empty), then the value of the `noResults` prop will be rendered in
place of the usual list. You also have the option to provide `initialContent`, which will render in place of the item
list if the query is empty.

@reactCodeExample SelectFilteringExample

@### Custom filtering

When filtering items in a **Select** component, use `itemPredicate` to filter each item individually; this is great for
lightweight searches. Use `itemListPredicate` to query the entire array at once and even reorder it, such as with
[fuzz-aldrin-plus](https://github.com/jeancroy/fuzz-aldrin-plus). The array of filtered items is cached internally
and is only recomputed when the `query` or `items`-related props change.

Omitting both `itemPredicate` and `itemListPredicate` props will cause the component to always render all `items`. It
will not hide the **InputGroup**; use the `filterable` prop for that. In this case, you can implement your own filtering
and change the `items` prop.

The **@blueprintjs/select** package exports `ItemPredicate<T>` and `ItemListPredicate<T>` type aliases to simplify the
process of implementing these functions. 

@## Custom item types

**Select** is a _generic component_ (defined in TypeScript as `Select<T>`), meaning you can define any type that
specifies `T`, the type of one item in `items`. For filtering items and rendering items, the `itemPredicate` and
`itemRenderer` props must also be defined to work with the item type `T`.

@reactCodeExample SelectCustomItemTypeExample

@## Styling

@### Button styling

**Select** accepts arbitrary child elements, but in most cases this will be a single **Button** component. To make this
button appear like a typical dropdown, apply some common button props such `alignText` and `endIcon`:

@reactCodeExample SelectButtonStylingExample

@### Placeholder styling

When a **Select** has no selected item, you may wish to display placeholder text. Use the **Button** component's
`textClassName` prop to accomplish this:

@reactCodeExample SelectPlaceholderStylingExample

@### Disabled styling

Disabling a **Select** requires setting the `disabled={true}` prop _and also_ disabling its children. For example:

@reactCodeExample SelectDisabledStylingExample

@## Custom menu

By default, **Select** renders the displayed items in a [**Menu**](#core/components/menu). This behavior can be
overridden by providing the `itemListRenderer` prop, giving you full control over the layout of the items. For example,
you can group items under a common heading, or render large data sets using
[react-virtualized](https://github.com/bvaughn/react-virtualized).

Note that the non-ideal states of `noResults` and `initialContent` are specific to the default renderer. If you provide
the `itemListRenderer` prop, these props will be ignored.

@reactCodeExample SelectCustomMenuExample

@## Controlled usage

The input value can be controlled with the `query` and `onQueryChange` props. _Do not use `inputProps` for this;_
the component ignores `inputProps.value` and `inputProps.onChange` in favor of `query` and `onQueryChange`
(as noted in the prop documentation).

The focused item (for keyboard interactions) can be controlled with the `activeItem` and `onActiveItemChange` props.

```tsx
<Select
    // Controlled active item
    activeItem={activeItem}
    onActiveItemChange={handleActiveItemChange}

    // Controlled query
    query={query}
    onQueryChange={handleQueryChange}

    {...props}
/>
```

This controlled usage allows you to implement all sorts of advanced behavior on top of the basic **Select**
interactions, such as windowed filtering for large data sets.

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">

To control the active item when a "Create Item" option is present, See
[Controlling the active item](#select/select-component.controlling-the-active-item) in the "Creating new items"
section below.

</div>

@## Creating new items

If you wish, you can allow users to select a brand new item that doesn't appear in the list, based on the current query
string. Use `createNewItemFromQuery` and `createNewItemRenderer` to enable this:

-   `createNewItemFromQuery`: Specifies how to convert a user-entered query string into an item of type `<T>` that
    **Select** understands.
-   `createNewItemRenderer`: Renders a custom "Create Item" element that will be shown at the bottom of the list. When
    selected via click or `Enter`, this element will invoke `onItemSelect` with the item returned from
    `createNewItemFromQuery`.

<div class="@ns-callout @ns-intent-warning @ns-icon-info-sign">
    <h5 class="@ns-heading">Avoiding type conflicts</h5>

The "Create Item" option is represented by the reserved type `CreateNewItem` exported from this package. It is
exceedingly unlikely but technically possible for your custom type `<T>` to conflict with this type. If your type
conflicts, you may see unexpected behavior; to resolve, consider changing the schema for your items.

</div>

@reactCodeExample SelectCreateNewItemsExample

@### Controlling the active item

Controlling the active item is slightly more involved when the "Create Item" option is present. At a high level, the
process works the same way as before: control the `activeItem` value and listen for updates via `onActiveItemChange`.
However, some special handling is required.

When the "Create Item" option is present, the callback will emit `activeItem=null` and `isCreateNewItem=true`:

```tsx
onActiveItemChange(null, true);
```

You can then make the "Create Item" option active by passing the result of `getCreateNewItem()` to the `activeItem`
prop (the `getCreateNewItem` function is exported from this package):

```tsx
activeItem={isCreateNewItemActive ? getCreateNewItem() : activeItem}
```

Altogether, the code might look something like this:

```tsx
const currentActiveItem: Film | CreateNewItem | null;
const isCreateNewItemActive: Film | CreateNewItem | null;

function handleActiveItemChange(
    activeItem: Film | CreateNewItem | null,
    isCreateNewItem: boolean,
) {
    currentActiveItem = activeItem;
    isCreateNewItemActive = isCreateNewItem;
}

function getActiveItem() {
    return isCreateNewItemActive ? getCreateNewItem() : currentActiveItem;
}

const FilmSelect: React.FC = () => (
    <Select<Film>
        {...} // Other required props (see previous examples).
        activeItem={getActiveItem()}
        createNewItemFromQuery={...}
        createNewItemRenderer={...}
        onActiveItemChange={handleActiveItemChange}
    />
);
```

@## Interactive Playground

@reactExample SelectExample

@## Props interface

@interface SelectProps

@### ItemRenderer API

@interface ItemRendererProps

@### ItemListRenderer API

@interface ItemListRendererProps