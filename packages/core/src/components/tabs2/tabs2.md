@# Tabs 2.0

Tabs allow the user to switch between panels of content.

@## CSS API

In addition to the [JavaScript API](#components.tabs.js), Blueprint also offers tab styles with the
class `pt-tabs`. You should add the proper accessibility attributes (`role`, `aria-selected`, and
`aria-hidden`) if you choose to implement tabs with CSS.

`.pt-tab-panel` elements with `aria-hidden="true"` are hidden automatically by the Blueprint CSS.
You may also simply omit hidden tabs from your markup to improve performance (the `Tabs`
JavaScript component does this by default).

@## JavaScript API

<div class="pt-callout pt-intent-danger pt-icon-error">
  <h5>Original `Tabs` API is deprecated since v1.11.0</h5>
  The original `Tabs` API has been deprecated in v1.11.0 favor of the simpler and more flexible
  `Tabs2` API described below. Documentation for the deprecated components can be found
  [further below](#components.tabs.deprecated). This API will replace the deprecated one in v2.0.
</div>

<div class="pt-callout pt-intent-primary pt-icon-info-sign">
  <h5>Advantages of new API</h5>
  <p>Only two components (`Tabs` and `Tab`) are needed, rather than the previous four.</p>
  <p>Selection is managed by ID, rather than by index. This is more reliable and deterministic and
  does not require translating between numbers and tab names. It does, however, require that
  every `Tab` have a locally unique `id` prop.</p>
  <p>Arbitrary elements are supported in the tab list, and order is respected. Yes, you can even
  insert things _between_ `Tab`s.</p>
</div>

The `Tabs2` and `Tab2` components are available in the __@blueprintjs/core__
package. Make sure to review the [general usage docs for JS components](#components.usage).

```tsx
import { Tab2, Tabs2 } from "@blueprintjs/core";

<Tabs2 id="Tabs2Example" onChange={this.handleTabChange}>
    <Tab2 id="rx" title="React" panel={<ReactPanel />} />
    <Tab2 id="ng" title="Angular" panel={<AngularPanel />} />
    <Tab2 id="mb" title="Ember" panel={<EmberPanel />} />
    <Tab2 id="bb" disabled title="Backbone" panel={<BackbonePanel />} />
    <Tabs2.Expander />
    <input className="pt-input" type="text" placeholder="Search..." />
</Tabs2>
```

@reactExample Tabs2Example

@### Tabs2

`Tabs2` is responsible for rendering the tab list and coordinating selection. It can be used in
controlled mode by providing `selectedTabId` and `onChange` props, or in uncontrolled mode by
optionally providing `defaultSelectedTabId` and `onChange`.

Children of the `Tabs2` are rendered in order in the tab list, which is a horizontal flex row.
`Tab2` children are managed by the component; clicking one will change selection. Arbitrary other
children are simply rendered; interactions are your responsibility. Insert a `<Tabs2.Expander />`
between any two children to right-align all subsequent children (or bottom-align when `vertical`).

@interface ITabs2Props

@### Tab2

`Tab2` is a minimal wrapper with no functionality of its own&mdash;it is managed entirely by its
parent `Tabs2` wrapper. Tab title text can be set either via `title` prop or via React children
(for more complex content).

The associated tab `panel` will be visible when the `Tab` is active. Omitting `panel` is perfectly
safe and allows you to control exactly where the panel appears in the DOM (by rendering it yourself
as needed).

@interface ITab2Props
