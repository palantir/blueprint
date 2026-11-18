import{I as b,r as p,j as e}from"./iframe-6KWIKMhT.js";import{s as x,S as u}from"./common-CGlRPlLv.js";import{F as s}from"./flex-CfNrUc6L.js";import{S as r}from"./slider-DH1BaE4A.js";import"./preload-helper-PPVm8Dsz.js";import"./functionUtils-BGFdVicR.js";const{useArgs:g}=__STORYBOOK_MODULE_PREVIEW_API__,A={title:"Core/Slider",component:r,decorators:[x],tags:["autodocs"],args:{min:0,max:10,stepSize:1,labelStepSize:1,value:5,disabled:!1,vertical:!1,showTrackFill:!0,intent:b.PRIMARY},argTypes:{intent:{control:"select",options:Object.values(b)},min:{control:{type:"range",min:-100,max:0,step:1}},max:{control:{type:"range",min:1,max:100,step:1}},stepSize:{control:{type:"range",min:1,max:10,step:1}},labelStepSize:{control:{type:"range",min:1,max:10,step:1}},value:{control:{type:"range",min:0,max:10,step:1}},disabled:{control:"boolean"},vertical:{control:"boolean"},showTrackFill:{control:"boolean"},labelRenderer:{control:"boolean"},onChange:{action:"changed"},onRelease:{action:"released"}}},o={args:{value:5},render:function(l){const[h,t]=g(),n=p.useCallback(a=>t({value:a}),[t]);return e.jsx(r,{...l,onChange:n,onRelease:n,handleHtmlProps:{"aria-label":"Slider"}})}},i={name:"Intent",argTypes:{intent:{table:{disable:!0}}},render:function(l){const[h,t]=g(),n=p.useCallback(a=>t({value:a}),[t]);return e.jsx(s,{flexDirection:"column",gap:6,style:{width:"100%"},children:Object.values(b).map(a=>e.jsxs(s,{flexDirection:"column",gap:1,children:[e.jsx(u,{title:a}),e.jsx(r,{...l,intent:a,onChange:n,onRelease:n,handleHtmlProps:{"aria-label":`${a} intent slider`}})]},a))})}},d={name:"State",argTypes:{disabled:{table:{disable:!0}},vertical:{table:{disable:!0}}},render:function(l){const[h,t]=g(),n=p.useCallback(a=>t({value:a}),[t]);return e.jsxs(s,{flexDirection:"column",gap:6,style:{width:"100%"},children:[e.jsxs(s,{flexDirection:"column",gap:1,children:[e.jsx(u,{title:"Default"}),e.jsx(r,{...l,disabled:!1,onChange:n,onRelease:n,handleHtmlProps:{"aria-label":"Default state slider"}})]}),e.jsxs(s,{flexDirection:"column",gap:1,children:[e.jsx(u,{title:"Disabled"}),e.jsx(r,{...l,disabled:!0,onChange:n,onRelease:n,handleHtmlProps:{"aria-label":"Disabled slider"}})]}),e.jsxs(s,{flexDirection:"column",gap:1,children:[e.jsx(u,{title:"Vertical"}),e.jsx(r,{...l,vertical:!0,onChange:n,onRelease:n,handleHtmlProps:{"aria-label":"Vertical slider"}})]})]})}},c={render:function(l){const[h,t]=g(),n=p.useCallback(a=>t({value:a}),[t]);return e.jsx(r,{...l,onChange:n,onRelease:n,handleHtmlProps:{"aria-label":"Playground slider"}})},args:{value:5}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    value: 5
  },
  render: function Render(args) {
    const [_, updateArgs] = useArgs();
    const handleChange = useCallback((newValue: number) => updateArgs({
      value: newValue
    }), [updateArgs]);
    return <Slider {...args} onChange={handleChange} onRelease={handleChange} handleHtmlProps={{
      "aria-label": "Slider"
    }} />;
  }
}`,...o.parameters?.docs?.source},description:{story:"A basic slider with default styling.",...o.parameters?.docs?.description}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  name: "Intent",
  argTypes: {
    intent: {
      table: {
        disable: true
      }
    }
  },
  render: function RenderIntent(args) {
    const [_, updateArgs] = useArgs();
    const handleChange = useCallback((newValue: number) => updateArgs({
      value: newValue
    }), [updateArgs]);
    return <Flex flexDirection="column" gap={6} style={{
      width: "100%"
    }}>
                {Object.values(Intent).map(intent => <Flex key={intent} flexDirection="column" gap={1}>
                        <StoryLabel title={intent} />
                        <Slider {...args} intent={intent} onChange={handleChange} onRelease={handleChange} handleHtmlProps={{
          "aria-label": \`\${intent} intent slider\`
        }} />
                    </Flex>)}
            </Flex>;
  }
}`,...i.parameters?.docs?.source},description:{story:"Use the `intent` prop to apply a semantic color to the slider track fill.",...i.parameters?.docs?.description}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: "State",
  argTypes: {
    disabled: {
      table: {
        disable: true
      }
    },
    vertical: {
      table: {
        disable: true
      }
    }
  },
  render: function RenderState(args) {
    const [_, updateArgs] = useArgs();
    const handleChange = useCallback((newValue: number) => updateArgs({
      value: newValue
    }), [updateArgs]);
    return <Flex flexDirection="column" gap={6} style={{
      width: "100%"
    }}>
                <Flex flexDirection="column" gap={1}>
                    <StoryLabel title="Default" />
                    <Slider {...args} disabled={false} onChange={handleChange} onRelease={handleChange} handleHtmlProps={{
          "aria-label": "Default state slider"
        }} />
                </Flex>
                <Flex flexDirection="column" gap={1}>
                    <StoryLabel title="Disabled" />
                    <Slider {...args} disabled={true} onChange={handleChange} onRelease={handleChange} handleHtmlProps={{
          "aria-label": "Disabled slider"
        }} />
                </Flex>
                <Flex flexDirection="column" gap={1}>
                    <StoryLabel title="Vertical" />
                    <Slider {...args} vertical={true} onChange={handleChange} onRelease={handleChange} handleHtmlProps={{
          "aria-label": "Vertical slider"
        }} />
                </Flex>
            </Flex>;
  }
}`,...d.parameters?.docs?.source},description:{story:"Use the `disabled` and `vertical` props to control slider state and orientation.",...d.parameters?.docs?.description}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: function Render(args) {
    const [_, updateArgs] = useArgs();
    const handleChange = useCallback((newValue: number) => updateArgs({
      value: newValue
    }), [updateArgs]);
    return <Slider {...args} onChange={handleChange} onRelease={handleChange} handleHtmlProps={{
      "aria-label": "Playground slider"
    }} />;
  },
  args: {
    value: 5
  }
}`,...c.parameters?.docs?.source},description:{story:"Interactive playground with full state management.",...c.parameters?.docs?.description}}};const D=["Default","IntentExample","StateExample","Playground"];export{o as Default,i as IntentExample,c as Playground,d as StateExample,D as __namedExportsOrder,A as default};
