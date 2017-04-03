@# Tooltips

Tooltips display a small string of text next to a target element.

@reactExample TooltipExample

@## JavaScript API

The `Tooltip` component is available in the __@blueprintjs/core__ package.
Make sure to review the [general usage docs for JS components](#blueprint.usage).

When creating a tooltip, you must specify both:
- its _content_, by setting the `content` prop, and
- its _target_, as a single child element or as plain text

When the user hovers over the target, the content is displayed in a tooltip above the target.

Content can be a `string` or a single `JSX.Element` (typically used to format said string),
but you should keep it simple. If you need more space, consider using a popover instead of a tooltip.

<div class="pt-callout pt-intent-warning pt-icon-warning-sign">
    <h5>Button targets</h5>
    Buttons make great tooltip targets, but the `disabled` attribute will prevent all events so the enclosing `Tooltip`
    will not know when to respond. Use [`AnchorButton`](#ore/components/button.anchor-button) instead;
    see the [callout here](#ore/components/button.javascript-api) for more details.
</div>

@interface ITooltipProps

@### Controlled mode

The `Tooltip` component supports controlled mode in exactly the same way the `Popover` component
does. Please refer to the [controlled mode documentation](#core/components/popover.controlled-mode) for
`Popover` for details.

@### Inline tooltips

Inline tooltips (with `inline={true}`) do not have a set width, and therefore will not break long
content into multiple lines. This is enforced with `white-space: nowrap`.

If you want to create an inline tooltip with content spanning multiple lines, you must override the
default styles and set an appropriate size for `.pt-tooltip`.

@### Combining with popover

You can give a single target both a popover and a tooltip. You must put the `Tooltip` inside the
`Popover` (and the target inside the `Tooltip`).

This order is required because when the popover is open, the tooltip is disabled, to prevent both
elements from appearing at the same time.

```tsx
<Popover content={<h1>Popover!</h1>} position={Position.RIGHT}>
    <Tooltip content="I has a popover!" position={Position.RIGHT}>
        <button className="pt-button pt-intent-success">Hover and click me</button>
    </Tooltip>
</Popover>
```

@### SVG tooltip

`SVGTooltip` is a convenience component provided for SVG contexts. It is a simple wrapper around
`Tooltip` that sets `rootElementTag="g"`.

@### Dark theme

If the trigger for a tooltip is nested inside a `.pt-dark` container, the tooltip will
automatically have the dark theme applied as well.

You can also explicitly apply the dark theme to a tooltip by adding the prop
`tooltipClassName="pt-dark"`.
