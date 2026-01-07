@# Checkbox

A checkbox allows the user to toggle between checked, unchecked, and (sometimes) indeterminate states.

@## Import

```tsx
import { Checkbox } from "@blueprintjs/core";
```

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
