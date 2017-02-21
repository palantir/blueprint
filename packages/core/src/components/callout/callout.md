@# Callouts

Callouts visually highlight important content for the user.

@## CSS API

Callouts use the same visual intent modifier classes as buttons. If you need a
heading, use the `<h5>` element.

<div class="pt-callout pt-intent-primary pt-icon-info-sign">
Note that the `<h5>` heading is entirely optional.
</div>

Markup:
<div class="pt-callout {{.modifier}}">
<h5>Callout Heading</h5>
Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex, delectus!
</div>

.pt-intent-primary - Primary intent
.pt-intent-success - Success intent
.pt-intent-warning - Warning intent
.pt-intent-danger  - Danger intent
.pt-icon-info-sign - With an icon
