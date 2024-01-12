@# Omnibar

**Omnibar** is a macOS Spotlight-style typeahead component built using [**Overlay**](#core/components/overlay) and
[**QueryList**](#select/query-list). Its usage is similar to that of [**Select**](#select/select-component): provide
your items and a predicate to customize the filtering algorithm.

The following example responds to a button and a hotkey.

@reactExample OmnibarExample

@## Usage

In TypeScript, `Omnibar<T>` is a _generic component_ where `<T>` represents the type of one item in the array of `items`.

The component is fully controlled via the `isOpen` prop, which means you can decide exactly how to trigger it.

@## Props interface

@interface OmnibarProps
