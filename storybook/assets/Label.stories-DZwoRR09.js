import{L as t,j as e}from"./iframe-6KWIKMhT.js";import{F as c}from"./flex-CfNrUc6L.js";import{I as o}from"./inputGroup-Csz7Qhv0.js";import"./preload-helper-PPVm8Dsz.js";const h={title:"Core/Form/Label",component:t,decorators:[r=>e.jsx(c,{flexDirection:"column",gap:3,style:{width:"100%",minWidth:"400px"},children:e.jsx(r,{})})],tags:["autodocs"]},a={args:{children:"Label text"}},n={name:"With Input",args:{children:"Label text"},render:({children:r,...d})=>e.jsx(c,{flexDirection:"column",gap:4,style:{width:"100%"},children:e.jsxs(t,{...d,children:[r,e.jsx(o,{placeholder:"Placeholder..."})]})})},s={name:"State",render:()=>e.jsxs(c,{flexDirection:"column",gap:4,style:{width:"100%"},children:[e.jsxs(t,{children:["Enabled label",e.jsx(o,{placeholder:"Enabled..."})]}),e.jsxs(t,{disabled:!0,children:["Disabled label",e.jsx(o,{disabled:!0,placeholder:"Disabled..."})]})]})},l={render:({children:r,...d})=>e.jsxs(t,{...d,children:[r,e.jsx(o,{placeholder:"Enter value..."})]}),args:{children:"Field label"}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Label text"
  }
}`,...a.parameters?.docs?.source},description:{story:"A basic label with text content.",...a.parameters?.docs?.description}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  name: "With Input",
  args: {
    children: "Label text"
  },
  render: ({
    children,
    ...args
  }) => <Flex flexDirection="column" gap={4} style={{
    width: "100%"
  }}>
            <Label {...args}>
                {children}
                <InputGroup placeholder="Placeholder..." />
            </Label>
        </Flex>
}`,...n.parameters?.docs?.source},description:{story:"Labels are commonly used alongside input elements.",...n.parameters?.docs?.description}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  name: "State",
  render: () => <Flex flexDirection="column" gap={4} style={{
    width: "100%"
  }}>
            <Label>
                Enabled label
                <InputGroup placeholder="Enabled..." />
            </Label>
            <Label disabled={true}>
                Disabled label
                <InputGroup disabled={true} placeholder="Disabled..." />
            </Label>
        </Flex>
}`,...s.parameters?.docs?.source},description:{story:"Labels support disabled styling through the `bp-disabled` class.",...s.parameters?.docs?.description}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: ({
    children,
    ...args
  }) => <Label {...args}>
            {children}
            <InputGroup placeholder="Enter value..." />
        </Label>,
  args: {
    children: "Field label"
  }
}`,...l.parameters?.docs?.source},description:{story:"Interactive playground.",...l.parameters?.docs?.description}}};const b=["Default","WithInput","StateExample","Playground"];export{a as Default,l as Playground,s as StateExample,n as WithInput,b as __namedExportsOrder,h as default};
