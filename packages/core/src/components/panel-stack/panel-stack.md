@# Panel Stack

`Panel Stack` is a component designed to render multiple panels from a stack, but only display the
top most panel at any given time.

It will render each panel with a title header and uses [`CSSTransitionGroup`](https://facebook.github.io/react/docs/animation.html)
to seamlessly transition between displaying panels. When panels transition, it displays a back
button to the previous panel, found in the header.

Any component can become a panel if it implements `IPanelProps`. The panel can then either open additional
panels, adding these new components to the top of the panel stack, or it can programatically close itself
if it is not the only panel in the stack.

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">
    <h4 class="@ns-heading">A note about closing a panel</h4>
    Try and avoid calling this method as much as possible since there is a back button in the header.
</div>

@reactExample PanelStackExample

@## Props

The `Panel Stack` component is available in the __@blueprintjs/core__ package.
Make sure to review the [general usage docs for JS components](#blueprint.usage).

`Panel Stack` will only render when given an initial panel with a title, and can only render
panels that both have an associated component and also a title.

The `onClose` callback prop is invoked whenever a panel closes and the `onOpen` callback prop
whenever a panel opens. Both return the panel the callback just acted on.

@interface IPanelStackProps

@interface IPanel
