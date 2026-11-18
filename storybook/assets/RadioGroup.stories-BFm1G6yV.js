import{r as u,j as t}from"./iframe-6KWIKMhT.js";import{s as p}from"./common-CGlRPlLv.js";import{F as h}from"./flex-CfNrUc6L.js";import{R as r}from"./radioGroup-BILGjkZI.js";import"./preload-helper-PPVm8Dsz.js";import"./radioCard-C-b2twbm.js";import"./controlCard-C1sq-t4J.js";import"./card-C6ssIv7b.js";import"./controls-DUXJJE55.js";const{useArgs:b}=__STORYBOOK_MODULE_PREVIEW_API__,m=[{label:"Option A",value:"a"},{label:"Option B",value:"b"},{label:"Option C",value:"c"}],T={title:"Core/Form/Controls/RadioGroup",component:r,decorators:[p],tags:["autodocs"],args:{label:"Choose an option",options:m,disabled:!1,inline:!1},argTypes:{disabled:{control:"boolean"},inline:{control:"boolean"},onChange:{action:"changed"}}},o={render:function(e){const[n,a]=u.useState("a"),s=u.useCallback(c=>{a(c.currentTarget.value),e.onChange?.(c)},[e]);return t.jsx(r,{...e,selectedValue:n,onChange:s})}},l={name:"State",args:{selectedValue:"a"},argTypes:{disabled:{table:{disable:!0}},inline:{table:{disable:!0}}},render:function(e){const[,n]=b(),a=u.useCallback(s=>{n({selectedValue:s.currentTarget.value})},[n]);return t.jsxs(h,{gap:8,children:[t.jsx(r,{...e,label:"Enabled",onChange:a}),t.jsx(r,{...e,label:"Disabled",disabled:!0,onChange:a}),t.jsx(r,{...e,label:"Inline",inline:!0,onChange:a})]})}},d={render:function({onChange:e,...n}){const[a,s]=u.useState("a"),c=u.useCallback(g=>{s(g.currentTarget.value),e?.(g)},[e]);return t.jsx(r,{...n,selectedValue:a,onChange:c})}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: function Render(args) {
    const [selectedValue, setSelectedValue] = useState<string>("a");
    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
      setSelectedValue(e.currentTarget.value);
      args.onChange?.(e);
    }, [args]);
    return <RadioGroup {...args} selectedValue={selectedValue} onChange={handleChange} />;
  }
}`,...o.parameters?.docs?.source},description:{story:"A basic radio group with default styling.",...o.parameters?.docs?.description}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  name: "State",
  args: {
    selectedValue: "a"
  },
  argTypes: {
    disabled: {
      table: {
        disable: true
      }
    },
    inline: {
      table: {
        disable: true
      }
    }
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
      updateArgs({
        selectedValue: e.currentTarget.value
      });
    }, [updateArgs]);
    return <Flex gap={8}>
                <RadioGroup {...args} label="Enabled" onChange={handleChange} />
                <RadioGroup {...args} label="Disabled" disabled={true} onChange={handleChange} />
                <RadioGroup {...args} label="Inline" inline={true} onChange={handleChange} />
            </Flex>;
  }
}`,...l.parameters?.docs?.source},description:{story:"Radio groups support `disabled` and `inline` states.",...l.parameters?.docs?.description}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: function Render({
    onChange,
    ...args
  }) {
    const [selectedValue, setSelectedValue] = useState<string>("a");
    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
      setSelectedValue(e.currentTarget.value);
      onChange?.(e);
    }, [onChange]);
    return <RadioGroup {...args} selectedValue={selectedValue} onChange={handleChange} />;
  }
}`,...d.parameters?.docs?.source},description:{story:"Interactive playground with all props toggleable via Storybook controls.",...d.parameters?.docs?.description}}};const A=["Default","StateExample","Playground"];export{o as Default,d as Playground,l as StateExample,A as __namedExportsOrder,T as default};
