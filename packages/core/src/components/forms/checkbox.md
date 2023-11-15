@# Checkbox

A checkbox allows the user to toggle between checked, unchecked, and (sometimes) indeterminate states.

@reactExample CheckboxExample

@## Usage

Use the `checked` prop instead of `value` in controlled mode to avoid typings issues.
Enable the `indeterminate` prop for a third in-between state.

```tsx
// simple usage for string labels
<Checkbox checked={this.state.isEnabled} label="Enabled" onChange={this.handleEnabledChange} />

// advanced usage for JSX content
<Checkbox checked={this.state.isEnabled} onChange={this.handleEnabledChange}>
    <Icon icon="user" />
    John <strong>Doe</strong>
</Checkbox>
```

@## Props interface

This component supports the full range of HTML `<input>` props.

@interface CheckboxProps

@## CSS API

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">

Deprecated API: use [`<Checkbox>`](#core/components/checkbox)

</h5>

CSS APIs for Blueprint components are considered deprecated, as they are verbose, error-prone, and they
often fall out of sync as the design system is updated. You should use the React component APIs instead.

</div>

Blueprint's custom checkboxes use an extra `.@ns-control-indicator` element after the `<input>` to achieve
their custom styling. You should then wrap the whole thing in a `<label>` with the classes `.@ns-control.@ns-checkbox`.

Note that attribute modifiers (`:checked`, `:disabled`) are applied on the internal `<input>` element. Further note
that `:indeterminate` can only be set via JavaScript (the `Checkbox` React component supports it handily with a prop).

@css checkbox
