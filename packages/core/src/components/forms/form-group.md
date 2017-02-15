---
parent: components
---

### Form groups

Form groups support more complex form controls than [simple labels](#components.forms.labels.simple-labels),
such as [control groups](#components.forms.control-group) or [`NumericInput`](#components.forms.numeric-input).
They also support additional helper text to aid with user navigation.

- Link each label to its respective control element with a `for={#id}` attribute on the `<label>` and
`id={#id}` on the control.

- Add `.pt-intent-*` or `.pt-disabled` to `.pt-form-group` to style the label and helper text.
Similar to labels, nested controls need to be styled separately.

- Add `.pt-inline` to `.pt-form-group` to place the label to the left of the control.

- Add `.pt-large` to `.pt-form-group` to align the label when used with large inline Blueprint controls.

Markup:
<div class="pt-form-group">
<label class="pt-label" for="example-form-group-input-a">
Label A
<span class="pt-text-muted">(required)</span>
</label>
<div class="pt-form-content">
<input id="example-form-group-input-a" class="pt-input" style="width: 300px;" placeholder="Placeholder text" type="text" dir="auto" />
<div class="pt-form-helper-text">Helper text with details / user feedback</div>
</div>
</div>
<div class="pt-form-group pt-intent-danger">
<label class="pt-label" for="example-form-group-input-b">
Label B
<span class="pt-text-muted">(required)</span>
</label>
<div class="pt-form-content">
<div class="pt-input-group pt-intent-danger">
<span class="pt-icon pt-icon-calendar"></span>
<input id="example-form-group-input-b" class="pt-input" style="width: 200px;" type="text" placeholder="Placeholder text" dir="auto" />
</div>
<div class="pt-form-helper-text">Please enter a value</div>
</div>
</div>
<div class="pt-form-group pt-inline pt-large pt-disabled">
<label class="pt-label" for="example-form-group-input-c">
Label C
<span class="pt-text-muted">(optional)</span>
</label>
<div class="pt-form-content">
<div class="pt-input-group pt-large pt-disabled">
<span class="pt-icon pt-icon-calendar"></span>
<input id="example-form-group-input-c" class="pt-input" disabled style="width: 200px;" type="text" placeholder="Placeholder text" dir="auto" />
</div>
<div class="pt-form-helper-text">Helper text with details / user feedback</div>
</div>
</div>

Weight: 3
