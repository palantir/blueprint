import{e as y,ch as j,aa as h,ci as S,cj as P,bc as D,j as e,ck as F,g as I,I as u}from"./iframe-6KWIKMhT.js";import{s as R,S as r}from"./common-CGlRPlLv.js";import{F as n}from"./flex-CfNrUc6L.js";import"./preload-helper-PPVm8Dsz.js";const a=t=>{const{animate:s=!0,className:d,intent:x,stripes:g=!0,value:m,...b}=t,v=y(j,h(x),{[P]:!s,[S]:!g},d),p=m==null?void 0:100*D(m,0,1),f=p==null?void 0:p+"%";return e.jsx("div",{...b,"aria-valuemax":100,"aria-valuemin":0,"aria-valuenow":p==null?void 0:Math.round(p),className:v,role:"progressbar",children:e.jsx("div",{className:F,style:{width:f}})})};a.displayName=`${I}.ProgressBar`;a.__docgenInfo={description:`Progress bar component.

@see https://blueprintjs.com/docs/#core/components/progress-bar`,methods:[]};const _={title:"Core/ProgressBar",component:a,decorators:[R],tags:["autodocs"],args:{animate:!0,intent:u.NONE,stripes:!0,value:void 0},argTypes:{animate:{control:"boolean"},intent:{control:"select",options:Object.values(u)},stripes:{control:"boolean"},value:{control:{type:"range",min:0,max:1,step:.05}}}},l={},o={name:"Intent",argTypes:{intent:{table:{disable:!0}},value:{table:{disable:!0}}},render:t=>e.jsx(n,{flexDirection:"column",gap:4,style:{width:"100%"},children:Object.values(u).map(s=>e.jsxs(n,{flexDirection:"column",gap:1,children:[e.jsx(r,{title:s}),e.jsx(a,{...t,intent:s,value:.6})]},s))})},i={name:"Value",argTypes:{animate:{table:{disable:!0}},stripes:{table:{disable:!0}},value:{table:{disable:!0}}},render:t=>e.jsxs(n,{flexDirection:"column",gap:4,style:{width:"100%"},children:[e.jsxs(n,{flexDirection:"column",gap:1,children:[e.jsx(r,{title:"Indeterminate"}),e.jsx(a,{...t,value:void 0})]}),e.jsxs(n,{flexDirection:"column",gap:1,children:[e.jsx(r,{title:"0%"}),e.jsx(a,{...t,value:0})]}),e.jsxs(n,{flexDirection:"column",gap:1,children:[e.jsx(r,{title:"50%"}),e.jsx(a,{...t,value:.5})]}),e.jsxs(n,{flexDirection:"column",gap:1,children:[e.jsx(r,{title:"100%"}),e.jsx(a,{...t,value:1})]}),e.jsxs(n,{flexDirection:"column",gap:1,children:[e.jsx(r,{title:"No stripes"}),e.jsx(a,{...t,stripes:!1,value:.6})]}),e.jsxs(n,{flexDirection:"column",gap:1,children:[e.jsx(r,{title:"No animation"}),e.jsx(a,{...t,animate:!1,value:.6})]})]})},c={args:{animate:!0,intent:u.PRIMARY,stripes:!0,value:.65}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:"{}",...l.parameters?.docs?.source},description:{story:"A basic indeterminate progress bar with default styling.",...l.parameters?.docs?.description}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: "Intent",
  argTypes: {
    intent: {
      table: {
        disable: true
      }
    },
    value: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="column" gap={4} style={{
    width: "100%"
  }}>
            {Object.values(Intent).map(intent => <Flex key={intent} flexDirection="column" gap={1}>
                    <StoryLabel title={intent} />
                    <ProgressBar {...args} intent={intent} value={0.6} />
                </Flex>)}
        </Flex>
}`,...o.parameters?.docs?.source},description:{story:"Use the `intent` prop to apply a semantic color to the progress bar.",...o.parameters?.docs?.description}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  name: "Value",
  argTypes: {
    animate: {
      table: {
        disable: true
      }
    },
    stripes: {
      table: {
        disable: true
      }
    },
    value: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="column" gap={4} style={{
    width: "100%"
  }}>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title="Indeterminate" />
                <ProgressBar {...args} value={undefined} />
            </Flex>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title="0%" />
                <ProgressBar {...args} value={0} />
            </Flex>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title="50%" />
                <ProgressBar {...args} value={0.5} />
            </Flex>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title="100%" />
                <ProgressBar {...args} value={1} />
            </Flex>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title="No stripes" />
                <ProgressBar {...args} stripes={false} value={0.6} />
            </Flex>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title="No animation" />
                <ProgressBar {...args} animate={false} value={0.6} />
            </Flex>
        </Flex>
}`,...i.parameters?.docs?.source},description:{story:"Use the `value` prop to show determinate progress. Omit it for an indeterminate bar that fills entirely.\nToggle `animate` and `stripes` to control visual feedback.",...i.parameters?.docs?.description}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    animate: true,
    intent: Intent.PRIMARY,
    stripes: true,
    value: 0.65
  }
}`,...c.parameters?.docs?.source},description:{story:"Interactive playground with all props toggleable via Storybook controls.",...c.parameters?.docs?.description}}};const L=["Default","IntentExample","ValueExample","Playground"];export{l as Default,o as IntentExample,c as Playground,i as ValueExample,L as __namedExportsOrder,_ as default};
