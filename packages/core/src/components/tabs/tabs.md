@# Tabs

@reactExample TabsExample

@## Props

Tab selection is managed by `id`, much like the HTML `<select>` element respects
`<option value>`. This is more reliable than using a numeric index as it does
not require translating between arbitrary indices and tab names. It does,
however, require that every `Tab` have a _locally unique `id` value_.

Arbitrary elements are supported in the tab list, and order is respected. Yes,
you can even insert things _between_ `Tab`s.

```tsx
import { Tab, Tabs } from "@blueprintjs/core";

<Tabs id="TabsExample" onChange={this.handleTabChange} selectedTabId="rx">
    <Tab id="ng" title="Angular" panel={<AngularPanel />} />
    <Tab id="mb" title="Ember" panel={<EmberPanel />} panelClassName="ember-panel" />
    <Tab id="rx" title="React" panel={<ReactPanel />} />
    <Tab id="bb" disabled title="Backbone" panel={<BackbonePanel />} />
    <Tabs.Expander />
    <input className="@ns-input" type="text" placeholder="Search..." />
</Tabs>
```

@### Tabs

`Tabs` is the top-level component responsible for rendering the tab list and coordinating selection.
It can be used in controlled mode by providing `selectedTabId` and `onChange` props, or in
uncontrolled mode by optionally providing `defaultSelectedTabId` and `onChange`.

Children of the `Tabs` are rendered in order in the tab list, which is a flex container.
`Tab` children are managed by the component; clicking one will change selection. Arbitrary other
children are simply rendered in order; interactions are your responsibility.

Insert a `<Tabs.Expander />` between any two children to right-align all
subsequent children (or bottom-align when `vertical`).

@interface ITabsProps

@### Tab

`Tab` is a minimal wrapper with no functionality of its own&mdash;it is managed entirely by its
parent `Tabs` wrapper. Tab title text can be set either via `title` prop or via React children
(for more complex content).

The associated tab `panel` will be visible when the `Tab` is active. Omitting
`panel` is supported and can be useful when you want the associated panel to
appear elsewhere in the DOM (by rendering it yourself as needed).

@interface ITabProps

@## CSS

Blueprint offers tab styles with the class `@ns-tabs`. You should add the proper
accessibility attributes (`role`, `aria-selected`, and `aria-hidden`) as
necessary if you choose to implement tabs with CSS.

`.@ns-tab-panel` elements with `aria-hidden="true"` are hidden automatically by
the Blueprint CSS. You may also simply omit hidden tabs from your markup to
improve performance (the `Tabs` JavaScript component supports this through the
`renderActiveTabPanelOnly` prop).

@css tabs
