@# Omnibar

**Omnibar** is a macOS Spotlight-style typeahead component built using [**Overlay**](#core/components/overlay) and
[**QueryList**](#select/query-list). Its usage is similar to that of [**Select**](#select/select-component): provide
your items and a predicate to customize the filtering algorithm.

The following example responds to a button and a hotkey.

@reactExample OmnibarExample

@## Usage

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">

[OverlaysProvider](#core/context/overlays-provider) recommended

</h5>

This component renders an **Overlay2** which works best inside a React tree which includes an
**OverlaysProvider**. Blueprint v5.x includes a backwards-compatibile shim which allows this context
to be optional, but it will be required in a future major version. See the full
[migration guide](https://github.com/palantir/blueprint/wiki/Overlay2-migration) on the wiki.

</div>

In TypeScript, `Omnibar<T>` is a _generic component_ where `<T>` represents the type of one item in the array of `items`.

The component is fully controlled via the `isOpen` prop, which means you can decide exactly how to trigger it.

@## Props interface

@interface OmnibarProps
