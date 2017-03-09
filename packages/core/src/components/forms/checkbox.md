@# Checkboxes

Blueprint's custom checkboxes use an extra `.pt-control-indicator` element after the `<input>` to
achieve their custom styling. You should then wrap the whole thing in a `<label>` with the classes
`.pt-control.pt-checkbox`.

Note that attribute modifiers (`:checked`, `:disabled`) are applied on the internal `<input>`
element. Further note that `:indeterminate` can only be set via JavaScript (the `Checkbox` React
component supports it handily with a prop).

@## CSS API

@css pt-checkbox

@## JavaScript API

The `Checkbox` component is available in the __@blueprintjs/core__ package.
Make sure to review the [general usage docs for JS components](#components.usage).

```tsx
// simple usage for string labels
<Checkbox checked={this.state.isEnabled} label="Enabled" onChange={this.handleEnabledChange} />

// advanced usage for JSX content
<Checkbox checked={this.state.isEnabled} onChange={this.handleEnabledChange}>
<span className="pt-icon-standard pt-icon-user" />
Gilad Gray
</Checkbox>
```

Note that this component supports the full range of props available on HTML `input` elements.
Use `checked` instead of `value` in controlled mode to avoid typings issues.
The most common options are detailed below.

@interface ICheckboxProps
