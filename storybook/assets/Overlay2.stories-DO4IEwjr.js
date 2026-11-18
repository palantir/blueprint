import{av as c,r,j as e,B as t,aw as p,H as u,C as R,b as N}from"./iframe-6KWIKMhT.js";import{I as d}from"./inputGroup-Csz7Qhv0.js";import"./preload-helper-PPVm8Dsz.js";const{useArgs:i}=__STORYBOOK_MODULE_PREVIEW_API__,{expect:C,screen:v,waitFor:b}=__STORYBOOK_MODULE_TEST__,_=["childRef","childRefs","portalStopPropagationEvents"],Y={title:"Core/Overlays/Overlay2",component:c,parameters:{layout:"centered"},tags:["autodocs"],args:{isOpen:!1,hasBackdrop:!0,canEscapeKeyClose:!0,canOutsideClickClose:!0,autoFocus:!0,enforceFocus:!0,usePortal:!0,transitionDuration:0,transitionName:"no-transition"},argTypes:{hasBackdrop:{control:"boolean"},canEscapeKeyClose:{control:"boolean"},canOutsideClickClose:{control:"boolean"},autoFocus:{control:"boolean"},enforceFocus:{control:"boolean"},usePortal:{control:"boolean"},lazy:{control:"boolean"},shouldReturnFocusOnClose:{control:"boolean"},transitionDuration:{control:"number"},..._.reduce((o,s)=>(o[s]={table:{disable:!0}},o),{})}},h={background:"var(--bp-surface-background-color, white)",borderRadius:6,boxShadow:"0 2px 10px rgba(0,0,0,0.2)",left:"calc(50% - 200px)",margin:"10vh 0",padding:30,position:"fixed",top:0,width:400,zIndex:20},y={render:function(s){const[,n]=i(),l=r.useCallback(()=>n({isOpen:!0}),[n]),a=r.useCallback(()=>n({isOpen:!1}),[n]);return e.jsxs(e.Fragment,{children:[e.jsx(t,{text:"Open Overlay",onClick:l}),e.jsx(c,{...s,onClose:a,children:e.jsxs("div",{className:p,style:h,children:[e.jsx(u,{children:"Overlay Content"}),e.jsx("p",{children:"This is the overlay body content. Click outside or press Escape to close."}),e.jsx(t,{text:"Close",onClick:a})]})})]})}},x={name:"Without Backdrop",args:{hasBackdrop:!1},argTypes:{hasBackdrop:{table:{disable:!0}}},render:function(s){const[,n]=i(),l=r.useCallback(()=>n({isOpen:!0}),[n]),a=r.useCallback(()=>n({isOpen:!1}),[n]);return e.jsxs(e.Fragment,{children:[e.jsx(t,{text:"Open Overlay",onClick:l}),e.jsx(c,{...s,onClose:a,children:e.jsxs("div",{className:p,style:h,children:[e.jsx(u,{children:"No Backdrop"}),e.jsx("p",{children:"This overlay has no backdrop. You can still interact with the page behind it. Click outside or press Escape to close."}),e.jsx(t,{text:"Close",onClick:a})]})})]})}},k={name:"Inline (No Portal)",args:{usePortal:!1,hasBackdrop:!1},argTypes:{usePortal:{table:{disable:!0}}},render:function(s){const[,n]=i(),l=r.useCallback(()=>n({isOpen:!s.isOpen}),[s.isOpen,n]),a=r.useCallback(()=>n({isOpen:!1}),[n]);return e.jsxs("div",{style:{position:"relative",minHeight:200,width:400},children:[e.jsx(t,{text:"Toggle Inline Overlay",onClick:l}),e.jsx(c,{...s,onClose:a,children:e.jsxs("div",{style:{background:"var(--bp-surface-background-color, white)",border:"1px solid var(--bp-surface-border-color-default, #ccc)",borderRadius:6,marginTop:8,padding:20},children:[e.jsx(N,{style:{marginTop:0},children:"Inline Overlay"}),e.jsx("p",{children:"This overlay is rendered inline without a Portal."}),e.jsx(t,{text:"Close",onClick:a})]})})]})}},f={name:"Auto Focus",render:function(s){const[,n]=i(),l=r.useCallback(()=>n({isOpen:!0}),[n]),a=r.useCallback(()=>n({isOpen:!1}),[n]);return e.jsxs(e.Fragment,{children:[e.jsx(t,{text:"Open Overlay",onClick:l}),e.jsx(c,{...s,onClose:a,children:e.jsxs("div",{className:p,style:h,children:[e.jsx(u,{children:"Auto Focus"}),e.jsxs("p",{children:["Focus is moved inside the overlay on open. Press ",e.jsx(R,{children:"Tab"})," to reach the first input."]}),e.jsx(d,{placeholder:"First input",style:{marginBottom:10}}),e.jsx(d,{placeholder:"Second input",style:{marginBottom:10}}),e.jsxs("div",{style:{display:"flex",gap:10},children:[e.jsx(t,{text:"OK",intent:"primary",onClick:a}),e.jsx(t,{text:"Cancel",onClick:a})]})]})})]})}},O={name:"Enforce Focus (Focus Trap)",render:function(s){const[,n]=i(),l=r.useCallback(()=>n({isOpen:!0}),[n]),a=r.useCallback(()=>n({isOpen:!1}),[n]);return e.jsxs(e.Fragment,{children:[e.jsx(t,{text:"Open Overlay",onClick:l}),e.jsx(c,{...s,onClose:a,children:e.jsxs("div",{className:p,style:h,children:[e.jsx(u,{children:"Focus Trap"}),e.jsx("p",{children:"Tab and Shift+Tab wrap around the focusable elements. Focus cannot leave this overlay."}),e.jsx(d,{placeholder:"Field 1",style:{marginBottom:10}}),e.jsx(d,{placeholder:"Field 2",style:{marginBottom:10}}),e.jsx(d,{placeholder:"Field 3",style:{marginBottom:10}}),e.jsxs("div",{style:{display:"flex",gap:10},children:[e.jsx(t,{text:"Submit",intent:"primary",onClick:a}),e.jsx(t,{text:"Cancel",onClick:a})]})]})})]})}},E={name:"Without Enforce Focus",args:{enforceFocus:!1,hasBackdrop:!1},render:function(s){const[,n]=i(),l=r.useCallback(()=>n({isOpen:!0}),[n]),a=r.useCallback(()=>n({isOpen:!1}),[n]);return e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:10,marginBottom:20},children:[e.jsx(t,{text:"Open Overlay",onClick:l}),e.jsx(d,{placeholder:"Background input (should be reachable with Tab)"})]}),e.jsx(c,{...s,onClose:a,children:e.jsxs("div",{className:p,style:h,children:[e.jsx(u,{children:"No Focus Trap"}),e.jsx("p",{children:"Focus can leave this overlay. Try tabbing past the button below."}),e.jsx(d,{placeholder:"Overlay input",style:{marginBottom:10}}),e.jsx(t,{text:"Close",onClick:a})]})})]})}},g={name:"Return Focus on Close",args:{shouldReturnFocusOnClose:!0},render:function(s){const[,n]=i(),l=r.useCallback(()=>n({isOpen:!0}),[n]),a=r.useCallback(()=>n({isOpen:!1}),[n]);return e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:{display:"flex",gap:10},children:[e.jsx(t,{text:"Before"}),e.jsx(t,{text:"Open Overlay",onClick:l}),e.jsx(t,{text:"After"})]}),e.jsx(c,{...s,onClose:a,children:e.jsxs("div",{className:p,style:h,children:[e.jsx(u,{children:"Return Focus on Close"}),e.jsx("p",{children:'Press Escape to close. Focus should return to the "Open Overlay" button.'}),e.jsx(t,{text:"Close",intent:"primary",onClick:a})]})})]})}},m={name:"Escape Key Close",render:function(s){const[,n]=i(),l=r.useCallback(()=>n({isOpen:!0}),[n]),a=r.useCallback(()=>n({isOpen:!1}),[n]);return e.jsxs(e.Fragment,{children:[e.jsx(t,{text:"Open Overlay",onClick:l}),e.jsx(c,{...s,onClose:a,children:e.jsxs("div",{className:p,style:h,children:[e.jsx(u,{children:"Escape Key Close"}),e.jsxs("p",{children:["Press Escape to close this overlay. Use the Storybook controls to toggle"," ",e.jsx(R,{children:"canEscapeKeyClose"}),"."]}),e.jsx(d,{placeholder:"Type here, then press Escape",style:{marginBottom:10}}),e.jsx(t,{text:"Close",onClick:a})]})})]})}},T={render:function(s){const[,n]=i(),l=r.useCallback(()=>n({isOpen:!0}),[n]),a=r.useCallback(()=>n({isOpen:!1}),[n]);return e.jsxs(e.Fragment,{children:[e.jsx(t,{text:"Open Overlay",onClick:l}),e.jsx(c,{...s,onClose:a,children:e.jsxs("div",{className:p,style:h,children:[e.jsx(u,{children:"Playground Overlay"}),e.jsx("p",{children:"Use the Storybook controls to customize overlay behavior."}),e.jsx(t,{text:"Close",onClick:a})]})})]})}},B={name:"Open on Click",...y,play:async({canvas:o,userEvent:s})=>{await s.click(o.getByRole("button",{name:"Open Overlay"})),await b(()=>C(v.getByText("Overlay Content")).toBeVisible()),await s.keyboard("{Escape}")}},A={name:"Close on Escape",...y,play:async({canvas:o,userEvent:s})=>{await s.click(o.getByRole("button",{name:"Open Overlay"})),await b(()=>C(v.getByText("Overlay Content")).toBeVisible()),await s.keyboard("{Escape}"),await b(()=>C(v.queryByText("Overlay Content")).not.toBeInTheDocument())}},F={name:"Type into Input",...m,play:async({canvas:o,userEvent:s})=>{await s.click(o.getByRole("button",{name:"Open Overlay"}));const n=await v.findByPlaceholderText("Type here, then press Escape");await s.click(n),await s.type(n,"hello"),await C(n).toHaveValue("hello"),await s.keyboard("{Escape}")}},j={name:"Tab into Focus Trap",...O,play:async({canvas:o,userEvent:s})=>{await s.click(o.getByRole("button",{name:"Open Overlay"}));const n=await v.findByPlaceholderText("Field 1");await s.tab(),await s.tab(),await b(()=>C(document.activeElement).toBe(n)),await s.keyboard("{Escape}")}},w={name:"Restore Focus on Close",...g,play:async({canvas:o,userEvent:s})=>{const n=o.getByRole("button",{name:"Open Overlay"});n.focus(),await s.keyboard("{Enter}"),await b(()=>C(v.getByText("Return Focus on Close")).toBeVisible()),await s.keyboard("{Escape}"),await b(()=>C(document.activeElement).toBe(n))}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: function RenderDefault(args) {
    const [, updateArgs] = useArgs();
    const handleOpen = useCallback(() => updateArgs({
      isOpen: true
    }), [updateArgs]);
    const handleClose = useCallback(() => updateArgs({
      isOpen: false
    }), [updateArgs]);
    return <>
                <Button text="Open Overlay" onClick={handleOpen} />
                <Overlay2 {...args} onClose={handleClose}>
                    <div className={Classes.OVERLAY_CONTENT} style={OVERLAY_CONTENT_STYLE}>
                        <H3>Overlay Content</H3>
                        <p>This is the overlay body content. Click outside or press Escape to close.</p>
                        <Button text="Close" onClick={handleClose} />
                    </div>
                </Overlay2>
            </>;
  }
}`,...y.parameters?.docs?.source},description:{story:`A basic overlay with backdrop. Click the button to open the overlay, then click
the backdrop or press Escape to close it.`,...y.parameters?.docs?.description}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: "Without Backdrop",
  args: {
    hasBackdrop: false
  },
  argTypes: {
    hasBackdrop: {
      table: {
        disable: true
      }
    }
  },
  render: function RenderWithoutBackdrop(args) {
    const [, updateArgs] = useArgs();
    const handleOpen = useCallback(() => updateArgs({
      isOpen: true
    }), [updateArgs]);
    const handleClose = useCallback(() => updateArgs({
      isOpen: false
    }), [updateArgs]);
    return <>
                <Button text="Open Overlay" onClick={handleOpen} />
                <Overlay2 {...args} onClose={handleClose}>
                    <div className={Classes.OVERLAY_CONTENT} style={OVERLAY_CONTENT_STYLE}>
                        <H3>No Backdrop</H3>
                        <p>
                            This overlay has no backdrop. You can still interact with the page behind it. Click outside
                            or press Escape to close.
                        </p>
                        <Button text="Close" onClick={handleClose} />
                    </div>
                </Overlay2>
            </>;
  }
}`,...x.parameters?.docs?.source},description:{story:"An overlay without a backdrop. Users can still interact with the content behind the overlay.",...x.parameters?.docs?.description}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  name: "Inline (No Portal)",
  args: {
    usePortal: false,
    hasBackdrop: false
  },
  argTypes: {
    usePortal: {
      table: {
        disable: true
      }
    }
  },
  render: function RenderInlineOverlay(args) {
    const [, updateArgs] = useArgs();
    const handleToggle = useCallback(() => updateArgs({
      isOpen: !args.isOpen
    }), [args.isOpen, updateArgs]);
    const handleClose = useCallback(() => updateArgs({
      isOpen: false
    }), [updateArgs]);
    return <div style={{
      position: "relative",
      minHeight: 200,
      width: 400
    }}>
                <Button text="Toggle Inline Overlay" onClick={handleToggle} />
                <Overlay2 {...args} onClose={handleClose}>
                    <div style={{
          background: "var(--bp-surface-background-color, white)",
          border: "1px solid var(--bp-surface-border-color-default, #ccc)",
          borderRadius: 6,
          marginTop: 8,
          padding: 20
        }}>
                        <H4 style={{
            marginTop: 0
          }}>Inline Overlay</H4>
                        <p>This overlay is rendered inline without a Portal.</p>
                        <Button text="Close" onClick={handleClose} />
                    </div>
                </Overlay2>
            </div>;
  }
}`,...k.parameters?.docs?.source},description:{story:`An inline overlay rendered without a Portal. The overlay is rendered in place within
the DOM hierarchy instead of being appended to the document body.`,...k.parameters?.docs?.description}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: "Auto Focus",
  render: function RenderAutoFocus(args) {
    const [, updateArgs] = useArgs();
    const handleOpen = useCallback(() => updateArgs({
      isOpen: true
    }), [updateArgs]);
    const handleClose = useCallback(() => updateArgs({
      isOpen: false
    }), [updateArgs]);
    return <>
                <Button text="Open Overlay" onClick={handleOpen} />
                <Overlay2 {...args} onClose={handleClose}>
                    <div className={Classes.OVERLAY_CONTENT} style={OVERLAY_CONTENT_STYLE}>
                        <H3>Auto Focus</H3>
                        <p>
                            Focus is moved inside the overlay on open. Press <Code>Tab</Code> to reach the first input.
                        </p>
                        <InputGroup placeholder="First input" style={{
            marginBottom: 10
          }} />
                        <InputGroup placeholder="Second input" style={{
            marginBottom: 10
          }} />
                        <div style={{
            display: "flex",
            gap: 10
          }}>
                            <Button text="OK" intent="primary" onClick={handleClose} />
                            <Button text="Cancel" onClick={handleClose} />
                        </div>
                    </div>
                </Overlay2>
            </>;
  }
}`,...f.parameters?.docs?.source},description:{story:"Demonstrates `autoFocus` behavior. When enabled (the default), focus moves inside the\noverlay on open. Toggle `autoFocus` to `false` to see that focus stays on the trigger\nbutton instead.",...f.parameters?.docs?.description}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  name: "Enforce Focus (Focus Trap)",
  render: function RenderEnforceFocus(args) {
    const [, updateArgs] = useArgs();
    const handleOpen = useCallback(() => updateArgs({
      isOpen: true
    }), [updateArgs]);
    const handleClose = useCallback(() => updateArgs({
      isOpen: false
    }), [updateArgs]);
    return <>
                <Button text="Open Overlay" onClick={handleOpen} />
                <Overlay2 {...args} onClose={handleClose}>
                    <div className={Classes.OVERLAY_CONTENT} style={OVERLAY_CONTENT_STYLE}>
                        <H3>Focus Trap</H3>
                        <p>Tab and Shift+Tab wrap around the focusable elements. Focus cannot leave this overlay.</p>
                        <InputGroup placeholder="Field 1" style={{
            marginBottom: 10
          }} />
                        <InputGroup placeholder="Field 2" style={{
            marginBottom: 10
          }} />
                        <InputGroup placeholder="Field 3" style={{
            marginBottom: 10
          }} />
                        <div style={{
            display: "flex",
            gap: 10
          }}>
                            <Button text="Submit" intent="primary" onClick={handleClose} />
                            <Button text="Cancel" onClick={handleClose} />
                        </div>
                    </div>
                </Overlay2>
            </>;
  }
}`,...O.parameters?.docs?.source},description:{story:"When `enforceFocus` is enabled (the default), the overlay traps keyboard focus inside its\ncontent. Tab and Shift+Tab wrap around the focusable elements.",...O.parameters?.docs?.description}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  name: "Without Enforce Focus",
  args: {
    enforceFocus: false,
    hasBackdrop: false
  },
  render: function RenderWithoutEnforceFocus(args) {
    const [, updateArgs] = useArgs();
    const handleOpen = useCallback(() => updateArgs({
      isOpen: true
    }), [updateArgs]);
    const handleClose = useCallback(() => updateArgs({
      isOpen: false
    }), [updateArgs]);
    return <>
                <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        marginBottom: 20
      }}>
                    <Button text="Open Overlay" onClick={handleOpen} />
                    <InputGroup placeholder="Background input (should be reachable with Tab)" />
                </div>
                <Overlay2 {...args} onClose={handleClose}>
                    <div className={Classes.OVERLAY_CONTENT} style={OVERLAY_CONTENT_STYLE}>
                        <H3>No Focus Trap</H3>
                        <p>Focus can leave this overlay. Try tabbing past the button below.</p>
                        <InputGroup placeholder="Overlay input" style={{
            marginBottom: 10
          }} />
                        <Button text="Close" onClick={handleClose} />
                    </div>
                </Overlay2>
            </>;
  }
}`,...E.parameters?.docs?.source},description:{story:"When `enforceFocus` is disabled, focus can leave the overlay and reach elements behind it.",...E.parameters?.docs?.description}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: "Return Focus on Close",
  args: {
    shouldReturnFocusOnClose: true
  },
  render: function RenderReturnFocusOnClose(args) {
    const [, updateArgs] = useArgs();
    const handleOpen = useCallback(() => updateArgs({
      isOpen: true
    }), [updateArgs]);
    const handleClose = useCallback(() => updateArgs({
      isOpen: false
    }), [updateArgs]);
    return <>
                <div style={{
        display: "flex",
        gap: 10
      }}>
                    <Button text="Before" />
                    <Button text="Open Overlay" onClick={handleOpen} />
                    <Button text="After" />
                </div>
                <Overlay2 {...args} onClose={handleClose}>
                    <div className={Classes.OVERLAY_CONTENT} style={OVERLAY_CONTENT_STYLE}>
                        <H3>Return Focus on Close</H3>
                        <p>Press Escape to close. Focus should return to the "Open Overlay" button.</p>
                        <Button text="Close" intent="primary" onClick={handleClose} />
                    </div>
                </Overlay2>
            </>;
  }
}`,...g.parameters?.docs?.source},description:{story:"When `shouldReturnFocusOnClose` is enabled (the default), focus returns to the element\nthat had focus before the overlay opened.",...g.parameters?.docs?.description}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  name: "Escape Key Close",
  render: function RenderEscapeKeyClose(args) {
    const [, updateArgs] = useArgs();
    const handleOpen = useCallback(() => updateArgs({
      isOpen: true
    }), [updateArgs]);
    const handleClose = useCallback(() => updateArgs({
      isOpen: false
    }), [updateArgs]);
    return <>
                <Button text="Open Overlay" onClick={handleOpen} />
                <Overlay2 {...args} onClose={handleClose}>
                    <div className={Classes.OVERLAY_CONTENT} style={OVERLAY_CONTENT_STYLE}>
                        <H3>Escape Key Close</H3>
                        <p>
                            Press Escape to close this overlay. Use the Storybook controls to toggle{" "}
                            <Code>canEscapeKeyClose</Code>.
                        </p>
                        <InputGroup placeholder="Type here, then press Escape" style={{
            marginBottom: 10
          }} />
                        <Button text="Close" onClick={handleClose} />
                    </div>
                </Overlay2>
            </>;
  }
}`,...m.parameters?.docs?.source},description:{story:"When `canEscapeKeyClose` is true (the default), pressing Escape closes the overlay.",...m.parameters?.docs?.description}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: function RenderPlayground(args) {
    const [, updateArgs] = useArgs();
    const handleOpen = useCallback(() => updateArgs({
      isOpen: true
    }), [updateArgs]);
    const handleClose = useCallback(() => updateArgs({
      isOpen: false
    }), [updateArgs]);
    return <>
                <Button text="Open Overlay" onClick={handleOpen} />
                <Overlay2 {...args} onClose={handleClose}>
                    <div className={Classes.OVERLAY_CONTENT} style={OVERLAY_CONTENT_STYLE}>
                        <H3>Playground Overlay</H3>
                        <p>Use the Storybook controls to customize overlay behavior.</p>
                        <Button text="Close" onClick={handleClose} />
                    </div>
                </Overlay2>
            </>;
  }
}`,...T.parameters?.docs?.source},description:{story:"Interactive playground with all props.",...T.parameters?.docs?.description}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  name: "Open on Click",
  ...Default,
  play: async ({
    canvas,
    userEvent
  }) => {
    await userEvent.click(canvas.getByRole("button", {
      name: "Open Overlay"
    }));
    await waitFor(() => expect(screen.getByText("Overlay Content")).toBeVisible());
    await userEvent.keyboard("{Escape}");
  }
}`,...B.parameters?.docs?.source},description:{story:"Clicking the trigger button opens the overlay.",...B.parameters?.docs?.description}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  name: "Close on Escape",
  ...Default,
  play: async ({
    canvas,
    userEvent
  }) => {
    await userEvent.click(canvas.getByRole("button", {
      name: "Open Overlay"
    }));
    await waitFor(() => expect(screen.getByText("Overlay Content")).toBeVisible());
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByText("Overlay Content")).not.toBeInTheDocument());
  }
}`,...A.parameters?.docs?.source},description:{story:"Pressing Escape closes an open overlay.",...A.parameters?.docs?.description}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  name: "Type into Input",
  ...EscapeKeyClose,
  play: async ({
    canvas,
    userEvent
  }) => {
    await userEvent.click(canvas.getByRole("button", {
      name: "Open Overlay"
    }));
    const input = await screen.findByPlaceholderText<HTMLInputElement>("Type here, then press Escape");
    await userEvent.click(input);
    await userEvent.type(input, "hello");
    await expect(input).toHaveValue("hello");
    await userEvent.keyboard("{Escape}");
  }
}`,...F.parameters?.docs?.source},description:{story:"Typing into an input inside the overlay updates its value.",...F.parameters?.docs?.description}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  name: "Tab into Focus Trap",
  ...EnforceFocus,
  play: async ({
    canvas,
    userEvent
  }) => {
    await userEvent.click(canvas.getByRole("button", {
      name: "Open Overlay"
    }));
    const field1 = await screen.findByPlaceholderText("Field 1");
    await userEvent.tab();
    await userEvent.tab();
    await waitFor(() => expect(document.activeElement).toBe(field1));
    await userEvent.keyboard("{Escape}");
  }
}`,...j.parameters?.docs?.source},description:{story:"With `enforceFocus`, Tab moves focus from the overlay's container into the first user-focusable element.",...j.parameters?.docs?.description}}};w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  name: "Restore Focus on Close",
  ...ReturnFocusOnClose,
  play: async ({
    canvas,
    userEvent
  }) => {
    const trigger = canvas.getByRole("button", {
      name: "Open Overlay"
    });
    trigger.focus();
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(screen.getByText("Return Focus on Close")).toBeVisible());
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  }
}`,...w.parameters?.docs?.source},description:{story:"With `shouldReturnFocusOnClose`, closing the overlay restores focus to the trigger.",...w.parameters?.docs?.description}}};const L=["Default","WithoutBackdrop","InlineOverlay","AutoFocus","EnforceFocus","WithoutEnforceFocus","ReturnFocusOnClose","EscapeKeyClose","Playground","OpenOnClick","CloseOnEscape","TypeIntoInput","TabIntoFocusTrap","RestoreFocusOnClose"];export{f as AutoFocus,A as CloseOnEscape,y as Default,O as EnforceFocus,m as EscapeKeyClose,k as InlineOverlay,B as OpenOnClick,T as Playground,w as RestoreFocusOnClose,g as ReturnFocusOnClose,j as TabIntoFocusTrap,F as TypeIntoInput,x as WithoutBackdrop,E as WithoutEnforceFocus,L as __namedExportsOrder,Y as default};
