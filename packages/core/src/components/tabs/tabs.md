@# Tabs

The **Tabs** component allows you to switch between displaying multiple panels of content.

@reactExample TabsExample

@## Usage

Tab selection is managed by `id`, much like the HTML `<select>` element respects `<option value>`. This is more
reliable than using a numeric index as it does not require translating between arbitrary indices and tab names.
It does, however, require that every `<Tab>` have a _locally unique `id` value_.

Arbitrary elements are supported in the tab list, and order is respected. Yes,
you can even insert things _between_ `<Tab>` elements.

```tsx
import { Tab, Tabs } from "@blueprintjs/core";

<Tabs id="TabsExample">
    <Tab id="ng" title="Angular" panel={<AngularPanel />} />
    <Tab id="mb" title="Ember" panel={<EmberPanel />} panelClassName="ember-panel" />
    <Tab id="rx" title="React" panel={<ReactPanel />} />
    <Tab id="bb" disabled title="Backbone" panel={<BackbonePanel />} />
    <TabsExpander />
    <input className="@ns-input" type="text" placeholder="Search..." />
</Tabs>;
```

@### Tabs

`<Tabs>` is the top-level component responsible for rendering the tab list and coordinating selection.
It can be used in controlled mode by providing `selectedTabId` and `onChange` props, or in
uncontrolled mode by optionally providing `defaultSelectedTabId` and `onChange`.

Children of `<Tabs>` are rendered in order in the tab list, which is a flex container.
`<Tab>` child elements are managed by the component; clicking one will change selection.
Other child elements are rendered in order; interactions are your responsibility.

Insert a `<TabsExpander />` between any two children to right-align all subsequent children
(or bottom-align when `vertical`).

@interface TabsProps

@### Tab

The **Tab** component is a minimal wrapper with no functionality of its own&mdash;it is managed entirely by its
parent **Tabs** component. Tab title text can be set either via `title` prop or via React children
(for more complex content).

The associated tab `panel` will be visible when the _Tab_ is active. Omitting the `panel` prop is supported; this can
be useful when you want the associated panel to appear elsewhere in the DOM (by rendering it yourself as needed&mdash;see _TabPanel_).

@interface TabProps

@### TabPanel

**TabPanel** wraps a passed `panel` in proper aria attributes, `id`, and `role`, for proper accessibility. A **TabPanel** gets automatically rendered by a _Tab_ when `panel` is supplied and the _Tab_ is active, but **TabPanel** is also exported for cases where you want to render the panel yourself elsewhere in the DOM, while using _Tabs_ in controlled mode:

```tsx
import * as React from "react";
import { Tab, Tabs, TabPanel, type TabId } from "@blueprintjs/core";

function TabsControlledExample() {
    const TABS_PARENT_ID = React.useId();
    const [selectedTabId, setSelectedTabId] = React.useState<TabId>("Home");

    return (
        <>
            <Tabs id={TABS_PARENT_ID} onChange={setSelectedTabId} selectedTabId={selectedTabId}>
                <Tab id="Home" title="Home" />
                <Tab id="Files" title="Files" />
            </Tabs>
            <TabPanel
                id={selectedTabId}
                selectedTabId={selectedTabId}
                parentId={TABS_PARENT_ID}
                panel={<p>The current panel id is: "{selectedTabId}"</p>}
            />
        </>
    );
}
```

@interface TabPanelProps

@## CSS API

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">

Deprecated API: use [`<Tabs>`](#core/components/tabs)

</h5>

CSS APIs for Blueprint components are considered deprecated, as they are verbose, error-prone, and they
often fall out of sync as the design system is updated. You should use the React component APIs instead.

</div>

Blueprint offers tab styles with the class `@ns-tabs`. You should add the proper accessibility attributes
(`role`, `aria-selected`, and `aria-hidden`) as necessary if you choose to implement tabs with CSS.

`.@ns-tab-panel` elements with `aria-hidden="true"` are hidden automatically by the Blueprint CSS. You may also
omit hidden tabs from your markup to improve performance (the `Tabs` JavaScript component supports this through the
`renderActiveTabPanelOnly` prop).

@css tabs
