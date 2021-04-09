@# Tooltip

A tooltip is a lightweight popover for showing additional information during hover interactions.

`Tooltip`

@reactExample TooltipExample

@## Combining with popover

A single target can be wrapped in both a popover and a tooltip.

You must put the `Tooltip` _inside_ the `Popover` (and the target inside the
`Tooltip`), so the final hierarchy is `Popover > Tooltip > target` This order is
required because the tooltip needs information from popover disable itself when the
popover is open is open, thus preventing both elements from appearing at the same time.

```tsx
import { Button, mergeRefs, Popover, Tooltip } from "@blueprintjs/core";

<Popover
    content={<h1>Popover!</h1>}
    renderTarget={({ isOpen: isPopoverOpen, ref: ref1, ...popoverProps }) => (
        <Tooltip
            content="I have a popover!"
            disabled={isPopoverOpen}
            renderTarget={({ isOpen: isTooltipOpen, ref: ref2, ...tooltipProps }) => (
                <Button
                    {...popoverProps}
                    {...tooltipProps}
                    active={isPopoverOpen}
                    ref={mergeRefs(ref1, ref2)}
                    text="Hover and click me"
                />
            )}
        />
    )}
/>;
```

@## Props

`Tooltip` simply passes its props to [`Popover`](#core/components/popover), with
some exceptions. Notably, it only supports hover interactions.

When creating a tooltip, you must specify both its **content** (via the `content` prop) and
its **target** (via the `renderTarget` prop).

The **target** is rendered at the location of the Tooltip component in the React component tree. It acts
as the trigger for the tooltip; hover interaction will show the tooltip based on the `interactionKind` prop.
In Popper.js terms, this is the popper "reference". In order to add its interaction logic to the target,
Tooltip supplies an object of props to the `renderTarget` function. These props should be
[spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals)
out to the `JSX.Element` returned from `renderTarget`.

The **content** will be shown inside the tooltip itself. When opened, the tooltip will always be
positioned on the page next to the target; the `position` prop determines its relative position (on
which side of the target).

@interface TooltipProps
