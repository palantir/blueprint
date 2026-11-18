import{j as e}from"./iframe-6KWIKMhT.js";import{s as b,S as c}from"./common-CGlRPlLv.js";import{F as n}from"./flex-CfNrUc6L.js";import{C as t}from"./controls-DUXJJE55.js";import"./preload-helper-PPVm8Dsz.js";const u=["large","tagName","labelElement","inputRef"],k={title:"Core/Form/Controls/Checkbox",component:t,decorators:[b],tags:["autodocs"],args:{label:"Checkbox",disabled:!1,inline:!1,size:"medium"},argTypes:{size:{control:"select",options:["medium","large"]},disabled:{control:"boolean"},inline:{control:"boolean"},indeterminate:{control:"boolean"},defaultChecked:{control:"boolean"},onChange:{action:"changed"},...u.reduce((a,l)=>(a[l]={table:{disable:!0}},a),{})}},r={args:{label:"Enable notifications"}},s={name:"Size",argTypes:{size:{table:{disable:!0}}},render:a=>e.jsxs(n,{gap:4,alignItems:"center",children:[e.jsx(t,{...a,size:"medium",label:"Medium",defaultChecked:!0}),e.jsx(t,{...a,size:"large",label:"Large",defaultChecked:!0})]})},i={name:"State",argTypes:{disabled:{table:{disable:!0}},indeterminate:{table:{disable:!0}},inline:{table:{disable:!0}}},render:a=>e.jsxs(n,{gap:4,flexDirection:"column",children:[e.jsx(c,{title:"Unchecked"}),e.jsxs(n,{gap:4,children:[e.jsx(t,{...a,label:"Default"}),e.jsx(t,{...a,label:"Disabled",disabled:!0})]}),e.jsx(c,{title:"Checked"}),e.jsxs(n,{gap:4,children:[e.jsx(t,{...a,label:"Checked",defaultChecked:!0}),e.jsx(t,{...a,label:"Checked Disabled",defaultChecked:!0,disabled:!0})]}),e.jsx(c,{title:"Indeterminate"}),e.jsxs(n,{gap:4,children:[e.jsx(t,{...a,label:"Indeterminate",indeterminate:!0}),e.jsx(t,{...a,label:"Indeterminate Disabled",indeterminate:!0,disabled:!0})]}),e.jsx(c,{title:"Inline"}),e.jsxs("div",{children:[e.jsx(t,{...a,inline:!0,label:"Option A"}),e.jsx(t,{...a,inline:!0,label:"Option B"}),e.jsx(t,{...a,inline:!0,label:"Option C"})]})]})},d={name:"All States All Sizes",render:a=>e.jsx(n,{gap:6,flexDirection:"column",children:["medium","large"].map(l=>e.jsxs("div",{children:[e.jsx(c,{title:l}),e.jsxs(n,{gap:4,flexDirection:"column",children:[e.jsx(t,{...a,size:l,label:"Unchecked"}),e.jsx(t,{...a,size:l,label:"Checked",defaultChecked:!0}),e.jsx(t,{...a,size:l,label:"Indeterminate",indeterminate:!0}),e.jsx(t,{...a,size:l,label:"Disabled",disabled:!0}),e.jsx(t,{...a,size:l,label:"Checked Disabled",defaultChecked:!0,disabled:!0}),e.jsx(t,{...a,size:l,label:"Indeterminate Disabled",indeterminate:!0,disabled:!0})]})]},l))})},o={args:{label:"Enable feature",defaultChecked:!1}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Enable notifications"
  }
}`,...r.parameters?.docs?.source},description:{story:"A basic checkbox with default styling.",...r.parameters?.docs?.description}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  name: "Size",
  argTypes: {
    size: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex gap={4} alignItems="center">
            <Checkbox {...args} size="medium" label="Medium" defaultChecked={true} />
            <Checkbox {...args} size="large" label="Large" defaultChecked={true} />
        </Flex>
}`,...s.parameters?.docs?.source},description:{story:"Use the `size` prop to adjust the checkbox dimensions.",...s.parameters?.docs?.description}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  name: "State",
  argTypes: {
    disabled: {
      table: {
        disable: true
      }
    },
    indeterminate: {
      table: {
        disable: true
      }
    },
    inline: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex gap={4} flexDirection="column">
            <StoryLabel title="Unchecked" />
            <Flex gap={4}>
                <Checkbox {...args} label="Default" />
                <Checkbox {...args} label="Disabled" disabled={true} />
            </Flex>
            <StoryLabel title="Checked" />
            <Flex gap={4}>
                <Checkbox {...args} label="Checked" defaultChecked={true} />
                <Checkbox {...args} label="Checked Disabled" defaultChecked={true} disabled={true} />
            </Flex>
            <StoryLabel title="Indeterminate" />
            <Flex gap={4}>
                <Checkbox {...args} label="Indeterminate" indeterminate={true} />
                <Checkbox {...args} label="Indeterminate Disabled" indeterminate={true} disabled={true} />
            </Flex>
            <StoryLabel title="Inline" />
            <div>
                <Checkbox {...args} inline={true} label="Option A" />
                <Checkbox {...args} inline={true} label="Option B" />
                <Checkbox {...args} inline={true} label="Option C" />
            </div>
        </Flex>
}`,...i.parameters?.docs?.source},description:{story:"Checkboxes support `disabled`, `indeterminate`, and `inline` states.",...i.parameters?.docs?.description}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: "All States All Sizes",
  render: args => <Flex gap={6} flexDirection="column">
            {(["medium", "large"] as const).map(size => <div key={size}>
                    <StoryLabel title={size} />
                    <Flex gap={4} flexDirection="column">
                        <Checkbox {...args} size={size} label="Unchecked" />
                        <Checkbox {...args} size={size} label="Checked" defaultChecked={true} />
                        <Checkbox {...args} size={size} label="Indeterminate" indeterminate={true} />
                        <Checkbox {...args} size={size} label="Disabled" disabled={true} />
                        <Checkbox {...args} size={size} label="Checked Disabled" defaultChecked={true} disabled={true} />
                        <Checkbox {...args} size={size} label="Indeterminate Disabled" indeterminate={true} disabled={true} />
                    </Flex>
                </div>)}
        </Flex>
}`,...d.parameters?.docs?.source},description:{story:"All states across all sizes.",...d.parameters?.docs?.description}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Enable feature",
    defaultChecked: false
  }
}`,...o.parameters?.docs?.source},description:{story:"Interactive playground with all props togglable via Storybook controls.",...o.parameters?.docs?.description}}};const C=["Default","SizeExample","StateExample","AllStatesAllSizes","Playground"];export{d as AllStatesAllSizes,r as Default,o as Playground,s as SizeExample,i as StateExample,C as __namedExportsOrder,k as default};
