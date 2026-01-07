@# Input group

**InputGroup** is basic building block used to render text inputs across many Blueprint components.
This component allows you to optionally add icons and buttons _within_ a text input to expand its appearance and
functionality. For example, you might use an input group to build a visibility toggle for a password field.

@## Import

```tsx
import { InputGroup } from "@blueprintjs/core";
```

@reactExample InputGroupExample

@## Usage

**InputGroup** supports one non-interactive icon on the left side and one arbitrary element on the right side.
It measures the width of its child elements to create the appropriate right padding inside the input to accommodate
content of any length.

**InputGroup** should be used like a standard React `<input>` element, either in a controlled or uncontrolled fashion.
In addition to its own props, it supports all valid `<input>` HTML attributes and forwards them to the DOM
(the most common ones are detailed below).

If controlled with the `value` prop, **InputGroup** has support for _asynchronous updates_, which may occur with some
form handling libraries like `redux-form`. This is not broadly encouraged (a value returned from `onChange` should be
sent back to the component as a controlled `value` synchronously), but there is basic support for it using the
`asyncControl` prop. Note that the input cursor may jump to the end of the input if the speed of text entry
(time between change events) is faster than the speed of the async update.

For _multiline text_: use [**TextArea**](#core/components/text-area) instead.

@## Props interface

@interface InputGroupProps

@## Search input

Apply the attribute `type="search"` to style a text input as a search field. This styling is equivalent
to what is applied using the `Classes.ROUND` modifier class&mdash;it is automatically applied for `[type="search"]`
inputs.

Note that some browsers also implement a handler for the <kbd>esc</kbd> key to clear the text in a search field.

@reactExample SearchInputExample
