---
parent: components
---

@# Button groups

Button groups arrange multiple buttons in a horizontal or vertical group.

@## CSS API

Arrange multiple buttons in a group by wrapping them in `.pt-button-group`.
You can apply sizing directly on the button group container element.

You should implement interactive segmented controls as button groups.

Markup:
<div class="pt-button-group {{.modifier}}">
<a class="pt-button pt-icon-database" tabindex="0" role="button">Queries</a>
<a class="pt-button pt-icon-function" tabindex="0" role="button">Functions</a>
<a class="pt-button" tabindex="0" role="button">
Options <span class="pt-icon-standard pt-icon-caret-down pt-align-right"></span>
</a>
</div>
<br /><br />
<div class="pt-button-group {{.modifier}}">
<a class="pt-button pt-icon-chart" tabindex="0" role="button"></a>
<a class="pt-button pt-icon-control" tabindex="0" role="button"></a>
<a class="pt-button pt-icon-graph" tabindex="0" role="button"></a>
<a class="pt-button pt-icon-camera" tabindex="0" role="button"></a>
<a class="pt-button pt-icon-map" tabindex="0" role="button"></a>
<a class="pt-button pt-icon-code" tabindex="0" role="button"></a>
<a class="pt-button pt-icon-th" tabindex="0" role="button"></a>
<a class="pt-button pt-icon-time" tabindex="0" role="button"></a>
<a class="pt-button pt-icon-compressed" tabindex="0" role="button"></a>
</div>
<br /><br />
<div class="pt-button-group {{.modifier}}">
<button type="button" class="pt-button pt-intent-success">Save</button>
<button type="button" class="pt-button pt-intent-success pt-icon-caret-down"></button>
</div>

.pt-large - Use large buttons
.pt-minimal - Use minimal buttons. Note that these minimal buttons will not automatically
truncate text in an ellipsis because of the divider line added in CSS.

@### Responsive button groups

Add the class `pt-fill` to a button group to make all buttons expand equally to fill the
available space. Then add the class `pt-fixed` to individual buttons to revert them to their
original default sizes.

Alternatively, add the class `pt-fill` to an individual button (instead of to the container)
to expand it to fill the available space while other buttons retain their original sizes.

You can adjust the specific size of a button with the `flex-basis` CSS property.

Markup:
<div class="pt-button-group pt-large pt-fill">
<a class="pt-button pt-intent-primary pt-fixed" tabindex="0" role="button">Start</a>
<a class="pt-button pt-intent-primary" tabindex="0" role="button">Left</a>
<a class="pt-button pt-intent-primary pt-active" tabindex="0" role="button">Middle</a>
<a class="pt-button pt-intent-primary" tabindex="0" role="button">Right</a>
<a class="pt-button pt-intent-primary pt-fixed" tabindex="0" role="button">End</a>
</div>
<br />
<div class="pt-button-group pt-fill">
<button class="pt-button pt-icon-arrow-left"></button>
<button class="pt-button pt-fill">Middle</button>
<button class="pt-button pt-icon-arrow-right"></button>
</div>

@### Vertical button groups

Add the class `pt-vertical` to create a vertical button group. The buttons in a vertical
group all have the same size as the widest button in the group.

Add the modifier class `pt-align-left` to left-align all button text and icons.

You can also combine vertical groups with the `pt-fill` and `pt-minimal` class modifiers.

Markup:
<div class="pt-button-group pt-vertical" style="padding-right: 10px">
<a class="pt-button pt-icon-search-template" role="button" tabindex="0"></a>
<a class="pt-button pt-icon-zoom-in" role="button" tabindex="0"></a>
<a class="pt-button pt-icon-zoom-out" role="button" tabindex="0"></a>
<a class="pt-button pt-icon-zoom-to-fit" role="button" tabindex="0"></a>
</div>
<div class="pt-button-group pt-vertical" style="padding-right: 10px">
<button type="button" class="pt-button pt-active">Home</button>
<button type="button" class="pt-button">Pages</button>
<button type="button" class="pt-button">Blog</button>
<button type="button" class="pt-button">Calendar</button>
</div>
<div class="pt-button-group pt-vertical pt-align-left pt-large">
<button type="button" class="pt-button pt-intent-primary pt-icon-document">Text</button>
<button type="button" class="pt-button pt-intent-primary pt-icon-media pt-active">Media</button>
<button type="button" class="pt-button pt-intent-primary pt-icon-link">Sources</button>
</div>
