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

The props are rendered in this order in the DOM, with comfortable vertical
spacing between each child:

1. `icon`
1. `title`
1. `description`
1. `action`
1. `children`

@interface INonIdealStateProps

@## CSS

Apply `.@ns-non-ideal-state` to the container and `.@ns-non-ideal-state-visual`
to the icon element. The container should only have direct element children (all
text should be wrapped in an enclosing element) for proper spacing between each
child.

@css non-ideal-state
