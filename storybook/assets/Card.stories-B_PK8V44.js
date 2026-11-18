import{j as e,H as h}from"./iframe-6KWIKMhT.js";import{s as C,S as g}from"./common-CGlRPlLv.js";import{F as u}from"./flex-CfNrUc6L.js";import{E as n,C as r}from"./card-C6ssIv7b.js";import"./preload-helper-PPVm8Dsz.js";const j={title:"Core/Card",component:r,decorators:[C],tags:["autodocs"],args:{children:"Card content",elevation:n.ZERO,interactive:!1,selected:!1,compact:!1},argTypes:{elevation:{control:"select",options:Object.values(n)},interactive:{control:"boolean"},selected:{control:"boolean"},compact:{control:"boolean"},onClick:{action:"clicked"}}},s={args:{children:"Card content"}},c={name:"Elevation",argTypes:{elevation:{table:{disable:!0}}},render:a=>e.jsx(u,{gap:4,children:Object.values(n).map(t=>e.jsxs(r,{...a,elevation:t,style:{width:140,padding:16},children:[e.jsx(g,{title:"Elevation"}),t]},t))})},i={name:"State",argTypes:{interactive:{table:{disable:!0}},selected:{table:{disable:!0}},compact:{table:{disable:!0}}},render:a=>e.jsxs(u,{gap:4,alignItems:"start",children:[e.jsx(r,{...a,style:{width:140,padding:16},children:"Default"}),e.jsx(r,{...a,interactive:!0,style:{width:140,padding:16},children:"Interactive"}),e.jsx(r,{...a,interactive:!0,selected:!0,style:{width:140,padding:16},children:"Selected"}),e.jsx(r,{...a,compact:!0,style:{width:140},children:"Compact"})]})},o={args:{children:"Click me",interactive:!0,elevation:n.ONE}},d={args:{children:"Selected card",interactive:!0,selected:!0,elevation:n.ONE}},l={args:{children:"Compact card",compact:!0}},p={render:a=>e.jsx(u,{flexDirection:"column",gap:4,children:["Default","Interactive","Selected","Compact"].map(t=>e.jsxs("div",{children:[e.jsx(g,{title:t}),e.jsx(u,{gap:4,children:Object.values(n).map(v=>e.jsxs(r,{...a,elevation:v,interactive:t==="Interactive"||t==="Selected"||t==="Compact",selected:t==="Selected",compact:t==="Compact",style:{width:120,padding:t==="Compact"?void 0:16},children:["Elev ",v]},v))})]},t))})},m={args:{children:"Customize this card using the controls below.",interactive:!0},render:a=>e.jsxs(r,{...a,children:[e.jsx(h,{children:"Card Title"}),e.jsx("p",{children:a.children})]})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Card content"
  }
}`,...s.parameters?.docs?.source},description:{story:"A basic card with default styling.",...s.parameters?.docs?.description}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: "Elevation",
  argTypes: {
    elevation: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex gap={4}>
            {Object.values(Elevation).map(elevation => <Card key={elevation} {...args} elevation={elevation} style={{
      width: 140,
      padding: 16
    }}>
                    <StoryLabel title="Elevation" />
                    {elevation}
                </Card>)}
        </Flex>
}`,...c.parameters?.docs?.source},description:{story:"Cards at each elevation level, showing increasing drop shadow intensity.",...c.parameters?.docs?.description}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  name: "State",
  argTypes: {
    interactive: {
      table: {
        disable: true
      }
    },
    selected: {
      table: {
        disable: true
      }
    },
    compact: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex gap={4} alignItems="start">
            <Card {...args} style={{
      width: 140,
      padding: 16
    }}>
                Default
            </Card>
            <Card {...args} interactive={true} style={{
      width: 140,
      padding: 16
    }}>
                Interactive
            </Card>
            <Card {...args} interactive={true} selected={true} style={{
      width: 140,
      padding: 16
    }}>
                Selected
            </Card>
            <Card {...args} compact={true} style={{
      width: 140
    }}>
                Compact
            </Card>
        </Flex>
}`,...i.parameters?.docs?.source},description:{story:"Cards in all visual states: default, interactive, selected, and compact.",...i.parameters?.docs?.description}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Click me",
    interactive: true,
    elevation: Elevation.ONE
  }
}`,...o.parameters?.docs?.source},description:{story:"An interactive card that responds to hover and click events.",...o.parameters?.docs?.description}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Selected card",
    interactive: true,
    selected: true,
    elevation: Elevation.ONE
  }
}`,...d.parameters?.docs?.source},description:{story:"A selected card with the selected visual treatment.",...d.parameters?.docs?.description}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Compact card",
    compact: true
  }
}`,...l.parameters?.docs?.source},description:{story:"A compact card with reduced visual padding.",...l.parameters?.docs?.description}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: args => <Flex flexDirection="column" gap={4}>
            {(["Default", "Interactive", "Selected", "Compact"] as const).map(state => <div key={state}>
                    <StoryLabel title={state} />
                    <Flex gap={4}>
                        {Object.values(Elevation).map(elevation => <Card key={elevation} {...args} elevation={elevation} interactive={state === "Interactive" || state === "Selected" || state === "Compact"} selected={state === "Selected"} compact={state === "Compact"} style={{
          width: 120,
          padding: state === "Compact" ? undefined : 16
        }}>
                                Elev {elevation}
                            </Card>)}
                    </Flex>
                </div>)}
        </Flex>
}`,...p.parameters?.docs?.source},description:{story:"Comprehensive matrix showing all elevations × all states for visual regression testing.",...p.parameters?.docs?.description}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Customize this card using the controls below.",
    interactive: true
  },
  render: args => <Card {...args}>
            <H3>Card Title</H3>
            <p>{args.children}</p>
        </Card>
}`,...m.parameters?.docs?.source},description:{story:"An interactive playground for experimenting with Card props.",...m.parameters?.docs?.description}}};const f=["Default","ElevationExample","StateExample","Interactive","Selected","Compact","AllElevationsAllStates","Playground"];export{p as AllElevationsAllStates,l as Compact,s as Default,c as ElevationExample,o as Interactive,m as Playground,d as Selected,i as StateExample,f as __namedExportsOrder,j as default};
