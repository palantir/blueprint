import{r as x,e as I,c6 as f,c7 as k,I as p,c8 as L,c9 as b,ca as v,aa as w,j as n,g as j}from"./iframe-6KWIKMhT.js";import{S as m}from"./common-CGlRPlLv.js";import{F as s}from"./flex-CfNrUc6L.js";import"./preload-helper-PPVm8Dsz.js";const t=x.forwardRef(({children:r,className:e,underline:a="always",color:u=p.PRIMARY,...h},g)=>{const y=I(f,{[v]:a==="always",[b]:a==="hover",[L]:a==="none",[k]:u==="inherit"},u!=="inherit"?w(u):void 0,e);return n.jsx("a",{...h,className:y,ref:g,children:r})});t.displayName=`${j}.Link`;t.__docgenInfo={description:`Link component.

@see https://blueprintjs.com/docs/#core/components/link`,methods:[],props:{className:{required:!1,tsType:{name:"string"},description:"A space-delimited list of class names to pass along to a child element."},children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"Child nodes to render inside the link."},underline:{required:!1,tsType:{name:"union",raw:'"always" | "hover" | "none"',elements:[{name:"literal",value:'"always"'},{name:"literal",value:'"hover"'},{name:"literal",value:'"none"'}]},description:`Underline behavior for the link.

- "always": Always shows underline (default)
- "hover": Shows underline only on hover
- "none": Never shows underline

@default "always"`,defaultValue:{value:'"always"',computed:!1}},color:{required:!1,tsType:{name:"union",raw:'Intent | "inherit"',elements:[{name:"Intent"},{name:"literal",value:'"inherit"'}]},description:`Color of the link text.

- Intent colors: "primary", "success", "warning", "danger"
- "inherit": Inherits color from surrounding text

@default Intent.PRIMARY`,defaultValue:{value:'"primary"',computed:!1}}}};const U={title:"Core/Link",component:t,decorators:[r=>n.jsx(s,{justifyContent:"center",alignItems:"center",children:n.jsx(r,{})})],tags:["autodocs"],args:{children:"Blueprint Link",href:"#",underline:"always",color:p.PRIMARY},argTypes:{underline:{control:"select",options:["always","hover","none"]},color:{control:"select",options:[...Object.values(p),"inherit"]},href:{control:"text"},onClick:{action:"clicked"}}},l={args:{children:"Blueprint Link"}},o={name:"Intent",argTypes:{color:{table:{disable:!0}}},render:r=>n.jsx(s,{gap:4,children:Object.values(p).map(e=>n.jsx(t,{...r,color:e,children:e.charAt(0).toUpperCase()+e.slice(1)},e))})},i={name:"Underline",argTypes:{underline:{table:{disable:!0}}},render:r=>n.jsx(s,{gap:4,children:["always","hover","none"].map(e=>n.jsxs(s,{flexDirection:"column",gap:1,alignItems:"center",children:[n.jsx(m,{title:e}),n.jsx(t,{...r,underline:e,children:"Link"})]},e))})},c={name:"All Intents / All Underlines",argTypes:{color:{table:{disable:!0}},underline:{table:{disable:!0}}},render:r=>n.jsx(s,{flexDirection:"column",gap:4,children:["always","hover","none"].map(e=>n.jsxs(s,{flexDirection:"column",gap:2,children:[n.jsx(m,{title:e}),n.jsxs(s,{gap:4,children:[Object.values(p).map(a=>n.jsx(t,{...r,color:a,underline:e,children:a.charAt(0).toUpperCase()+a.slice(1)},a)),n.jsx(t,{...r,color:"inherit",underline:e,children:"Inherit"})]})]},e))})},d={args:{children:"Click this link",href:"#"}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Blueprint Link"
  }
}`,...l.parameters?.docs?.source},description:{story:"A basic link with default styling.",...l.parameters?.docs?.description}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: "Intent",
  argTypes: {
    color: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex gap={4}>
            {Object.values(Intent).map(intent => <Link key={intent} {...args} color={intent}>
                    {intent.charAt(0).toUpperCase() + intent.slice(1)}
                </Link>)}
        </Flex>
}`,...o.parameters?.docs?.source},description:{story:"Use the `color` prop to apply intent-based colors to the link.",...o.parameters?.docs?.description}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  name: "Underline",
  argTypes: {
    underline: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex gap={4}>
            {(["always", "hover", "none"] as const).map(underline => <Flex key={underline} flexDirection="column" gap={1} alignItems="center">
                    <StoryLabel title={underline} />
                    <Link {...args} underline={underline}>
                        Link
                    </Link>
                </Flex>)}
        </Flex>
}`,...i.parameters?.docs?.source},description:{story:"Use the `underline` prop to control when the link underline appears.",...i.parameters?.docs?.description}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: "All Intents / All Underlines",
  argTypes: {
    color: {
      table: {
        disable: true
      }
    },
    underline: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="column" gap={4}>
            {(["always", "hover", "none"] as const).map(underline => <Flex key={underline} flexDirection="column" gap={2}>
                    <StoryLabel title={underline} />
                    <Flex gap={4}>
                        {Object.values(Intent).map(intent => <Link key={intent} {...args} color={intent} underline={underline}>
                                {intent.charAt(0).toUpperCase() + intent.slice(1)}
                            </Link>)}
                        <Link {...args} color="inherit" underline={underline}>
                            Inherit
                        </Link>
                    </Flex>
                </Flex>)}
        </Flex>
}`,...c.parameters?.docs?.source},description:{story:"All intent colors across all underline styles.",...c.parameters?.docs?.description}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Click this link",
    href: "#"
  }
}`,...d.parameters?.docs?.source},description:{story:"Interactive playground with all props togglable via Storybook controls.",...d.parameters?.docs?.description}}};const F=["Default","IntentExample","UnderlineExample","AllIntentsAllUnderlines","Playground"];export{c as AllIntentsAllUnderlines,l as Default,o as IntentExample,d as Playground,i as UnderlineExample,F as __namedExportsOrder,U as default};
