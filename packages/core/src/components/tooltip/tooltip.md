@# Tooltip

__Tooltip__ is a lightweight popover for showing additional information during hover interactions.

@reactExample TooltipExample

@## Usage

__Tooltip__ passes most of its props to [__Popover__](#core/components/popover), with some exceptions.
Notably, it only supports hover interactions.

When creating a tooltip, you must specify both its **content** (via the `content` prop) and
its **target** (either as children, or via the `renderTarget` prop). See the
[Popover "Structure" docs](#core/components/popover.structure) for more info on rendering a tooltip target.

The **content** will be shown inside the tooltip itself. When opened, the tooltip will always be
positioned on the page next to the target; the `placement` prop determines its relative placement (on
which side of the target).

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">Button targets</h5>

Buttons make great tooltip targets, but the `disabled` attribute will prevent all
events so the enclosing __Tooltip__ will not know when to respond.
Use [__AnchorButton__](#core/components/button.anchor-button) instead;
see the [callout here](#core/components/button.props) for more details.

</div>

@## Props interface

@interface TooltipProps

@## Combining with Popover

A single target can be wrapped in both a popover and a tooltip.

You must put the `<Tooltip>` _inside_ the `<Popover>` (and the target inside the `<Tooltip>`, so the hierarchy
is `Popover > Tooltip > target`). This order is required because the tooltip needs information from the popover to
disable itself when the popover is open, thus preventing both elements from appearing at the same time.

Also, you must take care to either set `<Popover shouldReturnFocusOnClose={false}>` or
`<Tooltip openOnTargetFocus={false}>` in this scenario in order to avoid undesirable UX where the tooltip could open
automatically when a user doesn't want it to.

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
