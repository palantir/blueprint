@# Tooltip

`Tooltip` simply passes its props to [`Popover`](#labs/popover) with some exceptions.
Notably, it only supports `HOVER` interactions and the `target` prop is not supported.

@reactExample TooltipExample

@## JavaScript API

The `Tooltip` component is available in the __@blueprintjs/core__ package.
Make sure to review the [general usage docs for JS components](#blueprint.usage).

When creating a tooltip, you must specify both:
- its _content_, by setting the `content` prop, and
- its _target_, as a single child element or string.

The content will appear in a contrasting popover when the target is hovered over.

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign">
    <h4 class="@ns-callout-title">Button targets</h4>
    Buttons make great tooltip targets, but the `disabled` attribute will prevent all
    events so the enclosing `Tooltip` will not know when to respond.
    Use [`AnchorButton`](#core/components/button.anchor-button) instead;
    see the [callout here](#core/components/button.javascript-api) for more details.
</div>

@interface ITooltipProps

@## Combining with popover

You can give a single target both a popover and a tooltip.
You must put the `Tooltip` _inside_ the `Popover` (and the target inside the `Tooltip`).

This order is required because the popover will disable the tooltip when it is open,
preventing both elements from appearing at the same time.

```tsx
import { Button, Popover, Position, Tooltip } from "@blueprintjs/core";

<Popover content={<h1>Popover!</h1>} position={Position.RIGHT}>
    <Tooltip content="I has a popover!" position={Position.RIGHT}>
        <Button>Hover and click me</Button>
    </Tooltip>
</Popover>
```
