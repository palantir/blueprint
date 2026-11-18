import{h,j as e,B as r,i as C}from"./iframe-6KWIKMhT.js";import{F as y}from"./flex-CfNrUc6L.js";import{D as f}from"./dialogFooter-C01O7ydT.js";import"./preload-helper-PPVm8Dsz.js";const{useArgs:O,useCallback:u}=__STORYBOOK_MODULE_PREVIEW_API__,D=["containerRef","hasBackdrop","transitionName"],S={title:"Core/Overlays/Dialog",component:h,decorators:[t=>e.jsx(y,{justifyContent:"center",alignItems:"center",children:e.jsx(t,{})})],args:{title:"Dialog Title",isOpen:!0,isCloseButtonShown:!0},argTypes:{icon:{control:"text"},title:{control:"text"},isCloseButtonShown:{control:"boolean"},isOpen:{control:"boolean"},role:{control:"select",options:["dialog","alertdialog"]},...D.reduce((t,s)=>(t[s]={table:{disable:!0}},t),{})}},p={render:m()},a={name:"Without Title",args:{title:void 0},render:m()},l={name:"With Minimal Footer",render:function(s){const[,n]=O(),o=u(()=>n({isOpen:!0}),[n]),i=u(()=>n({isOpen:!1}),[n]);return e.jsxs(e.Fragment,{children:[e.jsx(r,{text:"Open Dialog",onClick:o}),e.jsxs(h,{...s,isOpen:s.isOpen,onClose:i,children:[e.jsx(C,{children:e.jsx("p",{children:"This dialog uses a minimal footer, which flows inline with the content rather than being fixed at the bottom."})}),e.jsx(f,{minimal:!0,actions:e.jsxs(e.Fragment,{children:[e.jsx(r,{text:"Cancel",onClick:i}),e.jsx(r,{text:"Confirm",intent:"primary",onClick:i})]})})]})]})}},c={name:"Icon",args:{icon:"cog",title:"Settings"},render:m()},d={render:m({bodyText:"Use the Storybook controls panel to adjust the dialog properties. The dialog supports icons, close buttons, and custom titles."})};function m(t){return function(n){const[,o]=O(),i=u(()=>o({isOpen:!0}),[o]),g=u(()=>o({isOpen:!1}),[o]),b=t?.bodyText??"This is a simple dialog body. You can put any content here, including forms, text, or other components.",x=t?.intent,j=t?.buttonText??"Open Dialog";return e.jsxs(e.Fragment,{children:[e.jsx(r,{text:j,intent:x,onClick:i}),e.jsxs(h,{...n,isOpen:n.isOpen,onClose:g,children:[e.jsx(C,{children:e.jsx("p",{children:b})}),e.jsx(f,{actions:e.jsxs(e.Fragment,{children:[e.jsx(r,{text:"Cancel",onClick:g}),e.jsx(r,{text:"Confirm",intent:x,onClick:g})]})})]})]})}}p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: renderDialog()
}`,...p.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  name: "Without Title",
  args: {
    title: undefined
  },
  render: renderDialog()
}`,...a.parameters?.docs?.source},description:{story:"A dialog without a title bar.",...a.parameters?.docs?.description}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  name: "With Minimal Footer",
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    const handleOpen = useCallback(() => updateArgs({
      isOpen: true
    }), [updateArgs]);
    const handleClose = useCallback(() => updateArgs({
      isOpen: false
    }), [updateArgs]);
    return <>
                <Button text="Open Dialog" onClick={handleOpen} />
                <Dialog {...args} isOpen={args.isOpen} onClose={handleClose}>
                    <DialogBody>
                        <p>
                            This dialog uses a minimal footer, which flows inline with the content rather than being
                            fixed at the bottom.
                        </p>
                    </DialogBody>
                    <DialogFooter minimal={true} actions={<>
                                <Button text="Cancel" onClick={handleClose} />
                                <Button text="Confirm" intent="primary" onClick={handleClose} />
                            </>} />
                </Dialog>
            </>;
  }
}`,...l.parameters?.docs?.source},description:{story:"A dialog with a minimal footer that flows inline with the content.",...l.parameters?.docs?.description}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: "Icon",
  args: {
    icon: "cog",
    title: "Settings"
  },
  render: renderDialog()
}`,...c.parameters?.docs?.source},description:{story:"Use the `icon` prop to display an icon in the dialog header.",...c.parameters?.docs?.description}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: renderDialog({
    bodyText: "Use the Storybook controls panel to adjust the dialog properties. The dialog supports icons, close buttons, and custom titles."
  })
}`,...d.parameters?.docs?.source},description:{story:"Interactive playground with all props togglable via Storybook controls.",...d.parameters?.docs?.description}}};const B=["Default","WithoutTitle","WithMinimalFooter","IconExample","Playground"];export{p as Default,c as IconExample,d as Playground,l as WithMinimalFooter,a as WithoutTitle,B as __namedExportsOrder,S as default};
