@# Text inputs

Blueprint provides two ways to create a text input:

1. React component: use the `InputGroup` component for an advanced single-line
   input that supports an icon on the left and arbitrary content on the right.
1. CSS only: apply `Classes.INPUT` to an `<input>` or `<textarea>` element to
   style the native HTML tag.

@## Input group

An input group allows you to add icons and buttons _within_ a text input to expand its
functionality. For example, you might use an input group to build a visibility toggle for a password
field.

@reactExample InputGroupExample

@### Props

The `InputGroup` React component supports one non-interactive icon on the left
side and one arbitrary element on the right side. Unlike the CSS approach,
`InputGroup` supports _content of any length_ on the right side (not just
icon buttons) because it is able to measure the content and ensure there is
always space for it.

`InputGroup` can be used just like a standard React `input` element, in
a controlled or uncontrolled fashion. In addition to its own props, it supports
all valid props for HTML `<input>` elements and proxies them to that element in
the DOM; the most common ones are detailed below.

@interface IInputGroupProps

@### CSS

You can place a single `.@ns-icon` or `.@ns-button.@ns-icon-*` on either end of the input. The order is
dictated by the HTML markup: an element specified before the `input` appears on the left edge, and
vice versa. You do not need to apply sizing classes to the children&mdash;they inherit the size of
the parent input.

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign">
    <h4 class="@ns-heading">Icons only</h4>

You cannot use buttons with text in the CSS API for input groups. The padding for text inputs
in CSS cannot accommodate buttons whose width varies due to text content. You should use icons on
buttons instead.

Conversely, the [`InputGroup`](#core/components/text-inputs.input-group) React
component _does_ support arbitrary content in its right element.

</div>

@css input-group

@## HTML input

Apply `Classes.INPUT` on an `input[type="text"]`. You should also specify `dir="auto"`
[to better support RTL languages](http://www.w3.org/International/questions/qa-html-dir#dirauto)
(in all browsers except Internet Explorer).

@css input

@## Text area

Apply `Classes.INPUT` on a `<textarea>`, or use the `TextArea` React component.

```tsx
<TextArea
    growVertically={true}
    large={true}
    intent={Intent.PRIMARY}
    onChange={this.handleChange}
    value={this.state.value}
/>
```

@css textarea

@interface ITextAreaProps

@## Search field

Changing the `<input>` element's `type` attribute to `"search"` styles it to look like a search
field, giving it a rounded appearance. This style is equivalent to the `.@ns-round` modifier, but it
is applied automatically for `[type="search"]` inputs.

Note that some browsers also implement a handler for the `esc` key to clear the text in a search field.

@css input-search
