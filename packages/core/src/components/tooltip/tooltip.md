@# Tooltip

A tooltip is a lightweight popover for showing additional information during hover interactions.

@reactExample TooltipExample

@## Combining with popover

A single target can be wrapped in both a popover and a tooltip.

You must put the `Tooltip` _inside_ the `Popover` (and the target inside the
`Tooltip`), so the final hierarchy is `Popover > Tooltip > target` This order is
required because the popover will disable the tooltip when it is open,
preventing both elements from appearing at the same time.

```tsx
import { Button, Popover, Position, Tooltip } from "@blueprintjs/core";

<Popover content={<h1>Popover!</h1>} position={Position.RIGHT}>
    <Tooltip content="I has a popover!" position={Position.RIGHT}>
        <Button>Hover and click me</Button>
    </Tooltip>
</Popover>
```

@## Props

`Tooltip` simply passes its props to [`Popover`](#core/components/popover), with
some exceptions. Notably, it only supports `HOVER` interactions and the `target`
prop is not supported.

When creating a tooltip, you must specify both:
- its _content_ via the `content` prop, and
- its _target_ as either:
    - a single child element, or
    - an instrinsic element string identifier (N.B. this doesn't work if you are using any of the target props, so use an element instead, i.e. `<div>...</div>` instead of `"div"`).

The content will appear in a contrasting popover when the target is hovered.

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign">
    <h4 class="@ns-heading">Button targets</h4>

Buttons make great tooltip targets, but the `disabled` attribute will prevent all
events so the enclosing `Tooltip` will not know when to respond.
Use [`AnchorButton`](#core/components/button.anchor-button) instead;
see the [callout here](#core/components/button.props) for more details.

</div>

@interface ITooltipProps
