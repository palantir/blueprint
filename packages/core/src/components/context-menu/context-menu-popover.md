@# ContextMenuPopover

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">

Consider [ContextMenu](#core/components/context-menu) first

</h5>

The APIs described on this page are lower-level and have some limitations compared to
[ContextMenu](#core/components/context-menu), so you should try that API _first_ to see if it addresses your use case.

</div>

__ContextMenuPopover__ is a lower-level API for [ContextMenu](#core/components/context-menu) which does not hook up any
interaction handlers for you and simply renders an opinionated [Popover](#core/components/popover) at a particular
target offset on the page through a [Portal](#core/components/portal).

@reactExample ContextMenuPopoverExample

@## Declarative API

Use the `<ContextMenuPopover>` component like any other React component in your tree. Note that this is a controlled
component which requires its `isOpen` and `targetOffset` props to be defined.

@interface ContextMenuPopoverProps

@## Imperative API

Two functions are provided as an imperative API for showing and hiding a singleton ContextMenuPopover on the page:

```ts
export function showContextMenu(props: ContextMenuPopoverProps): void;
export function hideContextMenu(): void;
```

These are useful in some cases when working with imperative code that does not follow typical React paradigms.
Note that these functions come with come caveats, and thus they should be used with caution:

-   they rely on global state stored in Blueprint library code.
-   they create a new React DOM tree via `ReactDOM.render()`, which means they do not preserve any existing React
    context from the calling code.
-   they do _not_ automatically detect dark theme, so you must manualy set the `{ isDarkTheme: true }` property
