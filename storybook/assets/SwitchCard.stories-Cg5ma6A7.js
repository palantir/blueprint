import{r as C,e as b,aX as k,j as a,g as A,a as u}from"./iframe-6KWIKMhT.js";import{s as f}from"./common-CGlRPlLv.js";import{F as p}from"./flex-CfNrUc6L.js";import{C as x}from"./controlCard-C1sq-t4J.js";import{E as m}from"./card-C6ssIv7b.js";import"./preload-helper-PPVm8Dsz.js";import"./controls-DUXJJE55.js";const t=C.forwardRef((c,e)=>{const n=b(c.className,k);return a.jsx(x,{...c,className:n,controlKind:"switch",ref:e})});t.displayName=`${A}.SwitchCard`;t.__docgenInfo={description:`Switch Card component.

@see https://blueprintjs.com/docs/#core/components/control-card.switch-card`,methods:[]};const{useArgs:h,useCallback:g}=__STORYBOOK_MODULE_PREVIEW_API__,E={title:"Core/Control Card/SwitchCard",component:t,decorators:[f],tags:["autodocs"],args:{label:"Switch option",checked:!1,disabled:!1,showAsSelectedWhenChecked:!0,compact:!1,elevation:m.ZERO},argTypes:{label:{control:"text"},checked:{control:"boolean"},disabled:{control:"boolean"},showAsSelectedWhenChecked:{control:"boolean"},compact:{control:"boolean"},elevation:{control:"select",options:Object.values(m)},alignIndicator:{control:"select",options:Object.values(u)},onChange:{action:"changed"}}},s={args:{label:"Switch option"},render:function(e){const[,n]=h(),r=g(()=>n({checked:!e.checked}),[e.checked,n]);return a.jsx(t,{...e,onChange:r})}},d={name:"Compact",argTypes:{compact:{table:{disable:!0}}},render:function(e){const[,n]=h(),r=g(()=>n({checked:!e.checked}),[e.checked,n]);return a.jsxs(p,{flexDirection:"column",gap:2,style:{minWidth:300},children:[a.jsx(t,{...e,label:"Default",defaultChecked:!0,onChange:r}),a.jsx(t,{...e,compact:!0,label:"Compact",defaultChecked:!0,onChange:r})]})}},o={name:"State",argTypes:{disabled:{table:{disable:!0}},checked:{table:{disable:!0}}},render:function(e){const[,n]=h(),r=g(()=>n({checked:!e.checked}),[e.checked,n]);return a.jsxs(p,{flexDirection:"column",gap:2,style:{minWidth:300},children:[a.jsx(t,{...e,label:"Default",onChange:r}),a.jsx(t,{...e,label:"Checked",checked:!0,onChange:r}),a.jsx(t,{...e,label:"Disabled",disabled:!0}),a.jsx(t,{...e,label:"Disabled Checked",disabled:!0,checked:!0}),a.jsx(t,{...e,label:"No selected styling",checked:!0,showAsSelectedWhenChecked:!1,onChange:r})]})}},l={name:"Align Indicator",argTypes:{alignIndicator:{table:{disable:!0}}},render:function(e){const[,n]=h(),r=g(()=>n({checked:!e.checked}),[e.checked,n]);return a.jsxs(p,{flexDirection:"column",gap:2,style:{minWidth:300},children:[a.jsx(t,{...e,alignIndicator:u.START,label:"Align start",defaultChecked:!0,onChange:r}),a.jsx(t,{...e,alignIndicator:u.END,label:"Align end",defaultChecked:!0,onChange:r})]})}},i={args:{label:"Playground switch card"},render:function(e){const[,n]=h(),r=g(()=>n({checked:!e.checked}),[e.checked,n]);return a.jsx(t,{...e,onChange:r})}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Switch option"
  },
  render: function RenderDefault(args) {
    const [, updateArgs] = useArgs();
    const handleChange = useCallback(() => updateArgs({
      checked: !args.checked
    }), [args.checked, updateArgs]);
    return <SwitchCard {...args} onChange={handleChange} />;
  }
}`,...s.parameters?.docs?.source},description:{story:"A basic switch card with default styling.",...s.parameters?.docs?.description}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
                <SwitchCard {...args} label="Default" defaultChecked={true} onChange={handleChange} />
                <SwitchCard {...args} compact={true} label="Compact" defaultChecked={true} onChange={handleChange} />
            </Flex>;
  }
}`,...d.parameters?.docs?.source},description:{story:"Use the `compact` prop to render a more condensed switch card.",...d.parameters?.docs?.description}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
    const [, updateArgs] = useArgs();
    const handleChange = useCallback(() => updateArgs({
      checked: !args.checked
    }), [args.checked, updateArgs]);
    return <Flex flexDirection="column" gap={2} style={{
      minWidth: 300
    }}>
                <SwitchCard {...args} label="Default" onChange={handleChange} />
                <SwitchCard {...args} label="Checked" checked={true} onChange={handleChange} />
                <SwitchCard {...args} label="Disabled" disabled={true} />
                <SwitchCard {...args} label="Disabled Checked" disabled={true} checked={true} />
                <SwitchCard {...args} label="No selected styling" checked={true} showAsSelectedWhenChecked={false} onChange={handleChange} />
            </Flex>;
  }
}`,...o.parameters?.docs?.source},description:{story:"Switch cards support `disabled`, `checked`, and `selected` states.",...o.parameters?.docs?.description}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
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
                <SwitchCard {...args} alignIndicator={Alignment.START} label="Align start" defaultChecked={true} onChange={handleChange} />
                <SwitchCard {...args} alignIndicator={Alignment.END} label="Align end" defaultChecked={true} onChange={handleChange} />
            </Flex>;
  }
}`,...l.parameters?.docs?.source},description:{story:"Use the `alignIndicator` prop to render start or end-aligned.",...l.parameters?.docs?.description}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Playground switch card"
  },
  render: function RenderPlayground(args) {
    const [, updateArgs] = useArgs();
    const handleChange = useCallback(() => updateArgs({
      checked: !args.checked
    }), [args.checked, updateArgs]);
    return <SwitchCard {...args} onChange={handleChange} />;
  }
}`,...i.parameters?.docs?.source},description:{story:"Interactive playground with all props toggleable via Storybook controls.",...i.parameters?.docs?.description}}};const T=["Default","CompactExample","StateExample","AlignIndicatorExample","Playground"];export{l as AlignIndicatorExample,d as CompactExample,s as Default,i as Playground,o as StateExample,T as __namedExportsOrder,E as default};
