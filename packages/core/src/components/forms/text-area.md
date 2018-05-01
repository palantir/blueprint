@# Text areas

Text areas are similar to text inputs, but they are resizable and support multiline editing.

You should also specify `dir="auto"` on text areas
[to better support RTL languages](http://www.w3.org/International/questions/qa-html-dir#dirauto)
(in all browsers except Internet Explorer).

@## CSS API

@css textarea

@## JavaScript API

The `TextArea` component is available in the __@blueprintjs/core__ package. Make sure to review the [getting started docs for installation info](#blueprint/getting-started).

This component is a simple wrapper around the corresponding CSS API. It supports the full range of HTML props.

```tsx
<TextArea
    large={true}
    intent={Intent.PRIMARY}
    onChange={this.handleChange}
    value={this.state.value}
/>
```
