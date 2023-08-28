@# Form group

Form groups support more complex form controls than [simple labels](#core/components/label),
such as [control groups](#core/components/control-group) or [`NumericInput`](#core/components/numeric-input).
They also support additional helper text to aid with user navigation.

@reactExample FormGroupExample

@## Props

This component is a lightweight wrapper around its children with props for the
label above and helper text below.

```tsx
<FormGroup
    helperText="Helper text with details..."
    label="Label A"
    labelFor="text-input"
    labelInfo="(required)"
>
    <InputGroup id="text-input" placeholder="Placeholder text" />
</FormGroup>
```

@interface FormGroupProps

@## CSS

- Link each label to its respective control element with a `for={#id}` attribute on the `<label>` and
`id={#id}` on the control.

- Add `.@ns-intent-*` or `.@ns-disabled` to `.@ns-form-group` to style the label and helper text.
Similar to labels, nested controls need to be styled separately.

- Add `.@ns-inline` to `.@ns-form-group` to place the label to the left of the control.

- Add `.@ns-large` to `.@ns-form-group` to align the label when used with large inline Blueprint controls.

@css form-group
