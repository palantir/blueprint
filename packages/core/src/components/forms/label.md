@# Label

**Labels** enhance the usability of your forms.

Wrapping a `<label>` element around a form input effectively increases the area where the user can click to activate
the control. Notice how in the examples below, clicking a label focuses its `<input>`.

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">Prefer form groups over labels</h5>

The [**FormGroup** component](#core/components/form-group) provides additional functionality such as helper text and
modifier props as well as full label support. **FormGroup** supports both simple and complex use cases, therefore we
recommend using it exclusively when constructing forms.

</div>

@## Import

```tsx
import { Label } from "@blueprintjs/core";
```

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
