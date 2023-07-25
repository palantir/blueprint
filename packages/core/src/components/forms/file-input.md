@# File input

__FileInput__ is a lightweight wrapper around a `<label>` container element which contains an `<input type="file">`.

@reactExample FileInputExample

@## Usage

```tsx
<FileInput disabled={true} text="Choose file..." onInputChange={...} />
```

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">Static file name</h5>

File name does not automatically update after a user selects a file.
To get this behavior, you must update the `text` prop.

</div>

@## Props interface

__FileInput__ supports the full range of HTML `<label>` DOM attributes.
Use `inputProps` to forward props to the `<input>` element.

@interface FileInputProps

@## CSS API

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">

Deprecated API: use [`<FileInput>`](#core/components/forms/file-input)

</h5>

CSS APIs for Blueprint components are considered deprecated, as they are verbose, error-prone, and they
often fall out of sync as the design system is updated. You should use the React component APIs instead.

</div>

Use the standard `input type="file"` along with a `span` with class `@ns-file-upload-input`.
Wrap that all in a `label` with class `@ns-file-input`.

@css file-input
