@# QueryList

`QueryList<T>` is a higher-order component that provides interactions between a query string and a list of items. Specifically, it implements the two predicate props described above and provides keyboard selection. It does not render anything on its own, instead deferring to a `renderer` prop to perform the actual composition of components.

`QueryList<T>` is a generic component where `<T>` represents the type of one item in the array of `items`. The static method `QueryList.ofType<T>()` is available to simplify the TypeScript usage.

If the `Select` interactions are not sufficient for your use case, you can use `QueryList` directly to render your own components while leveraging basic interactions for keyboard selection and filtering. The `Select` source code is a great place to start when implementing a custom `QueryList` `renderer`.

@interface IQueryListProps

@## Renderer API

An object with the following properties will be passed to an `QueryList` `renderer`. Required properties will always be defined;  optional ones will only be defined if they are passed as props to the `QueryList`.

This interface is generic, accepting a type parameter `<T>` for an item in the list.

@interface IQueryListRendererProps
