@# Skeletons

Skeletons allow you to show a loading state that mimics the shape of your yet-to-load content.

@## CSS API

Apply the class `.@ns-skeleton` to elements that you would like to cover up with a loading animation.
The skeleton inherits the dimensions of whatever element the class is applied to. This means that
when using skeletons to show loading text, you should use some sort of placeholder text that is
approximately the length of your expected text.

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign">
    <h4 class="@ns-callout-title">Manually disable focusable elements</h4>
    When using the `.@ns-skeleton` class on focusable elements such as inputs and buttons, be sure to
    disable the element, via either the `disabled` or `tabindex="-1"` attributes. Failing to do so
    will allow these skeleton elements to be focused when they shouldn't be.
</div>

@css skeleton
