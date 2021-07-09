@# HTML select

Styling HTML `<select>` tags requires a wrapper element to customize the
dropdown caret, so we provide an `HTMLSelect` component to streamline this
process.

<div class="@ns-callout @ns-intent-success @ns-icon-info-sign">

The [`Select`](#select/multi-select) component in the [**@blueprintjs/select**](#select)
package provides a React alternative to the native HTML `<select>` tag. Notably, it
supports custom filtering logic and item rendering.

</div>

@## Props

Use `HTMLSelect` exactly like you would use a native `<select>` with `value` (or
`defaultValue`) and `onChange`. Options can be passed as `<option>` children for
full flexibility or via the `options` prop for simple shorthand.

@interface IHTMLSelectProps

@## CSS

Put class modifiers on the wrapper and attribute modifiers and event handlers
directly on the `<select>`.

@css select
