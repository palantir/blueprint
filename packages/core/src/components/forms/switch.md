@# Switches

A switch is simply an alternate appearance for a [checkbox](#components.forms.checkbox) that
simulates on/off instead of checked/unchecked.

@## CSS API

@## JavaScript API

The `Switch` component is available in the __@blueprintjs/core__ package.
Make sure to review the [general usage docs for JS components](#components.usage).

```
<Switch checked={this.state.isPublic} label="Public" onChange={this.handlePublicChange} />
```

Note that this component supports the full range of props available on HTML `input` elements.
The most common options are detailed below.

@interface ISwitchProps

@## Inline controls

Checkboxes, radios, and switches all support the `.pt-inline` modifier to make them `display:
inline-block`. Note that this modifier functions slightly differently on these elements than it
does on `.pt-label`. On `.pt-label`, it only adjusts the layout of text _within_ the label and not
the display of the label itself.

Here's an example of how you might group together some controls and label them.
