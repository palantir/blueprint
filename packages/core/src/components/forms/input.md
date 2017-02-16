---
parent: components.forms
---

## Text inputs

Use the `pt-input` class on an `input[type="text"]`. You should also specify `dir="auto"` [to better
support RTL languages](http://www.w3.org/International/questions/qa-html-dir#dirauto) (in all
browsers except Internet Explorer).

Markup:
<input class="pt-input {{.modifier}}" {{:modifier}} type="text" placeholder="Text input" dir="auto" />

:disabled - Disabled
:readonly - Readonly
.pt-round - Rounded ends
.pt-large - Larger size
.pt-intent-primary - Primary intent
.pt-intent-success - Success intent
.pt-intent-warning - Warning intent
.pt-intent-danger - Danger intent
.pt-fill - Take up full width of parent element

Weight: 3

### Search field

Changing the `<input>` element's `type` attribute to `"search"` styles it to look like a search
field, giving it a rounded appearance. This style is equivalent to the `.pt-round` modifier, but it
is applied automatically for `[type="search"]` inputs.

Note that some browsers also implement a handler for the <kbd class="pt-key">esc</kbd> key to clear
the text in a search field.

Markup:
<div class="pt-input-group {{.modifier}}">
<span class="pt-icon pt-icon-search"></span>
<input class="pt-input" {{:modifier}} type="search" placeholder="Search input" dir="auto" />
</div>

:disabled - Disabled. Also add <code>.pt-disabled</code> to <code>.pt-input-group</code> for icon coloring (not shown below).
.pt-large - Large

## Text areas

Text areas are similar to text inputs, but they are resizable.

You should also specify `dir="auto"` on text areas
[to better support RTL languages](http://www.w3.org/International/questions/qa-html-dir#dirauto)
(in all browsers except Internet Explorer).

Markup:
<textarea class="pt-input {{.modifier}}" {{:modifier}} dir="auto"></textarea>

:disabled - Disabled
:readonly - Readonly
.pt-large - Larger font size
.pt-intent-primary - Primary intent
.pt-intent-danger  - Danger intent
.pt-fill  - Take up full width of parent element

Weight: 3
