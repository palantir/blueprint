@# Form groups

Form groups support more complex form controls than [simple labels](#core/components/forms/label.simple-labels),
such as [control groups](#core/components/forms/control-group) or [`NumericInput`](#core/components/forms/numeric-input).
They also support additional helper text to aid with user navigation.

@## CSS API

- Link each label to its respective control element with a `for={#id}` attribute on the `<label>` and
`id={#id}` on the control.

- Add `.pt-intent-*` or `.pt-disabled` to `.pt-form-group` to style the label and helper text.
Similar to labels, nested controls need to be styled separately.

- Add `.pt-inline` to `.pt-form-group` to place the label to the left of the control.

- Add `.pt-large` to `.pt-form-group` to align the label when used with large inline Blueprint controls.

@css pt-form-group

@## JavaScript API

The `FormGroup` component is available in the __@blueprintjs/core__ package.
Make sure to review the [general usage docs for JS components](#blueprint.usage).

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
