import{j as e}from"./iframe-6KWIKMhT.js";import{s as u,S as m}from"./common-CGlRPlLv.js";import{F as t}from"./flex-CfNrUc6L.js";import{H as r}from"./htmlSelect-uzBgO6cZ.js";import"./preload-helper-PPVm8Dsz.js";import"./carets-vertical-DFIbhOR4.js";const g=[{label:"Option 1",value:"1"},{label:"Option 2",value:"2"},{label:"Option 3",value:"3"},{label:"Option 4",value:"4"},{label:"Option 5",value:"5"}],x=["children","multiple"],F={title:"Core/Form/HTMLSelect",component:r,decorators:[u],tags:["autodocs"],args:{options:g,fill:!1,large:!1,minimal:!1,disabled:!1,iconName:"double-caret-vertical"},argTypes:{fill:{control:"boolean"},large:{control:"boolean"},minimal:{control:"boolean"},disabled:{control:"boolean"},iconName:{control:"select",options:["double-caret-vertical","caret-down"]},onChange:{action:"changed"},...x.reduce((a,p)=>(a[p]={table:{disable:!0}},a),{})}},l={},n={name:"Variant",argTypes:{minimal:{table:{disable:!0}}},render:a=>e.jsxs(t,{gap:2,alignItems:"center",children:[e.jsxs(t,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(r,{...a,minimal:!1}),e.jsx(m,{title:"Default"})]}),e.jsxs(t,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(r,{...a,minimal:!0}),e.jsx(m,{title:"Minimal"})]})]})},s={name:"Size",argTypes:{large:{table:{disable:!0}}},render:a=>e.jsxs(t,{gap:2,alignItems:"center",children:[e.jsx(r,{...a,large:!1}),e.jsx(r,{...a,large:!0})]})},o={name:"State",argTypes:{disabled:{table:{disable:!0}}},render:a=>e.jsxs(t,{gap:2,alignItems:"center",children:[e.jsx(r,{...a,disabled:!1}),e.jsx(r,{...a,disabled:!0})]})},i={name:"Icons",argTypes:{iconName:{table:{disable:!0}}},render:a=>e.jsxs(t,{gap:2,alignItems:"center",children:[e.jsxs(t,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(r,{...a,iconName:"double-caret-vertical"}),e.jsx(m,{title:"double-caret-vertical"})]}),e.jsxs(t,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(r,{...a,iconName:"caret-down"}),e.jsx(m,{title:"caret-down"})]})]})},c={name:"Fill",argTypes:{fill:{table:{disable:!0}}},decorators:[a=>e.jsx("div",{style:{width:"400px"},children:e.jsx(a,{})})],render:a=>e.jsxs(t,{flexDirection:"column",gap:2,alignItems:"start",children:[e.jsx(r,{...a,fill:!0,options:[{label:"Full Width",value:"full"}]}),e.jsx(r,{...a,fill:!1,options:[{label:"Auto Width",value:"auto"}]})]})},d={};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:"{}",...l.parameters?.docs?.source},description:{story:"A basic HTML select with default styling.",...l.parameters?.docs?.description}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  name: "Variant",
  argTypes: {
    minimal: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex gap={2} alignItems="center">
            <Flex flexDirection="column" gap={1} alignItems="center">
                <HTMLSelect {...args} minimal={false} />
                <StoryLabel title="Default" />
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <HTMLSelect {...args} minimal={true} />
                <StoryLabel title="Minimal" />
            </Flex>
        </Flex>
}`,...n.parameters?.docs?.source},description:{story:"Use the `minimal` prop to apply minimal styling.",...n.parameters?.docs?.description}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  name: "Size",
  argTypes: {
    large: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex gap={2} alignItems="center">
            <HTMLSelect {...args} large={false} />
            <HTMLSelect {...args} large={true} />
        </Flex>
}`,...s.parameters?.docs?.source},description:{story:"Use the `large` prop to render a larger select element.",...s.parameters?.docs?.description}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: "State",
  argTypes: {
    disabled: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex gap={2} alignItems="center">
            <HTMLSelect {...args} disabled={false} />
            <HTMLSelect {...args} disabled={true} />
        </Flex>
}`,...o.parameters?.docs?.source},description:{story:"Use the `disabled` prop to make the select non-interactive.",...o.parameters?.docs?.description}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  name: "Icons",
  argTypes: {
    iconName: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex gap={2} alignItems="center">
            <Flex flexDirection="column" gap={1} alignItems="center">
                <HTMLSelect {...args} iconName="double-caret-vertical" />
                <StoryLabel title="double-caret-vertical" />
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <HTMLSelect {...args} iconName="caret-down" />
                <StoryLabel title="caret-down" />
            </Flex>
        </Flex>
}`,...i.parameters?.docs?.source},description:{story:"Use the `iconName` prop to choose between the supported dropdown icons.",...i.parameters?.docs?.description}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: "Fill",
  argTypes: {
    fill: {
      table: {
        disable: true
      }
    }
  },
  decorators: [Story => <div style={{
    width: "400px"
  }}>
                <Story />
            </div>],
  render: args => <Flex flexDirection="column" gap={2} alignItems="start">
            <HTMLSelect {...args} fill={true} options={[{
      label: "Full Width",
      value: "full"
    }]} />
            <HTMLSelect {...args} fill={false} options={[{
      label: "Auto Width",
      value: "auto"
    }]} />
        </Flex>
}`,...c.parameters?.docs?.source},description:{story:"Use the `fill` prop to make the select expand to the full width of its container.",...c.parameters?.docs?.description}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:"{}",...d.parameters?.docs?.source},description:{story:"Interactive playground with all props togglable via Storybook controls.",...d.parameters?.docs?.description}}};const T=["Default","VariantExample","SizeExample","StateExample","IconsExample","FillExample","Playground"];export{l as Default,c as FillExample,i as IconsExample,d as Playground,s as SizeExample,o as StateExample,n as VariantExample,T as __namedExportsOrder,F as default};
