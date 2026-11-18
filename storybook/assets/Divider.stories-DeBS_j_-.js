import{e as x,aY as u,ab as g,r as v,g as f,j as e}from"./iframe-6KWIKMhT.js";import{S as l}from"./common-CGlRPlLv.js";import{F as r}from"./flex-CfNrUc6L.js";import"./preload-helper-PPVm8Dsz.js";const n=({className:t,compact:i=!1,tagName:d="div",...p})=>{const m=x(u,{[g]:i},t);return v.createElement(d,{...p,className:m})};n.displayName=`${f}.Divider`;n.__docgenInfo={description:`Divider component.

@see https://blueprintjs.com/docs/#core/components/divider`,methods:[],props:{compact:{defaultValue:{value:"false",computed:!1},required:!1},tagName:{defaultValue:{value:'"div"',computed:!1},required:!1}}};const C={title:"Core/Divider",component:n,decorators:[t=>e.jsx("div",{style:{width:"300px"},children:e.jsx(t,{})})],tags:["autodocs"],args:{compact:!1},argTypes:{compact:{control:"boolean"},tagName:{control:"select",options:["div","span","br","hr","p"]}}},o={name:"Default",render:t=>e.jsxs(r,{flexDirection:"column",gap:10,children:[e.jsxs("div",{children:["Content above",e.jsx(n,{...t}),"Content below"]}),e.jsxs("div",{style:{textAlign:"center"},children:["Content above, text center-aligned",e.jsx(n,{...t}),"Content below, text center-aligned"]})]})},a={render:t=>e.jsxs(r,{flexDirection:"column",gap:10,children:[e.jsxs(r,{children:["Content to the left that wraps around a bit more than you'd expect",e.jsx(n,{...t}),"Content to the right that also wraps around a bit more than you'd expect"]}),e.jsxs(r,{style:{textAlign:"center"},children:["Content above, text center-aligned",e.jsx(n,{...t}),"Content below, text center-aligned"]})]})},s={name:"Compact",argTypes:{compact:{table:{disable:!0}}},render:t=>e.jsxs(r,{flexDirection:"column",gap:10,children:[e.jsxs(r,{flexDirection:"column",style:{textAlign:"center"},children:[e.jsx(l,{title:"Default"}),"Above",e.jsx(n,{...t,compact:!1}),"Below"]}),e.jsxs(r,{flexDirection:"column",style:{textAlign:"center"},children:[e.jsx(l,{title:"Compact"}),"Above",e.jsx(n,{...t,compact:!0}),"Below"]})]})},c={decorators:[t=>e.jsxs(r,{flexDirection:"column",children:["Content above",e.jsx(t,{}),"Content below"]})],args:{compact:!1}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: "Default",
  render: args => <Flex flexDirection="column" gap={10}>
            <div>
                Content above
                <Divider {...args} />
                Content below
            </div>

            <div style={{
      textAlign: "center"
    }}>
                Content above, text center-aligned
                <Divider {...args} />
                Content below, text center-aligned
            </div>
        </Flex>
}`,...o.parameters?.docs?.source},description:{story:"A basic horizontal divider rendered inside a column flex container.",...o.parameters?.docs?.description}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: args => <Flex flexDirection="column" gap={10}>
            <Flex>
                Content to the left that wraps around a bit more than you'd expect
                <Divider {...args} />
                Content to the right that also wraps around a bit more than you'd expect
            </Flex>

            <Flex style={{
      textAlign: "center"
    }}>
                Content above, text center-aligned
                <Divider {...args} />
                Content below, text center-aligned
            </Flex>
        </Flex>
}`,...a.parameters?.docs?.source},description:{story:"A basic vertical divider inside a flex container",...a.parameters?.docs?.description}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  name: "Compact",
  argTypes: {
    compact: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="column" gap={10}>
            <Flex flexDirection="column" style={{
      textAlign: "center"
    }}>
                <StoryLabel title="Default" />
                Above
                <Divider {...args} compact={false} />
                Below
            </Flex>
            <Flex flexDirection="column" style={{
      textAlign: "center"
    }}>
                <StoryLabel title="Compact" />
                Above
                <Divider {...args} compact={true} />
                Below
            </Flex>
        </Flex>
}`,...s.parameters?.docs?.source},description:{story:"Use the `compact` prop to remove the default margin around the Divider,\nmaking it flush with adjacent content.",...s.parameters?.docs?.description}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  decorators: [Story => <Flex flexDirection="column">
                Content above
                <Story />
                Content below
            </Flex>],
  args: {
    compact: false
  }
}`,...c.parameters?.docs?.source},description:{story:"Interactive playground with all Divider props available via Storybook controls.",...c.parameters?.docs?.description}}};const j=["Default","Vertical","CompactExample","Playground"];export{s as CompactExample,o as Default,c as Playground,a as Vertical,j as __namedExportsOrder,C as default};
