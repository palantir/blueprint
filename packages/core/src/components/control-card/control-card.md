---
tag: new
---

@# Control card

A control card is an interactive [**Card**](#core/components/card) with an embedded form control.
There are a few supported form controls:

-   [**SwitchCard**](#core/components/control-card.switch-card)
-   [**CheckboxCard**](#core/components/control-card.checkbox-card)
-   RadioCard (_coming soon_)

The children of a control card will be used as the `labelElement` of the form control. Users may click anywhere
inside the card to toggle the control state.

By default, a "checked" control card will be displayed with the same appearance as a "selected" card. This behavior
may be toggled with the `showAsSelectedWhenChecked` prop.

@## Switch card

Card with an embedded [**Switch**](#core/components/switch) control (right-aligned by default).

Most of the properties in [**CardProps**](#core/components/card.props-interface) and
[**SwitchProps**](#core/components/switch.props-interface) are available on the root component.

@reactExample SwitchCardExample

@interface SwitchCardProps

@## Checkbox card

Card with an embedded [**Checkbox**](#core/components/checkbox) control (left-aligned by default).

Most of the properties in [**CardProps**](#core/components/card.props-interface) and
[**CheckboxProps**](#core/components/checkbox.props-interface) are available on the root component.

@reactExample CheckboxCardExample

@interface CheckboxCardProps

@## Combining with CardList

Control cards work just like regular cards inside a [**CardList**](#core/components/card-list).

@reactExample ControlCardListExample
