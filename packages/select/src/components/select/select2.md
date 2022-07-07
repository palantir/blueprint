---
tag: new
---

@# Select2

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">
    <h4 class="@ns-heading">

Migrating from [Select](#select/select-component)?

</h4>

Select2 is a replacement for Select and will replace it in Blueprint core v5.
You are encouraged to use this new API now to ease the transition to the next major version of Blueprint.
See the [migration guide](https://github.com/palantir/blueprint/wiki/select-component-migration)
on the wiki.

</div>

The Select2 component renders a UI to choose one item from a list. Its children are wrapped in a
[Popover2](#popover2-package/popover2) that contains the list and an optional
[InputGroup](#core/components/text-inputs.input-group) to filter it.
You may provide a predicate to customize the filtering algorithm. The value of a Select2
(the currently chosen item) is uncontrolled: listen to changes with the `onItemSelect` callback prop.

@reactExample SelectExample

```tsx
import { Button, MenuItem } from "@blueprintjs/core";
import { Select2 } from "@blueprintjs/select";
import * as Films from "./films";

// Select2<T> is a generic component to work with your data types.
// In TypeScript, you must first obtain a non-generic reference:
const FilmSelect = Select2.ofType<Films.Film>();

ReactDOM.render(
    <FilmSelect
        items={Films.items}
        itemPredicate={Films.itemPredicate}
        itemRenderer={Films.itemRenderer}
        noResults={<MenuItem disabled={true} text="No results."  roleStructure="listoption" />}
        onItemSelect={...}
    >
        {/* children become the popover target; render value here */}
        <Button text={Films.items[0].title} rightIcon="double-caret-vertical" />
    </FilmSelect>,
    document.querySelector("#root")
);
```

In TypeScript, `Select2<T>` is a _generic component_ so you must define a local type that specifies `<T>`, the type of one item in `items`. The props on this local type will now operate on your data type (speak your language) so you can easily define handlers without transformation steps, but most props are required as a result. The static `Select2.ofType<T>()` method is available to streamline this process. (Note that this has no effect on JavaScript usage: the `Select2` export is a perfectly valid React component class.)

@## Querying

Supply a predicate to automatically query items based on the `InputGroup` value. Use `itemPredicate` to filter each item individually; this is great for lightweight searches. Use `itemListPredicate` to query the entire array in one go, and even reorder it, such as with [fuzz-aldrin-plus](https://github.com/jeancroy/fuzz-aldrin-plus). The array of filtered items is cached internally by `QueryList` state and only recomputed when `query` or `items`-related props change.

Omitting both `itemPredicate` and `itemListPredicate` props will cause the component to always render all `items`. It will not hide the `InputGroup`; use the `filterable` prop for that. In this case, you can implement your own filtering and simply change the `items` prop.

The **@blueprintjs/select** package exports `ItemPredicate<T>` and `ItemListPredicate<T>` type aliases to simplify the process of implementing these functions.
See the code sample in [Item Renderer API](#select/select2.item-renderer) below for usage.

@### Non-ideal states

If the query returns no results or `items` is empty, then `noResults` will be rendered in place of the usual list. You also have the option to provide `initialContent`, which will render in place of the item list if the query is empty.

@## Disabling

Since Select2 accepts arbitrary children, disabling a Select2 componet requires setting `disabled={true}`
_and also_ disabling its children. For example:

```tsx
const FilmSelect = Select2.ofType<Films.Film>();

// many props omitted here for brevity
return (
    <FilmSelect disabled={true}>
        <Button disabled={true}>
    </FilmSelect>
);
```

@## Custom menu

By default, `Select2` renders the displayed items in a [`Menu`](#core/components/menu). This behavior can be overridden by providing the `itemListRenderer` prop, giving you full control over the layout of the items. For example, you can group items under a common heading, or render large data sets using [react-virtualized](https://github.com/bvaughn/react-virtualized).

Note that the non-ideal states of `noResults` and `initialContent` are specific to the default renderer. If you provide the `itemListRenderer` prop, these props will be ignored.

See the code sample in [Item List Renderer API](#select/select2.item-list-renderer) below for usage.

@## Controlled usage

The input value can be controlled with the `query` and `onQueryChange` props. _Do not use `inputProps` for this;_ the component ignores `inputProps.value` and `inputProps.onChange` in favor of `query` and `onQueryChange` (as noted in the prop documentation).

The focused item (for keyboard interactions) can be controlled with the `activeItem` and `onActiveItemChange` props.

```tsx
<FilmSelect
    items={myFilter(ALL_ITEMS, this.state.myQuery)}
    itemRenderer={...}
    onItemSelect={...}
    // controlled active item
    activeItem={this.state.myActiveItem}
    onActiveItemChange={this.handleActiveItemChange}
    // controlled query
    query={this.state.myQuery}
    onQueryChange={this.handleQueryChange}
/>
```

This controlled usage allows you to implement all sorts of advanced behavior on
top of the basic `Select2` interactions, such as windowed filtering for large
data sets.

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">

To control the active item when a "Create Item" option is present, See [Controlling the active item](#select/select2.controlling-the-active-item) in the "Creating new items" section below.
</div>

@## Creating new items

If you wish, you can allow users to select a brand new item that doesn't appear
in the list, based on the current query string. Use `createNewItemFromQuery` and
`createNewItemRenderer` to enable this:
- `createNewItemFromQuery`: Specifies how to convert a user-entered query string
    into an item of type `<T>` that `Select2` understands.
- `createNewItemRenderer`: Renders a custom "Create Item" element that will be
    shown at the bottom of the list. When selected via click or `Enter`, this element
    will invoke `onItemSelect` with the item returned from `createNewItemFromQuery`.

<div class="@ns-callout @ns-intent-warning @ns-icon-info-sign">
    <h4 class="@ns-heading">Avoiding type conflicts</h4>

The "Create Item" option is represented by the reserved type `ICreateNewItem`
exported from this package. It is exceedingly unlikely but technically possible
for your custom type `<T>` to conflict with this type. If your type conflicts,
you may see unexpected behavior; to resolve, consider changing the schema for
your items.

</div>

```tsx
function createFilm(title: string): IFilm {
    return {
        rank: /* ... */,
        title,
        year: /* ... */,
    };
}

function renderCreateFilmOption(
    query: string,
    active: boolean,
    handleClick: React.MouseEventHandler<HTMLElement>,
) {
    return (
        <MenuItem
            icon="add"
            text={`Create "${query}"`}
            roleStructure="listoption"
            selected={active}
            onClick={handleClick}
            shouldDismissPopover={false}
        />
    )
}

ReactDOM.render(
    <FilmSelect
        createNewItemFromQuery={createFilm}
        createNewItemRenderer={renderCreateFilmOption}
        items={Films.items}
        itemPredicate={Films.itemPredicate}
        itemRenderer={Films.itemRenderer}
        noResults={<MenuItem disabled={true} text="No results."  roleStructure="listoption" />}
        onItemSelect={...}
    />,
    document.querySelector("#root")
);
```

@### Controlling the active item

Controlling the active item is slightly more involved when the "Create Item"
option is present. At a high level, the process works the same way as before:
control the `activeItem` value and listen for updates via `onActiveItemChange`.
However, some special handling is required.

When the "Create Item" option is present, the callback will emit
`activeItem=null` and `isCreateNewItem=true`:

```tsx
onActiveItemChange(null, true);
```

You can then make the "Create Item" option active by passing the result of
`getCreateNewItem()` to the `activeItem` prop (the `getCreateNewItem` function
is exported from this package):

```tsx
activeItem={isCreateNewItemActive ? getCreateNewItem() : activeItem}
```

Altogether, the code might look something like this:

```tsx
const currentActiveItem: Film | ICreateNewItem | null;
const isCreateNewItemActive: Film | ICreateNewItem | null;

function handleActiveItemChange(
    activeItem: Film | ICreateNewItem | null,
    isCreateNewItem: boolean,
) {
    currentActiveItem = activeItem;
    isCreateNewItemActive = isCreateNewItem;
}

function getActiveItem() {
    return isCreateNewItemActive ? getCreateNewItem() : currentActiveItem;
}

ReactDOM.render(
    <FilmSelect
        {...} // Other required props (see previous examples).
        activeItem={getActiveItem()}
        createNewItemFromQuery={...}
        createNewItemRenderer={...}
        onActiveItemChange={handleActiveItemChange}
    />,
    document.querySelector("#root")
);
```

@## Props interface

@interface Select2Props

@### Item renderer

`Select2`'s `itemRenderer` will be called for each item and receives the item and a props object containing data specific
to rendering this item in this frame. The renderer is called for all items, so don't forget to respect
`modifiers.matchesPredicate` to hide items that don't match the predicate. Also, don't forget to define a `key` for each item, or face React's console wrath!

```tsx
import { Classes, MenuItem } from "@blueprintjs/core";
import { ItemRenderer, ItemPredicate, Select2 } from "@blueprintjs/select";

const FilmSelect = Select2.ofType<Film>();

const filterFilm: ItemPredicate<IFilm> = (query, film) => {
    return film.title.toLowerCase().indexOf(query.toLowerCase()) >= 0;
};

const renderFilm: ItemRenderer<Film> = (film, { handleClick, handleFocus, modifiers }) => {
    if (!modifiers.matchesPredicate) {
        return null;
    }
    return (
        <MenuItem
            text={film.title}
            label={film.year}
            roleStructure="listoption"
            selected={modifiers.active}
            key={film.title}
            onClick={handleClick}
            onFocus={handleFocus}
        />
    );
};

<FilmSelect itemPredicate={filterFilm} itemRenderer={renderFilm} items={...} onItemSelect={...} />
```

@interface IItemRendererProps

@### Item list renderer

If provided, the `itemListRenderer` prop will be called to render the contents of the dropdown menu. It has access to the items, the current query, and a `renderItem` callback for rendering a single item. A ref handler (`itemsParentRef`) is given as well; it should be attached to the parent element of the rendered menu items so that the currently selected item can be scrolled into view automatically.

```tsx
import { ItemListRenderer } from "@blueprintjs/select";

const renderMenu: ItemListRenderer<Film> = ({ items, itemsParentRef, query, renderItem, menuProps }) => {
    const renderedItems = items.map(renderItem).filter(item => item != null);
    return (
        <Menu role="listbox" ulRef={itemsParentRef} {...menuProps}>
            <MenuItem
                disabled={true}
                text={`Found ${renderedItems.length} items matching "${query}"`}
                roleStructure="listoption"
            />
            {renderedItems}
        </Menu>
    );
};

<FilmSelect
    itemListRenderer={renderMenu}
    itemPredicate={filterFilm}
    itemRenderer={renderFilm}
    items={...}
    onItemSelect={...}
/>
```

@interface IItemListRendererProps
