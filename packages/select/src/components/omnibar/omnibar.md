@# Omnibar

**Omnibar** is a macOS Spotlight-style typeahead component built using [**Overlay**](#core/components/overlay) and
[**QueryList**](#select/query-list). Its usage is similar to that of [**Select**](#select/select-component): provide
your items and a predicate to customize the filtering algorithm.

The following example responds to a button and a hotkey.

@reactExample OmnibarExample

@## Usage

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">

Context provider required

</h5>

This component renders an **Overlay** which must be rendered inside a React tree which
contains a **[BlueprintProvider](#core/context/blueprint-provider)** or an
**[OverlaysProvider](#core/context/overlays-provider)**.

</div>

In TypeScript, `Omnibar<T>` is a _generic component_ where `<T>` represents the type of one item in the array of `items`.

The component is fully controlled via the `isOpen` prop, which means you can decide exactly how to trigger it.

@## Props interface

@interface OmnibarProps
