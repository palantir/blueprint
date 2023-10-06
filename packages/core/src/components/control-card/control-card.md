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

Card with an embedded [**Switch**](#core/components/switch) control.

@reactExample SwitchCardExample

@### Props interface

Most of the properties in [**CardProps**](#core/components/card.props-interface) and
[**SwitchProps**](#core/components/switch.props-interface) are available on the root component.

@interface SwitchCardProps

@## Composing with CardList

Control cards work just like regular cards inside a [**CardList**](#core/components/card-list).

@reactExample ControlCardListExample
