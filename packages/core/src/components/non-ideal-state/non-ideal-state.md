---
parent: components
---

@# Non-ideal state

Non-ideal UI states inform the user that some content is unavailable. There are several types of
non-ideal states, including:

* **Empty state:** a container has just been created and has no data in it yet,
  or a container's contents have been intentionally removed.
* **Loading state:** a container is awaiting data. A good practice is to show a
  spinner for this state, with optional explanatory text below the spinner.
* **Error state:** something went wrong (for instance, 404 and 500 HTTP errors).
  In this case, a good practice is to add a call to action directing the user
  what to do next.

@reactExample NonIdealStateExample

@## Props

The props are rendered in this order in the DOM, with comfortable spacing between each child:

1. `icon`
1. text (`title` + optional `description`)
1. `action`
1. `children`

By default, a vertical layout is used, but you can make it horizontal with `layout="horizontal"`.

Icons take on a muted appearance inside this component, but their shape contrast is preserved
by adding a small stroke to the SVG paths.

@interface INonIdealStateProps

@## CSS

Apply the `.@ns-non-ideal-state` class to the root container element and wrap the icon
element with a `.@ns-non-ideal-state-visual` container.

The root container should only have direct element children, no grandchildren (except
for text, which is enclosed in a `.@ns-non-ideal-state-text` wrapper element). This
constraint ensures proper spacing between each child.

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign">
    <h4 class="@ns-heading">Limited CSS API support</h4>

Note that you are required to set the `font-size` and `line-height` styles for
the icon element to render it properly.

Also, since the CSS API uses the icon font, Blueprint styles cannot adjust the icon visual
design to have a muted appearance like it does with the React component API. This means
NonIdealState elements rendered with this API will stand out visually within the design system.
</div>

@css non-ideal-state
