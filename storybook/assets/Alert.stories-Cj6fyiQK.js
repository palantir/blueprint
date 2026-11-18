import{q as L,aK as j,aL as D,aM as v,r as o,j as n,h as W,aN as Y,ai as M,aO as H,aP as G,B as I,e as z,aQ as U,g as F,I as e}from"./iframe-6KWIKMhT.js";import{s as q}from"./common-CGlRPlLv.js";import{H as Q}from"./home-BddfYDeC.js";import"./preload-helper-PPVm8Dsz.js";import"./flex-CfNrUc6L.js";const R=k=>{const{cancelButtonText:s,canEscapeKeyCancel:c=!1,canOutsideClickCancel:i=!1,children:t,className:b,confirmButtonText:l="OK",icon:N,intent:E,isOpen:B=!1,loading:O=!1,onCancel:r,onClose:d,onConfirm:S,..._}=k;L(()=>{d==null&&s==null!=(r==null)&&console.warn(j);const a=r!=null||d!=null;c&&!a&&console.warn(D),i&&!a&&console.warn(v)},[c,i,s,r,d]);const A=o.useCallback((a,P)=>{(a?S:r)?.(P),d?.(a,P)},[r,d,S]),K=o.useCallback(a=>A(!1,a),[A]),w=o.useCallback(a=>A(!0,a),[A]);return n.jsxs(W,{..._,role:"alertdialog",className:z(U,b),canEscapeKeyClose:c,canOutsideClickClose:i,isOpen:B,onClose:K,children:[n.jsxs("div",{className:Y,children:[n.jsx(M,{icon:N,size:40,intent:E}),n.jsx("div",{className:H,children:t})]}),n.jsxs("div",{className:G,children:[n.jsx(I,{loading:O,intent:E,text:l,onClick:w}),s&&n.jsx(I,{text:s,disabled:O,onClick:K})]})]})};R.displayName=`${F}.Alert`;R.__docgenInfo={description:`Alert component.

@see https://blueprintjs.com/docs/#core/components/alert`,methods:[]};const nn={title:"Core/Alert",component:R,decorators:[q],args:{intent:e.NONE,isOpen:!0,canEscapeKeyCancel:!1,canOutsideClickCancel:!1,icon:"info-sign",confirmButtonText:"OK",cancelButtonText:void 0,loading:!1},argTypes:{intent:{control:"select",options:Object.values(e)},isOpen:{control:"boolean"},canEscapeKeyCancel:{control:"boolean"},canOutsideClickCancel:{control:"boolean"},icon:{control:"text"},confirmButtonText:{control:"text"},cancelButtonText:{control:"text"},loading:{control:"boolean"},onConfirm:{action:"confirmed"},onCancel:{action:"cancelled"},onClose:{action:"closed"}}},u={args:{children:"Are you sure you want to continue?"}},p={args:{intent:e.PRIMARY,icon:"info-sign",children:"This is a primary intent alert."}},m={args:{intent:e.SUCCESS,icon:"tick-circle",children:"This is a success intent alert."}},C={args:{intent:e.WARNING,icon:"warning-sign",children:"This is a warning intent alert."}},g={args:{intent:e.DANGER,icon:"error",children:"This is a danger intent alert."}},f={args:{intent:e.NONE,icon:"info-sign",confirmButtonText:"OK",cancelButtonText:void 0,children:"Alert with confirm button only."}},h={args:{intent:e.NONE,icon:"info-sign",confirmButtonText:"Confirm",cancelButtonText:"Cancel",children:"Alert with cancel button."}},T={args:{intent:e.PRIMARY,icon:"info-sign",confirmButtonText:"OK",cancelButtonText:"Cancel",loading:!0,children:"Loading alert."}},x={name:"Element icon",args:{intent:e.PRIMARY,icon:n.jsx(Q,{size:40}),children:"This alert renders <Home /> as its icon."}},y={render:function({onConfirm:s,onCancel:c,onClose:i,...t}){const[b,l]=o.useState(!0),N=o.useCallback(()=>{s?.(),l(!1)},[s]),E=o.useCallback(()=>{c?.(),l(!1)},[c]),B=o.useCallback(r=>{i?.(r),l(!1)},[i]),O=o.useCallback(()=>l(!0),[]);return n.jsxs("div",{children:[n.jsx(I,{type:"button",onClick:O,children:"Open Alert"}),n.jsx(R,{cancelButtonText:t.cancelButtonText,canEscapeKeyCancel:t.canEscapeKeyCancel,canOutsideClickCancel:t.canOutsideClickCancel,confirmButtonText:t.confirmButtonText,icon:t.icon,intent:t.intent,isOpen:b,loading:t.loading,onCancel:E,onClose:B,onConfirm:N,children:"This is a playground alert. Use the controls to customize it."})]})},args:{intent:e.DANGER,icon:"trash",confirmButtonText:"Confirm",cancelButtonText:"Cancel",canEscapeKeyCancel:!0,canOutsideClickCancel:!0,loading:!1}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Are you sure you want to continue?"
  }
}`,...u.parameters?.docs?.source},description:{story:"A basic alert with default styling.",...u.parameters?.docs?.description}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    intent: Intent.PRIMARY,
    icon: "info-sign",
    children: "This is a primary intent alert."
  }
}`,...p.parameters?.docs?.source},description:{story:"Primary intent alert.",...p.parameters?.docs?.description}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    intent: Intent.SUCCESS,
    icon: "tick-circle",
    children: "This is a success intent alert."
  }
}`,...m.parameters?.docs?.source},description:{story:"Success intent alert.",...m.parameters?.docs?.description}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    intent: Intent.WARNING,
    icon: "warning-sign",
    children: "This is a warning intent alert."
  }
}`,...C.parameters?.docs?.source},description:{story:"Warning intent alert.",...C.parameters?.docs?.description}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    intent: Intent.DANGER,
    icon: "error",
    children: "This is a danger intent alert."
  }
}`,...g.parameters?.docs?.source},description:{story:"Danger intent alert.",...g.parameters?.docs?.description}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    intent: Intent.NONE,
    icon: "info-sign",
    confirmButtonText: "OK",
    cancelButtonText: undefined,
    children: "Alert with confirm button only."
  }
}`,...f.parameters?.docs?.source},description:{story:"Alert with only a confirm button (no cancel).",...f.parameters?.docs?.description}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    intent: Intent.NONE,
    icon: "info-sign",
    confirmButtonText: "Confirm",
    cancelButtonText: "Cancel",
    children: "Alert with cancel button."
  }
}`,...h.parameters?.docs?.source},description:{story:"Alert with both confirm and cancel buttons.",...h.parameters?.docs?.description}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    intent: Intent.PRIMARY,
    icon: "info-sign",
    confirmButtonText: "OK",
    cancelButtonText: "Cancel",
    loading: true,
    children: "Loading alert."
  }
}`,...T.parameters?.docs?.source},description:{story:"Alert in a loading state. The confirm button shows a spinner and the cancel button is disabled.",...T.parameters?.docs?.description}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: "Element icon",
  args: {
    intent: Intent.PRIMARY,
    icon: <Home size={40} />,
    children: "This alert renders <Home /> as its icon."
  }
}`,...x.parameters?.docs?.source},description:{story:"The `icon` prop accepts either a string icon name or a React element.\nWhen an element is provided, `<Icon>` clones it and merges the parent-provided\n`className` and intent class onto its root.",...x.parameters?.docs?.description}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: function Render({
    onConfirm,
    onCancel,
    onClose,
    ...args
  }) {
    const [isOpen, setIsOpen] = useState(true);
    const handleConfirm = useCallback(() => {
      onConfirm?.();
      setIsOpen(false);
    }, [onConfirm]);
    const handleCancel = useCallback(() => {
      onCancel?.();
      setIsOpen(false);
    }, [onCancel]);
    const handleClose = useCallback((confirmed: boolean) => {
      onClose?.(confirmed);
      setIsOpen(false);
    }, [onClose]);
    const handleReopen = useCallback(() => setIsOpen(true), []);
    return <div>
                <Button type="button" onClick={handleReopen}>
                    Open Alert
                </Button>
                <Alert cancelButtonText={args.cancelButtonText} canEscapeKeyCancel={args.canEscapeKeyCancel} canOutsideClickCancel={args.canOutsideClickCancel} confirmButtonText={args.confirmButtonText} icon={args.icon} intent={args.intent} isOpen={isOpen} loading={args.loading} onCancel={handleCancel} onClose={handleClose} onConfirm={handleConfirm}>
                    This is a playground alert. Use the controls to customize it.
                </Alert>
            </div>;
  },
  args: {
    intent: Intent.DANGER,
    icon: "trash",
    confirmButtonText: "Confirm",
    cancelButtonText: "Cancel",
    canEscapeKeyCancel: true,
    canOutsideClickCancel: true,
    loading: false
  }
}`,...y.parameters?.docs?.source},description:{story:"Interactive playground with all props togglable via Storybook controls.",...y.parameters?.docs?.description}}};const en=["Default","Primary","Success","Warning","Danger","ConfirmOnly","WithCancel","Loading","ElementIconExample","Playground"];export{f as ConfirmOnly,g as Danger,u as Default,x as ElementIconExample,T as Loading,y as Playground,p as Primary,m as Success,C as Warning,h as WithCancel,en as __namedExportsOrder,nn as default};
