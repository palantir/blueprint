import{j as a,a as h}from"./iframe-6KWIKMhT.js";import{s as C}from"./common-CGlRPlLv.js";import{F as p}from"./flex-CfNrUc6L.js";import{R as n}from"./radioCard-C-b2twbm.js";import{E as m}from"./card-C6ssIv7b.js";import"./preload-helper-PPVm8Dsz.js";import"./controlCard-C1sq-t4J.js";import"./controls-DUXJJE55.js";const{useArgs:u,useCallback:g}=__STORYBOOK_MODULE_PREVIEW_API__,S={title:"Core/Control Card/RadioCard",component:n,decorators:[C],tags:["autodocs"],args:{label:"Radio option",checked:!1,disabled:!1,showAsSelectedWhenChecked:!0,compact:!1,elevation:m.ZERO},argTypes:{label:{control:"text"},checked:{control:"boolean"},disabled:{control:"boolean"},showAsSelectedWhenChecked:{control:"boolean"},compact:{control:"boolean"},elevation:{control:"select",options:Object.values(m)},alignIndicator:{control:"select",options:Object.values(h)},onChange:{action:"changed"}}},d={args:{label:"Radio option"},render:function(e){const[,r]=u(),t=g(()=>r({checked:!e.checked}),[e.checked,r]);return a.jsx(n,{...e,onChange:t})}},o={name:"Compact",argTypes:{compact:{table:{disable:!0}}},render:function(e){const[,r]=u(),t=g(()=>r({checked:!e.checked}),[e.checked,r]);return a.jsxs(p,{flexDirection:"column",gap:2,style:{minWidth:300},children:[a.jsx(n,{...e,label:"Default",defaultChecked:!0,onChange:t}),a.jsx(n,{...e,compact:!0,label:"Compact",defaultChecked:!0,onChange:t})]})}},c={name:"State",argTypes:{disabled:{table:{disable:!0}},checked:{table:{disable:!0}}},render:function(e){return a.jsxs(p,{flexDirection:"column",gap:2,style:{minWidth:300},children:[a.jsx(n,{...e,label:"Default"}),a.jsx(n,{...e,label:"Checked",checked:!0}),a.jsx(n,{...e,label:"Disabled",disabled:!0}),a.jsx(n,{...e,label:"Disabled Checked",disabled:!0,checked:!0}),a.jsx(n,{...e,label:"No selected styling",checked:!0,showAsSelectedWhenChecked:!1})]})}},s={name:"Align Indicator",argTypes:{alignIndicator:{table:{disable:!0}}},render:function(e){const[,r]=u(),t=g(()=>r({checked:!e.checked}),[e.checked,r]);return a.jsxs(p,{flexDirection:"column",gap:2,style:{minWidth:300},children:[a.jsx(n,{...e,alignIndicator:h.START,label:"Align start",defaultChecked:!0,onChange:t}),a.jsx(n,{...e,alignIndicator:h.END,label:"Align end",defaultChecked:!0,onChange:t})]})}},l={args:{label:"Playground radio card"},render:function(e){const[,r]=u(),t=g(()=>r({checked:!e.checked}),[e.checked,r]);return a.jsx(n,{...e,onChange:t})}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Radio option"
  },
  render: function RenderDefault(args) {
    const [, updateArgs] = useArgs();
    const handleChange = useCallback(() => updateArgs({
      checked: !args.checked
    }), [args.checked, updateArgs]);
    return <RadioCard {...args} onChange={handleChange} />;
  }
}`,...d.parameters?.docs?.source},description:{story:"A basic radio card with default styling.",...d.parameters?.docs?.description}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: "Compact",
  argTypes: {
    compact: {
      table: {
        disable: true
      }
    }
  },
  render: function RenderCompact(args) {
    const [, updateArgs] = useArgs();
    const handleChange = useCallback(() => updateArgs({
      checked: !args.checked
    }), [args.checked, updateArgs]);
    return <Flex flexDirection="column" gap={2} style={{
      minWidth: 300
    }}>
                <RadioCard {...args} label="Default" defaultChecked={true} onChange={handleChange} />
                <RadioCard {...args} compact={true} label="Compact" defaultChecked={true} onChange={handleChange} />
            </Flex>;
  }
}`,...o.parameters?.docs?.source},description:{story:"Use the `compact` prop to render a more condensed radio card.",...o.parameters?.docs?.description}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: "State",
  argTypes: {
    disabled: {
      table: {
        disable: true
      }
    },
    checked: {
      table: {
        disable: true
      }
    }
  },
  render: function RenderState(args) {
    return <Flex flexDirection="column" gap={2} style={{
      minWidth: 300
    }}>
                <RadioCard {...args} label="Default" />
                <RadioCard {...args} label="Checked" checked={true} />
                <RadioCard {...args} label="Disabled" disabled={true} />
                <RadioCard {...args} label="Disabled Checked" disabled={true} checked={true} />
                <RadioCard {...args} label="No selected styling" checked={true} showAsSelectedWhenChecked={false} />
            </Flex>;
  }
}`,...c.parameters?.docs?.source},description:{story:"Radio cards support `disabled`, `checked`, and `selected` states.",...c.parameters?.docs?.description}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  name: "Align Indicator",
  argTypes: {
    alignIndicator: {
      table: {
        disable: true
      }
    }
  },
  render: function RenderAlignIndicator(args) {
    const [, updateArgs] = useArgs();
    const handleChange = useCallback(() => updateArgs({
      checked: !args.checked
    }), [args.checked, updateArgs]);
    return <Flex flexDirection="column" gap={2} style={{
      minWidth: 300
    }}>
                <RadioCard {...args} alignIndicator={Alignment.START} label="Align start" defaultChecked={true} onChange={handleChange} />
                <RadioCard {...args} alignIndicator={Alignment.END} label="Align end" defaultChecked={true} onChange={handleChange} />
            </Flex>;
  }
}`,...s.parameters?.docs?.source},description:{story:"Use the `alignIndicator` prop to render start or end-aligned.",...s.parameters?.docs?.description}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Playground radio card"
  },
  render: function RenderPlayground(args) {
    const [, updateArgs] = useArgs();
    const handleChange = useCallback(() => updateArgs({
      checked: !args.checked
    }), [args.checked, updateArgs]);
    return <RadioCard {...args} onChange={handleChange} />;
  }
}`,...l.parameters?.docs?.source},description:{story:"Interactive playground with all props toggleable via Storybook controls.",...l.parameters?.docs?.description}}};const j=["Default","CompactExample","StateExample","AlignIndicatorExample","Playground"];export{s as AlignIndicatorExample,o as CompactExample,d as Default,l as Playground,c as StateExample,j as __namedExportsOrder,S as default};
