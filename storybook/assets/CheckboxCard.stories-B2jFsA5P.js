import{r as m,a as i,j as r,e as k,aW as x,g as A}from"./iframe-6KWIKMhT.js";import{s as f}from"./common-CGlRPlLv.js";import{F as p}from"./flex-CfNrUc6L.js";import{C as y}from"./controlCard-C1sq-t4J.js";import{E as C}from"./card-C6ssIv7b.js";import"./preload-helper-PPVm8Dsz.js";import"./controls-DUXJJE55.js";const c=m.forwardRef((t,e)=>{const{alignIndicator:n=i.START,className:a,...b}=t;return r.jsx(y,{...b,alignIndicator:n,className:k(a,x),controlKind:"checkbox",ref:e})});c.displayName=`${A}.CheckboxCard`;c.__docgenInfo={description:`Checkbox Card component.

@see https://blueprintjs.com/docs/#core/components/control-card.checkbox-card`,methods:[]};const{useArgs:g,useCallback:u}=__STORYBOOK_MODULE_PREVIEW_API__,_={title:"Core/Control Card/CheckboxCard",component:c,decorators:[f],tags:["autodocs"],args:{label:"Checkbox option",checked:!1,disabled:!1,showAsSelectedWhenChecked:!0,compact:!1,elevation:C.ZERO,alignIndicator:i.START},argTypes:{label:{control:"text"},checked:{control:"boolean"},disabled:{control:"boolean"},showAsSelectedWhenChecked:{control:"boolean"},compact:{control:"boolean"},elevation:{control:"select",options:Object.values(C)},alignIndicator:{control:"select",options:Object.values(i)},onChange:{action:"changed"}}},o={args:{label:"Checkbox option"},render:function(e){const[,n]=g(),a=u(()=>n({checked:!e.checked}),[e.checked,n]);return r.jsx(c,{...e,onChange:a})}},s={name:"Compact",argTypes:{compact:{table:{disable:!0}}},render:function(e){const[,n]=g(),a=u(()=>n({checked:!e.checked}),[e.checked,n]);return r.jsxs(p,{flexDirection:"column",gap:2,style:{minWidth:300},children:[r.jsx(c,{...e,label:"Default",defaultChecked:!0,onChange:a}),r.jsx(c,{...e,compact:!0,label:"Compact",defaultChecked:!0,onChange:a})]})}},d={name:"State",argTypes:{disabled:{table:{disable:!0}},checked:{table:{disable:!0}}},render:function(e){const[,n]=g(),a=u(()=>n({checked:!e.checked}),[e.checked,n]);return r.jsxs(p,{flexDirection:"column",gap:2,style:{minWidth:300},children:[r.jsx(c,{...e,label:"Default",onChange:a}),r.jsx(c,{...e,label:"Checked",checked:!0,onChange:a}),r.jsx(c,{...e,label:"Disabled",disabled:!0}),r.jsx(c,{...e,label:"Disabled Checked",disabled:!0,checked:!0}),r.jsx(c,{...e,label:"No selected styling",checked:!0,showAsSelectedWhenChecked:!1,onChange:a})]})}},l={name:"Align Indicator",argTypes:{alignIndicator:{table:{disable:!0}}},render:function(e){const[,n]=g(),a=u(()=>n({checked:!e.checked}),[e.checked,n]);return r.jsxs(p,{flexDirection:"column",gap:2,style:{minWidth:300},children:[r.jsx(c,{...e,alignIndicator:i.START,label:"Align start",defaultChecked:!0,onChange:a}),r.jsx(c,{...e,alignIndicator:i.END,label:"Align end",defaultChecked:!0,onChange:a})]})}},h={args:{label:"Playground checkbox card"},render:function(e){const[,n]=g(),a=u(()=>n({checked:!e.checked}),[e.checked,n]);return r.jsx(c,{...e,onChange:a})}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Checkbox option"
  },
  render: function RenderDefault(args) {
    const [, updateArgs] = useArgs();
    const handleChange = useCallback(() => updateArgs({
      checked: !args.checked
    }), [args.checked, updateArgs]);
    return <CheckboxCard {...args} onChange={handleChange} />;
  }
}`,...o.parameters?.docs?.source},description:{story:"A basic checkbox card with default styling.",...o.parameters?.docs?.description}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
                <CheckboxCard {...args} label="Default" defaultChecked={true} onChange={handleChange} />
                <CheckboxCard {...args} compact={true} label="Compact" defaultChecked={true} onChange={handleChange} />
            </Flex>;
  }
}`,...s.parameters?.docs?.source},description:{story:"Use the `compact` prop to render a medium or large checkbox card.",...s.parameters?.docs?.description}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
                <CheckboxCard {...args} label="Default" onChange={handleChange} />
                <CheckboxCard {...args} label="Checked" checked={true} onChange={handleChange} />
                <CheckboxCard {...args} label="Disabled" disabled={true} />
                <CheckboxCard {...args} label="Disabled Checked" disabled={true} checked={true} />
                <CheckboxCard {...args} label="No selected styling" checked={true} showAsSelectedWhenChecked={false} onChange={handleChange} />
            </Flex>;
  }
}`,...d.parameters?.docs?.source},description:{story:"Checkbox cards support `disabled`, `checked`, and `selected` states.",...d.parameters?.docs?.description}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
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
                <CheckboxCard {...args} alignIndicator={Alignment.START} label="Align start" defaultChecked={true} onChange={handleChange} />
                <CheckboxCard {...args} alignIndicator={Alignment.END} label="Align end" defaultChecked={true} onChange={handleChange} />
            </Flex>;
  }
}`,...l.parameters?.docs?.source},description:{story:"Use the `alignIndicator` prop to render start or end-aligned.",...l.parameters?.docs?.description}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Playground checkbox card"
  },
  render: function RenderPlayground(args) {
    const [, updateArgs] = useArgs();
    const handleChange = useCallback(() => updateArgs({
      checked: !args.checked
    }), [args.checked, updateArgs]);
    return <CheckboxCard {...args} onChange={handleChange} />;
  }
}`,...h.parameters?.docs?.source},description:{story:"Interactive playground with all props toggleable via Storybook controls.",...h.parameters?.docs?.description}}};const W=["Default","CompactExample","StateExample","AlignIndicatorExample","Playground"];export{l as AlignIndicatorExample,s as CompactExample,o as Default,h as Playground,d as StateExample,W as __namedExportsOrder,_ as default};
