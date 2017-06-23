@# Labs

<div class="pt-callout pt-intent-warning pt-icon-info-sign">
    <h5>Under construction</h5>
    The **[@blueprintjs/labs](https://www.npmjs.com/package/@blueprintjs/labs)** NPM package contains **unstable React components under active development by team members**. It is an incubator and staging area for components as we refine the API design; as such, this package will never reach 1.0.0, and every minor version should be considered breaking.
</div>

@## Select

Use `Select<T>` for choosing one item from a list. The component's children will be wrapped in a `Popover` that contains the list and an optional `InputGroup` to filter it. Provide a predicate to customize the filtering algorithm. The value of a `Select<T>` (the currently chosen item) is uncontrolled: listen to changes with `onItemSelect`.

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

@### Querying

Supply a predicate to automatically query items based on the `InputGroup` value. Use `itemPredicate` to filter each item individually; this is great for lightweight searches. Use `itemListPredicate` to query the entire array in one go, and even reorder it, such as with [fuzz-aldrin-plus](https://github.com/jeancroy/fuzz-aldrin-plus). The array of filtered items is cached internally by `QueryList` state and only recomputed when `query` or `items`-related props change.

If the query returns no results or `items` is empty, then `noResults` will be rendered in place of the usual list.

Omitting both `itemPredicate` and `itemListPredicate` props will cause the component to always render all `items`. It will not hide the `InputGroup`; use the `filterable` prop for that. In this case, you can implement your own filtering and simply change the `items` prop.

@### Controlled usage

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

@### JavaScript API

@interface ISelectProps

@#### Item Renderer API

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

@## Multi Select

Use `MultiSelect<T>` for choosing multiple items in a list. The component renders a `TagInput` wrapped in a `Popover`. Similarly to `Select`, you can pass in a predicate to customize the filtering algorithm. Selection of a `MultiSelect<T>` is controlled: listen to changes with `onItemSelect`.

<div class="pt-callout pt-intent-primary pt-icon-info-sign">
    <h5>Generic components and custom filtering</h5>
    For more information on controlled usage, generic components and custom filtering, visit the documentation for [`Select<T>`](http://localhost:9000/packages/site-docs/dist/#labs.select).
</div>

@reactExample MultiSelectExample

@interface IMultiSelectProps

@interface IMultiSelectItemRendererProps

@## QueryList

`QueryList<T>` is a higher-order component that provides interactions between a query string and a list of items. Specifically, it implements the two predicate props describe above and provides keyboard selection. It does not render anything on its own, instead deferring to a `renderer` prop to perform the actual composition of components.

`QueryList<T>` is a generic component where `<T>` represents the type of one item in the array of `items`. The static method `QueryList.ofType<T>()` is available to simplify the TypeScript usage.

If the `Select` interactions are not sufficient for your use case, you can use `QueryList` directly to render your own components while leveraging basic interactions for keyboard selection and filtering. The `Select` source code is a great place to start when implementing a custom `QueryList` `renderer`.

@interface IQueryListProps

@### Renderer API

An object with the following properties will be passed to an `QueryList` `renderer`. Required properties will always be defined;  optional ones will only be defined if they are passed as props to the `QueryList`.

This interface is generic, accepting a type parameter `<T>` for an item in the list.

@interface IQueryListRendererProps

@## TagInput

`TagInput` renders [`Tag`](#core/components/tag)s inside an input, followed by an actual text input. The container is merely styled to look like a Blueprint input; the actual editable element appears after the last tag. Clicking anywhere on the container will focus the text input for seamless interaction.


@reactExample TagInputExample

`TagInput` must be controlled, meaning the `values` prop is required and event handlers are strongly suggested. The component controls the text input internally to support the `onAdd` event, but you can wrest control by supplying your own `inputProps`.

`Tag` appearance can be customized with `tagProps`: supply an object to apply the same props to every tag, or supply a callback to apply dynamic props per tag. Tag `values` must be an array of strings so you may need a transformation step between your state and these props.

Tags can be removed by clicking their X buttons, or by pressing <kbd class="pt-key">backspace</kbd> repeatedly.
Arrow keys can also be used to focus on a particular tag before removing it. The cursor must be at the beginning
of the text input for these interactions.

<div class="pt-callout pt-intent-primary pt-icon-info-sign">
    <h5>Handling long words</h5>
    Set an explicit `width` on `.pt-tag-input` to cause long words to wrap onto multiple lines. Either supply a specific pixel value, or use `<TagInput className="pt-fill">` to fill its container's width (try this in the example above).
</div>

@interface ITagInputProps
