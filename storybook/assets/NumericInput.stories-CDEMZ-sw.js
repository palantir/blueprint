import{j as e,I as y,r as f}from"./iframe-6KWIKMhT.js";import{S as x}from"./common-CGlRPlLv.js";import{F as a}from"./flex-CfNrUc6L.js";import{N as r}from"./numericInput-33y2bkPW.js";import{P as g}from"./position-wreWcUSJ.js";import{S as I}from"./size-c484FBD7.js";import"./preload-helper-PPVm8Dsz.js";import"./buttonGroup-Dt--H6MV.js";import"./controlGroup-DgQe6Apf.js";import"./inputGroup-Csz7Qhv0.js";import"./chevron-up-Dg4RJcAC.js";const A={title:"Core/Form/Inputs/NumericInput",component:r,decorators:[t=>e.jsx(a,{flexDirection:"column",gap:3,style:{width:"100%",minWidth:"400px"},children:e.jsx(t,{})})],tags:["autodocs"],args:{intent:"none",size:"medium",placeholder:"Enter a number...",disabled:!1,readOnly:!1,fill:!1,min:0,max:100,stepSize:1},argTypes:{intent:{control:"select",options:Object.values(y)},size:{control:"select",options:Object.values(I)},placeholder:{control:"text"},disabled:{control:"boolean"},readOnly:{control:"boolean"},fill:{control:"boolean"},min:{control:"number"},max:{control:"number"},stepSize:{control:"number"},buttonPosition:{control:"select",options:[g.LEFT,g.RIGHT,"none"]},leftIcon:{control:"text"},onValueChange:{action:"valueChanged"},large:{table:{disable:!0}},small:{table:{disable:!0}}}},o={},s={name:"Intent",argTypes:{intent:{table:{disable:!0}}},render:t=>e.jsx(a,{flexDirection:"column",gap:3,style:{width:"100%"},children:Object.values(y).map(n=>e.jsx(r,{...t,intent:n,placeholder:`${n.charAt(0).toUpperCase()+n.slice(1)} intent...`},n))})},l={name:"Size",argTypes:{size:{table:{disable:!0}}},render:t=>e.jsx(a,{flexDirection:"column",gap:3,style:{width:"100%"},children:Object.values(I).map(n=>e.jsx(r,{...t,size:n,placeholder:`${n.charAt(0).toUpperCase()+n.slice(1)} size...`},n))})},i={name:"State",argTypes:{disabled:{table:{disable:!0}},readOnly:{table:{disable:!0}}},render:t=>e.jsxs(a,{flexDirection:"column",gap:3,style:{width:"100%"},children:[e.jsx(r,{...t,placeholder:"Enabled..."}),e.jsx(r,{...t,disabled:!0,placeholder:"Disabled..."}),e.jsx(r,{...t,readOnly:!0,value:42})]})},c={name:"Button Position",argTypes:{buttonPosition:{table:{disable:!0}}},render:t=>e.jsxs(a,{flexDirection:"column",gap:3,style:{width:"100%"},children:[e.jsx(x,{title:"Right (default)"}),e.jsx(r,{...t,buttonPosition:g.RIGHT,placeholder:"Buttons right..."}),e.jsx(x,{title:"Left"}),e.jsx(r,{...t,buttonPosition:g.LEFT,placeholder:"Buttons left..."}),e.jsx(x,{title:"None"}),e.jsx(r,{...t,buttonPosition:"none",placeholder:"No buttons..."})]})},p={name:"Icons",argTypes:{leftIcon:{table:{disable:!0}}},render:t=>e.jsxs(a,{flexDirection:"column",gap:3,style:{width:"100%"},children:[e.jsx(r,{...t,leftIcon:"dollar",placeholder:"Price..."}),e.jsx(r,{...t,leftIcon:"percentage",placeholder:"Percentage...",min:0,max:100})]})},d={name:"Fill",argTypes:{fill:{table:{disable:!0}}},decorators:[t=>e.jsx("div",{style:{width:"400px"},children:e.jsx(t,{})})],render:t=>e.jsxs(a,{flexDirection:"column",gap:2,alignItems:"start",children:[e.jsx(r,{...t,fill:!0,placeholder:"Full Width"}),e.jsx(r,{...t,fill:!1,placeholder:"Auto Width"})]})},u={name:"Focused",play:async({canvas:t,userEvent:n})=>{const h=t.getByPlaceholderText("Click to focus...");await n.click(h)},render:t=>e.jsx(a,{gap:3,children:e.jsx(r,{...t,placeholder:"Click to focus..."})})},m={render:function(n){const[h,S]=f.useState("0"),j=f.useCallback((F,b)=>{S(b),n.onValueChange?.(F,b,null)},[n]);return e.jsxs(a,{flexDirection:"column",gap:3,style:{minWidth:"400px"},children:[e.jsx(r,{buttonPosition:n.buttonPosition,disabled:n.disabled,fill:n.fill,intent:n.intent,leftIcon:n.leftIcon,max:n.max,min:n.min,onValueChange:j,placeholder:n.placeholder,readOnly:n.readOnly,size:n.size,stepSize:n.stepSize,value:h}),e.jsx(x,{title:`Current value: ${h}`})]})},args:{leftIcon:"dollar",placeholder:"Enter amount...",min:0,max:1e3,stepSize:1}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:"{}",...o.parameters?.docs?.source},description:{story:"A basic numeric input with default styling and increment/decrement buttons.",...o.parameters?.docs?.description}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
            {Object.values(Intent).map(intent => <NumericInput key={intent} {...args} intent={intent} placeholder={\`\${intent.charAt(0).toUpperCase() + intent.slice(1)} intent...\`} />)}
        </Flex>
}`,...s.parameters?.docs?.source},description:{story:"Use the `intent` prop to apply a semantic color that conveys the purpose or status of the input.",...s.parameters?.docs?.description}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
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
            {Object.values(Size).map(size => <NumericInput key={size} {...args} size={size} placeholder={\`\${size.charAt(0).toUpperCase() + size.slice(1)} size...\`} />)}
        </Flex>
}`,...l.parameters?.docs?.source},description:{story:"Use the `size` prop to adjust the input dimensions.",...l.parameters?.docs?.description}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
            <NumericInput {...args} placeholder="Enabled..." />
            <NumericInput {...args} disabled={true} placeholder="Disabled..." />
            <NumericInput {...args} readOnly={true} value={42} />
        </Flex>
}`,...i.parameters?.docs?.source},description:{story:"NumericInput supports `disabled` and `readOnly` states.",...i.parameters?.docs?.description}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: "Button Position",
  argTypes: {
    buttonPosition: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="column" gap={3} style={{
    width: "100%"
  }}>
            <StoryLabel title="Right (default)" />
            <NumericInput {...args} buttonPosition={Position.RIGHT} placeholder="Buttons right..." />
            <StoryLabel title="Left" />
            <NumericInput {...args} buttonPosition={Position.LEFT} placeholder="Buttons left..." />
            <StoryLabel title="None" />
            <NumericInput {...args} buttonPosition="none" placeholder="No buttons..." />
        </Flex>
}`,...c.parameters?.docs?.source},description:{story:"Use `buttonPosition` to control the placement of increment/decrement buttons.",...c.parameters?.docs?.description}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
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
            <NumericInput {...args} leftIcon="dollar" placeholder="Price..." />
            <NumericInput {...args} leftIcon="percentage" placeholder="Percentage..." min={0} max={100} />
        </Flex>
}`,...p.parameters?.docs?.source},description:{story:"Use `leftIcon` to add an icon to the left side of the input.",...p.parameters?.docs?.description}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
            <NumericInput {...args} fill={true} placeholder="Full Width" />
            <NumericInput {...args} fill={false} placeholder="Auto Width" />
        </Flex>
}`,...d.parameters?.docs?.source},description:{story:"Use the `fill` prop to make the input expand to the full width of its container.",...d.parameters?.docs?.description}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  name: "Focused",
  play: async ({
    canvas,
    userEvent
  }) => {
    const input = canvas.getByPlaceholderText("Click to focus...");
    await userEvent.click(input);
  },
  render: args => <Flex gap={3}>
            <NumericInput {...args} placeholder="Click to focus..." />
        </Flex>
}`,...u.parameters?.docs?.source},description:{story:"A numeric input in the focused state, showing the focus ring. Use controls to change the intent.",...u.parameters?.docs?.description}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: function Render(args) {
    const [value, setValue] = useState<string>("0");
    const handleValueChange = useCallback((_valueAsNumber: number, valueAsString: string) => {
      setValue(valueAsString);
      args.onValueChange?.(_valueAsNumber, valueAsString, null);
    }, [args]);
    return <Flex flexDirection="column" gap={3} style={{
      minWidth: "400px"
    }}>
                <NumericInput buttonPosition={args.buttonPosition} disabled={args.disabled} fill={args.fill} intent={args.intent} leftIcon={args.leftIcon} max={args.max} min={args.min} onValueChange={handleValueChange} placeholder={args.placeholder} readOnly={args.readOnly} size={args.size} stepSize={args.stepSize} value={value} />
                <StoryLabel title={\`Current value: \${value}\`} />
            </Flex>;
  },
  args: {
    leftIcon: "dollar",
    placeholder: "Enter amount...",
    min: 0,
    max: 1000,
    stepSize: 1
  }
}`,...m.parameters?.docs?.source},description:{story:"Interactive playground with all props togglable via Storybook controls.",...m.parameters?.docs?.description}}};const V=["Default","IntentExample","SizeExample","StateExample","ButtonPositionExample","IconExample","FillExample","FocusedExample","Playground"];export{c as ButtonPositionExample,o as Default,d as FillExample,u as FocusedExample,p as IconExample,s as IntentExample,m as Playground,l as SizeExample,i as StateExample,V as __namedExportsOrder,A as default};
