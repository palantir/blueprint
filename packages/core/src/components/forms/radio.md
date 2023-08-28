@# Radio

A radio button typically represents a single option in a mutually exclusive list
(where only one item can be selected at a time). Blueprint provides `Radio` and
`RadioGroup` components for these two layers.

@reactExample RadioExample

@## Props

Typically, radio buttons are used in a group to choose one option from several,
similar to how a `<select>` tag contains several `<option>` tags. As such, you
can use the `RadioGroup` component with a series of `Radio` children.
`RadioGroup` is responsible for managing state and interaction.

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

`Radio` supports the full range of HTML `<input>` props.
The most common options are detailed below.

@interface RadioProps

@### RadioGroup

@interface RadioGroupProps

@interface OptionProps

@## CSS

Blueprint's custom radio buttons use an extra `.@ns-control-indicator` element
after the `<input>` to achieve their custom styling. You should then wrap the
whole thing in a `<label>` with the classes `.@ns-control.@ns-radio`.

Note that attribute modifiers (`:checked`, `:disabled`) are applied on the
internal `<input>` element.

@css radio
