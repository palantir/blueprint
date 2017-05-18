@# Popovers

Popovers display floating content next to a target element.

@reactExample PopoverExample

@## JavaScript API

The `Popover` component is available in the __@blueprintjs/core__ package.
Make sure to review the [general usage docs for JS components](#blueprint.usage).

When creating a popover, you must specify both its _content_ and its _target_.
This can be done a few ways:

1. Provide both the `content` and `target` props, which accept a string or a JSX element.
  Omitting the `target` prop will produce an error.
  ```tsx
  <Popover content={<Content />} target={<Button text="Open" />} />
  ```

1. Provide one or two `children`. Omitting a `target` element will produce an error.
  ```tsx
  <Popover>
    <Button text="Open" />
    <Content />
  </Popover>
  ```

1. It is possible to mix the two: provide the `content` prop and one React child as the target.
  (Using the `target` prop with `children` is not supported and will produce a warning.)
  ```tsx
  <Popover content={<Content />}>
    <Button text="Open" />
  </Popover>
  ```

The _target_ acts as the trigger for the popover; user interaction will show the popover based on
`interactionKind`. The _content_ will be shown in the popover itself. The popover's will always be
positioned on the page next to the target; the `position` prop determines the relative position (on
which side of the target).

Internally, the child of a `Popover` component is wrapped in a `span.pt-popover-target` and rendered
inline in the HTML in the component's place.

<div class="pt-callout pt-intent-warning pt-icon-warning-sign">
    <h5>Button targets</h5>
    Buttons make great popover targets, but the `disabled` attribute on a `<button>` blocks all
    events, which interferes with the popover functioning. If you need to disable a button that
    triggers a popover, you should use [`AnchorButton`](#core/components/button.anchor-button) instead.
    See the [callout here](#core/components/button.javascript-api) for more details.
</div>

```tsx
const { Popover, PopoverInteractionKind, Position } = "@blueprintjs/core";

export class PopoverExample extends React.Component<{}, {}> {
    public render() {
        let popoverContent = (
            <div>
                <h5>Popover title</h5>
                <p>...</p>
                <button className="pt-button pt-popover-dismiss">Dismiss</button>
            </div>
        );

        // popover content gets no padding by default, so we can add the
        // .pt-popover-content-sizing class to get nice padding between
        // the edge of the popover and our popover content. We also get
        // a default width for our content if the popover is inline.
        return (
            <Popover
                content={popoverContent}
                interactionKind={PopoverInteractionKind.CLICK}
                popoverClassName="pt-popover-content-sizing"
                position={Position.RIGHT}
            >
                <button className="pt-button pt-intent-primary">Popover target</button>
            </Popover>
        );
    }
}
```

@interface IPopoverProps

@### Controlled mode

If you prefer to have more control over your popover's behavior, you can specify the `isOpen`
property to use the component in __controlled mode__. You are now in charge of the component's
state.

Providing a non-null value for `isOpen` disables all automatic interaction and instead invokes
the `onInteraction` callback prop any time the opened state _would have changed_ in response to
user interaction under the current `interactionKind`. As a result, the `isDisabled` prop is
incompatible with `isOpen`, and an error is thrown if both are set.

Note that there are cases where `onInteraction` is invoked with an unchanged open state.
It is important to pay attention to the value of the `nextOpenState` parameter and determine
in your application logic whether you should care about a particular invocation (for instance,
if the `nextOpenState` is not the same as the `Popover`'s current state).

##### Example controlled usage

```tsx
const { Popover, Position } = "@blueprintjs/core";

export class ControlledPopoverExample extends React.Component<{}, { isOpen: boolean }> {
    public state = { isOpen: false };

    public render() {
        let popoverContent = (
            <div>
                <h5>Popover Title</h5>
                <p>...</p>
                <button class="pt-button pt-popover-dismiss">Close popover</button>
            </div>
        );

        return (
            <Popover
                content={popoverContent}
                interactionKind={PopoverInteractionKind.CLICK}
                isOpen={this.state.isOpen}
                onInteraction={(state) => this.handleInteraction(state)}
                position={Position.RIGHT}
            >
                <button className="pt-button pt-intent-primary">Popover target</button>
            </Popover>
        );
    }

    private handleInteraction(nextOpenState: boolean) {
        this.setState({ isOpen: nextOpenState });
    }
}
```

@### Inline popovers

By default, popover contents are rendered in a newly created element appended to `document.body`.

This works well for most layouts, because you want popovers to appear above everything else in your
application without having to manually adjust z-indices. For these "detached" popovers, we use the
[Tether](http://github.hubspot.com/tether/) library to handle positioning popovers correctly
relative to their targets. Tether is great at maintaining position in complex, dynamic UIs.

However, there are cases where it's preferable to render the popover contents inline.

Take, for example, a scrolling table where certain cells have tooltips attached to them. As row
items go out of view, you want their tooltips to slide out of the viewport as well. This is best
accomplished with inline popovers. Enable this feature by setting `inline={true}`.

It is also important to note that "inline" popovers are much more performant than "detached" ones,
particularly in response to page scrolling, because their position does not need to be recomputed on
every interaction.

@### Opening & closing popovers

<div class="pt-callout pt-intent-success pt-icon-info-sign">
    <h5>Conditionally styling popover targets</h5>
    When a popover is open, the target has a `.pt-popover-open` class applied to it.
    You can use this to style the target differently depending on whether the popover is open.
</div>

The different interaction kinds specify whether the popover closes when the user interacts with the
target or the rest of the document, but by default, a user interacting with a popover's *contents*
does __not__ close the popover.

To enable click-to-close behavior on an element inside a popover, simply add the class
`pt-popover-dismiss` to that element. The "Dismiss" button in the demo [above](#core/components/popover)
has this class. To enable this behavior on the entire popover, pass the
`popoverClassName="pt-popover-dismiss"` prop.

Note that dismiss elements won't have any effect in a popover with
`PopoverInteractionKind.HOVER_TARGET_ONLY` because there is no way to interact with the popover
content itself (the popover is dismissed the moment the user mouses away from the target).

@### Modal popovers

Setting the `isModal` prop to `true` will:

- Render a transparent backdrop beneath the popover that covers the entire viewport and prevents
interaction with the document until the popover is closed. This is useful for preventing stray
clicks or hovers in your app when the user tries to close a popover.
- Focus the popover when opened to allow keyboard accessibility.

Clicking the backdrop will:

- _in uncontrolled mode_, close the popover.
- _in controlled mode_, invoke the `onInteraction` callback with an argument of `false`.

Modal behavior is only available for popovers with `interactionKind={PopoverInteractionKind.CLICK}`
and an error is thrown if used otherwise.

By default, the popover backdrop is invisible, but you can easily add your own styles to
`.pt-popover-backdrop` to customize the appearance of the backdrop (for example, you could give it
a translucent background color, like the backdrop for the [`Dialog`](#core/components/dialog) component).

The backdrop element has the same opacity fade transition as the `Dialog` backdrop.

<div class="pt-callout pt-intent-danger pt-icon-error">
    <h5>Dangerous edge case</h5>
    Rendering a `<Popover isOpen={true} isModal={true}>` outside the viewport bounds can easily break
    your application by covering the UI with an invisible non-interactive backdrop. This edge case
    must be handled by your application code or simply avoided if possible.
</div>

@### Sizing popovers

Popovers by default have a max-width but no max-height. To constrain the height of a popover
and make its content scrollable, set the appropriate CSS rules on `.pt-popover-content`:

```css.less
// pass "my-popover" to `popoverClassName` prop.
.my-popover .pt-popover-content {
    max-height: $pt-grid-size * 30;
    overflow-y: auto;
}
```

@### SVG popover

`SVGPopover` is a convenience component provided for SVG contexts. It is a simple wrapper around
`Popover` that sets `rootElementTag="g"`.

@### Minimal popovers

You can create a minimal popover with the `pt-minimal` modifier: `popoverClassName="pt-minimal"`.
This removes the arrow from the popover and makes the transitions more subtle.

This minimal style is recommended for popovers that are not triggered by an obvious action like the
user clicking or hovering over something. For example, a minimal popover is useful for making
typeahead menus where the menu appears almost instantly after the user starts typing.

Minimal popovers are also useful for context menus that require quick enter and leave animations to
support fast workflows. You can see an example in the [context menus](#core/components/context-menu)
documentation.

@### Dark theme

The `Popover` component automatically detects whether its trigger is nested inside a `.pt-dark`
container and applies the same class to itself. You can also explicitly apply the dark theme to
the React component by providing the prop `popoverClassName="pt-dark"`.

As a result, any component that you place inside a `Popover` (such as a `Menu`) automatically
inherits the dark theme styles. Note that `Tooltip` uses `Popover` internally, so it also benefits
from this behavior.

This behavior can be disabled when the `Popover` is not rendered inline via the `inheritDarkTheme`
prop.
