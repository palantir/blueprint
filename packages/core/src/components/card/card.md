@# Card

A card is a bounded unit of UI content with a solid background color.

@reactExample CardExample

@## Elevation

Apply an `elevation` value to a card to apply a drop shadow that simulates
height in the UI. Five elevations are supported, from 0 to 4.

The `Classes.ELEVATION_*` constants can be used on any element (not just a
`Card`) to apply the drop shadow.

@## Props

This component is a simple stateless container for its children.

```tsx
import { Button, Card, Elevation } from "@blueprintjs/core";

<Card interactive={true} elevation={Elevation.TWO}>
    <h5><a href="#">Card heading</a></h5>
    <p>Card content</p>
    <Button>Submit</Button>
</Card>
```

@interface ICardProps

@## CSS

Start with `.@ns-card` and add an elevation class `.@ns-elevation-*` to apply a
drop shadow that simulates height in the UI.

Add the `.@ns-interactive` modifier class to make a `.@ns-card` respond to user
interactions. When you hover over cards with this class applied, the mouse
changes to a pointer and increases the elevation shadow on the card.

@css card
