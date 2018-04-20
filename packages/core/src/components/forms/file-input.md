@# File input

Use the standard `input type="file"` along with a `span` with class `@ns-file-upload-input`.
Wrap that all in a `label` with class `@ns-file-input`.

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign">
    <h4 class="@ns-callout-title">Static file name</h4>
    File name does not update on file selection. To get this behavior,
    you must implement it separately in JS.
</div>

@## CSS API

@css file-input

@## JavaScript API

The `FileInput` component is available in the __@blueprintjs/core__ package. Make sure to review the [getting started docs for installation info](#blueprint/getting-started).

This component is a simple wrapper around the corresponding CSS API. It supports the full range of HTML props.

```tsx
<FileInput disabled={true} text="Choose file..." onInputChange={...} />
```

@interface IFileInputProps
