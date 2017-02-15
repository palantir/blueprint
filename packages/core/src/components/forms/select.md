---
parent: components
---

## Selects

Styling `<select>` tags requires a wrapper element to customize the dropdown caret. Put class
modifiers on the wrapper and attribute modifiers directly on the `<select>`.

<div class="pt-callout pt-intent-primary pt-icon-info-sign">
Check out [Dropdown menus](#components.menu.js.dropdown) for a simple JavaScript alternative
to the `<select>` tag.
</div>

Markup:
<div class="pt-select {{.modifier}}">
<select {{:modifier}}>
<option selected>Choose an item...</option>
<option value="1">One</option>
<option value="2">Two</option>
<option value="3">Three</option>
<option value="4">Four</option>
</select>
</div>

:disabled - Disabled. Also add <code>.pt-disabled</code> to <code>.pt-select</code> for icon coloring (not shown below).
.pt-minimal - Minimal appearance
.pt-large - Large
.pt-fill - Expand to fill parent container

Weight: 5

### Labeled static dropdown

You can label `<select>` tags, similar to how you label any other form control.

Markup:
<label class="pt-label {{.modifier}}">
Label A
<div class="pt-select">
<select>
<option selected>Choose an item...</option>
<option value="1">One</option>
</select>
</div>
</label>

.pt-inline - Inline
