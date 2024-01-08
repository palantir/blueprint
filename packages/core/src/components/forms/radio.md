@# Radio

A radio button typically represents a single option in a mutually exclusive list (where only one item can be
selected at a time). Blueprint provides **Radio** and **RadioGroup** components for these two layers.

@reactExample RadioExample

@## Usage

Typically, radio buttons are used in a group to choose one option from several, similar to how a `<select>` element
contains several `<option>` elements. As such, you can use the **RadioGroup** component with a series of **Radio** children.
**RadioGroup** is responsible for managing state and interaction.

```tsx
<RadioGroup label="Lunch special" onChange={handleMealChange} selectedValue={mealType}>
    <Radio label="Soup" value="one" />
    <Radio label="Salad" value="two" />
    <Radio label="Sandwich" value="three" />
</RadioGroup>
```

@## Props interface

**Radio** supports the full range of HTML `<input>` attributes.

@interface RadioProps

@### RadioGroup

@interface RadioGroupProps

@interface OptionProps

@## CSS

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">

Deprecated API: use [`<Checkbox>`](#core/components/checkbox)

</h5>

CSS APIs for Blueprint components are considered deprecated, as they are verbose, error-prone, and they
often fall out of sync as the design system is updated. You should use the React component APIs instead.

</div>

Blueprint's custom radio buttons use an extra `.@ns-control-indicator` element after the `<input>` to achieve their
custom styling. You should then wrap the whole thing in a `<label>` with the classes `.@ns-control.@ns-radio`.

Note that attribute modifiers (`:checked`, `:disabled`) are applied on the internal `<input>` element.

@css radio
