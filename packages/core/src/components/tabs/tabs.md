@# Tabs

Tabs allow the user to switch between panels of content.

@## CSS API

In addition to the [JavaScript API](#components.tabs.js), Blueprint also offers tab styles with the
class `pt-tabs`. You should add the proper accessibility attributes (`role`, `aria-selected`, and
`aria-hidden`) if you choose to implement tabs with CSS.

`.pt-tab-panel` elements with `aria-hidden="true"` are hidden automatically by the Blueprint CSS.
You may also simply omit hidden tabs from your markup to improve performance (the `Tabs`
JavaScript component does this by default).

@## JavaScript API

The `Tabs`, `TabList`, `Tab`, and `TabPanel` components are available in the __@blueprintjs/core__
package. Make sure to review the [general usage docs for JS components](#components.usage).

Four components are necessary to render tabs: `Tabs`, `TabList`, `Tab`, and `TabPanel`.

For performance reasons, only the currently active `TabPanel` is rendered into the DOM. When the
user switches tabs, data stored in the DOM is lost. This is not an issue in React applications
because of how the library manages the virtual DOM for you.

@### Sample usage

```tsx
<Tabs>
    <TabList>
        <Tab>First tab</Tab>
        <Tab>Second tab</Tab>
        <Tab>Third tab</Tab>
        <Tab isDisabled={true}>Fourth tab</Tab>
    </TabList>
    <TabPanel>
        First panel
    </TabPanel>
    <TabPanel>
        Second panel
    </TabPanel>
    <TabPanel>
        Third panel
    </TabPanel>
    <TabPanel>
        Fourth panel
    </TabPanel>
</Tabs>
```

Every component accepts a `className` prop that can be used to set additional classes on the
component's root element. You can get larger tabs by using the `pt-large` class on `TabList`.

You can use the `Tabs` API in controlled or uncontrolled mode. The props you supply will differ
between these approaches.

@reactExample TabsExample

@### Tabs props

@interface ITabsProps

@### Tab props

@interface ITabProps

@### Usage with React Router

Often, you'll want to link tab navigation to overall app navigation, including updating the URL.
[react-router](https://github.com/reactjs/react-router) is a commonly-used library for React
applications. Here's how you might configure tabs to work with it:

```tsx
import { render } from "react-dom";
import { Router, Route } from "react-router";
import { Tabs, TabList, Tab, TabPanel } from "@blueprintjs/core";

const App = () => { ... };

// keys are necessary in JSX.Element lists to keep React happy
const contents = [
    <TabList key={0}>
        <Tab>Home</Tab>
        <Tab>Projects</Tab>
    </TabList>,
    <TabPanel key={1}>
        home things
    </TabPanel>,
    <TabPanel key={2}>
        projects things
    </TabPanel>,
];

// using SFCs from TS 1.8, but easy to do without them
export const Home = () => <Tabs selectedTabIndex={0}>{contents}</Tabs>;
export const Projects = () => <Tabs selectedTabIndex={1}>{contents}</Tabs>;

render(
    <Router path="/" component={App}>
        <Route path="home" component={Home}/>
        <Route path="projects" component={Projects}/>
    </Router>,
    document.querySelector("#app")
);
```
