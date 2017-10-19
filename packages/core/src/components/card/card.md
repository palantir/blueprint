@# Cards

A card is a bounded unit of UI content with a solid background color.

@## CSS API

Start with `.pt-card` and add an elevation modifier class to apply a drop shadow that simulates
height in the UI.

You can also use the `.pt-elevation-*` classes by themselves to apply shadows to any arbitrary
element.

@css pt-card

@### Interactive cards

Add the `.pt-interactive` modifier class to make a `.pt-card` respond to user interactions. When you
hover over cards with this class applied, the mouse changes to a pointer and the elevation shadow on
the card increases by two levels.

Users expect an interactive card to be a single clickable unit.

@css pt-card.pt-interactive

@## JavaScript API

Then `Card` component is available in the __@blueprintjs/core__ package.
Make sure to review the [general usage docs for JS components](#blueprint.usage).

This component is a simple wrapper around the CSS API that abstracts away the HTML complexity.

```
<Card interactive={true} elevation={Card.ELEVATION_TWO}>
    <h5><a href="#">Card heading</a></h5>
    <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eget tortor felis.
    Fusce dapibus metus in dapibus mollis. Quisque eget ex diam.
    </p>
    <button type="button" className={Classes.BUTTON}>Submit</button>
</Card>
```

@reactExample CardExample

@interface ICardProps
