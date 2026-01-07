@# File input

**FileInput** is a lightweight wrapper around a `<label>` container element which contains an `<input type="file">`.

@## Import

```tsx
import { FileInput } from "@blueprintjs/core";
```

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

**FileInput** supports the full range of HTML `<label>` DOM attributes.
Use `inputProps` to forward props to the `<input>` element.

@interface FileInputProps
