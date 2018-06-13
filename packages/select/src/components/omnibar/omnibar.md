@# Omnibar

`Omnibar<T>` is a macOS Spotlight-style typeahead component composing `Overlay`
and `QueryList<T>`. Usage is similar to `Select<T>`: provide your items and a
predicate to customize the filtering algorithm. The component is fully
controlled via the `isOpen` prop, which means you can decide exactly how to
trigger the component. The following example responds to a button and a hotkey.

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">
    [Read the `Select` documentation](#select/select-component) for more advanced usage documentation.
</div>

@reactExample OmnibarExample

@interface IOmnibarProps

