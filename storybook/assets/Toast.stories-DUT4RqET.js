import{r as a,cI as S,j as t,ai as N,cJ as B,A as F,B as R,b4 as P,e as D,cK as U,aa as q,g as M,I as h}from"./iframe-6KWIKMhT.js";import{s as O}from"./common-CGlRPlLv.js";import{F as y}from"./flex-CfNrUc6L.js";import{B as L}from"./buttonGroup-Dt--H6MV.js";import"./preload-helper-PPVm8Dsz.js";function _(e,n){const o=a.useRef(e);S(()=>{o.current=e},[e]),a.useEffect(()=>{if(!n&&n!==0)return;const b=setTimeout(()=>o.current(),n);return()=>clearTimeout(b)},[n])}const s=a.forwardRef((e,n)=>{const{action:o,className:b,icon:v,intent:C,isCloseButtonShown:I=!0,message:A,onDismiss:T,timeout:p=5e3}=e,[j,w]=a.useState(!1),g=a.useCallback(()=>w(!0),[]),i=a.useCallback(()=>w(!1),[]),f=p!=null&&p>0;_(()=>{r(!0)},j&&f?p:null),a.useEffect(()=>(f?g():i(),i),[i,g,f,p]);const r=a.useCallback(x=>{i(),T?.(x)},[i,T]),E=a.useCallback(()=>r(!1),[r]),k=a.useCallback(x=>{o?.onClick?.(x),r(!1)},[o,r]);return t.jsxs("div",{className:D(U,q(C),b),onBlur:g,onFocus:i,onMouseEnter:i,onMouseLeave:g,ref:n,tabIndex:0,children:[t.jsx(N,{icon:v}),t.jsx("span",{className:B,role:"alert",children:A}),t.jsxs(L,{variant:"minimal",children:[o&&t.jsx(F,{...o,intent:void 0,onClick:k}),I&&t.jsx(R,{"aria-label":"Close",icon:t.jsx(P,{}),onClick:E})]})]})});s.displayName=`${M}.Toast`;s.__docgenInfo={description:`Toast component.

@see https://blueprintjs.com/docs/#core/components/toast`,methods:[],props:{className:{required:!1,tsType:{name:"string"},description:"A space-delimited list of class names to pass along to a child element."},intent:{required:!1,tsType:{name:"Intent"},description:"Visual intent color to apply to element."},action:{required:!1,tsType:{name:"intersection",raw:"ActionProps & LinkProps",elements:[{name:"ActionProps"},{name:"LinkProps"}]},description:"Action rendered as a minimal `AnchorButton`. The toast is dismissed automatically when the\nuser clicks the action button. Note that the `intent` prop is ignored (the action button\ncannot have its own intent color that might conflict with the toast's intent). Omit this\nprop to omit the action button."},icon:{required:!1,tsType:{name:"union",raw:"IconName | MaybeElement",elements:[{name:"IconName"},{name:"union",raw:"React.JSX.Element | false | null | undefined",elements:[{name:"React.JSX.Element"},{name:"literal",value:"false"},{name:"null"},{name:"undefined"}]}]},description:"Name of a Blueprint UI icon (or an icon element) to render before the message."},isCloseButtonShown:{required:!1,tsType:{name:"boolean"},description:`Whether to show the close button in the toast.

@default true`},message:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"Message to display in the body of the toast."},onDismiss:{required:!1,tsType:{name:"signature",type:"function",raw:"(didTimeoutExpire: boolean) => void",signature:{arguments:[{type:{name:"boolean"},name:"didTimeoutExpire"}],return:{name:"void"}}},description:`Callback invoked when the toast is dismissed, either by the user or by the timeout.
The value of the argument indicates whether the toast was closed because the timeout expired.`},timeout:{required:!1,tsType:{name:"number"},description:`Milliseconds to wait before automatically dismissing toast.
Providing a value less than or equal to 0 will disable the timeout (this is discouraged).

@default 5000`}}};const X=["timeout","className","action","onDismiss","message"],K={title:"Core/Overlays/Toast",component:s,decorators:[O],args:{intent:h.NONE,icon:void 0,isCloseButtonShown:!0,timeout:0},argTypes:{intent:{control:"select",options:Object.values(h)},icon:{control:"text"},isCloseButtonShown:{control:"boolean"},...X.reduce((e,n)=>(e[n]={table:{disable:!0}},e),{})}},c={args:{message:"This is a toast message"}},l={name:"Intent",argTypes:{intent:{table:{disable:!0}}},render:e=>t.jsx(y,{flexDirection:"column",gap:2,children:Object.values(h).map(n=>t.jsx(s,{...e,intent:n,message:`${n.charAt(0).toUpperCase()+n.slice(1)} intent toast`},n))})},m={name:"Icons",argTypes:{icon:{table:{disable:!0}},intent:{table:{disable:!0}}},render:e=>t.jsxs(y,{flexDirection:"column",gap:2,children:[t.jsx(s,{...e,icon:"tick-circle",intent:"success",message:"File saved successfully"}),t.jsx(s,{...e,icon:"warning-sign",intent:"warning",message:"Connection is unstable"}),t.jsx(s,{...e,icon:"error",intent:"danger",message:"Failed to save changes"}),t.jsx(s,{...e,icon:"info-sign",intent:"primary",message:"New update available"})]})},u={name:"Action",argTypes:{isCloseButtonShown:{table:{disable:!0}},intent:{table:{disable:!0}}},render:e=>t.jsxs(y,{flexDirection:"column",gap:2,children:[t.jsx(s,{...e,message:"File deleted",action:{text:"Undo"}}),t.jsx(s,{...e,message:"Changes saved",intent:"success",action:{text:"View",icon:"share"}}),t.jsx(s,{...e,message:"New version available",intent:"primary",action:{text:"Release notes",href:"#",icon:"link"}})]})},d={args:{message:"Playground toast message",icon:"info-sign",intent:h.PRIMARY,isCloseButtonShown:!0,action:{text:"Undo"}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    message: "This is a toast message"
  }
}`,...c.parameters?.docs?.source},description:{story:"A basic toast with default styling and a close button.",...c.parameters?.docs?.description}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  name: "Intent",
  argTypes: {
    intent: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="column" gap={2}>
            {Object.values(Intent).map(intent => <Toast key={intent} {...args} intent={intent} message={\`\${intent.charAt(0).toUpperCase() + intent.slice(1)} intent toast\`} />)}
        </Flex>
}`,...l.parameters?.docs?.source},description:{story:"Use the `intent` prop to apply a semantic color that conveys the purpose or status of the toast.",...l.parameters?.docs?.description}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  name: "Icons",
  argTypes: {
    icon: {
      table: {
        disable: true
      }
    },
    intent: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="column" gap={2}>
            <Toast {...args} icon="tick-circle" intent="success" message="File saved successfully" />
            <Toast {...args} icon="warning-sign" intent="warning" message="Connection is unstable" />
            <Toast {...args} icon="error" intent="danger" message="Failed to save changes" />
            <Toast {...args} icon="info-sign" intent="primary" message="New update available" />
        </Flex>
}`,...m.parameters?.docs?.source},description:{story:"Use the `icon` prop to render a Blueprint icon before the message.",...m.parameters?.docs?.description}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  name: "Action",
  argTypes: {
    isCloseButtonShown: {
      table: {
        disable: true
      }
    },
    intent: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="column" gap={2}>
            <Toast {...args} message="File deleted" action={{
      text: "Undo"
    }} />
            <Toast {...args} message="Changes saved" intent="success" action={{
      text: "View",
      icon: "share"
    }} />
            <Toast {...args} message="New version available" intent="primary" action={{
      text: "Release notes",
      href: "#",
      icon: "link"
    }} />
        </Flex>
}`,...u.parameters?.docs?.source},description:{story:"Use the `action` prop to render an {@link AnchorButton} alongside the message.\nThe action accepts `ActionProps & LinkProps`, supporting text, icons, and links.",...u.parameters?.docs?.description}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    message: "Playground toast message",
    icon: "info-sign",
    intent: Intent.PRIMARY,
    isCloseButtonShown: true,
    action: {
      text: "Undo"
    }
  }
}`,...d.parameters?.docs?.source},description:{story:"Interactive playground for experimenting with toast props.",...d.parameters?.docs?.description}}};const W=["Default","IntentExample","IconExample","ActionExample","Playground"];export{u as ActionExample,c as Default,m as IconExample,l as IntentExample,d as Playground,W as __namedExportsOrder,K as default};
