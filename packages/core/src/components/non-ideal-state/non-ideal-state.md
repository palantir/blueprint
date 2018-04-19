---
parent: components
---

@# Non-ideal state

Non-ideal UI states inform the user that some content is unavailable. There are several types of
non-ideal states, including:

* Blank states (when a container has just been created and has no data in it yet,
or when a container's contents have been intentionally removed)
* Loading states (when a container is preparing to populate with data).
A good practice is to show a spinner for this state, with optional explanatory text
below the spinner.
* Error states (when something went wrong&mdash;for instance, 404 and 500 HTTP errors).
In this case, a good practice is to add a call to action directing the user what to do next.

@## CSS API

You may use the provided styles without using the React component described below.
See the example below.

@css non-ideal-state

@## JavaScript API

The `NonIdealState` component is available in the __@blueprintjs/core__ package.
Make sure to review the [getting started docs for installation info](#blueprint/getting-started).

A `NonIdealState` component's props determine the content displayed. The content should
reflect the situation the user is in: no files found, an empty document, a 404 error, etc.

@interface INonIdealStateProps

@reactExample NonIdealStateExample
