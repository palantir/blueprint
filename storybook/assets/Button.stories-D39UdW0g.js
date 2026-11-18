import{B as a,j as t,a as f,I as i}from"./iframe-6KWIKMhT.js";import{s as h,S as y}from"./common-CGlRPlLv.js";import{F as s}from"./flex-CfNrUc6L.js";import{B as v}from"./buttonVariant-Dalv6_qh.js";import{S as j}from"./size-c484FBD7.js";import"./preload-helper-PPVm8Dsz.js";const I=["large","minimal","outlined","rightIcon","small","type","children"],O={title:"Core/Button/Button",component:a,decorators:[h],tags:["autodocs"],args:{text:"Button",intent:"none",variant:"solid",size:"medium",alignText:"center",icon:void 0,endIcon:void 0,fill:!1,active:!1,loading:!1,disabled:!1,ellipsizeText:!1},argTypes:{text:{control:"text"},intent:{control:"select",options:Object.values(i)},size:{control:"select",options:Object.values(j)},variant:{control:"select",options:Object.values(v)},alignText:{control:"select",options:Object.values(f)},icon:{control:"text"},endIcon:{control:"text"},active:{control:"boolean"},disabled:{control:"boolean"},ellipsizeText:{control:"boolean"},fill:{control:"boolean"},loading:{control:"boolean"},onClick:{action:"clicked"},...I.reduce((n,e)=>(n[e]={table:{disable:!0}},n),{})}},o={args:{text:"Button"}},l={name:"Intent",argTypes:{intent:{table:{disable:!0}}},render:n=>t.jsx(s,{gap:2,children:Object.values(i).filter(e=>e!=="none").map(e=>t.jsx(a,{...n,intent:e,text:e.charAt(0).toUpperCase()+e.slice(1)},e))})},c={name:"Variant",argTypes:{variant:{table:{disable:!0}}},render:n=>t.jsx(s,{gap:2,children:Object.values(v).map(e=>t.jsx(a,{...n,variant:e,text:e.charAt(0).toUpperCase()+e.slice(1)},e))})},d={name:"Size",argTypes:{size:{table:{disable:!0}}},render:n=>t.jsx(s,{gap:2,alignItems:"center",children:Object.values(j).map(e=>t.jsx(a,{...n,size:e,text:e.charAt(0).toUpperCase()+e.slice(1)},e))})},p={name:"State",argTypes:{active:{table:{disable:!0}},disabled:{table:{disable:!0}},loading:{table:{disable:!0}}},render:n=>t.jsxs(s,{gap:2,children:[t.jsx(a,{...n,text:"Default"}),t.jsx(a,{...n,active:!0,text:"Active"}),t.jsx(a,{...n,disabled:!0,text:"Disabled"}),t.jsx(a,{...n,loading:!0,text:"Loading"})]})},u={name:"Icons",argTypes:{icon:{table:{disable:!0}},endIcon:{table:{disable:!0}}},render:n=>t.jsxs(s,{gap:2,children:[t.jsx(a,{...n,icon:"refresh",text:"Reset"}),t.jsx(a,{...n,icon:"user",endIcon:"caret-down",text:"Profile"}),t.jsx(a,{...n,endIcon:"arrow-right",text:"Next"}),t.jsx(a,{...n,icon:"edit",text:void 0,"aria-label":"edit"})]})},x={name:"Alignment",argTypes:{alignText:{table:{disable:!0}}},render:n=>t.jsx(s,{flexDirection:"column",gap:2,style:{minWidth:300},children:Object.values(f).map(e=>t.jsx(a,{...n,alignText:e,fill:!0,endIcon:"caret-down",text:e.charAt(0).toUpperCase()+e.slice(1)},e))})},m={name:"Fill",argTypes:{fill:{table:{disable:!0}}},decorators:[n=>t.jsx("div",{style:{width:"400px"},children:t.jsx(n,{})})],render:n=>t.jsxs(s,{flexDirection:"column",gap:2,children:[t.jsx(a,{...n,fill:!0,text:"Full Width"}),t.jsx(a,{...n,fill:!1,text:"Auto Width"})]})},g={argTypes:{intent:{table:{disable:!0}},variant:{table:{disable:!0}},active:{table:{disable:!0}},disabled:{table:{disable:!0}},loading:{table:{disable:!0}}},render:n=>t.jsx(s,{flexDirection:"column",gap:4,children:Object.values(v).map(e=>t.jsxs(s,{flexDirection:"column",gap:2,children:[t.jsx(y,{title:e}),t.jsx(s,{gap:2,children:Object.values(i).map(r=>t.jsx(a,{...n,variant:e,intent:r,text:r},r))}),t.jsx(s,{gap:2,children:Object.values(i).map(r=>t.jsx(a,{...n,variant:e,intent:r,active:!0,text:r},r))}),t.jsx(s,{gap:2,children:Object.values(i).map(r=>t.jsx(a,{...n,variant:e,intent:r,disabled:!0,text:r},r))}),t.jsx(s,{gap:2,children:Object.values(i).map(r=>t.jsx(a,{...n,variant:e,intent:r,loading:!0,text:r},r))})]},e))})},b={render:function(e){return t.jsx(a,{active:e.active,alignText:e.alignText,disabled:e.disabled,ellipsizeText:e.ellipsizeText,endIcon:e.endIcon,fill:e.fill,icon:e.icon,intent:e.intent,loading:e.loading,size:e.size,text:e.text,variant:e.variant})},args:{text:"Click",icon:"refresh",endIcon:void 0,intent:"none",variant:"solid",size:"medium"}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    text: "Button"
  }
}`,...o.parameters?.docs?.source},description:{story:"A basic button with default styling.",...o.parameters?.docs?.description}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  name: "Intent",
  argTypes: {
    intent: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex gap={2}>
            {Object.values(Intent).filter(i => i !== "none").map(intent => <Button key={intent} {...args} intent={intent} text={intent.charAt(0).toUpperCase() + intent.slice(1)} />)}
        </Flex>
}`,...l.parameters?.docs?.source},description:{story:"Use the `intent` prop to apply a semantic color that conveys the purpose or status of the button.",...l.parameters?.docs?.description}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: "Variant",
  argTypes: {
    variant: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex gap={2}>
            {Object.values(ButtonVariant).map(variant => <Button key={variant} {...args} variant={variant} text={variant.charAt(0).toUpperCase() + variant.slice(1)} />)}
        </Flex>
}`,...c.parameters?.docs?.source},description:{story:'Use the `variant` prop to change the visual style. "solid" (default) renders a filled button,\n"minimal" renders without a background, and "outlined" adds a border without fill.',...c.parameters?.docs?.description}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: "Size",
  argTypes: {
    size: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex gap={2} alignItems="center">
            {Object.values(Size).map(size => <Button key={size} {...args} size={size} text={size.charAt(0).toUpperCase() + size.slice(1)} />)}
        </Flex>
}`,...d.parameters?.docs?.source},description:{story:"Use the `size` prop to adjust the button dimensions.",...d.parameters?.docs?.description}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  name: "State",
  argTypes: {
    active: {
      table: {
        disable: true
      }
    },
    disabled: {
      table: {
        disable: true
      }
    },
    loading: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex gap={2}>
            <Button {...args} text="Default" />
            <Button {...args} active={true} text="Active" />
            <Button {...args} disabled={true} text="Disabled" />
            <Button {...args} loading={true} text="Loading" />
        </Flex>
}`,...p.parameters?.docs?.source},description:{story:"Buttons support `active`, `disabled`, and `loading` states.",...p.parameters?.docs?.description}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  name: "Icons",
  argTypes: {
    icon: {
      table: {
        disable: true
      }
    },
    endIcon: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex gap={2}>
            <Button {...args} icon="refresh" text="Reset" />
            <Button {...args} icon="user" endIcon="caret-down" text="Profile" />
            <Button {...args} endIcon="arrow-right" text="Next" />
            <Button {...args} icon="edit" text={undefined} aria-label="edit" />
        </Flex>
}`,...u.parameters?.docs?.source},description:{story:"Use `icon` and `endIcon` props to render icons alongside text, or use `icon` alone for icon-only buttons.",...u.parameters?.docs?.description}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: "Alignment",
  argTypes: {
    alignText: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="column" gap={2} style={{
    minWidth: 300
  }}>
            {Object.values(Alignment).map(alignment => <Button key={alignment} {...args} alignText={alignment} fill={true} endIcon="caret-down" text={alignment.charAt(0).toUpperCase() + alignment.slice(1)} />)}
        </Flex>
}`,...x.parameters?.docs?.source},description:{story:"Use the `alignText` prop to control text alignment within the button.",...x.parameters?.docs?.description}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
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
  render: args => <Flex flexDirection="column" gap={2}>
            <Button {...args} fill={true} text="Full Width" />
            <Button {...args} fill={false} text="Auto Width" />
        </Flex>
}`,...m.parameters?.docs?.source},description:{story:"Use the `fill` prop to make the button expand to the full width of its container.",...m.parameters?.docs?.description}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  argTypes: {
    intent: {
      table: {
        disable: true
      }
    },
    variant: {
      table: {
        disable: true
      }
    },
    active: {
      table: {
        disable: true
      }
    },
    disabled: {
      table: {
        disable: true
      }
    },
    loading: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="column" gap={4}>
            {Object.values(ButtonVariant).map(variant => <Flex key={variant} flexDirection="column" gap={2}>
                    <StoryLabel title={variant} />
                    <Flex gap={2}>
                        {Object.values(Intent).map(intent => <Button key={intent} {...args} variant={variant} intent={intent} text={intent} />)}
                    </Flex>
                    <Flex gap={2}>
                        {Object.values(Intent).map(intent => <Button key={intent} {...args} variant={variant} intent={intent} active={true} text={intent} />)}
                    </Flex>
                    <Flex gap={2}>
                        {Object.values(Intent).map(intent => <Button key={intent} {...args} variant={variant} intent={intent} disabled={true} text={intent} />)}
                    </Flex>
                    <Flex gap={2}>
                        {Object.values(Intent).map(intent => <Button key={intent} {...args} variant={variant} intent={intent} loading={true} text={intent} />)}
                    </Flex>
                </Flex>)}
        </Flex>
}`,...g.parameters?.docs?.source},description:{story:"All intents across all variants and states.",...g.parameters?.docs?.description}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: function Render(args) {
    return <Button active={args.active} alignText={args.alignText} disabled={args.disabled} ellipsizeText={args.ellipsizeText} endIcon={args.endIcon} fill={args.fill} icon={args.icon} intent={args.intent} loading={args.loading} size={args.size} text={args.text} variant={args.variant} />;
  },
  args: {
    text: "Click",
    icon: "refresh",
    endIcon: undefined,
    intent: "none",
    variant: "solid",
    size: "medium"
  }
}`,...b.parameters?.docs?.source},description:{story:"Interactive playground with all props togglable via Storybook controls.",...b.parameters?.docs?.description}}};const k=["Default","IntentExample","VariantExample","SizeExample","StateExample","IconExample","AlignmentExample","FillExample","AllIntentsAllVariants","Playground"];export{x as AlignmentExample,g as AllIntentsAllVariants,o as Default,m as FillExample,u as IconExample,l as IntentExample,b as Playground,d as SizeExample,p as StateExample,c as VariantExample,k as __namedExportsOrder,O as default};
