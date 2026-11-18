import{j as e,B as t}from"./iframe-6KWIKMhT.js";import{s as c}from"./common-CGlRPlLv.js";import{F as p}from"./flex-CfNrUc6L.js";import{C as n}from"./controlGroup-DgQe6Apf.js";import{I as o}from"./inputGroup-Csz7Qhv0.js";import"./preload-helper-PPVm8Dsz.js";const g={title:"Core/Form/ControlGroup",component:n,decorators:[c],tags:["autodocs"],args:{fill:!1,vertical:!1},argTypes:{fill:{control:"boolean"},vertical:{control:"boolean"}}},l={argTypes:{fill:{table:{disable:!0}},children:{table:{disable:!0}}},render:r=>e.jsxs(n,{...r,children:[e.jsx(o,{placeholder:"Enter text..."}),e.jsx(t,{text:"Submit"})]})},a={name:"Fill",argTypes:{fill:{table:{disable:!0}},children:{table:{disable:!0}}},decorators:[r=>e.jsx("div",{style:{width:"500px"},children:e.jsx(r,{})})],render:r=>e.jsxs(p,{flexDirection:"column",gap:2,children:[e.jsxs(n,{...r,fill:!0,children:[e.jsx(o,{placeholder:"Full width input"}),e.jsx(t,{text:"Submit"})]}),e.jsxs(n,{...r,fill:!1,children:[e.jsx(o,{placeholder:"Auto width input"}),e.jsx(t,{text:"Submit"})]})]})},s={name:"Vertical",argTypes:{vertical:{table:{disable:!0}},children:{table:{disable:!0}}},decorators:[r=>e.jsx("div",{style:{width:"500px"},children:e.jsx(r,{})})],render:r=>e.jsxs(p,{flexDirection:"column",gap:8,children:[e.jsxs(n,{...r,vertical:!0,children:[e.jsx(o,{placeholder:"Vertical input"}),e.jsx(t,{text:"Submit"})]}),e.jsxs(n,{...r,vertical:!1,children:[e.jsx(o,{placeholder:"Horizontal input"}),e.jsx(t,{text:"Submit"})]})]})},i={argTypes:{children:{table:{disable:!0}}},render:r=>e.jsxs(n,{...r,children:[e.jsx(t,{icon:"filter","aria-label":"Filter results"}),e.jsx(o,{placeholder:"Enter text..."}),e.jsx(t,{text:"Submit"})]})};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  argTypes: {
    fill: {
      table: {
        disable: true
      }
    },
    children: {
      table: {
        disable: true
      }
    }
  },
  render: args => <ControlGroup {...args}>
            <InputGroup placeholder="Enter text..." />
            <Button text="Submit" />
        </ControlGroup>
}`,...l.parameters?.docs?.source},description:{story:"A basic control group with default styling containing an input and a button.",...l.parameters?.docs?.description}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  name: "Fill",
  argTypes: {
    fill: {
      table: {
        disable: true
      }
    },
    children: {
      table: {
        disable: true
      }
    }
  },
  decorators: [Story => <div style={{
    width: "500px"
  }}>
                <Story />
            </div>],
  render: args => <Flex flexDirection="column" gap={2}>
            <ControlGroup {...args} fill={true}>
                <InputGroup placeholder="Full width input" />
                <Button text="Submit" />
            </ControlGroup>
            <ControlGroup {...args} fill={false}>
                <InputGroup placeholder="Auto width input" />
                <Button text="Submit" />
            </ControlGroup>
        </Flex>
}`,...a.parameters?.docs?.source},description:{story:"Use the `fill` prop to make the control group expand to the full width of its container.",...a.parameters?.docs?.description}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  name: "Vertical",
  argTypes: {
    vertical: {
      table: {
        disable: true
      }
    },
    children: {
      table: {
        disable: true
      }
    }
  },
  decorators: [Story => <div style={{
    width: "500px"
  }}>
                <Story />
            </div>],
  render: args => <Flex flexDirection="column" gap={8}>
            <ControlGroup {...args} vertical={true}>
                <InputGroup placeholder="Vertical input" />
                <Button text="Submit" />
            </ControlGroup>
            <ControlGroup {...args} vertical={false}>
                <InputGroup placeholder="Horizontal input" />
                <Button text="Submit" />
            </ControlGroup>
        </Flex>
}`,...s.parameters?.docs?.source},description:{story:"Use the `vertical` prop to make the control group show vertically.",...s.parameters?.docs?.description}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  argTypes: {
    children: {
      table: {
        disable: true
      }
    }
  },
  render: args => <ControlGroup {...args}>
            <Button icon="filter" aria-label="Filter results" />
            <InputGroup placeholder="Enter text..." />
            <Button text="Submit" />
        </ControlGroup>
}`,...i.parameters?.docs?.source},description:{story:"Interactive playground with all props toggleable via Storybook controls.",...i.parameters?.docs?.description}}};const f=["Default","FillExample","VerticalExample","Playground"];export{l as Default,a as FillExample,i as Playground,s as VerticalExample,f as __namedExportsOrder,g as default};
