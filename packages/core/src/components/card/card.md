---
parent: components
---

# Cards

A card is a bounded unit of UI content with a solid background color.

## CSS API

Start with `.pt-card` and add an elevation modifier class to apply a drop shadow that simulates
height in the UI.

You can also use the `.pt-elevation-*` classes by themselves to apply shadows to any arbitrary
element.

Markup:
<div class="pt-card {{.modifier}}">
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec dapibus et mauris,
vitae dictum metus.
</div>

.pt-elevation-0 - Ground floor. This level provides just a gentle border shadow.
.pt-elevation-1 - First. Subtle drop shadow intended for static containers.
.pt-elevation-2 - Second. An even stronger shadow, moving on up.
.pt-elevation-3 - Third. For containers overlaying content temporarily.
.pt-elevation-4 - Fourth. The strongest shadow, usually for overlay containers on top of backdrops.

### Interactive cards

Add the `.pt-interactive` modifier class to make a `.pt-card` respond to user interactions. When you
hover over cards with this class applied, the mouse changes to a pointer and the elevation shadow on
the card increases by two levels.

Users expect an interactive card to be a single clickable unit.

Markup:
<div class="docs-card-example">
<div class="pt-card pt-elevation-0 pt-interactive">
<h5><a href="#">Trader Profile</a></h5>
<p>Overview of employee activity, including risk model, scores and scenario alert history.</p>
</div>
<div class="pt-card pt-elevation-1 pt-interactive">
<h5><a href="#">Desk Profile</a></h5>
<p>Desk-level summary of trading activity and trading profiles.</p>
</div>
<div class="pt-card pt-elevation-2 pt-interactive">
<h5><a href="#">Dataset Dashboards</a></h5>
<p>Stats of dataset completeness and reference data join percentages.</p>
</div>
</div>
