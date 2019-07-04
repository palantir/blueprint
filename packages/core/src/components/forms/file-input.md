@# File input

@reactExample FileInputExample

@## Props

This component is a lightweight wrapper around the underlying `<label>` element
which contain an `<input type="file">`. It supports the full range of HTML `<label>` props.

Use `inputProps` to apply props to the `<input>` element.

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign">
    <h4 class="@ns-heading">Static file name</h4>

File name does not update on file selection. To get this behavior,
you must implement it separately in JS.

</div>

```tsx
<FileInput disabled={true} text="Choose file..." onInputChange={...} />
```

@interface IFileInputProps

@## CSS

Use the standard `input type="file"` along with a `span` with class `@ns-file-upload-input`.
Wrap that all in a `label` with class `@ns-file-input`.

@css file-input
