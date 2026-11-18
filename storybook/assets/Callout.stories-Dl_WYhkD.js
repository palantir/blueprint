import{e as I,aR as F,aa as S,af as A,ab as T,aS as v,aT as E,aj as L,j as e,ax as N,ai as w,I as r,g as O}from"./iframe-6KWIKMhT.js";import{s as U,S as x}from"./common-CGlRPlLv.js";import{F as o}from"./flex-CfNrUc6L.js";import{C as k,T as M,a as P,b as _}from"./triangle-exclamation-filled-BDvWT3Oc.js";import"./preload-helper-PPVm8Dsz.js";const l=t=>{const{className:a,children:n,icon:C,intent:g,title:f,compact:b,minimal:y=!1,...j}=t,h=R(C,g),D=I(F,S(g),a,{[E]:!L(n),[v]:h!=null,[T]:b,[A]:y});return e.jsxs("div",{className:D,...j,children:[h,f&&e.jsx(N,{children:f}),n]})};l.displayName=`${O}.Callout`;const R=(t,a)=>{if(t===null||t===!1)return;const n={"aria-hidden":!0,tabIndex:-1};if(t!==void 0)return e.jsx(w,{icon:t,...n});switch(a){case r.DANGER:return e.jsx(_,{...n});case r.PRIMARY:return e.jsx(P,{...n});case r.WARNING:return e.jsx(M,{...n});case r.SUCCESS:return e.jsx(k,{...n});default:return}};l.__docgenInfo={description:`Callout component.

@see https://blueprintjs.com/docs/#core/components/callout`,methods:[]};const W={title:"Core/Callout",component:l,decorators:[U],tags:["autodocs"],args:{children:"This is a callout with some informational content.",intent:void 0,icon:void 0,title:void 0,compact:!1,minimal:!1},argTypes:{intent:{control:"select",options:[...Object.values(r)]},icon:{control:"text"},compact:{control:"boolean"},minimal:{control:"boolean"},title:{control:"text"}}},i={args:{children:"This is a callout with some informational content."}},s={name:"Intent",argTypes:{intent:{table:{disable:!0}}},render:t=>e.jsx(o,{flexDirection:"column",gap:2,children:Object.values(r).map(a=>e.jsxs(l,{...t,intent:a,children:[a.charAt(0).toUpperCase()+a.slice(1)," intent callout."]},a))})},c={name:"Variant",argTypes:{minimal:{table:{disable:!0}}},render:t=>e.jsxs(o,{flexDirection:"column",gap:4,children:[e.jsxs(o,{flexDirection:"column",gap:1,children:[e.jsx(x,{title:"Default"}),e.jsx(l,{...t,minimal:!1,children:"Default callout with background fill."})]}),e.jsxs(o,{flexDirection:"column",gap:1,children:[e.jsx(x,{title:"Minimal"}),e.jsx(l,{...t,minimal:!0,children:"Minimal callout without background fill."})]})]})},m={name:"Compact",argTypes:{compact:{table:{disable:!0}}},render:t=>e.jsxs(o,{flexDirection:"column",gap:4,children:[e.jsxs(o,{flexDirection:"column",gap:1,children:[e.jsx(x,{title:"Default"}),e.jsx(l,{...t,compact:!1,children:"Default padding callout."})]}),e.jsxs(o,{flexDirection:"column",gap:1,children:[e.jsx(x,{title:"Compact"}),e.jsx(l,{...t,compact:!0,children:"Compact padding callout."})]})]})},u={name:"Icons",argTypes:{icon:{table:{disable:!0}}},render:t=>e.jsxs(o,{flexDirection:"column",gap:2,children:[e.jsx(l,{...t,icon:"home",children:"Custom icon callout."}),e.jsx(l,{...t,intent:"primary",children:"Intent-driven default icon."}),e.jsx(l,{...t,intent:"primary",icon:null,children:"Intent with icon explicitly hidden."})]})},p={argTypes:{intent:{table:{disable:!0}},minimal:{table:{disable:!0}}},render:t=>e.jsx(o,{flexDirection:"column",gap:4,children:[!1,!0].map(a=>e.jsxs(o,{flexDirection:"column",gap:2,children:[e.jsx(x,{title:a?"Minimal":"Default"}),e.jsx(l,{...t,minimal:a,children:"No intent callout."}),Object.values(r).map(n=>e.jsxs(l,{...t,minimal:a,intent:n,title:n,children:[n.charAt(0).toUpperCase()+n.slice(1)," intent callout content."]},n))]},String(a)))})},d={args:{children:"Adjust the controls to customize this callout.",intent:"primary",title:"Playground Callout",icon:void 0,compact:!1,minimal:!1}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    children: "This is a callout with some informational content."
  }
}`,...i.parameters?.docs?.source},description:{story:"A basic callout with default styling.",...i.parameters?.docs?.description}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  name: "Intent",
  argTypes: {
    intent: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="column" gap={2}>
            {Object.values(Intent).map(intent => <Callout key={intent} {...args} intent={intent}>
                    {intent.charAt(0).toUpperCase() + intent.slice(1)} intent callout.
                </Callout>)}
        </Flex>
}`,...s.parameters?.docs?.source},description:{story:"Use the `intent` prop to apply a semantic color that conveys the purpose or status of the callout.\nWhen an intent is set, a default icon is also rendered.",...s.parameters?.docs?.description}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: "Variant",
  argTypes: {
    minimal: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="column" gap={4}>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title="Default" />
                <Callout {...args} minimal={false}>
                    Default callout with background fill.
                </Callout>
            </Flex>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title="Minimal" />
                <Callout {...args} minimal={true}>
                    Minimal callout without background fill.
                </Callout>
            </Flex>
        </Flex>
}`,...c.parameters?.docs?.source},description:{story:"Use the `minimal` prop to render a callout without a background color fill.",...c.parameters?.docs?.description}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  name: "Compact",
  argTypes: {
    compact: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="column" gap={4}>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title="Default" />
                <Callout {...args} compact={false}>
                    Default padding callout.
                </Callout>
            </Flex>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title="Compact" />
                <Callout {...args} compact={true}>
                    Compact padding callout.
                </Callout>
            </Flex>
        </Flex>
}`,...m.parameters?.docs?.source},description:{story:"Use the `compact` prop to reduce the visual padding around callout content.",...m.parameters?.docs?.description}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  name: "Icons",
  argTypes: {
    icon: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="column" gap={2}>
            <Callout {...args} icon="home">
                Custom icon callout.
            </Callout>
            <Callout {...args} intent="primary">
                Intent-driven default icon.
            </Callout>
            <Callout {...args} intent="primary" icon={null}>
                Intent with icon explicitly hidden.
            </Callout>
        </Flex>
}`,...u.parameters?.docs?.source},description:{story:"Use the `icon` prop to render an icon on the left side. If omitted, the intent prop determines a default icon.\nSet `icon={null}` to explicitly hide the icon.",...u.parameters?.docs?.description}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  argTypes: {
    intent: {
      table: {
        disable: true
      }
    },
    minimal: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="column" gap={4}>
            {[false, true].map(minimal => <Flex key={String(minimal)} flexDirection="column" gap={2}>
                    <StoryLabel title={minimal ? "Minimal" : "Default"} />
                    <Callout {...args} minimal={minimal}>
                        No intent callout.
                    </Callout>
                    {Object.values(Intent).map(intent => <Callout key={intent} {...args} minimal={minimal} intent={intent} title={intent}>
                            {intent.charAt(0).toUpperCase() + intent.slice(1)} intent callout content.
                        </Callout>)}
                </Flex>)}
        </Flex>
}`,...p.parameters?.docs?.source},description:{story:"All intents across default and minimal variants.",...p.parameters?.docs?.description}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Adjust the controls to customize this callout.",
    intent: "primary",
    title: "Playground Callout",
    icon: undefined,
    compact: false,
    minimal: false
  }
}`,...d.parameters?.docs?.source},description:{story:"Interactive playground with all props togglable via Storybook controls.",...d.parameters?.docs?.description}}};const B=["Default","IntentExample","VariantExample","CompactExample","IconExample","AllIntentsAllVariants","Playground"];export{p as AllIntentsAllVariants,m as CompactExample,i as Default,u as IconExample,s as IntentExample,d as Playground,c as VariantExample,B as __namedExportsOrder,W as default};
