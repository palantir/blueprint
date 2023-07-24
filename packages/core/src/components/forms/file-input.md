@# File input

@reactExample FileInputExample

@## Usage

__FileInput__ is a lightweight wrapper around a `<label>` container element which contains an `<input type="file">`.
It supports the full range of HTML `<label>` DOM attributes.

Use `inputProps` to forward props to the `<input>` element.

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign">
    <h5 class="@ns-heading">Static file name</h5>
<div class="@ns-callout-body">

File name does not update on file selection. To get this behavior, you must implement it separately in JS.

</div>
</div>

```tsx
<FileInput disabled={true} text="Choose file..." onInputChange={...} />
```

@## Props interface

@interface FileInputProps

@## CSS API

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign">
    <h5 class="@ns-heading">

Deprecated API: use [`<FileInput>`](#core/components/forms/file-input)

</h5>
<div class="@ns-callout-body">

CSS APIs for Blueprint components are considered deprecated, as they are verbose, error-prone, and they
often fall out of sync as the design system is updated. You should use the React component APIs instead.

</div>
</div>

Use the standard `input type="file"` along with a `span` with class `@ns-file-upload-input`.
Wrap that all in a `label` with class `@ns-file-input`.

@css file-input
