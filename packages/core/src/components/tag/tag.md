@# Tag

**Tag** is a lightweight visual container for short strings of text. This flexible component may be used to label an
entity, display a list of selected items, and much more. **Tag** supports a range of visual modifiers for many
different situations; its colors are designed to be accessible in almost any context.

@reactExample TagExample

@## Usage

The `<Tag>` component is a stateless wrapper around its children with support for an optional close button.
It supports all valid `<span>` DOM attributes.

@## Props interface

@interface TagProps

@## CSS API

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">

Deprecated API: use [`<Tag>`](#core/components/tag)

</h5>

CSS APIs for Blueprint components are considered deprecated, as they are verbose, error-prone, and they
often fall out of sync as the design system is updated. You should use the React component APIs instead.

</div>

Create a tag with a `span.@ns-tag`. An optional "remove" button can be added with a `button.@ns-tag-remove` as the last
child.

@css tag
