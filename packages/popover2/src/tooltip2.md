@# Tooltip2

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">
    <h4 class="@ns-heading">

Migrating from [Tooltip](#core/components/tooltip)?

</h4>

Tooltip2 is a replacement for Tooltip and will become the standard Popover API in Blueprint core v5.
You are encouraged to use this new API now to ease the transition to the next major version of Blueprint.
See the full [migration guide](https://github.com/palantir/blueprint/wiki/Popover2-migration) on the wiki.

</div>

A tooltip is a lightweight popover for showing additional information during hover interactions.

`Tooltip2`

@reactExample Tooltip2Example

@## Combining with popover

A single target can be wrapped in both a popover and a tooltip.

You must put the `Tooltip2` _inside_ the `Popover2` (and the target inside the
`Tooltip2`), so the final hierarchy is `Popover2 > Tooltip2 > target` This order is
required because the tooltip needs information from popover disable itself when the
popover is open is open, thus preventing both elements from appearing at the same time.

Also, you must take to either set `<Popover2 shouldReturnFocusOnClose={false}>`
or `<Tooltip2 openOnTargetFocus={false}>` in this scenario in order to avoid undesirable
UX where the tooltip could open automatically when a user doesn't want it to.

```tsx
import { Button, mergeRefs } from "@blueprintjs/core";
import { Popover2, Tooltip2 } from "@blueprintjs/popover2";

<Popover2
    content={<h1>Popover!</h1>}
    renderTarget={({ isOpen: isPopoverOpen, ref: ref1, ...popoverProps }) => (
        <Tooltip2
            content="I have a popover!"
            disabled={isPopoverOpen}
            openOnTargetFocus={false}
            renderTarget={({ isOpen: isTooltipOpen, ref: ref2, ...tooltipProps }) => (
                <Button
                    {...popoverProps}
                    {...tooltipProps}
                    active={isPopoverOpen}
                    elementRef={mergeRefs(ref1, ref2)}
                    text="Hover and click me"
                />
            )}
        />
    )}
/>;
```

@## Props

`Tooltip2` simply passes its props to [`Popover2`](#popover2-package/popover2), with
some exceptions. Notably, it only supports hover interactions.

When creating a tooltip, you must specify both its **content** (via the `content` prop) and
its **target** (via the `renderTarget` prop).

The **target** is rendered at the location of the Tooltip2 component in the React component tree. It acts
as the trigger for the tooltip; hover interaction will show the tooltip based on the `interactionKind` prop.
In Popper.js terms, this is the popper "reference". In order to add its interaction logic to the target,
Tooltip2 supplies an object of props to the `renderTarget` function. These props should be
[spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals)
out to the `JSX.Element` returned from `renderTarget`.

The **content** will be shown inside the tooltip itself. When opened, the tooltip will always be
positioned on the page next to the target; the `position` prop determines its relative position (on
which side of the target).

@interface ITooltip2Props
