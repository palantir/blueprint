@# File input

Use the standard `input type="file"` along with a `span` with class `pt-file-upload-input`.
Wrap that all in a `label` with class `pt-file-input`.

<div class="pt-callout pt-intent-warning pt-icon-warning-sign">
    <h4>Static file name</h4>
    File name does not update on file selection. To get this behavior,
    you must implement it separately in JS.
</div>

@## CSS API

@css pt-file-input

@## JavaScript API

The `FileInput` component is available in the __@blueprintjs/core__ package. Make sure to review the [general usage docs for JS components](#blueprint.usage).

This component is a simple wrapper around the corresponding CSS API. It supports the full range of HTML props.

```tsx
<FileInput disabled={true} text="Choose file..." onInputChange={...} />
```

@interface IFileInputProps
