import{j as e,a as h,B as t,I as F}from"./iframe-6KWIKMhT.js";import{S as o}from"./common-CGlRPlLv.js";import{F as a}from"./flex-CfNrUc6L.js";import{P as S}from"./popoverNext-BYxtaCWB.js";import{B as s}from"./buttonGroup-Dt--H6MV.js";import{B as b}from"./buttonVariant-Dalv6_qh.js";import{S as B}from"./size-c484FBD7.js";import"./preload-helper-PPVm8Dsz.js";const T=["large","minimal","outlined","children","className"],y=[h.START,h.CENTER,h.END],N={title:"Core/Button/ButtonGroup",component:s,tags:["autodocs"],args:{variant:"solid",size:"medium",fill:!1,vertical:!1,alignText:"center"},argTypes:{variant:{control:"select",options:Object.values(b)},size:{control:"select",options:Object.values(B)},alignText:{control:"select",options:Object.values(y)},fill:{control:"boolean"},vertical:{control:"boolean"},...T.reduce((n,r)=>(n[r]={table:{disable:!0}},n),{})}},l={render:n=>e.jsxs(s,{...n,children:[e.jsx(t,{text:"First"}),e.jsx(t,{text:"Second"}),e.jsx(t,{text:"Third"})]})},c={name:"Variant",argTypes:{variant:{table:{disable:!0}}},render:n=>e.jsx(a,{gap:10,alignItems:"center",children:Object.values(b).map(r=>e.jsxs(a,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(o,{title:r}),e.jsxs(s,{...n,variant:r,children:[e.jsx(t,{text:"First"}),e.jsx(t,{text:"Second"}),e.jsx(t,{text:"Third"})]})]},r))})},x={name:"Size",argTypes:{size:{table:{disable:!0}}},render:n=>e.jsx(a,{gap:10,alignItems:"center",children:Object.values(B).map(r=>e.jsxs(a,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(o,{title:r}),e.jsxs(s,{...n,size:r,children:[e.jsx(t,{text:"First"}),e.jsx(t,{text:"Second"}),e.jsx(t,{text:"Third"})]})]},r))})},p={name:"Fill",argTypes:{fill:{table:{disable:!0}}},decorators:[n=>e.jsx("div",{style:{width:"400px"},children:e.jsx(n,{})})],render:n=>e.jsxs(a,{flexDirection:"column",gap:5,children:[e.jsxs(a,{flexDirection:"column",gap:1,children:[e.jsx(o,{title:"fill={true}"}),e.jsxs(s,{...n,fill:!0,children:[e.jsx(t,{text:"First"}),e.jsx(t,{text:"Second"}),e.jsx(t,{text:"Third"})]})]}),e.jsxs(a,{flexDirection:"column",gap:1,children:[e.jsx(o,{title:"fill={false}"}),e.jsxs(s,{...n,fill:!1,children:[e.jsx(t,{text:"First"}),e.jsx(t,{text:"Second"}),e.jsx(t,{text:"Third"})]})]})]})},u={name:"Vertical",argTypes:{vertical:{table:{disable:!0}}},render:n=>e.jsxs(a,{gap:6,alignItems:"start",children:[e.jsxs(a,{flexDirection:"column",gap:1,children:[e.jsx(o,{title:"horizontal"}),e.jsxs(s,{...n,vertical:!1,children:[e.jsx(t,{text:"First"}),e.jsx(t,{text:"Second"}),e.jsx(t,{text:"Third"})]})]}),e.jsxs(a,{flexDirection:"column",gap:1,children:[e.jsx(o,{title:"vertical"}),e.jsxs(s,{...n,vertical:!0,children:[e.jsx(t,{text:"First"}),e.jsx(t,{text:"Second"}),e.jsx(t,{text:"Third"})]})]})]})},d={name:"Alignment",argTypes:{alignText:{table:{disable:!0}},fill:{table:{disable:!0}}},decorators:[n=>e.jsx("div",{style:{width:"400px"},children:e.jsx(n,{})})],render:n=>e.jsx(a,{flexDirection:"column",gap:6,children:Object.values(y).map(r=>e.jsxs(a,{flexDirection:"column",gap:1,children:[e.jsx(o,{title:r}),e.jsxs(s,{...n,alignText:r,fill:!0,children:[e.jsx(t,{text:"First"}),e.jsx(t,{text:"Second"}),e.jsx(t,{text:"Third"})]})]},r))})},m={argTypes:{variant:{table:{disable:!0}}},render:n=>e.jsx(a,{flexDirection:"row",gap:10,children:Object.values(b).map(r=>e.jsxs(a,{flexDirection:"column",gap:2,children:[e.jsx(o,{title:r}),Object.values(F).map(i=>e.jsxs(s,{...n,variant:r,children:[e.jsx(t,{intent:i,text:i}),e.jsx(t,{intent:i,text:i}),e.jsx(t,{intent:i,text:i})]},i))]},r))})},g={argTypes:{variant:{table:{disable:!0}}},render:n=>{const r=[{icon:"floppy-disk",label:"Save"},{icon:"export",label:"Export as PDF"},{icon:"archive",label:"Archive"}];return e.jsx(a,{gap:10,alignItems:"center",children:Object.values(b).map(i=>e.jsxs(a,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(o,{title:i}),e.jsx(s,{...n,variant:i,children:r.map(({icon:v,label:f})=>e.jsx(S,{content:e.jsx("span",{style:{padding:10},children:f}),placement:"bottom",children:e.jsx(t,{icon:v,"aria-label":f})},v))})]},i))})}},j={render:n=>e.jsxs(s,{alignText:n.alignText,fill:n.fill,size:n.size,variant:n.variant,vertical:n.vertical,children:[e.jsx(t,{text:"First"}),e.jsx(t,{text:"Second"}),e.jsx(t,{text:"Third"})]})};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => <ButtonGroup {...args}>
            <Button text="First" />
            <Button text="Second" />
            <Button text="Third" />
        </ButtonGroup>
}`,...l.parameters?.docs?.source},description:{story:"A basic button group with default styling.",...l.parameters?.docs?.description}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: "Variant",
  argTypes: {
    variant: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex gap={10} alignItems="center">
            {Object.values(ButtonVariant).map(variant => <Flex key={variant} flexDirection="column" gap={1} alignItems="center">
                    <StoryLabel title={variant} />
                    <ButtonGroup {...args} variant={variant}>
                        <Button text="First" />
                        <Button text="Second" />
                        <Button text="Third" />
                    </ButtonGroup>
                </Flex>)}
        </Flex>
}`,...c.parameters?.docs?.source},description:{story:"Use the `variant` prop to change the visual style of all child buttons.",...c.parameters?.docs?.description}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: "Size",
  argTypes: {
    size: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex gap={10} alignItems="center">
            {Object.values(Size).map(size => <Flex key={size} flexDirection="column" gap={1} alignItems="center">
                    <StoryLabel title={size} />
                    <ButtonGroup {...args} size={size}>
                        <Button text="First" />
                        <Button text="Second" />
                        <Button text="Third" />
                    </ButtonGroup>
                </Flex>)}
        </Flex>
}`,...x.parameters?.docs?.source},description:{story:"Use the `size` prop to adjust the size of all child buttons.",...x.parameters?.docs?.description}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
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
  render: args => <Flex flexDirection="column" gap={5}>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title="fill={true}" />
                <ButtonGroup {...args} fill={true}>
                    <Button text="First" />
                    <Button text="Second" />
                    <Button text="Third" />
                </ButtonGroup>
            </Flex>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title="fill={false}" />
                <ButtonGroup {...args} fill={false}>
                    <Button text="First" />
                    <Button text="Second" />
                    <Button text="Third" />
                </ButtonGroup>
            </Flex>
        </Flex>
}`,...p.parameters?.docs?.source},description:{story:"Use the `fill` prop to make the button group expand to the full width of its container.",...p.parameters?.docs?.description}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  name: "Vertical",
  argTypes: {
    vertical: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex gap={6} alignItems="start">
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title="horizontal" />
                <ButtonGroup {...args} vertical={false}>
                    <Button text="First" />
                    <Button text="Second" />
                    <Button text="Third" />
                </ButtonGroup>
            </Flex>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title="vertical" />
                <ButtonGroup {...args} vertical={true}>
                    <Button text="First" />
                    <Button text="Second" />
                    <Button text="Third" />
                </ButtonGroup>
            </Flex>
        </Flex>
}`,...u.parameters?.docs?.source},description:{story:"Use the `vertical` prop to arrange buttons in a vertical stack.",...u.parameters?.docs?.description}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: "Alignment",
  argTypes: {
    alignText: {
      table: {
        disable: true
      }
    },
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
  render: args => <Flex flexDirection="column" gap={6}>
            {Object.values(ALIGNMENT).map(alignment => <Flex key={alignment} flexDirection="column" gap={1}>
                    <StoryLabel title={alignment} />
                    <ButtonGroup {...args} alignText={alignment} fill={true}>
                        <Button text="First" />
                        <Button text="Second" />
                        <Button text="Third" />
                    </ButtonGroup>
                </Flex>)}
        </Flex>
}`,...d.parameters?.docs?.source},description:{story:"Use the `alignText` prop to control text alignment within the buttons. Best used with `fill`.",...d.parameters?.docs?.description}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  argTypes: {
    variant: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="row" gap={10}>
            {Object.values(ButtonVariant).map(variant => <Flex key={variant} flexDirection="column" gap={2}>
                    <StoryLabel title={variant} />
                    {Object.values(Intent).map(intent => <ButtonGroup key={intent} {...args} variant={variant}>
                            <Button intent={intent} text={intent} />
                            <Button intent={intent} text={intent} />
                            <Button intent={intent} text={intent} />
                        </ButtonGroup>)}
                </Flex>)}
        </Flex>
}`,...m.parameters?.docs?.source},description:{story:"All intents across all variants.",...m.parameters?.docs?.description}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  argTypes: {
    variant: {
      table: {
        disable: true
      }
    }
  },
  render: args => {
    const BUTTONS = [{
      icon: "floppy-disk",
      label: "Save"
    }, {
      icon: "export",
      label: "Export as PDF"
    }, {
      icon: "archive",
      label: "Archive"
    }] as const;
    return <Flex gap={10} alignItems="center">
                {Object.values(ButtonVariant).map(variant => <Flex key={variant} flexDirection="column" gap={1} alignItems="center">
                        <StoryLabel title={variant} />
                        <ButtonGroup {...args} variant={variant}>
                            {BUTTONS.map(({
            icon,
            label
          }) => <PopoverNext key={icon} content={<span style={{
            padding: 10
          }}>{label}</span>} placement="bottom">
                                    <Button icon={icon} aria-label={label} />
                                </PopoverNext>)}
                        </ButtonGroup>
                    </Flex>)}
            </Flex>;
  }
}`,...g.parameters?.docs?.source},description:{story:"Wrap buttons with Popover to provide additional context on hover.",...g.parameters?.docs?.description}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  render: args => <ButtonGroup alignText={args.alignText} fill={args.fill} size={args.size} variant={args.variant} vertical={args.vertical}>
            <Button text="First" />
            <Button text="Second" />
            <Button text="Third" />
        </ButtonGroup>
}`,...j.parameters?.docs?.source},description:{story:"Interactive playground with all props togglable via Storybook controls.",...j.parameters?.docs?.description}}};const k=["Default","VariantExample","SizeExample","FillExample","VerticalExample","AlignmentExample","AllIntentsAllVariants","WithPopover","Playground"];export{d as AlignmentExample,m as AllIntentsAllVariants,l as Default,p as FillExample,j as Playground,x as SizeExample,c as VariantExample,u as VerticalExample,g as WithPopover,k as __namedExportsOrder,N as default};
