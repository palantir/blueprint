@# Text inputs

Use the `@ns-input` class on an `input[type="text"]`. You should also specify `dir="auto"`
[to better support RTL languages](http://www.w3.org/International/questions/qa-html-dir#dirauto)
(in all browsers except Internet Explorer).

@css input

@## Search field

Changing the `<input>` element's `type` attribute to `"search"` styles it to look like a search
field, giving it a rounded appearance. This style is equivalent to the `.@ns-round` modifier, but it
is applied automatically for `[type="search"]` inputs.

Note that some browsers also implement a handler for the `esc` key to clear the text in a search field.

@css input-search
