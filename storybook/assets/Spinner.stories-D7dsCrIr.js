import{aA as s,I as m,aB as r,j as e}from"./iframe-6KWIKMhT.js";import{s as g,S as a}from"./common-CGlRPlLv.js";import{F as n}from"./flex-CfNrUc6L.js";import"./preload-helper-PPVm8Dsz.js";const D={title:"Core/Spinner",component:r,decorators:[g],tags:["autodocs"],args:{intent:m.NONE,size:s.STANDARD},argTypes:{intent:{control:"select",options:Object.values(m)},size:{control:"number"},value:{control:{type:"range",min:0,max:1,step:.05}},tagName:{control:"text"}}},i={},l={name:"Intent",argTypes:{intent:{table:{disable:!0}}},render:t=>e.jsx(n,{gap:4,alignItems:"center",children:Object.values(m).map(x=>e.jsxs(n,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(r,{...t,intent:x,size:s.STANDARD}),e.jsx(a,{title:x})]},x))})},o={name:"Size",argTypes:{size:{table:{disable:!0}}},render:t=>e.jsxs(n,{gap:6,alignItems:"center",children:[e.jsxs(n,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(r,{...t,size:s.SMALL}),e.jsx(a,{title:"Small (20px)"})]}),e.jsxs(n,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(r,{...t,size:s.STANDARD}),e.jsx(a,{title:"Standard (50px)"})]}),e.jsxs(n,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(r,{...t,size:s.LARGE}),e.jsx(a,{title:"Large (100px)"})]})]})},c={name:"State",argTypes:{value:{table:{disable:!0}}},render:t=>e.jsxs(n,{gap:6,alignItems:"center",children:[e.jsxs(n,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(r,{...t,value:void 0}),e.jsx(a,{title:"Indeterminate"})]}),e.jsxs(n,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(r,{...t,value:0}),e.jsx(a,{title:"0%"})]}),e.jsxs(n,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(r,{...t,value:.5}),e.jsx(a,{title:"50%"})]}),e.jsxs(n,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(r,{...t,value:1}),e.jsx(a,{title:"100%"})]})]})},p={args:{intent:m.PRIMARY,size:s.STANDARD,value:.7}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:"{}",...i.parameters?.docs?.source},description:{story:"A basic spinner with default styling (indeterminate).",...i.parameters?.docs?.description}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  name: "Intent",
  argTypes: {
    intent: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex gap={4} alignItems="center">
            {Object.values(Intent).map(intent => <Flex key={intent} flexDirection="column" gap={1} alignItems="center">
                    <Spinner {...args} intent={intent} size={SpinnerSize.STANDARD} />
                    <StoryLabel title={intent} />
                </Flex>)}
        </Flex>
}`,...l.parameters?.docs?.source},description:{story:"Use the `intent` prop to apply a semantic color to the spinner.",...l.parameters?.docs?.description}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: "Size",
  argTypes: {
    size: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex gap={6} alignItems="center">
            <Flex flexDirection="column" gap={1} alignItems="center">
                <Spinner {...args} size={SpinnerSize.SMALL} />
                <StoryLabel title="Small (20px)" />
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <Spinner {...args} size={SpinnerSize.STANDARD} />
                <StoryLabel title="Standard (50px)" />
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <Spinner {...args} size={SpinnerSize.LARGE} />
                <StoryLabel title="Large (100px)" />
            </Flex>
        </Flex>
}`,...o.parameters?.docs?.source},description:{story:"Use the `size` prop to control the spinner dimensions. Common sizes are available as `SpinnerSize` constants.",...o.parameters?.docs?.description}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: "State",
  argTypes: {
    value: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex gap={6} alignItems="center">
            <Flex flexDirection="column" gap={1} alignItems="center">
                <Spinner {...args} value={undefined} />
                <StoryLabel title="Indeterminate" />
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <Spinner {...args} value={0} />
                <StoryLabel title="0%" />
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <Spinner {...args} value={0.5} />
                <StoryLabel title="50%" />
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <Spinner {...args} value={1} />
                <StoryLabel title="100%" />
            </Flex>
        </Flex>
}`,...c.parameters?.docs?.source},description:{story:"Use the `value` prop to show determinate progress. Omit it for an indeterminate spinner.",...c.parameters?.docs?.description}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    intent: Intent.PRIMARY,
    size: SpinnerSize.STANDARD,
    value: 0.7
  }
}`,...p.parameters?.docs?.source},description:{story:"Interactive playground with all props toggleable via Storybook controls.",...p.parameters?.docs?.description}}};const j=["Default","IntentExample","SizeExample","StateExample","Playground"];export{i as Default,l as IntentExample,p as Playground,o as SizeExample,c as StateExample,j as __namedExportsOrder,D as default};
