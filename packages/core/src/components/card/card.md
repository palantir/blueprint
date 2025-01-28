@# Card

A **Card** is a bounded container for grouping related content with a solid
background color. It offers customizable padding, interactivity, and elevation.

@## Import

```tsx
import { Card } from "@blueprintjs/core";
```

@## Usage

A **Card** provides a structured container for text, actions, or other content.
Use it to present a cohesive unit of information.

@reactCodeExample CardBasicExample

@## Interactive

The `interactive` prop makes a **Card** appear responsive to hover and click events.
Combine it with an `onClick` handler to perform actions when the card is clicked,
such as navigation or selection.

Additionally, the `selected` prop can be used to indicate a selection state.

@reactCodeExample CardInteractiveExample

@## Compact

Enable the `compact` prop to reduce the padding of the **Card**, resulting in a more condensed appearance.

@reactCodeExample CardCompactExample

@## Elevation

The `elevation` prop controls the shadow depth of the **Card**, creating a visual
hierarchy. Five elevations are supported, from 0 to 4. Higher elevation values
make the **Card** appear more prominent.

> Note that the `Classes.ELEVATION_*` classes can be used on any element (not just a `Card`) to apply the box shadow.

@reactCodeExample CardElevationExample

@## Interactive Playground

@reactExample CardPlaygroundExample

@## Props interface

@interface CardProps

@## CSS API

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">

Deprecated API: use [`<Card>`](#core/components/card)

</h5>

CSS APIs for Blueprint components are considered deprecated, as they are verbose, error-prone, and they
often fall out of sync as the design system is updated. You should use the React component APIs instead.

</div>

Start with `.@ns-card` and add an elevation class `.@ns-elevation-*` to apply a drop shadow that simulates height in
the UI.

Add the `.@ns-interactive` modifier class to make a `.@ns-card` respond to user interactions. When you hover over cards
with this class applied, the mouse changes to a pointer and increases the elevation shadow on the card.

@css card
