@# Omnibar

__Omnibar__ is a macOS Spotlight-style typeahead component built using [__Overlay__](#core/components/overlay) and
[__QueryList__](#select/query-list). Its usage is similar to that of [__Select__](#select/select-component): provide
your items and a predicate to customize the filtering algorithm. The component is fully controlled via the `isOpen`
prop, which means you can decide exactly how to trigger the component. The following example responds to a button and
a hotkey.

`Omnibar<T>` is a _generic component_ where `<T>` represents the type of one item in the array of `items`.

@reactExample OmnibarExample

@## Props interface

@interface OmnibarProps

