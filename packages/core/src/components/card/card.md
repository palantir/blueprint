@# Cards

A card is a bounded unit of UI content with a solid background color.

@## CSS API

Start with `.@ns-card` and add an elevation modifier class to apply a drop
shadow that simulates height in the UI.

You can also use the `.@ns-elevation-*` classes by themselves to apply shadows
to any arbitrary element.

@css card

@### Interactive cards

Add the `.@ns-interactive` modifier class to make a `.@ns-card` respond to user
interactions. When you hover over cards with this class applied, the mouse
changes to a pointer and increases the elevation shadow on the card.

Users expect an interactive card to be a single clickable unit.

@css card-interactive

@## JavaScript API

Then `Card` component is available in the __@blueprintjs/core__ package.
Make sure to review the [getting started docs for installation info](#blueprint/getting-started).

This component is a simple wrapper around the CSS API.

```tsx
import { Button, Card, Elevation } from "@blueprintjs/core";

<Card interactive={true} elevation={Elevation.TWO}>
    <h5><a href="#">Card heading</a></h5>
    <p>Card content</p>
    <Button>Submit</Button>
</Card>
```

@reactExample CardExample

@interface ICardProps
