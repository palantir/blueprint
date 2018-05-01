@# Form groups

Form groups support more complex form controls than [simple labels](#core/components/forms/label.simple-labels),
such as [control groups](#core/components/forms/control-group) or [`NumericInput`](#core/components/forms/numeric-input).
They also support additional helper text to aid with user navigation.

@## CSS API

- Link each label to its respective control element with a `for={#id}` attribute on the `<label>` and
`id={#id}` on the control.

- Add `.@ns-intent-*` or `.@ns-disabled` to `.@ns-form-group` to style the label and helper text.
Similar to labels, nested controls need to be styled separately.

- Add `.@ns-inline` to `.@ns-form-group` to place the label to the left of the control.

- Add `.@ns-large` to `.@ns-form-group` to align the label when used with large inline Blueprint controls.

@css form-group

@## JavaScript API

The `FormGroup` component is available in the __@blueprintjs/core__ package.
Make sure to review the [getting started docs for installation info](#blueprint/getting-started).

This component is a simple wrapper around the CSS API that abstracts away the HTML complexity.

```tsx
<FormGroup
    helperText="Helper text with details..."
    label="Label A"
    labelFor="text-input"
    requiredLabel={true}
>
    <input id="text-input" placeholder="Placeholder text" />
</FormGroup>
```

@interface IFormGroupProps
