@# Tabs

@## CSS API

In addition to the [JavaScript API](#core/components/tabs.javascript-api), Blueprint also offers tab styles with the
class `pt-tabs`. You should add the proper accessibility attributes (`role`, `aria-selected`, and
`aria-hidden`) if you choose to implement tabs with CSS.

`.pt-tab-panel` elements with `aria-hidden="true"` are hidden automatically by the Blueprint CSS.
You may also simply omit hidden tabs from your markup to improve performance (the `Tabs`
JavaScript component does this by default).

@css pt-tabs

@## JavaScript API

The `Tabs` and `Tab` components are available in the __@blueprintjs/core__
package. Make sure to review the [general usage docs for JS components](#blueprint.usage).

Tab selection is managed by `id`, much like the HTML `<select>` element respects `<option value>`. This is more reliable than using a numeric index (it's also deterministic), and
does not require translating between numbers and tab names. It does, however, require that
every `Tab` have a locally unique `id` prop.

Arbitrary elements are supported in the tab list, and order is respected. Yes, you can even
insert things _between_ `Tab`s.

```tsx
import { Tab, Tabs } from "@blueprintjs/core";

<Tabs id="TabsExample" onChange={this.handleTabChange} selectedTabId="rx">
    <Tab id="ng" title="Angular" panel={<AngularPanel />} />
    <Tab id="mb" title="Ember" panel={<EmberPanel />} />
    <Tab id="rx" title="React" panel={<ReactPanel />} />
    <Tab id="bb" disabled title="Backbone" panel={<BackbonePanel />} />
    <Tabs.Expander />
    <input className="pt-input" type="text" placeholder="Search..." />
</Tabs>
```

@reactExample TabsExample

@### Tabs

`Tabs` is the top-level component responsible for rendering the tab list and coordinating selection.
It can be used in controlled mode by providing `selectedTabId` and `onChange` props, or in
uncontrolled mode by optionally providing `defaultSelectedTabId` and `onChange`.

Children of the `Tabs` are rendered in order in the tab list, which is a flex container.
`Tab` children are managed by the component; clicking one will change selection. Arbitrary other
children are simply rendered in order; interactions are your responsibility.

Insert a `<Tabs.Expander />` between any two children to right-align all subsequent children (or bottom-align when `vertical`).

@interface ITabsProps

@### Tab

`Tab` is a minimal wrapper with no functionality of its own&mdash;it is managed entirely by its
parent `Tabs` wrapper. Tab title text can be set either via `title` prop or via React children
(for more complex content).

The associated tab `panel` will be visible when the `Tab` is active. Omitting `panel` is perfectly
safe and allows you to control exactly where the panel appears in the DOM (by rendering it yourself
as needed).

@interface ITab2Props


@### Usage with React Router

Often, you'll want to link tab navigation to overall app navigation, including updating the URL.
[react-router](https://github.com/reactjs/react-router) is a commonly-used library for React
applications. Here's how you might configure tabs to work with it:

```tsx
import { render } from "react-dom";
import { Router, Route } from "react-router";
import { Tabs, Tab } from "@blueprintjs/core";

const App = () => { ... };

// keys are necessary in JSX.Element lists to keep React happy
const contents = [
    <Tab key="home" id="home" title="Home" panel={<HomePanel />}>,
    <Tab key="proj" id="projects" title="Projects" panel={<ProjectsPanel />}>,
];

export const Home = () => <Tabs selectedTabId="home">{contents}</Tabs>;
export const Projects = () => <Tabs selectedTabId="projects">{contents}</Tabs>;

render(
    <Router path="/" component={App}>
        <Route path="home" component={Home}/>
        <Route path="projects" component={Projects}/>
    </Router>,
    document.querySelector("#app")
);
```
