@# QueryList

__QueryList__ is a higher-order component that provides interactions between a query string and a list of items.
Specifically, it implements the two predicate props described above and provides keyboard selection. It does not render
anything on its own, instead deferring to a `renderer` prop to perform the actual composition of components.

`QueryList<T>` is a _generic component_ where `<T>` represents the type of one item in the array of `items`.

You may consider using __QueryList__ if the built-in behaviors of [__Select__](#select/select-component) are
insufficient for your use case. This allows you to render your own item and item list components while leveraging basic
interactions for keyboard selection and filtering. The __Select__ component source code is a great place to start when
implementing a custom __QueryList__ `renderer`.

@## Props interface

@interface QueryListProps

@## Renderer API

An object with the following properties will be passed to an `QueryList` `renderer`. Required properties will always be defined;  optional ones will only be defined if they are passed as props to the `QueryList`.

This interface is generic, accepting a type parameter `<T>` for an item in the list.

@interface QueryListRendererProps
