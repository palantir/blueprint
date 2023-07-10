@# Tooltip

A tooltip is a lightweight popover for showing additional information during hover interactions.

@reactExample TooltipExample

@## Combining with popover

A single target can be wrapped in both a popover and a tooltip.

You must put the `Tooltip` _inside_ the `Popover` (and the target inside the
`Tooltip`), so the final hierarchy is `Popover > Tooltip > target` This order is
required because the tooltip needs information from popover disable itself when the
popover is open is open, thus preventing both elements from appearing at the same time.

Also, you must take to either set `<Popover shouldReturnFocusOnClose={false}>`
or `<Tooltip openOnTargetFocus={false}>` in this scenario in order to avoid undesirable
UX where the tooltip could open automatically when a user doesn't want it to.

```tsx
import { Button, mergeRefs, Popover, Tooltip } from "@blueprintjs/core";

<Popover
    content={<h1>Popover!</h1>}
    renderTarget={({ isOpen: isPopoverOpen, ref: ref1, ...popoverProps }) => (
        <Tooltip
            content="I have a popover!"
            disabled={isPopoverOpen}
            openOnTargetFocus={false}
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
its **target** (either as children, or via the `renderTarget` prop). See the
[Popover "Structure" docs](#core/components/popover.structure) for more info on rendering a tooltip target.

The **content** will be shown inside the tooltip itself. When opened, the tooltip will always be
positioned on the page next to the target; the `placement` prop determines its relative placement (on
which side of the target).

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign">
    <h5 class="@ns-heading">Button targets</h5>

Buttons make great tooltip targets, but the `disabled` attribute will prevent all
events so the enclosing `Tooltip` will not know when to respond.
Use [`AnchorButton`](#core/components/button.anchor-button) instead;
see the [callout here](#core/components/button.props) for more details.

</div>

@interface TooltipProps
