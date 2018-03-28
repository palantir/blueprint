@# Labels

Labels enhance the usability of your forms.

<div class="@ns-callout @ns-intent-success @ns-icon-comparison">
    <h4 class="@ns-callout-title">Simple labels vs. form groups</h4>
    <p>Blueprint provides two ways of connecting label text to control fields, depending on the complexity of the control.</p>
    <p>Simple labels are a basic way to connect a label with a single control.</p>
    <p>Form groups support more complex control layouts but require more markup to maintain consistent visuals.</p>
</div>

@## CSS API

@### Simple labels

Simple labels are useful for basic forms for a single `<input>`.

- Add extra information to the label with `span.@ns-text-muted`.

- Putting the `<input>` element _inside_ a `<label>` element increases the area where the user
can click to activate the control. Notice how in the examples below, clicking a `<label>` focuses its `<input>`.

@css label

@### Disabled labels

Add the `.@ns-label` and `.@ns-disabled` class modifiers to a `<label>` to make the label appear
disabled.

This styles the label text, but does not disable any nested children like inputs or selects. You
must add the `:disabled` attribute directly to any nested elements to disable them. Similarly the respective
`@ns-*` form control will need a `.@ns-disabled` modifier. See the examples below.

@css label-disabled

@## JavaScript API

The `Label` component is available in the __@blueprintjs/core__ package. Make sure to review the [getting started docs for installation info](#blueprint/getting-started).

This component is a simple wrapper around the corresponding CSS API. It supports the full range of HTML props.

```tsx
<Label
    helperText="Helper text with details..."
    text="Label A"
>
    <input className="@ns-input" id="text-input" placeholder="Placeholder text" />
</Label>
```

@interface ILabelProps
