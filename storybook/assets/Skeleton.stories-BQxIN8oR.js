import{j as e,ax as c,ay as d,az as n,B as m}from"./iframe-6KWIKMhT.js";import{S as l}from"./common-CGlRPlLv.js";import{F as a}from"./flex-CfNrUc6L.js";import{C as p}from"./card-C6ssIv7b.js";import"./preload-helper-PPVm8Dsz.js";const i=({skeleton:s})=>e.jsxs(p,{children:[e.jsx(c,{className:`${d} ${s?n:""}`,children:e.jsx("span",{tabIndex:s?-1:void 0,children:"Card heading"})}),e.jsx("p",{className:s?n:"",children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eget tortor felis. Fusce dapibus metus in dapibus mollis. Quisque eget ex diam."}),e.jsx(m,{className:s?n:"",icon:"add",text:"Submit","aria-busy":!0,tabIndex:s?-1:void 0})]}),j={title:"Core/Styles/Skeleton",component:i,decorators:[s=>e.jsx(a,{style:{width:"600px"},children:e.jsx(s,{})})],tags:["autodocs"],args:{skeleton:!0},argTypes:{skeleton:{control:"boolean"}}},t={args:{skeleton:!0}},o={name:"Comparison",render:()=>e.jsxs(a,{gap:6,children:[e.jsxs(a,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(l,{title:"Loading"}),e.jsx(i,{skeleton:!0})]}),e.jsxs(a,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(l,{title:"Loaded"}),e.jsx(i,{skeleton:!1})]})]})},r={args:{skeleton:!1}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    skeleton: true
  }
}`,...t.parameters?.docs?.source},description:{story:"A card with the `.bp5-skeleton` class applied to its content elements, showing the default loading state.",...t.parameters?.docs?.description}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: "Comparison",
  render: () => <Flex gap={6}>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="Loading" />
                <SkeletonDemo skeleton={true} />
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="Loaded" />
                <SkeletonDemo skeleton={false} />
            </Flex>
        </Flex>
}`,...o.parameters?.docs?.source},description:{story:"Compare the skeleton loading state with the loaded content side by side.",...o.parameters?.docs?.description}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    skeleton: false
  }
}`,...r.parameters?.docs?.source},description:{story:"Interactive playground with all props controlled via Storybook controls.",...r.parameters?.docs?.description}}};const y=["Default","ComparisonExample","Playground"];export{o as ComparisonExample,t as Default,r as Playground,y as __namedExportsOrder,j as default};
