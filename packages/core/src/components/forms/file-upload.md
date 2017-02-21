---
parent: components.forms
---

@## File upload

Use the standard `input type="file"` along with a `span` with class `pt-file-upload-input`.
Wrap that all in a `label` with class `pt-file-upload`.

<div class="pt-callout pt-intent-warning pt-icon-warning-sign">
<h5>Static file name</h5>
File name does not update on file selection. To get this behavior,
you must implement it separately in JS.
</div>

Markup:
<label class="pt-file-upload">
<input type="file" />
<span class="pt-file-upload-input">Choose file...</span>
</label>


