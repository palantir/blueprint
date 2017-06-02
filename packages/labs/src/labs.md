@# Labs

The **@blueprintjs/labs** NPM package contains unstable React components under active development by team members. It is an incubator and staging area for components as we refine the API design; as such, this package will never reach 1.0.0, and every minor version should be considered breaking.

@## Select

Use `Select` for choosing one item from a list. The component's children will be wrapped in a `Popover` that contains the list and an optional `InputGroup` to filter it. Provide a predicate to customize the filtering algorithm.

@reactExample SelectExample

The selected item (provided by the `onItemSelect`) callback is uncontrolled: `Select` will report when a new selection is made but it cannot be told what the selected item is.

```tsx
import { Button, MenuItem } from "@blueprintjs/core";
import { Select } from "@blueprintjs/labs";

// Select<T> is a generic component to work with your data types.
// In TypeScript, you must first obtain a non-generic reference:
const MovieSelect = Select.ofType<Film>();

ReactDOM.render(
    <MovieSelect
        items={TOP_100_FILMS}
        itemPredicate={this.filterFilm}
        itemRenderer={this.renderFilm}
        noResults={<MenuItem disabled text="No results." />}
        onItemSelect={this.handleValueChange}
    >
        {/* children become the popover target: clicking or pressing up/down arrow will open the chooser */}
        <Button text={film.title} rightIconName="double-caret-vertical" />
    </MovieSelect>,
    document.querySelector("#root")
);
```

@### Filtering

Supply a predicate to automatically filter items based on the `InputGroup` value. Use `itemPredicate` to filter each item individually; this is great for lightweight searches. Use `itemListPredicate` to filter the entire array in one go, such as with [fuzz-aldrin-plus](TODO). The filtered items are cached internally by `InputList` and only recomputed when `query` or `items`-related props change.

If the query returns no results, `noResults` will be rendered in place of the usual list.

@### Controlled usage

The `InputGroup` value, called "query," is managed by `Select` itself and is not exposed via props. If you would like to control it, you can simply pass `value` and `onChange` to `inputProps`:

```tsx
<MovieSelect inputProps={{ value: this.state.myQuery, onChange: this.handleChange }} />
```

@interface ISelectProps

@## InputList

`InputList` is a higher-order component that provides interactions between a filter input and a list of items. It does not render anything on its own, instead deferring to a `renderer` prop to perform the actual composition of components.

If the `Select` interactions are not sufficient for your use case, you can use `InputList` directly to render your own components while leveraging basic interactions for keyboard selection and filtering.

@interface IInputListProps

@interface IInputListRendererProps
