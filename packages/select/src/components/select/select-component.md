@# Select

The **Select** component renders a UI to choose one item from a list. Its children are wrapped in a
[**Popover**](#core/components/popover) that contains the list and an optional
[**InputGroup**](#core/components/input-group) to filter it.
You may provide a predicate to customize the filtering algorithm. The value of a **Select**
(the currently chosen item) is uncontrolled: listen to changes with the `onItemSelect` callback prop.

@reactExample SelectExample

@## Usage

In TypeScript, `Select<T>` is a _generic component_ so you must define a local type that specifies `<T>`, the type of
one item in `items`. The props on this local type will now operate on your data type so you can easily define handlers
without transformation steps, but most props are required as a result.

```tsx
import { Button, MenuItem } from "@blueprintjs/core";
import { ItemPredicate, ItemRenderer, Select } from "@blueprintjs/select";
import * as React from "react";
import * as ReactDOM from "react-dom/client";

export interface Film {
    title: string;
    year: number;
    rank: number;
}

const TOP_100_FILMS: Film[] = [
    { title: "The Shawshank Redemption", year: 1994 },
    { title: "The Godfather", year: 1972 },
    // ...
].map((f, index) => ({ ...f, rank: index + 1 }));

const filterFilm: ItemPredicate<Film> = (query, film, _index, exactMatch) => {
    const normalizedTitle = film.title.toLowerCase();
    const normalizedQuery = query.toLowerCase();

    if (exactMatch) {
        return normalizedTitle === normalizedQuery;
    } else {
        return `${film.rank}. ${normalizedTitle} ${film.year}`.indexOf(normalizedQuery) >= 0;
    }
};

const renderFilm: ItemRenderer<Film> = (film, { handleClick, handleFocus, modifiers, query }) => {
    if (!modifiers.matchesPredicate) {
        return null;
    }
    return (
        <MenuItem
            active={modifiers.active}
            disabled={modifiers.disabled}
            key={film.rank}
            label={film.year.toString()}
            onClick={handleClick}
            onFocus={handleFocus}
            roleStructure="listoption"
            text={`${film.rank}. ${film.title}`}
        />
    );
};

const FilmSelect: React.FC = () => {
    const [selectedFilm, setSelectedFilm] = React.useState<Film | undefined>();
    return (
        <Select<Film>
            items={TOP_100_FILMS}
            itemPredicate={filterFilm}
            itemRenderer={renderFilm}
            noResults={<MenuItem disabled={true} text="No results." roleStructure="listoption" />}
            onItemSelect={setSelectedFilm}
        >
            <Button text={selectedFilm?.title ?? "Select a film"} rightIcon="double-caret-vertical" />
        </Select>
    );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<FilmSelect />);
```

@## Props interface

@interface SelectProps

@## Querying

Supply a predicate to automatically query items based on the **InputGroup** value. Use `itemPredicate` to filter each item
individually; this is great for lightweight searches. Use `itemListPredicate` to query the entire array in one go, and
even reorder it, such as with [fuzz-aldrin-plus](https://github.com/jeancroy/fuzz-aldrin-plus). The array of filtered
items is cached internally by `QueryList` state and only recomputed when `query` or `items`-related props change.

Omitting both `itemPredicate` and `itemListPredicate` props will cause the component to always render all `items`. It
will not hide the **InputGroup**; use the `filterable` prop for that. In this case, you can implement your own filtering
and change the `items` prop.

The **@blueprintjs/select** package exports `ItemPredicate<T>` and `ItemListPredicate<T>` type aliases to simplify the
process of implementing these functions. See the code sample in
[Item Renderer API](#select/select-component.item-renderer) below for more info.

@### Non-ideal states

If the query returns no results or `items` is empty, then `noResults` will be rendered in place of the usual list.
You also have the option to provide `initialContent`, which will render in place of the item list if the query is empty.

@## Styling

@### Button styling

**Select** accepts arbitrary child elements, but in most cases this will be a single **Button** component. To make this
button appear like a typical dropdown, apply some common button props such `alignText` and `rightIcon`:

```tsx
const MySelectDropdown: React.FC = () => (
    // many props omitted here for brevity
    <Select>
        <Button alignText="left" fill={true} rightIcon="caret-down" text="Dropdown">
    </Select>
);
```

@### Placeholder styling

When a **Select** has no selected item, you may wish to display placeholder text. Use the **Button** component's
`textClassName` prop to accomplish this:

```tsx
const MySelectDropdown: React.FC = () => {
    const [selectedValue, setSelectedValue] = React.useState<string | undefined>(undefined);
    return (
        // many props omitted here for brevity
        <Select<string> onItemSelect={setSelectedValue}>
            <Button
                rightIcon="caret-down"
                textClassName={classNames({
                    [Classes.TEXT_MUTED]: selectedValue === undefined,
                })}
                text={selectedValue ?? "(No selection)"}
            />
        </Select>
    );
};
```

@### Disabled styling

Disabling a **Select** requires setting the `disabled={true}` prop _and also_ disabling its children. For example:

```tsx
const FilmSelect: React.FC = () => (
    // many props omitted here for brevity
    <Select disabled={true}>
        <Button disabled={true}>
    </Select>
);
```

@## Custom menu

By default, **Select** renders the displayed items in a [**Menu**](#core/components/menu). This behavior can be
overridden by providing the `itemListRenderer` prop, giving you full control over the layout of the items. For example,
you can group items under a common heading, or render large data sets using
[react-virtualized](https://github.com/bvaughn/react-virtualized).

Note that the non-ideal states of `noResults` and `initialContent` are specific to the default renderer. If you provide
the `itemListRenderer` prop, these props will be ignored.

See the code sample in [Item List Renderer API](#select/select-component.item-list-renderer) below for more info.

@## Controlled usage

The input value can be controlled with the `query` and `onQueryChange` props. _Do not use `inputProps` for this;_
the component ignores `inputProps.value` and `inputProps.onChange` in favor of `query` and `onQueryChange`
(as noted in the prop documentation).

The focused item (for keyboard interactions) can be controlled with the `activeItem` and `onActiveItemChange` props.

```tsx
const FilmSelect: React.FC = () => (
    <Select<Film>
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
);
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

```tsx
function createFilm(title: string): Film {
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
            active={active}
            onClick={handleClick}
            shouldDismissPopover={false}
        />
    )
}

const FilmSelect: React.FC = () => (
    <Select<Film>
        createNewItemFromQuery={createFilm}
        createNewItemRenderer={renderCreateFilmOption}
        items={Films.items}
        itemPredicate={Films.itemPredicate}
        itemRenderer={Films.itemRenderer}
        noResults={<MenuItem disabled={true} text="No results."  roleStructure="listoption" />}
        onItemSelect={...}
    />
);
```

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

@### Item renderer

A **Select** component's `itemRenderer` will be called for each item and receives the item and a props object containing
data specific to rendering this item in this frame.

A few things to keep in mind:

-   The renderer is called for all items, so don't forget to respect `modifiers.matchesPredicate` to hide items which
    do not match the predicate.
-   Make sure to forward the provided `ref` to the rendered element (usually via `<MenuItem ref={ref} />`) to ensure
    that scrolling to active items works correctly.
-   Also, don't forget to define a `key` for each item, or face React's console wrath!

```tsx
import { Classes, MenuItem } from "@blueprintjs/core";
import { ItemRenderer, ItemPredicate, Select } from "@blueprintjs/select";

const filterFilm: ItemPredicate<Film> = (query, film) => {
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
            active={modifiers.active}
            key={film.title}
            onClick={handleClick}
            onFocus={handleFocus}
        />
    );
};

const FilmSelect: React.FC = () => (
    <Select<Film>
        itemPredicate={filterFilm}
        itemRenderer={renderFilm}
        items={...}
        onItemSelect={...}
    />
);
```

@interface ItemRendererProps

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

const FilmSelect: React.FC = () => (
    <Select<Film>
        itemListRenderer={renderMenu}
        itemPredicate={filterFilm}
        itemRenderer={renderFilm}
        items={...}
        onItemSelect={...}
    />
);
```

@interface ItemListRendererProps
