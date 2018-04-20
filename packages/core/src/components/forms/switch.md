@# Switches

A switch is simply an alternate appearance for a [checkbox](#core/components/forms/checkbox) that
simulates on/off instead of checked/unchecked.

@reactExample SwitchExample

@## CSS API

@css switch

@## JavaScript API

The `Switch` component is available in the __@blueprintjs/core__ package.
Make sure to review the [getting started docs for installation info](#blueprint/getting-started).

```tsx
<Switch checked={this.state.isPublic} label="Public" onChange={this.handlePublicChange} />
```

Note that this component supports the full range of props available on HTML `input` elements.
The most common options are detailed below.

@interface ISwitchProps
