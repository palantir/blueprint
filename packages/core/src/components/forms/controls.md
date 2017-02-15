---
parent: forms
---

## Checkboxes

Blueprint's custom checkboxes use an extra `.pt-control-indicator` element after the `<input>` to
achieve their custom styling. You should then wrap the whole thing in a `<label>` with the classes
`.pt-control.pt-checkbox`.

Note that attribute modifiers (`:checked`, `:disabled`) are applied on the internal `<input>`
element. Further note that `:indeterminate` can only be set via JavaScript (the `Checkbox` React
component supports it handily with a prop).

Weight: 2

### CSS API

Markup:
<label class="pt-control pt-checkbox {{.modifier}}">
<input type="checkbox" {{:modifier}} />
<span class="pt-control-indicator"></span>
Checkbox
</label>

:checked  - Checked
:disabled - Disabled. Also add <code>.pt-disabled</code> to <code>.pt-control</code> to change text color (not shown below).
:indeterminate - Indeterminate. Note that this style can only be achieved via JavaScript
<code>input.indeterminate = true</code>.
.pt-align-right - Right-aligned indicator
.pt-large - Large

### JavaScript API

The `Checkbox` component is available in the __@blueprintjs/core__ package.
Make sure to review the [general usage docs for JS components](#components.usage).

```
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

## Radios

Blueprint's custom radio buttons use an extra `.pt-control-indicator` element after the `<input>`
to achieve their custom styling. You should then wrap the whole thing in a `<label>` with the
classes `.pt-control.pt-radio`.

Note that attribute modifiers (`:checked`, `:disabled`) are applied on the internal `<input>`
element.

Weight: 2

### CSS API

Markup:
<label class="pt-control pt-radio {{.modifier}}">
<input type="radio" name="docs-radio-regular" {{:modifier}} />
<span class="pt-control-indicator"></span>
Radio
</label>

:checked  - Selected
:disabled - Disabled. Also add <code>.pt-disabled</code> to <code>.pt-control</code> to change text color (not shown below).
.pt-align-right - Right-aligned indicator
.pt-large - Large

### JavaScript API

The `Radio` and `RadioGroup` components are available in the __@blueprintjs/core__ package. Make
sure to review the [general usage docs for JS components](#components.usage).

Typically, radio buttons are used in a group to choose one option from several, similar to how a
`<select>` tag contains several `<option>` tags. As such, you can use the `RadioGroup` component
with a series of `Radio` children. `RadioGroup` is responsible for managing state and interaction.

```
<RadioGroup
label="Meal Choice"
onChange={this.handleMealChange}
selectedValue={this.state.mealType}
>
<Radio label="Soup" value="one" />
<Radio label="Salad" value="two" />
<Radio label="Sandwich" value="three" />
</RadioGroup>
```

Note that this component supports the full range of props available on HTML `input` elements.
The most common options are detailed below.

@interface IRadioProps

## Switches

A switch is simply an alternate appearance for a [checkbox](#components.forms.checkbox) that
simulates on/off instead of checked/unchecked.

Weight: 2

### CSS API

Markup:
<label class="pt-control pt-switch {{.modifier}}">
<input type="checkbox" {{:modifier}} />
<span class="pt-control-indicator"></span>
Switch
</label>

:checked  - Selected
:disabled - Disabled. Also add <code>.pt-disabled</code> to <code>.pt-control</code> to change text color (not shown below).
.pt-align-right - Right-aligned indicator
.pt-large - Large

### JavaScript API

The `Switch` component is available in the __@blueprintjs/core__ package.
Make sure to review the [general usage docs for JS components](#components.usage).

```
<Switch checked={this.state.isPublic} label="Public" onChange={this.handlePublicChange} />
```

Note that this component supports the full range of props available on HTML `input` elements.
The most common options are detailed below.

@interface ISwitchProps

### Inline controls

Checkboxes, radios, and switches all support the `.pt-inline` modifier to make them `display:
inline-block`. Note that this modifier functions slightly differently on these elements than it
does on `.pt-label`. On `.pt-label`, it only adjusts the layout of text _within_ the label and not
the display of the label itself.

Here's an example of how you might group together some controls and label them.

Markup:
<label class="pt-label">A group of related options</label>
<label class="pt-control pt-checkbox pt-inline">
<input type="checkbox" />
<span class="pt-control-indicator"></span>
First
</label>
<label class="pt-control pt-checkbox pt-inline">
<input type="checkbox" />
<span class="pt-control-indicator"></span>
Second
</label>
<label class="pt-control pt-checkbox pt-inline">
<input type="checkbox" />
<span class="pt-control-indicator"></span>
Third
</label>

Weight: 10
