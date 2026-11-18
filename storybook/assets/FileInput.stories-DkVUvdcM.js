import{j as e,r as m}from"./iframe-6KWIKMhT.js";import{S as y}from"./common-CGlRPlLv.js";import{F as l}from"./flex-CfNrUc6L.js";import{F as s}from"./fileInput-CDkalMiM.js";import{S as b}from"./size-c484FBD7.js";import"./preload-helper-PPVm8Dsz.js";const z={title:"Core/Form/Inputs/FileInput",component:s,decorators:[t=>e.jsx(l,{flexDirection:"column",gap:3,style:{width:"100%",minWidth:"400px"},children:e.jsx(t,{})})],tags:["autodocs"],args:{text:"Choose file...",buttonText:"Browse",disabled:!1,fill:!1,hasSelection:!1,size:"medium"},argTypes:{text:{control:"text"},buttonText:{control:"text"},size:{control:"select",options:Object.values(b)},disabled:{control:"boolean"},fill:{control:"boolean"},hasSelection:{control:"boolean"},onInputChange:{action:"inputChanged"},large:{table:{disable:!0}},small:{table:{disable:!0}}}},r={},o={name:"Size",argTypes:{size:{table:{disable:!0}}},render:t=>e.jsx(l,{flexDirection:"column",gap:3,style:{width:"100%"},children:Object.values(b).map(n=>e.jsx(s,{...t,size:n,text:`${n.charAt(0).toUpperCase()+n.slice(1)} size`},n))})},i={name:"State",argTypes:{disabled:{table:{disable:!0}},hasSelection:{table:{disable:!0}}},render:t=>e.jsxs(l,{flexDirection:"column",gap:3,style:{width:"100%"},children:[e.jsx(s,{...t,text:"Choose file..."}),e.jsx(s,{...t,hasSelection:!0,text:"document.pdf"}),e.jsx(s,{...t,disabled:!0,text:"Disabled..."})]})},c={name:"Fill",argTypes:{fill:{table:{disable:!0}}},decorators:[t=>e.jsx("div",{style:{width:"400px"},children:e.jsx(t,{})})],render:t=>e.jsxs(l,{flexDirection:"column",gap:2,alignItems:"start",children:[e.jsx(s,{...t,fill:!0,text:"Full Width"}),e.jsx(s,{...t,fill:!1,text:"Auto Width"})]})},u={name:"Button Text",argTypes:{buttonText:{table:{disable:!0}}},render:t=>e.jsxs(l,{flexDirection:"column",gap:3,style:{width:"100%"},children:[e.jsx(s,{...t,buttonText:"Browse",text:"Default button text..."}),e.jsx(s,{...t,buttonText:"Upload",text:"Custom button text..."}),e.jsx(s,{...t,buttonText:"Select",text:"Another button text..."})]})},p={name:"Focused",play:async({canvas:t})=>{const a=t.getByText("Choose file...").closest("label")?.querySelector("input");a&&a.focus()},render:t=>e.jsx(l,{gap:3,children:e.jsx(s,{...t,text:"Choose file..."})})},d={render:function(n){const[a,f]=m.useState(null),h=m.useCallback(x=>{const g=x.target.files?.[0];f(g?.name??null),n.onInputChange?.(x)},[n]);return e.jsxs(l,{flexDirection:"column",gap:3,style:{minWidth:"400px"},children:[e.jsx(s,{buttonText:n.buttonText,disabled:n.disabled,fill:n.fill,hasSelection:a!=null,onInputChange:h,size:n.size,text:a??"Choose file..."}),a!=null&&e.jsx(y,{title:`Selected: ${a}`})]})},args:{buttonText:"Browse"}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:"{}",...r.parameters?.docs?.source},description:{story:"A basic file input with default styling.",...r.parameters?.docs?.description}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
            {Object.values(Size).map(size => <FileInput key={size} {...args} size={size} text={\`\${size.charAt(0).toUpperCase() + size.slice(1)} size\`} />)}
        </Flex>
}`,...o.parameters?.docs?.source},description:{story:"Use the `size` prop to adjust the file input dimensions.",...o.parameters?.docs?.description}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  name: "State",
  argTypes: {
    disabled: {
      table: {
        disable: true
      }
    },
    hasSelection: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="column" gap={3} style={{
    width: "100%"
  }}>
            <FileInput {...args} text="Choose file..." />
            <FileInput {...args} hasSelection={true} text="document.pdf" />
            <FileInput {...args} disabled={true} text="Disabled..." />
        </Flex>
}`,...i.parameters?.docs?.source},description:{story:"FileInput supports `disabled` state and `hasSelection` visual state.",...i.parameters?.docs?.description}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
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
            <FileInput {...args} fill={true} text="Full Width" />
            <FileInput {...args} fill={false} text="Auto Width" />
        </Flex>
}`,...c.parameters?.docs?.source},description:{story:"Use the `fill` prop to make the file input expand to the full width of its container.",...c.parameters?.docs?.description}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  name: "Button Text",
  argTypes: {
    buttonText: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="column" gap={3} style={{
    width: "100%"
  }}>
            <FileInput {...args} buttonText="Browse" text="Default button text..." />
            <FileInput {...args} buttonText="Upload" text="Custom button text..." />
            <FileInput {...args} buttonText="Select" text="Another button text..." />
        </Flex>
}`,...u.parameters?.docs?.source},description:{story:"Customize the button text with the `buttonText` prop.",...u.parameters?.docs?.description}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  name: "Focused",
  play: async ({
    canvas
  }) => {
    const label = canvas.getByText("Choose file...");
    const input = label.closest("label")?.querySelector("input");
    if (input) {
      input.focus();
    }
  },
  render: args => <Flex gap={3}>
            <FileInput {...args} text="Choose file..." />
        </Flex>
}`,...p.parameters?.docs?.source},description:{story:"A file input in the focused state, showing the focus ring.",...p.parameters?.docs?.description}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: function Render(args) {
    const [fileName, setFileName] = useState<string | null>(null);
    const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      setFileName(file?.name ?? null);
      args.onInputChange?.(e);
    }, [args]);
    return <Flex flexDirection="column" gap={3} style={{
      minWidth: "400px"
    }}>
                <FileInput buttonText={args.buttonText} disabled={args.disabled} fill={args.fill} hasSelection={fileName != null} onInputChange={handleInputChange} size={args.size} text={fileName ?? "Choose file..."} />
                {fileName != null && <StoryLabel title={\`Selected: \${fileName}\`} />}
            </Flex>;
  },
  args: {
    buttonText: "Browse"
  }
}`,...d.parameters?.docs?.source},description:{story:"Interactive playground with file selection handling.",...d.parameters?.docs?.description}}};const w=["Default","SizeExample","StateExample","FillExample","ButtonTextExample","FocusedExample","Playground"];export{u as ButtonTextExample,r as Default,c as FillExample,p as FocusedExample,d as Playground,o as SizeExample,i as StateExample,w as __namedExportsOrder,z as default};
