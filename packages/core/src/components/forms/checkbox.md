@# Checkbox

A checkbox allows the user to toggle between checked, unchecked, and (rarely)
indeterminate states.

@reactExample CheckboxExample

@## Props

Use the `checked` prop instead of `value` in controlled mode to avoid typings
issues. Enable the `indeterminate` prop for a third in-between state.

```tsx
// simple usage for string labels
<Checkbox checked={this.state.isEnabled} label="Enabled" onChange={this.handleEnabledChange} />

// advanced usage for JSX content
<Checkbox checked={this.state.isEnabled} onChange={this.handleEnabledChange}>
    <Icon icon="user" />
    Gilad <strong>Gray</strong>
</Checkbox>
```

This component supports the full range of HTML `<input>` props. The most common
options are detailed below.

@interface CheckboxProps

@## CSS

Blueprint's custom checkboxes use an extra `.@ns-control-indicator` element
after the `<input>` to achieve their custom styling. You should then wrap the
whole thing in a `<label>` with the classes `.@ns-control.@ns-checkbox`.

Note that attribute modifiers (`:checked`, `:disabled`) are applied on the
internal `<input>` element. Further note that `:indeterminate` can only be set
via JavaScript (the `Checkbox` React component supports it handily with a prop).

@css checkbox
