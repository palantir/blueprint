import{j as e}from"./iframe-6KWIKMhT.js";import{s as u,S as o}from"./common-CGlRPlLv.js";import{F as r}from"./flex-CfNrUc6L.js";import{S as l}from"./controls-DUXJJE55.js";import"./preload-helper-PPVm8Dsz.js";const b=["large","tagName","labelElement","inputRef"],f={title:"Core/Form/Controls/Switch",component:l,decorators:[u],tags:["autodocs"],args:{label:"Switch",disabled:!1,inline:!1,size:"medium"},argTypes:{size:{control:"select",options:["medium","large"]},disabled:{control:"boolean"},inline:{control:"boolean"},innerLabel:{control:"text"},innerLabelChecked:{control:"text"},defaultChecked:{control:"boolean"},onChange:{action:"changed"},...b.reduce((a,t)=>(a[t]={table:{disable:!0}},a),{})}},n={args:{label:"Enable dark mode"}},s={name:"Size",argTypes:{size:{table:{disable:!0}}},render:a=>e.jsxs(r,{gap:4,alignItems:"center",children:[e.jsx(l,{...a,size:"medium",label:"Medium",defaultChecked:!0}),e.jsx(l,{...a,size:"large",label:"Large",defaultChecked:!0})]})},i={name:"State",argTypes:{disabled:{table:{disable:!0}},inline:{table:{disable:!0}},defaultChecked:{table:{disable:!0}}},render:a=>e.jsxs(r,{gap:4,flexDirection:"column",children:[e.jsx(o,{title:"Unchecked"}),e.jsxs(r,{gap:4,children:[e.jsx(l,{...a,label:"Default"}),e.jsx(l,{...a,label:"Disabled",disabled:!0})]}),e.jsx(o,{title:"Checked"}),e.jsxs(r,{gap:4,children:[e.jsx(l,{...a,label:"Checked",defaultChecked:!0}),e.jsx(l,{...a,label:"Checked Disabled",defaultChecked:!0,disabled:!0})]}),e.jsx(o,{title:"Inline"}),e.jsxs("div",{children:[e.jsx(l,{...a,inline:!0,label:"Wi-Fi",defaultChecked:!0}),e.jsx(l,{...a,inline:!0,label:"Bluetooth"}),e.jsx(l,{...a,inline:!0,label:"Airplane Mode"})]})]})},d={name:"All States",render:a=>e.jsx(r,{gap:6,flexDirection:"column",children:["medium","large"].map(t=>e.jsxs("div",{children:[e.jsx(o,{title:t}),e.jsxs(r,{gap:4,flexDirection:"column",children:[e.jsx(l,{...a,size:t,label:"Unchecked"}),e.jsx(l,{...a,size:t,label:"Checked",defaultChecked:!0}),e.jsx(l,{...a,size:t,label:"Disabled",disabled:!0}),e.jsx(l,{...a,size:t,label:"Checked Disabled",defaultChecked:!0,disabled:!0}),e.jsx(l,{...a,size:t,label:"With inner labels",innerLabel:"Off",innerLabelChecked:"On",defaultChecked:!0})]})]},t))})},c={args:{label:"Enable feature",innerLabel:"Off",innerLabelChecked:"On",defaultChecked:!1}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Enable dark mode"
  }
}`,...n.parameters?.docs?.source},description:{story:"A basic switch with default styling.",...n.parameters?.docs?.description}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  name: "Size",
  argTypes: {
    size: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex gap={4} alignItems="center">
            <Switch {...args} size="medium" label="Medium" defaultChecked={true} />
            <Switch {...args} size="large" label="Large" defaultChecked={true} />
        </Flex>
}`,...s.parameters?.docs?.source},description:{story:"Use the `size` prop to adjust the switch dimensions.",...s.parameters?.docs?.description}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  name: "State",
  argTypes: {
    disabled: {
      table: {
        disable: true
      }
    },
    inline: {
      table: {
        disable: true
      }
    },
    defaultChecked: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex gap={4} flexDirection="column">
            <StoryLabel title="Unchecked" />
            <Flex gap={4}>
                <Switch {...args} label="Default" />
                <Switch {...args} label="Disabled" disabled={true} />
            </Flex>
            <StoryLabel title="Checked" />
            <Flex gap={4}>
                <Switch {...args} label="Checked" defaultChecked={true} />
                <Switch {...args} label="Checked Disabled" defaultChecked={true} disabled={true} />
            </Flex>
            <StoryLabel title="Inline" />
            <div>
                <Switch {...args} inline={true} label="Wi-Fi" defaultChecked={true} />
                <Switch {...args} inline={true} label="Bluetooth" />
                <Switch {...args} inline={true} label="Airplane Mode" />
            </div>
        </Flex>
}`,...i.parameters?.docs?.source},description:{story:"Switches support `disabled`, `checked`, and `inline` states.",...i.parameters?.docs?.description}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: "All States",
  render: args => <Flex gap={6} flexDirection="column">
            {(["medium", "large"] as const).map(size => <div key={size}>
                    <StoryLabel title={size} />
                    <Flex gap={4} flexDirection="column">
                        <Switch {...args} size={size} label="Unchecked" />
                        <Switch {...args} size={size} label="Checked" defaultChecked={true} />
                        <Switch {...args} size={size} label="Disabled" disabled={true} />
                        <Switch {...args} size={size} label="Checked Disabled" defaultChecked={true} disabled={true} />
                        <Switch {...args} size={size} label="With inner labels" innerLabel="Off" innerLabelChecked="On" defaultChecked={true} />
                    </Flex>
                </div>)}
        </Flex>
}`,...d.parameters?.docs?.source},description:{story:"All states across all sizes.",...d.parameters?.docs?.description}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Enable feature",
    innerLabel: "Off",
    innerLabelChecked: "On",
    defaultChecked: false
  }
}`,...c.parameters?.docs?.source},description:{story:"Interactive playground with all props toggleable via Storybook controls.",...c.parameters?.docs?.description}}};const k=["Default","SizeExample","StateExample","AllStates","Playground"];export{d as AllStates,n as Default,c as Playground,s as SizeExample,i as StateExample,k as __namedExportsOrder,f as default};
