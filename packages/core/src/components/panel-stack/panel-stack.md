@# Panel stack

`PanelStack` is a component designed to render multiple panels from a stack, but only display the
top most panel at any given time.

It will render each panel with a header and uses [`CSSTransition`](http://reactcommunity.org/react-transition-group/css-transition)
to seamlessly move between panels. Whenever there is more than a single panel on the stack, `Panel Stack` will display a back
button allowing the user to easily move to the previous panel.

Any component can become a panel if it implements `IPanelProps`. The panel can then either open additional
panels, adding these new components to the top of the panel stack, or it can programatically close itself
provided it is not the only panel left in the stack.

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">
    <h4 class="@ns-heading">A note about closing a panel</h4>
    Try and avoid calling `closePanel()` as much as possible since there is a back button in the header.
</div>

@reactExample PanelStackExample

@## Props

@interface IPanelStackProps

@interface IPanel
