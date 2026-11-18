import{j as e,B as I,I as E,r as f}from"./iframe-6KWIKMhT.js";import{s as T}from"./common-CGlRPlLv.js";import{F as a}from"./flex-CfNrUc6L.js";import{T as x}from"./tag-DnuMuEBY.js";import{I as r}from"./inputGroup-Csz7Qhv0.js";import{S as j}from"./size-c484FBD7.js";import"./preload-helper-PPVm8Dsz.js";import"./tagRemoveButton-DdGBep5P.js";import"./x-small-DmUwHyi-.js";import"./functionUtils-BGFdVicR.js";const L={title:"Core/Form/Inputs/InputGroup",component:r,decorators:[T],tags:["autodocs"],args:{intent:"none",size:"medium",placeholder:"Enter text...",disabled:!1,readOnly:!1,fill:!1,round:!1},argTypes:{intent:{control:"select",options:Object.values(E)},size:{control:"select",options:Object.values(j)},placeholder:{control:"text"},disabled:{control:"boolean"},readOnly:{control:"boolean"},fill:{control:"boolean"},round:{control:"boolean"},leftIcon:{control:"text"},onChange:{action:"changed"},large:{table:{disable:!0}},small:{table:{disable:!0}}}},l={},s={name:"Intent",argTypes:{intent:{table:{disable:!0}}},render:t=>e.jsx(a,{flexDirection:"column",gap:3,style:{width:"100%"},children:Object.values(E).map(n=>e.jsx(r,{...t,intent:n,placeholder:`${n.charAt(0).toUpperCase()+n.slice(1)} intent...`},n))})},o={name:"Size",argTypes:{size:{table:{disable:!0}}},render:t=>e.jsx(a,{flexDirection:"column",gap:3,style:{width:"100%"},children:Object.values(j).map(n=>e.jsx(r,{...t,size:n,placeholder:`${n.charAt(0).toUpperCase()+n.slice(1)} size...`},n))})},i={name:"State",argTypes:{disabled:{table:{disable:!0}},readOnly:{table:{disable:!0}}},render:t=>e.jsxs(a,{flexDirection:"column",gap:3,style:{width:"100%"},children:[e.jsx(r,{...t,placeholder:"Enabled..."}),e.jsx(r,{...t,disabled:!0,placeholder:"Disabled..."}),e.jsx(r,{...t,readOnly:!0,defaultValue:"Read only"})]})},c={name:"Icons",argTypes:{leftIcon:{table:{disable:!0}}},render:t=>e.jsxs(a,{flexDirection:"column",gap:3,style:{width:"100%"},children:[e.jsx(r,{...t,leftIcon:"search",placeholder:"Search..."}),e.jsx(r,{...t,leftIcon:"user",placeholder:"Username..."}),e.jsx(r,{...t,leftIcon:"lock",rightElement:e.jsx(I,{icon:"eye-open",variant:"minimal",size:"small"}),placeholder:"Password...",type:"password"})]})},d={name:"Left & Right Elements",argTypes:{leftElement:{table:{disable:!0}},rightElement:{table:{disable:!0}}},render:t=>e.jsxs(a,{flexDirection:"column",gap:3,style:{width:"100%"},children:[e.jsx(r,{...t,leftElement:e.jsx(x,{interactive:!0,children:"Left"}),placeholder:"Search..."}),e.jsx(r,{...t,leftElement:e.jsx(x,{interactive:!0,children:"Left"}),rightElement:e.jsx(x,{interactive:!0,children:"Right"}),placeholder:"Search..."}),e.jsx(r,{...t,rightElement:e.jsx(x,{interactive:!0,children:"Right"}),placeholder:"With right element..."})]})},p={name:"Round",argTypes:{round:{table:{disable:!0}}},render:t=>e.jsxs(a,{flexDirection:"column",gap:3,style:{width:"100%"},children:[e.jsx(r,{...t,round:!1,placeholder:"Default shape..."}),e.jsx(r,{...t,round:!0,placeholder:"Round shape..."}),e.jsx(r,{...t,round:!0,leftIcon:"search",placeholder:"Round with icon..."})]})},u={name:"Fill",argTypes:{fill:{table:{disable:!0}}},decorators:[t=>e.jsx("div",{style:{width:"400px"},children:e.jsx(t,{})})],render:t=>e.jsxs(a,{flexDirection:"column",gap:2,alignItems:"start",children:[e.jsx(r,{...t,fill:!0,placeholder:"Full Width"}),e.jsx(r,{...t,fill:!1,placeholder:"Auto Width"})]})},m={name:"Focused",play:async({canvas:t,userEvent:n})=>{const g=t.getByPlaceholderText("Click to focus...");await n.click(g)},render:t=>e.jsx(r,{...t,placeholder:"Click to focus..."})},h={render:function(n){const[g,y]=f.useState(""),v=f.useCallback(b=>{y(b.target.value),n.onChange?.(b)},[n]),S=f.useCallback(()=>y(""),[]);return e.jsx(a,{flexDirection:"column",gap:3,style:{minWidth:"400px"},children:e.jsx(r,{disabled:n.disabled,fill:n.fill,intent:n.intent,leftIcon:n.leftIcon,onChange:v,placeholder:n.placeholder,readOnly:n.readOnly,rightElement:g.length>0?e.jsx(I,{icon:"cross",variant:"minimal",size:"small",onClick:S}):void 0,round:n.round,size:n.size,value:g})})},args:{leftIcon:"search",placeholder:"Type to search..."}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:"{}",...l.parameters?.docs?.source},description:{story:"A basic input group with default styling.",...l.parameters?.docs?.description}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  name: "Intent",
  argTypes: {
    intent: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="column" gap={3} style={{
    width: "100%"
  }}>
            {Object.values(Intent).map(intent => <InputGroup key={intent} {...args} intent={intent} placeholder={\`\${intent.charAt(0).toUpperCase() + intent.slice(1)} intent...\`} />)}
        </Flex>
}`,...s.parameters?.docs?.source},description:{story:"Use the `intent` prop to apply a semantic color that conveys the purpose or status of the input.",...s.parameters?.docs?.description}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: "Size",
  argTypes: {
    size: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="column" gap={3} style={{
    width: "100%"
  }}>
            {Object.values(Size).map(size => <InputGroup key={size} {...args} size={size} placeholder={\`\${size.charAt(0).toUpperCase() + size.slice(1)} size...\`} />)}
        </Flex>
}`,...o.parameters?.docs?.source},description:{story:"Use the `size` prop to adjust the input dimensions.",...o.parameters?.docs?.description}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  name: "State",
  argTypes: {
    disabled: {
      table: {
        disable: true
      }
    },
    readOnly: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="column" gap={3} style={{
    width: "100%"
  }}>
            <InputGroup {...args} placeholder="Enabled..." />
            <InputGroup {...args} disabled={true} placeholder="Disabled..." />
            <InputGroup {...args} readOnly={true} defaultValue="Read only" />
        </Flex>
}`,...i.parameters?.docs?.source},description:{story:"InputGroup supports `disabled` and `readOnly` states.",...i.parameters?.docs?.description}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: "Icons",
  argTypes: {
    leftIcon: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="column" gap={3} style={{
    width: "100%"
  }}>
            <InputGroup {...args} leftIcon="search" placeholder="Search..." />
            <InputGroup {...args} leftIcon="user" placeholder="Username..." />
            <InputGroup {...args} leftIcon="lock" rightElement={<Button icon="eye-open" variant="minimal" size="small" />} placeholder="Password..." type="password" />
        </Flex>
}`,...c.parameters?.docs?.source},description:{story:"Use `leftIcon`, `leftElement`, and `rightElement` to add content around the input.",...c.parameters?.docs?.description}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: "Left & Right Elements",
  argTypes: {
    leftElement: {
      table: {
        disable: true
      }
    },
    rightElement: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="column" gap={3} style={{
    width: "100%"
  }}>
            <InputGroup {...args} leftElement={<Tag interactive={true}>Left</Tag>} placeholder="Search..." />
            <InputGroup {...args} leftElement={<Tag interactive={true}>Left</Tag>} rightElement={<Tag interactive={true}>Right</Tag>} placeholder="Search..." />
            <InputGroup {...args} rightElement={<Tag interactive={true}>Right</Tag>} placeholder="With right element..." />
        </Flex>
}`,...d.parameters?.docs?.source},description:{story:"Use `leftElement`, and `rightElement` to add content around the input.",...d.parameters?.docs?.description}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  name: "Round",
  argTypes: {
    round: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="column" gap={3} style={{
    width: "100%"
  }}>
            <InputGroup {...args} round={false} placeholder="Default shape..." />
            <InputGroup {...args} round={true} placeholder="Round shape..." />
            <InputGroup {...args} round={true} leftIcon="search" placeholder="Round with icon..." />
        </Flex>
}`,...p.parameters?.docs?.source},description:{story:"Use the `round` prop to render the input with rounded caps.",...p.parameters?.docs?.description}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
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
            <InputGroup {...args} fill={true} placeholder="Full Width" />
            <InputGroup {...args} fill={false} placeholder="Auto Width" />
        </Flex>
}`,...u.parameters?.docs?.source},description:{story:"Use the `fill` prop to make the input expand to the full width of its container.",...u.parameters?.docs?.description}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  name: "Focused",
  play: async ({
    canvas,
    userEvent
  }) => {
    const input = canvas.getByPlaceholderText("Click to focus...");
    await userEvent.click(input);
  },
  render: args => <InputGroup {...args} placeholder="Click to focus..." />
}`,...m.parameters?.docs?.source},description:{story:"An input in the focused state, showing the focus ring. Use controls to change the intent.",...m.parameters?.docs?.description}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: function Render(args) {
    const [value, setValue] = useState("");
    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      args.onChange?.(e);
    }, [args]);
    const handleClear = useCallback(() => setValue(""), []);
    return <Flex flexDirection="column" gap={3} style={{
      minWidth: "400px"
    }}>
                <InputGroup disabled={args.disabled} fill={args.fill} intent={args.intent} leftIcon={args.leftIcon} onChange={handleChange} placeholder={args.placeholder} readOnly={args.readOnly} rightElement={value.length > 0 ? <Button icon="cross" variant="minimal" size="small" onClick={handleClear} /> : undefined} round={args.round} size={args.size} value={value} />
            </Flex>;
  },
  args: {
    leftIcon: "search",
    placeholder: "Type to search..."
  }
}`,...h.parameters?.docs?.source},description:{story:"Interactive playground with all props togglable via Storybook controls.",...h.parameters?.docs?.description}}};const A=["Default","IntentExample","SizeExample","StateExample","IconExample","LeftRightElementsExample","RoundExample","FillExample","FocusedExample","Playground"];export{l as Default,u as FillExample,m as FocusedExample,c as IconExample,s as IntentExample,d as LeftRightElementsExample,h as Playground,p as RoundExample,o as SizeExample,i as StateExample,A as __namedExportsOrder,L as default};
