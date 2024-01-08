@# Callout

__Callouts__ visually highlight important content for the user. They may contain
a title, an icon and content. Each intent has a default icon associated with it.

@reactExample CalloutExample

@## Props interface

@interface CalloutProps

@## CSS API

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">

Deprecated API: use [`<Callout>`](#core/components/callout)

</h5>

CSS APIs for Blueprint components are considered deprecated, as they are verbose, error-prone, and they
often fall out of sync as the design system is updated. You should use the React component APIs instead.

</div>

Callouts use the same visual intent modifier classes as buttons. If you need a heading, use the `<h5>`
element with a `.@ns-heading` class.

@css callout
