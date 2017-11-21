@# File upload

Use the standard `input type="file"` along with a `span` with class `pt-file-upload-input`.
Wrap that all in a `label` with class `pt-file-upload`.

<div class="pt-callout pt-intent-warning pt-icon-warning-sign">
    <h5>Static file name</h5>
    File name does not update on file selection. To get this behavior,
    you must implement it separately in JS.
</div>

@## CSS API

@css pt-file-upload

@## JavaScript API

The `FileUpload` component is available in the @blueprintjs/core package. Make sure to review the general usage docs for JS components.

This component is a simple wrapper around the corresponding CSS API. It supports the full range of HTML props.

```tsx
<FileUpload disabled={true} text="Choose file..." inputProps={{ onChange: /* ... */ }} />
```

@interface IFileUploadProps
