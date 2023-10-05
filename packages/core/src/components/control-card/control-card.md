---
tag: new
---

@# Control card

A control card is an interactive [**Card**](#core/components/card) with an embedded form control.
There are a few supported form controls:

-   [**SwitchCard**](#core/components/control-card.switch-card)
-   CheckboxCard (_coming soon_)
-   RadioCard (_coming soon_)

The children of a control card will be used as the `labelElement` of the form control. Users may click anywhere
inside the card to toggle the control state.

@## SwitchCard

Card with an embedded [**Switch**](#core/components/switch) control. Most of the **Card** and **Switch** props are
available on the root component.

@reactExample SwitchCardExample

@### Props interface

@interface SwitchCardProps
