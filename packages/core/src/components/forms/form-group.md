@# Form group

Form groups support more complex form controls than [simple labels](#core/components/label),
such as [control groups](#core/components/control-group) or [`NumericInput`](#core/components/numeric-input).
They also support additional helper text to aid with user navigation.

@## Import

```tsx
import { FormGroup } from "@blueprintjs/core";
```

@reactExample FormGroupExample

@## Props

This component is a lightweight wrapper around its children with props for the
label above and helper text below.

```tsx
<FormGroup helperText="Helper text with details..." label="Label A" labelFor="text-input" labelInfo="(required)">
    <InputGroup id="text-input" placeholder="Placeholder text" />
</FormGroup>
```

@interface FormGroupProps
