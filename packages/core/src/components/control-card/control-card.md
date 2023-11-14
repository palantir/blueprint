---
tag: new
---

@# Control card

A control card is an interactive [**Card**](#core/components/card) with an embedded form control.
There are a few supported form controls, each has a corresponding component API:

-   [**SwitchCard**](#core/components/control-card.switch-card)
-   [**CheckboxCard**](#core/components/control-card.checkbox-card)
-   [**RadioCard**](#core/components/control-card.radio-card)

The label may be specified as either `children` (`React.ReactNode`) or the `label` prop (`string`).

Users may click anywhere inside the card to toggle the control state.

By default, a "checked" control card will be displayed with the same appearance as a "selected" card.
This behavior may be toggled with the `showAsSelectedWhenChecked` prop.

@## Switch card

Card with an embedded [**Switch**](#core/components/switch) control (right-aligned by default).

Most of the properties in [**CardProps**](#core/components/card.props-interface) and
[**SwitchProps**](#core/components/switch.props-interface) are available on the root component.

@reactExample SwitchCardExample

@## Checkbox card

Card with an embedded [**Checkbox**](#core/components/checkbox) control (left-aligned by default).

Most of the properties in [**CardProps**](#core/components/card.props-interface) and
[**CheckboxProps**](#core/components/checkbox.props-interface) are available on the root component.

@reactExample CheckboxCardExample

@## Radio card

Card with an embedded [**Radio**](#core/components/radio) control (left-aligned by default).

Most of the properties in [**CardProps**](#core/components/card.props-interface) and
[**RadioProps**](#core/components/radio.props-interface) are available on the root component.

Just like the **Radio** component, a **RadioCard** is usually contained in a
[**RadioCardGroup**](#core/components/radio.radiogroup) which manages its selection state.

```tsx
import { RadioGroup, RadioCard } from "@blueprintjs/core";
import React from "react";

function RadioCardGroupExample() {
    const [selectedValue, setSelectedValue] = React.useState<string | undefined>();
    const handleChange = React.useCallback((event: React.FormEvent<HTMLInputElement>) => {
        setSelectedValue(event.currentTarget.value);
    }, []);

    return (
        <RadioGroup selectedValue={selectedValue} onChange={handleChange} label="Lunch Special">
            <RadioCard label="Soup" value="soup" />
            <RadioCard label="Salad" value="salad" />
            <RadioCard label="Sandwich" value="sandwich" />
        </RadioGroup>
    );
}
```

@reactExample RadioCardGroupExample

@## Props interface

@interface ControlCardProps

@## Combining with CardList

Control cards work just like regular cards inside a [**CardList**](#core/components/card-list).

@reactExample ControlCardListExample
