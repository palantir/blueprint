import{E as d,at as x,I as g,ai as n,j as e,z as s}from"./iframe-6KWIKMhT.js";import{s as I,S as u}from"./common-CGlRPlLv.js";import{B as y}from"./buggy-DMHtH6SL.js";import{F as r}from"./flex-CfNrUc6L.js";import"./preload-helper-PPVm8Dsz.js";const z={title:"Core/Icon",component:n,decorators:[I],args:{icon:x.BUGGY,intent:g.NONE,size:d.STANDARD,color:void 0,title:void 0,tagName:"span",autoLoad:!0},argTypes:{icon:{control:"text"},intent:{control:"select",options:Object.values(g)},size:{control:"number"},color:{control:"color"},title:{control:"text"},tagName:{control:"text"},autoLoad:{control:"boolean"},className:{table:{disable:!0}},svgProps:{table:{disable:!0}}}},a={},c={name:"Intent",argTypes:{intent:{table:{disable:!0}}},render:o=>e.jsx(r,{gap:6,children:Object.values(g).map(t=>e.jsx(n,{...o,intent:t},t))})},i={name:"Size",argTypes:{size:{table:{disable:!0}}},render:o=>e.jsxs(r,{gap:5,children:[e.jsx(n,{...o,size:d.STANDARD}),e.jsx(n,{...o,size:d.LARGE}),e.jsx(n,{...o,size:48})]})},l={name:"Color",render:o=>e.jsx(r,{gap:4,alignItems:"center",children:[s.BLUE3,s.FOREST3,s.GOLD3,s.RED3,s.INDIGO4].map(t=>e.jsxs(r,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(n,{...o,color:t}),e.jsx(u,{title:t})]},t))})},p={name:"Element icon",render:o=>e.jsxs(r,{gap:4,alignItems:"center",children:[e.jsxs(r,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(n,{...o,icon:x.BUGGY}),e.jsx(u,{title:'icon="buggy"'})]}),e.jsxs(r,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(n,{...o,icon:e.jsx(y,{})}),e.jsx(u,{title:"icon={<Buggy />}"})]})]})},m={args:{icon:x.BUGGY,size:d.STANDARD,intent:"none",color:void 0}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:"{}",...a.parameters?.docs?.source},description:{story:"A basic icon with default styling.",...a.parameters?.docs?.description}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: "Intent",
  argTypes: {
    intent: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex gap={6}>
            {Object.values(Intent).map(intent => <Icon key={intent} {...args} intent={intent} />)}
        </Flex>
}`,...c.parameters?.docs?.source},description:{story:"Use the `intent` prop to apply a semantic color that conveys the purpose or status of the icon.",...c.parameters?.docs?.description}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  name: "Size",
  argTypes: {
    size: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex gap={5}>
            <Icon {...args} size={IconSize.STANDARD} />
            <Icon {...args} size={IconSize.LARGE} />
            <Icon {...args} size={48} />
        </Flex>
}`,...i.parameters?.docs?.source},description:{story:"Use the `size` prop to adjust the icon dimensions. Icon supports `STANDARD` (16px) and `LARGE` (20px).",...i.parameters?.docs?.description}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  name: "Color",
  render: args => <Flex gap={4} alignItems="center">
            {[Colors.BLUE3, Colors.FOREST3, Colors.GOLD3, Colors.RED3, Colors.INDIGO4].map(color => <Flex key={color} flexDirection="column" gap={1} alignItems="center">
                    <Icon {...args} color={color} />
                    <StoryLabel title={color} />
                </Flex>)}
        </Flex>
}`,...l.parameters?.docs?.source},description:{story:"Use the `color` prop to override the icon fill with a custom CSS color.\nThis takes precedence over `intent`.",...l.parameters?.docs?.description}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  name: "Element icon",
  render: args => <Flex gap={4} alignItems="center">
            <Flex flexDirection="column" gap={1} alignItems="center">
                <Icon {...args} icon={IconNames.BUGGY} />
                <StoryLabel title='icon="buggy"' />
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <Icon {...args} icon={<Buggy />} />
                <StoryLabel title="icon={<Buggy />}" />
            </Flex>
        </Flex>
}`,...p.parameters?.docs?.source},description:{story:"The `icon` prop accepts either a string icon name or a React element (typically an icon\ncomponent from `@blueprintjs/icons`). When an element is provided, `<Icon>` clones it and\nmerges the parent-provided `className` and intent class onto its root. For recognized\n`@blueprintjs/icons` elements, it also forwards the `color` and `size` props (the element's\nown props take precedence).",...p.parameters?.docs?.description}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    icon: IconNames.BUGGY,
    size: IconSize.STANDARD,
    intent: "none",
    color: undefined
  }
}`,...m.parameters?.docs?.source},description:{story:"Interactive playground with all props togglable via Storybook controls.",...m.parameters?.docs?.description}}};const E=["Default","IntentExample","SizeExample","ColorExample","ElementIcon","Playground"];export{l as ColorExample,a as Default,p as ElementIcon,c as IntentExample,m as Playground,i as SizeExample,E as __namedExportsOrder,z as default};
