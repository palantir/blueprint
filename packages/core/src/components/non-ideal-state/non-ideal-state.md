---
parent: components
---

@# Non-ideal state

[Non-ideal UI states](https://github.com/palantir/blueprint/wiki/Non-ideal-UI-states)
inform the user that some content is unavailable. There are several types of non-ideal states,
including:

* blank states (when a container has just been created and has no data in it yet,
or when a container's contents have been intentionally removed)
* loading states (when a container is preparing to populate with data).
A good practice is to show a spinner for this state, with optional explanatory text
below the spinner.
* error states (when something went wrong&mdash;for instance, 404 and 500 HTTP errors).
In this case, a good practice is to add a call to action directing the user what to do next.

@## CSS API

You may use the provided styles without using the [React component](#components.nonidealstate.js).
See the example below.

Markup:
<div class="pt-non-ideal-state">
<div class="pt-non-ideal-state-visual pt-non-ideal-state-icon">
<span class="pt-icon pt-icon-folder-open"></span>
</div>
<h4 class="pt-non-ideal-state-title">This folder is empty</h4>
<div class="pt-non-ideal-state-description">
Create a new file to populate the folder.
</div>
</div>

@## JavaScript API

The `NonIdealState` component is available in the __@blueprintjs/core__ package.
Make sure to review the [general usage docs for JS components](#components.usage).

A `NonIdealState` component's props determine the content displayed. The content should
reflect the situation the user is in: no files found, an empty document, a 404 error, etc.

@interface INonIdealStateProps

@reactExample NonIdealStateExample
