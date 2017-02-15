---
parent: components
---

## Labels

Labels enhance the usability of your forms.

<div class="pt-callout pt-intent-success pt-icon-comparison">
<h5>Simple labels vs. form groups</h5>
<p>Blueprint provides two ways of connecting label text to control fields, depending on the complexity of the control.</p>
<p>Simple labels are a basic way to connect a label with a single control.</p>
<p>Form groups support more complex control layouts but require more markup to maintain consistent visuals.</p>
</div>

Weight: 1

### Simple labels

Simple labels are useful for basic forms for a single `<input>`.

- Add extra information to the label with `span.pt-text-muted`.

- Putting the `<input>` element _inside_ a `<label>` element increases the area where the user
can click to activate the control. Notice how in the examples below, clicking a `<label>` focuses its `<input>`.

Markup:
<label class="pt-label {{.modifier}}">
Label A
<span class="pt-text-muted">(required)</span>
<input class="pt-input" style="width: 200px;" type="text" placeholder="Text input" dir="auto" />
</label>
<label class="pt-label {{.modifier}}">
Label B
<span class="pt-text-muted">(optional)</span>
<div class="pt-input-group">
<span class="pt-icon pt-icon-calendar"></span>
<input class="pt-input" style="width: 200px;" type="text" placeholder="Input group" dir="auto" />
</div>
</label>

.pt-inline - Inline

Weight: 1

### Disabled labels

Add the `.pt-label` and `.pt-disabled` class modifiers to a `<label>` to make the label appear
disabled.

This styles the label text, but does not disable any nested children like inputs or selects. You
must add the `:disabled` attribute directly to any nested elements to disable them. Similarly the respective
`pt-*` form control will need a `.pt-disabled` modifier. See the examples below.

Markup:
<label class="pt-label pt-disabled">
Label A
<span class="pt-text-muted">(optional)</span>
<input disabled class="pt-input" style="width: 200px;" type="text" placeholder="Text input" dir="auto" />
</label>
<label class="pt-label pt-disabled">
Label B
<div class="pt-input-group pt-disabled">
<span class="pt-icon pt-icon-calendar"></span>
<input disabled class="pt-input" style="width: 200px;" type="text" placeholder="Input group" dir="auto" />
</div>
</label>
<label class="pt-label pt-disabled">
Label C
<div class="pt-select pt-disabled">
<select disabled>
<option selected>Choose an item...</option>
<option value="1">One</option>
</select>
</div>
</label>

Weight: 2
