---
parent: components.forms
---

@## Text input groups

An input group allows you to add icons and buttons _within_ a text input to expand its
functionality. For example, you might use an input group to build a visibility toggle for a password
field.



@### CSS API

You can place a single `.pt-icon` or `.pt-button.pt-icon-*` on either end of the input. The order is
dictated by the HTML markup: an element specified before the `input` appears on the left edge, and
vice versa. You do not need to apply sizing classes to the children&mdash;they inherit the size of
the parent input.

<div class="pt-callout pt-intent-warning pt-icon-warning-sign">
<h5>Icons only</h5>
<p>You cannot use buttons with text in the CSS API for input groups. The padding for text inputs
in CSS cannot accomodate buttons whose width varies due to text content. You should use icons on
buttons instead.</p>

Conversely, the [`InputGroup`](#components.forms.input-group.js) React component _does_ support
arbitrary content in its right element.
</div>

Markup:
<div class="pt-input-group {{.modifier}}">
<span class="pt-icon pt-icon-filter"></span>
<input type="text" class="pt-input" {{:modifier}} placeholder="Filter histogram..." />
</div>
<div class="pt-input-group {{.modifier}}">
<input type="password" class="pt-input" {{:modifier}} placeholder="Enter your password..." />
<button class="pt-button pt-minimal pt-intent-warning pt-icon-lock" {{:modifier}}></button>
</div>
<div class="pt-input-group {{.modifier}}">
<span class="pt-icon pt-icon-search"></span>
<input type="text" class="pt-input" {{:modifier}} placeholder="Search" />
<button class="pt-button pt-minimal pt-intent-primary pt-icon-arrow-right" {{:modifier}}></button>
</div>

:disabled - Disabled input. Must be added separately to the <code>&#60;input&#62;</code> and <code>&#60;button&#62;</code>. Also add <code>.pt-disabled</code> to <code>.pt-input-group</code> for icon coloring (not shown below).
.pt-round - Rounded caps. Button will also be rounded.
.pt-large - Large group. Children will adjust size accordingly.
.pt-intent-primary - Primary intent. (All 4 intents are supported.)

@### JavaScript API

The `InputGroup` component is available in the __@blueprintjs/core__ package. Make sure to review
the [general usage docs for JS components](#components.usage).

The `InputGroup` React Component encapsulates the `.pt-input-group`
[CSS API](#components.forms.input-group.css): it supports one non-interactive icon on the left side
and one arbitrary element on the right side. Unlike the CSS API, the React Component supports
_content of any length_ on the right side, not just icon buttons, because it is able to measure the
content and ensure there is always space for it.

`InputGroup` can be used just like a standard React `input` element, in controlled or uncontrolled
fashion. In addition to its own content props, it supports all valid props for HTML `input` elements
and proxies them to that element in the DOM; the most common ones are detailed below.

@interface IInputGroupProps

@reactExample InputGroupExample
