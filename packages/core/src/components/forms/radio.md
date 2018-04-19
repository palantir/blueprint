@# Radios

Blueprint's custom radio buttons use an extra `.@ns-control-indicator` element after the `<input>`
to achieve their custom styling. You should then wrap the whole thing in a `<label>` with the
classes `.@ns-control.@ns-radio`.

Note that attribute modifiers (`:checked`, `:disabled`) are applied on the internal `<input>`
element.

@reactExample RadioExample

@## CSS API

@css radio

@## JavaScript API

The `Radio` and `RadioGroup` components are available in the __@blueprintjs/core__ package. Make
sure to review the [getting started docs for installation info](#blueprint/getting-started).

Typically, radio buttons are used in a group to choose one option from several, similar to how a
`<select>` tag contains several `<option>` tags. As such, you can use the `RadioGroup` component
with a series of `Radio` children. `RadioGroup` is responsible for managing state and interaction.

```tsx
<RadioGroup
    label="Meal Choice"
    onChange={this.handleMealChange}
    selectedValue={this.state.mealType}
>
    <Radio label="Soup" value="one" />
    <Radio label="Salad" value="two" />
    <Radio label="Sandwich" value="three" />
</RadioGroup>
```

Note that this component supports the full range of props available on HTML `input` elements.
The most common options are detailed below.

@interface IRadioProps

@### RadioGroup

@interface IRadioGroupProps

@interface IOptionProps
