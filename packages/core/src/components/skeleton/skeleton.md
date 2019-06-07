@# Skeleton

Skeletons provide a loading state that mimics the shape of your yet-to-load content.

This "component" is a single constant `Classes.SKELETON` that, when applied to
an element through `className`, will cover its content with a loading animation.
The skeleton inherits the dimensions of whatever element the class is applied
to, so you should supply a placeholder while awaiting real content.

@css skeleton

@## CSS

Apply the class `.@ns-skeleton` to elements that you would like to cover up with
a loading animation.

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign">
    <h4 class="@ns-heading">Manually disable focusable elements</h4>

When using the `.@ns-skeleton` class on focusable elements such as inputs
and buttons, be sure to disable the element, via either the `disabled` or
`tabindex="-1"` attributes. Failing to do so will allow these skeleton
elements to be focused when they shouldn't be.

</div>

