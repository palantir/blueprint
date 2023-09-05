@# Input group

__InputGroup__ is basic building block used to render text inputs across many Blueprint components.
This component allows you to optionally add icons and buttons _within_ a text input to expand its appearance and
functionality. For example, you might use an input group to build a visibility toggle for a password field.

@reactExample InputGroupExample

@## Usage

__InputGroup__ supports one non-interactive icon on the left side and one arbitrary element on the right side.
It measures the width of its child elements to create the appropriate right padding inside the input to accommodate
content of any length.

__InputGroup__ should be used like a standard React `<input>` element, either in a controlled or uncontrolled fashion.
In addition to its own props, it supports all valid `<input>` HTML attributes and forwards them to the DOM
(the most common ones are detailed below).

If controlled with the `value` prop, __InputGroup__ has support for _asynchronous updates_, which may occur with some
form handling libraries like `redux-form`. This is not broadly encouraged (a value returned from `onChange` should be
sent back to the component as a controlled `value` synchronously), but there is basic support for it using the
`asyncControl` prop. Note that the input cursor may jump to the end of the input if the speed of text entry
(time between change events) is faster than the speed of the async update.

@## Props interface

@interface InputGroupProps

@## Search input

Apply the attribute `<InputGroup type="search">` to style a text input as a search field. This styling is equivalent
to what is applied using the `Classes.ROUND` modifier class&mdash;it is automatically applied for `[type="search"]`
inputs.

Note that some browsers also implement a handler for the `esc` key to clear the text in a search field.

@reactExample SearchInputExample

@## CSS API

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">

Deprecated API: use [`<InputGroup>`](#core/components/input-group)

</h5>

CSS APIs for Blueprint components are considered deprecated, as they are verbose, error-prone, and they
often fall out of sync as the design system is updated. You should use the React component APIs instead.

Note that you cannot use buttons with text in the CSS API for input groups. The padding for text inputs
in CSS cannot accommodate buttons whose width varies due to text content.

</div>

#### `.@ns-input-group`

You can place a single `.@ns-icon` or `.@ns-button.@ns-icon-*` on either end of the input. The order is
dictated by the HTML markup: an element specified before the `input` appears on the left edge, and
vice versa. You do not need to apply sizing classes to the children&mdash;they inherit the size of
the parent input.

@css input-group

#### `.@ns-input`

Apply `Classes.INPUT` on an `input[type="text"]`. You should also specify `dir="auto"`
[to better support RTL languages](http://www.w3.org/International/questions/qa-html-dir#dirauto)
(in all browsers except Internet Explorer).

@css input
