@# Label

__Labels__ enhance the usability of your forms.

Wrapping a `<label>` element around a form input effectively increases the area where the user can click to activate
the control. Notice how in the examples below, clicking a label focuses its `<input>`.

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">Prefer form groups over labels</h5>

The [__FormGroup__ component](#core/components/form-group) provides additional functionality such as helper text and
modifier props as well as full label support. __FormGroup__ supports both simple and complex use cases, therefore we
recommend using it exclusively when constructing forms.

</div>

@## Usage

```tsx
<Label>
    Label A
    <input className={Classes.INPUT} placeholder="Placeholder text" />
</Label>

<Label htmlFor="input-b">Label B</Label>
<input className={Classes.INPUT} id="input-b" placeholder="Placeholder text" />
```

@## Props

This component supports the full range of `<label>` DOM attributes.

@interface LabelProps

@## CSS API

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">

Deprecated API: use [`<Label>`](#core/components/forms/label)

</h5>

CSS APIs for Blueprint components are considered deprecated, as they are verbose, error-prone, and they
often fall out of sync as the design system is updated. You should use the React component APIs instead.

</div>

Simple labels are useful for basic forms for a single `<input>`.

Apply disabled styles with the `@ns-disabled` class. This styles the label text, but does not disable any nested
children like inputs or selects. You must add the `:disabled` attribute directly to any nested elements to disable them.
Similarly the respective `@ns-*` form control will need a `.@ns-disabled` modifier. See the examples below.

@css label
