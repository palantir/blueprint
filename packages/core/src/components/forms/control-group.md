---
parent: forms
---

## Control groups

A `.pt-control-group` renders several distinct controls as one unit, squaring the borders between
them. It supports any number of `.pt-button`, `.pt-input`, `.pt-input-group`, and `.pt-select`
elements as direct children.

Note that `.pt-control-group` does not cascade any modifiers to its children. For example, each
child must be marked individually as `.pt-large` for uniform large appearance.

<div class="pt-callout pt-intent-success pt-icon-comparison">
<h5>Control group vs. input group</h5>
<p>Both components group multiple elements into a single unit, but their usage patterns are
different.</p>
<p>Think of `.pt-control-group` as a parent with multiple children, each of them a
"control."</p>
<p>Conversely, a `.pt-input-group` is a single control, and should function like so. A
button inside of an input group should only affect that input; if its reach is further, then it
should be promoted to live in a control group.</p>
</div>

Markup:
<div class="pt-control-group-example">
<div class="pt-control-group">
<button class="pt-button pt-icon-filter">Filter</button>
<input type="text" class="pt-input" placeholder="Find filters..." />
</div>
<div class="pt-control-group">
<div class="pt-select">
<select>
<option selected>Filter...</option>
<option value="1">Issues</option>
<option value="2">Requests</option>
<option value="3">Projects</option>
</select>
</div>
<div class="pt-input-group">
<span class="pt-icon pt-icon-search"></span>
<input type="text" class="pt-input" value="from:ggray to:allorca" />
</div>
</div>
<div class="pt-control-group">
<div class="pt-input-group">
<span class="pt-icon pt-icon-people"></span>
<input type="text" class="pt-input" placeholder="Find collaborators..." style="padding-right:94px" />
<div class="pt-input-action">
<button class="pt-button pt-minimal pt-intent-primary">
can view<span class="pt-icon-standard pt-icon-caret-down pt-align-right"></span>
</button>
</div>
</div>
<button class="pt-button pt-intent-primary">Add</button>
</div>
</div>

Weight: 4

### Responsive control groups

Add the class `pt-fill` to a control group to make all elements expand equally to fill the
available space. Then add the class `pt-fixed` to individual elements to revert them to their
original default sizes.

Alternatively, add the class `pt-fill` to an individual element (instead of to the container)
to expand it to fill the available space while other elements retain their original sizes.

You can adjust the specific size of an element with the `flex-basis` CSS property.

Markup:
<div class="pt-control-group-example">
<div class="pt-control-group">
<div class="pt-input-group pt-fill">
<span class="pt-icon pt-icon-people"></span>
<input type="text" class="pt-input" placeholder="Find collaborators..." />
</div>
<button class="pt-button pt-intent-primary">Add</button>
</div>
<div class="pt-control-group pt-fill">
<button class="pt-button pt-icon-minus pt-fixed"></button>
<input type="text" class="pt-input" placeholder="Enter a value..." />
<button class="pt-button pt-icon-plus pt-fixed"></button>
</div>
</div>

### Vertical control groups

Add the class `pt-vertical` to create a vertical control group. Controls in a vertical group
will all have the same width as the widest control.

Markup:
<div class="pt-control-group pt-vertical" style="width: 300px;">
<div class="pt-input-group pt-large">
<span class="pt-icon pt-icon-person"></span>
<input type="text" class="pt-input" placeholder="Username" />
</div>
<div class="pt-input-group pt-large">
<span class="pt-icon pt-icon-lock"></span>
<input type="password" class="pt-input" placeholder="Password" />
</div>
<button class="pt-button pt-large pt-intent-primary">Login</button>
</div>
