@# Label

Labels enhance the usability of your forms.

Wrapping a `<label>` element around a form input effectively increases the area
where the user can click to activate the control. Notice how in the examples
below, clicking a label focuses its `<input>`.

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign">
    <h4 class="@ns-heading">Prefer form groups over labels</h4>

The [React `FormGroup` component](#core/components/form-group) provides
additional functionality such as helper text and modifier props as well as
full label support. `FormGroup` supports both simple and complex use cases,
therefore we recommend using it exclusively when constructing forms.

</div>

@## Props

This component supports the full range of HTML props.

```tsx
<Label>
    Label A
    <input className={Classes.INPUT} placeholder="Placeholder text" />
</Label>

<Label htmlFor="input-b">Label B</Label>
<input className={Classes.INPUT} id="input-b" placeholder="Placeholder text" />
```

@interface ILabelProps

@## CSS

Simple labels are useful for basic forms for a single `<input>`.

Apply disabled styles with the `@ns-disabled` class. This styles the label text,
but does not disable any nested children like inputs or selects. You must add
the `:disabled` attribute directly to any nested elements to disable them.
Similarly the respective `@ns-*` form control will need a `.@ns-disabled`
modifier. See the examples below.

@css label
