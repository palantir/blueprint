@# ContextMenu2Popover

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">
    <h5 class="@ns-heading">

Migrating from [ContextMenu](#core/components/context-menu)?

</h5>

ContextMenu2 is a replacement for ContextMenu + ContextMenuTarget. It will become the standard
context menu API in Blueprint core v5. You are encouraged to use this new API now to facilitate the
transition to the next major version of Blueprint. See the full
[migration guide](https://github.com/palantir/blueprint/wiki/ContextMenu2-migration) on the wiki.

The APIs described on this page are lower-level and have some limitations compared to
[ContextMenu2](#popover2-package/context-menu2), so you should try that API _first_ to see if it addresses
your use case.

</div>

__ContextMenu2Popover__ is a lower-level API for [ContextMenu2](#popover2-package/context-menu2) which
does not hook up any interaction handlers for you and simply renders an opinionated
[Popover2](#popover2-package/popover2) at a particular target offset on the page through a
[Portal](#core/components/portal).

@reactExample ContextMenu2PopoverExample

@## Declarative API

Use the `<ContextMenu2Popover>` component just like any other React component in your tree. Note that this is
a controlled component that requires `isOpen` and `targetOffset` information.

@interface ContextMenu2PopoverProps

@## Imperative API

Two functions are provided as an imperative API for showing and hiding a singleton ContextMenu2Popover on the page:

```ts
export function showContextMenu(props: ContextMenu2PopoverProps): void;
export function hideContextMenu(): void;
```

These are useful in some cases when working with imperative code that does not follow typical React paradigms.
Note that these functions come with come caveats, and thus they should be used with caution:

-   they rely on global state stored in Blueprint library code.
-   they create a new React DOM tree via `ReactDOM.render()`, which means they do not preserve any existing React
    context from the calling code.
-   they do _not_ automatically detect dark theme, so you must manualy set the `{ isDarkTheme: true }` property
