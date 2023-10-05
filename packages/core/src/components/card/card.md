@# Card

A **Card** is a bounded unit of UI content with a solid background color.

@reactExample CardExample

@## Usage

```tsx
import { Button, Card, Elevation } from "@blueprintjs/core";

<Card interactive={true} elevation={Elevation.TWO}>
    <h5>
        <a href="#">Card heading</a>
    </h5>
    <p>Card content</p>
    <Button>Submit</Button>
</Card>;
```

@## Elevation

Apply an `elevation` value to a card to apply a drop shadow that simulates height in the UI.
Five elevations are supported, from 0 to 4.

Note that the `Classes.ELEVATION_*` classes can be used on any element (not just a `Card`) to apply the drop shadow.

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
