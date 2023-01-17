@# Tooltip2

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">
    <h5 class="@ns-heading">

Migrating from [Tooltip](#core/components/tooltip)?

</h5>

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
its **target** (either as children, or via the `renderTarget` prop). See the
[Popover2 "Structure" docs](#popover2-package/popover2.structure) for more info on rendering a tooltip target.

The **content** will be shown inside the tooltip itself. When opened, the tooltip will always be
positioned on the page next to the target; the `placement` prop determines its relative placement (on
which side of the target).

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign">
    <h5 class="@ns-heading">Button targets</h5>

Buttons make great tooltip targets, but the `disabled` attribute will prevent all
events so the enclosing `Tooltip2` will not know when to respond.
Use [`AnchorButton`](#core/components/button.anchor-button) instead;
see the [callout here](#core/components/button.props) for more details.

</div>

@interface ITooltip2Props
