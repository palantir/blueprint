@# Select

Use `Select<T>` for choosing one item from a list. The component's children will be wrapped in a [`Popover2`](#labs/popover2) that contains the list and an optional `InputGroup` to filter it. Provide a predicate to customize the filtering algorithm. The value of a `Select<T>` (the currently chosen item) is uncontrolled: listen to changes with `onItemSelect`.

<div class="pt-callout pt-intent-primary pt-icon-info-sign">
    <h5>Disabling a Select</h5>
    <p>Disabling the component requires setting the `disabled` prop to `true`
    and separately disabling the component's children as appropriate (because `Select` accepts arbitrary children).</p>
    <p>For example, `<Select ... disabled={true}><Button ... disabled={true} /></Select>`</p>
</div>

@reactExample SelectExample

```tsx
import { Button, MenuItem } from "@blueprintjs/core";
import { Select } from "@blueprintjs/labs";
import { Film, TOP_100_FILMS, filterFilm, renderFilm } from "./demoData";

// Select<T> is a generic component to work with your data types.
// In TypeScript, you must first obtain a non-generic reference:
const FilmSelect = Select.ofType<Film>();

ReactDOM.render(
    <FilmSelect
        items={TOP_100_FILMS}
        itemPredicate={filterFilm}
        itemRenderer={renderFilm}
        noResults={<MenuItem disabled text="No results." />}
        onItemSelect={...}
    >
        {/* children become the popover target; render value here */}
        <Button text={TOP_100_FILMS[0].title} rightIconName="double-caret-vertical" />
    </FilmSelect>,
    document.querySelector("#root")
);
```

In TypeScript, `Select<T>` is a *generic component* so you must define a local type that specifies `<T>`, the type of one item in `items`. The props on this local type will now operate on your data type (speak your language) so you can easily define handlers without transformation steps, but most props are required as a result. The static `Select.ofType<T>()` method is available to streamline this process. (Note that this has no effect on JavaScript usage: the `Select` export is a perfectly valid React component class.)

@## Querying

Supply a predicate to automatically query items based on the `InputGroup` value. Use `itemPredicate` to filter each item individually; this is great for lightweight searches. Use `itemListPredicate` to query the entire array in one go, and even reorder it, such as with [fuzz-aldrin-plus](https://github.com/jeancroy/fuzz-aldrin-plus). The array of filtered items is cached internally by `QueryList` state and only recomputed when `query` or `items`-related props change.

Omitting both `itemPredicate` and `itemListPredicate` props will cause the component to always render all `items`. It will not hide the `InputGroup`; use the `filterable` prop for that. In this case, you can implement your own filtering and simply change the `items` prop.

@### Non-ideal states

If the query returns no results or `items` is empty, then `noResults` will be rendered in place of the usual list. You also have the option to provide `initialContent`, which will render in place of the item list if the query is empty.

@## Controlled usage

The `InputGroup` value is managed by `Select`'s internal state and is not exposed via props. If you would like to control it, you can circumvent `Select` state by passing your `value` state and `onChange` handler to `inputProps`. You can then query the `items` array directly and omit both predicate props.

```tsx
// controlling query involves controlling the input and doing your own filtering
<FilmSelect
    inputProps={{ value: this.state.myQuery, onChange: this.handleChange }}
    items={myFilter(ALL_ITEMS, this.state.myQuery)}
    itemRenderer={...}
    onItemSelect={...}
/>
```

This "escape hatch" can be used to implement all sorts of advanced behavior on top of the basic `Select` interactions, such as windowed filtering for large data sets.

@## JavaScript API

@interface ISelectProps

@### Item Renderer API

An object with the following properties will be passed to a `Select` `itemRenderer`, for each item being rendered. Only items which pass the predicate will be rendered. Don't forget to define a `key` for each item, or face React's console wrath!

This interface is generic, accepting a type parameter `<T>` for an item in the list.

```tsx
import { Classes, MenuItem } from "@blueprintjs/core";
import { Select, ISelectItemRendererProps } from "@blueprintjs/labs";
const FilmSelect = Select.ofType<Film>();

const renderMenuItem = ({ handleClick, item: film, isActive }: ISelectItemRendererProps<Film>) => (
    <MenuItem
        className={isActive ? Classes.ACTIVE : ""}
        key={film.title}
        label={film.year}
        onClick={handleClick}
        text={film.title}
    />
);

<FilmSelect itemRenderer={renderMenuItem} items={...} onItemSelect={...} />
```

@interface ISelectItemRendererProps
