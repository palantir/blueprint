@# Labs

<div class="pt-callout pt-intent-warning pt-icon-info-sign">
    <h5>Under construuction</h5>
    The **[@blueprintjs/labs](https://www.npmjs.com/package/@blueprintjs/labs)** NPM package contains **unstable React components under active development by team members**. It is an incubator and staging area for components as we refine the API design; as such, this package will never reach 1.0.0, and every minor version should be considered breaking.
</div>

@## Select

Use `Select<T>` for choosing one item from a list. The component's children will be wrapped in a `Popover` that contains the list and an optional `InputGroup` to filter it. Provide a predicate to customize the filtering algorithm. The value of a `Select<T>` (the currently chosen item) is uncontrolled: listen to changes with `onItemSelect`.

@reactExample SelectExample

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
        onItemSelect={this.handleFilmChange}
    >
        {/* children become the popover target; render value here */}
        <Button text={this.state.film.title} rightIconName="double-caret-vertical" />
    </MovieSelect>,
    document.querySelector("#root")
);
```

In TypeScript, `Select<T>` is a *generic component* so you must define a local type that specifies `<T>`, the type of one item in `items`. The props on this local type will now operate on your data type (speak your language) so you can easily define handlers without transformation steps, but most props are required as a result. The static `Select.ofType<T>()` method is available to streamline this process. (Note that this has no effect on JavaScript usage: the `Select` export is a perfectly valid React component class.)


@### Filtering

Supply a predicate to automatically filter items based on the `InputGroup` value. Use `itemPredicate` to filter each item individually; this is great for lightweight searches. Use `itemListPredicate` to filter the entire array in one go, such as with [fuzz-aldrin-plus](TODO). The filtered items are cached internally by `InputList` and only recomputed when `query` or `items`-related props change.

If the query returns no results or `items` is empty, then `noResults` will be rendered in place of the usual list.

Omitting both `itemPredicate` and `itemListPredicate` props will cause the component to always render all `items`. It will not hide the `InputGroup`; use the `filterable` prop for that. In this case, you can implement your own filtering and simply change the `items` prop.

@### Controlled usage

The `InputGroup` value, called "query," is managed by `Select`'s internal state and is not exposed via props. If you would like to control it, you can circumvent `Select` state by passing your `value` state and `onChange` to `inputProps`. You can then filter the `items` array directly and omit both predicate props.

```tsx
// controlling query involes controlling the input and doing your own filtering
<MovieSelect
    inputProps={{ value: this.state.myQuery, onChange: this.handleChange }}
    items={myFilter(this.props.items, this.state.myQuery)}
/>
```

This "escape hatch" can be used to implement all sorts of advanced behavior on top of the basic `Select` interactions, such as windowed filtering for large data sets.

@### JavaScript API

@interface ISelectProps

@## InputList

`InputList<T>` is a higher-order component that provides interactions between a filter input and a list of items. Specifically, it implements the two predicate props and provides keyboard selection. It does not render anything on its own, instead deferring to a `renderer` prop to perform the actual composition of components.

`InputList<T>` is a generic component where `<T>` represents the type of one item in the array of `items`. The static method `InputList.ofType<T>()` is available to simplify the TypeScript usage.

If the `Select` interactions are not sufficient for your use case, you can use `InputList` directly to render your own components while leveraging basic interactions for keyboard selection and filtering.

@interface IInputListProps

@### Renderer API

@interface IInputListRendererProps
