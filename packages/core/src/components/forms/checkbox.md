@# Checkboxes

Blueprint's custom checkboxes use an extra `.@ns-control-indicator` element after the `<input>` to
achieve their custom styling. You should then wrap the whole thing in a `<label>` with the classes
`.@ns-control.@ns-checkbox`.

Note that attribute modifiers (`:checked`, `:disabled`) are applied on the internal `<input>`
element. Further note that `:indeterminate` can only be set via JavaScript (the `Checkbox` React
component supports it handily with a prop).

@reactExample CheckboxExample

@## CSS API

@css checkbox

@## JavaScript API

The `Checkbox` component is available in the __@blueprintjs/core__ package.
Make sure to review the [getting started docs for installation info](#blueprint/getting-started).

```tsx
// simple usage for string labels
<Checkbox checked={this.state.isEnabled} label="Enabled" onChange={this.handleEnabledChange} />

// advanced usage for JSX content
<Checkbox checked={this.state.isEnabled} onChange={this.handleEnabledChange}>
    <Icon icon="user" />
    Gilad <strong>Gray</strong>
</Checkbox>
```

Note that this component supports the full range of props available on HTML `input` elements.
Use `checked` instead of `value` in controlled mode to avoid typings issues.
The most common options are detailed below.

@interface ICheckboxProps

@## Inline controls

Checkboxes, radios, and switches all support the `.@ns-inline` modifier to make them `display:
inline-block`. Note that this modifier functions slightly differently on these elements than it
does on `.@ns-label`. On `.@ns-label`, it only adjusts the layout of text _within_ the label and not
the display of the label itself.

Here's an example of how you might group together some controls and label them.

@css checkbox-inline
