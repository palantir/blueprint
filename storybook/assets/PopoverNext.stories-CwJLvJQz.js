import{j as e,B as o,r as h,h as z,i as Y,bf as X,cg as Z,C as W}from"./iframe-6KWIKMhT.js";import{S as a}from"./common-CGlRPlLv.js";import{F as t,B as U}from"./flex-CfNrUc6L.js";import{D as q}from"./dialogFooter-C01O7ydT.js";import{C as V}from"./controlGroup-DgQe6Apf.js";import{C as K}from"./controls-DUXJJE55.js";import{I as J}from"./inputGroup-Csz7Qhv0.js";import{H as Q}from"./htmlSelect-uzBgO6cZ.js";import{M as O,a as d}from"./menuItem-DvErEafd.js";import{a as b,P as r,b as $}from"./popoverNext-BYxtaCWB.js";import{S as ee}from"./slider-DH1BaE4A.js";import"./preload-helper-PPVm8Dsz.js";import"./carets-vertical-DFIbhOR4.js";import"./popoverNextMigrationUtils-D3izG0g9.js";import"./position-wreWcUSJ.js";import"./check-small-CLtm5zFR.js";import"./functionUtils-BGFdVicR.js";const m={BOTTOM:"bottom",BOTTOM_END:"bottom-end",BOTTOM_START:"bottom-start",LEFT:"left",LEFT_END:"left-end",LEFT_START:"left-start",RIGHT:"right",RIGHT_END:"right-end",RIGHT_START:"right-start",TOP:"top",TOP_END:"top-end",TOP_START:"top-start"},ne=[m.TOP,m.TOP_START,m.TOP_END,m.RIGHT,m.RIGHT_START,m.RIGHT_END,m.BOTTOM,m.BOTTOM_START,m.BOTTOM_END,m.LEFT,m.LEFT_START,m.LEFT_END],{useArgs:G}=__STORYBOOK_MODULE_PREVIEW_API__,{expect:p,screen:l,waitFor:y}=__STORYBOOK_MODULE_TEST__,te=["autoUpdateOptions","backdropProps","middleware","portalClassName","portalContainer","renderTarget","rootBoundary","targetProps","targetTagName","popupKind"],fe={title:"Core/Overlays/PopoverNext",component:r,parameters:{layout:"centered"},tags:["autodocs"],args:{disabled:!1,arrow:!0,matchTargetWidth:!1,interactionKind:b.CLICK,hasBackdrop:!1},argTypes:{placement:{control:"select",options:ne},interactionKind:{control:"select",options:Object.values(b)},disabled:{control:"boolean"},arrow:{control:"boolean"},matchTargetWidth:{control:"boolean"},hasBackdrop:{control:"boolean"},fill:{control:"boolean"},canEscapeKeyClose:{control:"boolean"},usePortal:{control:"boolean"},isOpen:{control:"boolean"},defaultIsOpen:{control:"boolean"},animation:{control:"select",options:Object.values($)},hoverOpenDelay:{control:"number"},hoverCloseDelay:{control:"number"},onClose:{action:"closed"},...te.reduce((n,i)=>(n[i]={table:{disable:!0}},n),{})}},x=e.jsxs(O,{children:[e.jsx(d,{text:"Cut",icon:"cut"}),e.jsx(d,{text:"Copy",icon:"duplicate"}),e.jsx(d,{text:"Paste",icon:"clipboard"})]}),I={render:n=>e.jsx(r,{...n,content:x,children:e.jsx(o,{text:"Open Menu",endIcon:"caret-down"})})},B={name:"Content",render:n=>e.jsxs(t,{gap:4,alignItems:"start",children:[e.jsxs(t,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(a,{title:"Text"}),e.jsx(r,{...n,content:"This is a simple string popover content.",children:e.jsx(o,{text:"Text",endIcon:"caret-down"})})]}),e.jsxs(t,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(a,{title:"Menu"}),e.jsx(r,{...n,content:x,children:e.jsx(o,{text:"Menu",endIcon:"caret-down"})})]}),e.jsxs(t,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(a,{title:"Input"}),e.jsx(r,{...n,content:e.jsx(U,{padding:4,children:e.jsxs(t,{flexDirection:"column",gap:2,children:[e.jsx(J,{placeholder:"Enter a value..."}),e.jsx(o,{text:"Submit",intent:"primary",size:"small"})]})}),children:e.jsx(o,{text:"Input",icon:"edit"})})]}),e.jsxs(t,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(a,{title:"Slider"}),e.jsx(r,{...n,content:e.jsx(U,{padding:4,children:e.jsx(ee,{min:0,max:100,stepSize:1,value:50,labelStepSize:25})}),children:e.jsx(o,{text:"Slider",icon:"settings"})})]}),e.jsxs(t,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(a,{title:"Select"}),e.jsx(r,{...n,content:e.jsx(U,{padding:4,children:e.jsx(Q,{options:["Apple","Banana","Cherry","Date"],fill:!0})}),children:e.jsx(o,{text:"Select",endIcon:"caret-down"})})]}),e.jsxs(t,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(a,{title:"undefined"}),e.jsx(r,{...n,content:void 0,children:e.jsx(o,{text:"Open",endIcon:"caret-down"})})]}),e.jsxs(t,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(a,{title:"Empty string"}),e.jsx(r,{...n,content:"",children:e.jsx(o,{text:"Open",endIcon:"caret-down"})})]})]})},u=({placement:n,...i})=>{const[s,g]=n.split("-"),c=e.jsxs("div",{children:["Popover on ",e.jsx(W,{children:s})," side",e.jsx("br",{}),g===void 0?e.jsxs(e.Fragment,{children:["Aligned to ",e.jsx(W,{children:"(center)"})]}):e.jsxs(e.Fragment,{children:["Aligned to ",e.jsx(W,{children:g})," edge"]})]}),v=h.useCallback(({isOpen:f,className:j,...w})=>e.jsx(o,{...w,active:f,text:n,style:{width:100}}),[n]);return e.jsx(r,{...i,content:c,placement:n,popoverClassName:Z,renderTarget:v})},P={name:"Placement",argTypes:{placement:{table:{disable:!0}}},render:n=>e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 2fr 1fr",gap:16},children:[e.jsx("div",{}),e.jsxs(V,{fill:!0,children:[e.jsx(u,{...n,placement:"bottom-start"}),e.jsx(u,{...n,placement:"bottom"}),e.jsx(u,{...n,placement:"bottom-end"})]}),e.jsx("div",{}),e.jsx(t,{justifyContent:"end",children:e.jsxs(V,{vertical:!0,children:[e.jsx(u,{...n,placement:"right-start"}),e.jsx(u,{...n,placement:"right"}),e.jsx(u,{...n,placement:"right-end"})]})}),e.jsx(t,{alignItems:"center",justifyContent:"center",children:e.jsx("em",{className:X,children:"Button positions are flipped here so that all popovers open inward."})}),e.jsx("div",{children:e.jsxs(V,{vertical:!0,children:[e.jsx(u,{...n,placement:"left-start"}),e.jsx(u,{...n,placement:"left"}),e.jsx(u,{...n,placement:"left-end"})]})}),e.jsx("div",{}),e.jsxs(V,{fill:!0,children:[e.jsx(u,{...n,placement:"top-start"}),e.jsx(u,{...n,placement:"top"}),e.jsx(u,{...n,placement:"top-end"})]}),e.jsx("div",{})]})},D={name:"Arrow",args:{placement:"bottom"},argTypes:{arrow:{table:{disable:!0}}},render:n=>e.jsxs(t,{gap:4,children:[e.jsxs(t,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(a,{title:"With Arrow"}),e.jsx(r,{...n,arrow:!0,content:e.jsxs(O,{children:[e.jsx(d,{text:"Action 1",icon:"play"}),e.jsx(d,{text:"Action 2",icon:"pause"})]}),children:e.jsx(o,{text:"Open",endIcon:"caret-down"})})]}),e.jsxs(t,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(a,{title:"No Arrow"}),e.jsx(r,{...n,arrow:!1,content:e.jsxs(O,{children:[e.jsx(d,{text:"Action 1",icon:"play"}),e.jsx(d,{text:"Action 2",icon:"pause"})]}),children:e.jsx(o,{text:"Open",endIcon:"caret-down"})})]})]})},T={name:"Interaction Kind",argTypes:{interactionKind:{table:{disable:!0}}},render:n=>e.jsx(t,{gap:4,children:[["Click",b.CLICK],["Click Target Only",b.CLICK_TARGET_ONLY],["Hover",b.HOVER],["Hover Target Only",b.HOVER_TARGET_ONLY]].map(([i,s])=>e.jsxs(t,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(a,{title:i}),e.jsx(r,{...n,interactionKind:s,content:e.jsxs(O,{children:[e.jsx(d,{text:"Option 1"}),e.jsx(d,{text:"Option 2"})]}),children:e.jsx(o,{text:i})})]},s))})},C={name:"Match Target Width",args:{animation:"minimal",arrow:!1,isOpen:!0,placement:"bottom"},argTypes:{matchTargetWidth:{table:{disable:!0}}},render:n=>e.jsxs(t,{gap:4,children:[e.jsxs(t,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(a,{title:"Default"}),e.jsx(r,{...n,matchTargetWidth:!1,content:e.jsxs(O,{children:[e.jsx(d,{text:"Short"}),e.jsx(d,{text:"Option"})]}),children:e.jsx(o,{text:"Wide Trigger Button",fill:!0,style:{width:250}})})]}),e.jsxs(t,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(a,{title:"Match Target Width"}),e.jsx(r,{...n,matchTargetWidth:!0,content:e.jsxs(O,{children:[e.jsx(d,{text:"Short"}),e.jsx(d,{text:"Option"})]}),children:e.jsx(o,{text:"Wide Trigger Button",fill:!0,style:{width:250}})})]})]})},E={name:"Disabled",args:{content:x},argTypes:{disabled:{table:{disable:!0}}},render:n=>e.jsxs(t,{gap:4,children:[e.jsxs(t,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(a,{title:"Enabled"}),e.jsx(r,{...n,disabled:!1,children:e.jsx(o,{text:"Click Me",endIcon:"caret-down"})})]}),e.jsxs(t,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(a,{title:"Disabled"}),e.jsx(r,{...n,disabled:!0,children:e.jsx(o,{text:"Click Me",endIcon:"caret-down"})})]})]})},F={name:"Has Backdrop",args:{content:x},argTypes:{hasBackdrop:{table:{disable:!0}}},render:n=>e.jsxs(t,{gap:4,children:[e.jsxs(t,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(a,{title:"No Backdrop"}),e.jsx(r,{...n,hasBackdrop:!1,children:e.jsx(o,{text:"Open",endIcon:"caret-down"})})]}),e.jsxs(t,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(a,{title:"Invisible Backdrop"}),e.jsx(r,{...n,hasBackdrop:!0,children:e.jsx(o,{text:"Open",endIcon:"caret-down"})})]}),e.jsxs(t,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(a,{title:"Visible Backdrop"}),e.jsx(r,{...n,hasBackdrop:!0,backdropProps:{style:{backgroundColor:"oklch(from var(--bp-palette-black) l c h / 0.3)"}},children:e.jsx(o,{text:"Open",endIcon:"caret-down"})})]})]})},S={name:"Fill",args:{content:x},argTypes:{fill:{table:{disable:!0}}},render:n=>e.jsxs(t,{flexDirection:"column",gap:4,style:{width:300},children:[e.jsxs(t,{flexDirection:"column",gap:1,children:[e.jsx(a,{title:"Default (inline)"}),e.jsx(r,{...n,fill:!1,children:e.jsx(o,{text:"Open Menu",endIcon:"caret-down"})})]}),e.jsxs(t,{flexDirection:"column",gap:1,children:[e.jsx(a,{title:"Fill"}),e.jsx(r,{...n,fill:!0,children:e.jsx(o,{text:"Open Menu",endIcon:"caret-down",fill:!0})})]})]})},N={name:"Controlled",args:{isOpen:!0,content:x},argTypes:{disabled:{table:{disable:!0}}},render:function({isOpen:i,...s}){const[,g]=G(),c=h.useCallback(v=>g({isOpen:v}),[g]);return e.jsx(r,{...s,isOpen:i,onInteraction:c,children:e.jsx(o,{text:"Popover Target",endIcon:"caret-down"})})}},k={name:"Default Is Open",args:{defaultIsOpen:!0,content:x},render:n=>e.jsx(r,{...n,children:e.jsx(o,{text:"Initially Open",endIcon:"caret-down"})})},M={name:"Hover Delays",args:{interactionKind:b.HOVER,content:x},argTypes:{interactionKind:{table:{disable:!0}}},render:n=>e.jsxs(t,{gap:4,children:[e.jsxs(t,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(a,{title:"Default delays"}),e.jsx(r,{...n,children:e.jsx(o,{text:"Hover me"})})]}),e.jsxs(t,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(a,{title:"Slow open (800ms)"}),e.jsx(r,{...n,hoverOpenDelay:800,children:e.jsx(o,{text:"Hover me"})})]}),e.jsxs(t,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(a,{title:"No close delay"}),e.jsx(r,{...n,hoverCloseDelay:0,children:e.jsx(o,{text:"Hover me"})})]})]})},R={name:"Animation",args:{arrow:!1,isOpen:!0,placement:"bottom",content:x},render:n=>e.jsxs(t,{gap:4,children:[e.jsxs(t,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(a,{title:"Scale (default)"}),e.jsx(r,{...n,animation:"scale",children:e.jsx(o,{text:"Open",endIcon:"caret-down"})})]}),e.jsxs(t,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(a,{title:"Minimal"}),e.jsx(r,{...n,animation:"minimal",children:e.jsx(o,{text:"Open",endIcon:"caret-down"})})]})]})},A={name:"Use Portal",render:function(i){return e.jsx("div",{style:{border:"2px dashed var(--bp-surface-border-color-default)",borderRadius:"var(--bp-surface-border-radius)",width:400,height:250,overflow:"auto"},children:e.jsxs(t,{gap:4,justifyContent:"center",style:{padding:"180px 40px"},children:[e.jsxs(t,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(a,{title:"With Portal (default)"}),e.jsx(r,{...i,usePortal:!0,placement:"bottom",content:x,children:e.jsx(o,{text:"Open",endIcon:"caret-down"})})]}),e.jsxs(t,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(a,{title:"No Portal"}),e.jsx(r,{...i,usePortal:!1,content:x,children:e.jsx(o,{text:"Open",endIcon:"caret-down"})})]})]})})}},L={name:"Boundary",args:{defaultIsOpen:!0},render:function(i){const[s,g]=h.useState(null);return e.jsx("div",{ref:g,style:{border:"2px dashed var(--bp-surface-border-color-default)",borderRadius:"var(--bp-surface-border-radius)",width:400,height:250,overflow:"auto",position:"relative"},children:e.jsx(t,{flexDirection:"column",alignItems:"center",gap:4,style:{padding:"180px 40px"},children:e.jsxs(t,{gap:4,children:[e.jsxs(t,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(a,{title:"With boundary"}),e.jsx(r,{...i,placement:"bottom",boundary:s??void 0,content:x,children:e.jsx(o,{text:"Open",endIcon:"caret-down"})})]}),e.jsxs(t,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(a,{title:"No boundary"}),e.jsx(r,{...i,placement:"bottom",content:x,children:e.jsx(o,{text:"Open",endIcon:"caret-down"})})]})]})})})}},_={name:"Opens Dialog",render:function(i){const[{isOpen:s,dialogOpen:g},c]=G(),v=h.useCallback(w=>c({isOpen:w}),[c]),f=h.useCallback(()=>c({dialogOpen:!0}),[c]),j=h.useCallback(()=>c({dialogOpen:!1}),[c]);return e.jsxs(e.Fragment,{children:[e.jsx(r,{...i,isOpen:s,onInteraction:v,content:e.jsx(U,{padding:4,children:e.jsxs(t,{flexDirection:"column",gap:2,children:[e.jsx("span",{children:"Choose an action"}),e.jsx(o,{text:"Edit details",icon:"edit",onClick:f})]})}),children:e.jsx(o,{text:"Open menu",endIcon:"caret-down"})}),e.jsxs(z,{isOpen:g===!0,title:"Edit details",onClose:j,usePortal:!0,children:[e.jsxs(Y,{children:[e.jsx("p",{children:"This dialog was launched from inside a popover. The popover remains open behind it."}),e.jsx(K,{label:"Clickable"}),e.jsx(K,{label:"Options"})]}),e.jsx(q,{actions:e.jsxs(e.Fragment,{children:[e.jsx(o,{text:"Cancel",onClick:j}),e.jsx(o,{text:"Save",intent:"primary",onClick:j})]})})]})]})},args:{isOpen:!1},play:async({canvas:n,userEvent:i,step:s})=>{await s("Open the popover",async()=>{await i.click(n.getByRole("button",{name:"Open menu"})),await y(()=>p(l.getByRole("button",{name:/Edit details/})).toBeVisible())}),await s("Open the dialog from inside the popover",async()=>{await i.click(l.getByRole("button",{name:/Edit details/})),await y(()=>p(l.getByRole("dialog")).toBeVisible())}),await s("Popover remains open while dialog is on screen",async()=>{await p(l.getByRole("dialog")).toBeVisible(),await p(l.getByRole("button",{name:/Edit details/})).toBeVisible()}),await s("Clicking inside the dialog does not close the popover",async()=>{await i.click(l.getByLabelText("Clickable")),await p(l.getByRole("dialog")).toBeVisible(),await p(l.getByRole("button",{name:/Edit details/})).toBeVisible()}),await s("Closing the dialog leaves the popover open",async()=>{await i.click(l.getByRole("button",{name:"Cancel"})),await y(()=>p(l.queryByRole("dialog")).not.toBeInTheDocument()),await p(l.getByRole("button",{name:/Edit details/})).toBeVisible()})}},H={name:"Opens Dialog (Hover)",render:function(i){const[{isOpen:s,dialogOpen:g},c]=G(),v=h.useCallback(()=>c({dialogOpen:!0}),[c]),f=h.useCallback(()=>c({dialogOpen:!1}),[c]),j=h.useCallback(w=>c({isOpen:w}),[c]);return e.jsxs(e.Fragment,{children:[e.jsx(r,{...i,isOpen:s,onInteraction:j,interactionKind:b.HOVER,content:e.jsx(U,{padding:4,children:e.jsxs(t,{flexDirection:"column",gap:2,children:[e.jsx("span",{children:"Hover-triggered popover"}),e.jsx(o,{text:"Open settings",icon:"cog",onClick:v})]})}),children:e.jsx(o,{text:"Hover me"})}),e.jsxs(z,{isOpen:g===!0,title:"Settings",onClose:f,usePortal:!0,children:[e.jsxs(Y,{children:[e.jsx("p",{children:"Clicking inside this dialog does not dismiss the hover-triggered popover behind it."}),e.jsx(K,{label:"Clickable"}),e.jsx(K,{label:"Options"})]}),e.jsx(q,{actions:e.jsx(o,{text:"Done",intent:"primary",onClick:f})})]})]})},args:{isOpen:!1},play:async({canvas:n,userEvent:i,step:s})=>{await s("Hover the target to open the popover",async()=>{await i.hover(n.getByRole("button",{name:"Hover me"})),await y(()=>p(l.getByRole("button",{name:/Open settings/})).toBeVisible())}),await s("Click the popover action to open the dialog",async()=>{await i.click(l.getByRole("button",{name:/Open settings/})),await y(()=>p(l.getByRole("dialog")).toBeVisible())}),await s("Popover stays open while dialog is on screen",async()=>{await y(()=>p(l.getByRole("dialog")).toBeVisible()),await p(l.getByRole("button",{name:/Open settings/})).toBeVisible()}),await s("Close the dialog — popover remains open",async()=>{await i.click(l.getByRole("button",{name:"Done"})),await y(()=>p(l.queryByRole("dialog")).not.toBeInTheDocument()),await p(l.getByRole("button",{name:/Open settings/})).toBeVisible()})}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  render: args => <PopoverNext {...args} content={SAMPLE_MENU}>
            <Button text="Open Menu" endIcon="caret-down" />
        </PopoverNext>
}`,...I.parameters?.docs?.source},description:{story:`A basic PopoverNext that opens a menu when clicked. PopoverNext wraps its children
and uses them as the trigger target. By default, clicking outside or on a menu item
closes the popover.`,...I.parameters?.docs?.description}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  name: "Content",
  render: args => <Flex gap={4} alignItems="start">
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="Text" />
                <PopoverNext {...args} content="This is a simple string popover content.">
                    <Button text="Text" endIcon="caret-down" />
                </PopoverNext>
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="Menu" />
                <PopoverNext {...args} content={SAMPLE_MENU}>
                    <Button text="Menu" endIcon="caret-down" />
                </PopoverNext>
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="Input" />
                <PopoverNext {...args} content={<Box padding={4}>
                            <Flex flexDirection="column" gap={2}>
                                <InputGroup placeholder="Enter a value..." />
                                <Button text="Submit" intent="primary" size="small" />
                            </Flex>
                        </Box>}>
                    <Button text="Input" icon="edit" />
                </PopoverNext>
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="Slider" />
                <PopoverNext {...args} content={<Box padding={4}>
                            <Slider min={0} max={100} stepSize={1} value={50} labelStepSize={25} />
                        </Box>}>
                    <Button text="Slider" icon="settings" />
                </PopoverNext>
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="Select" />
                <PopoverNext {...args} content={<Box padding={4}>
                            <HTMLSelect options={["Apple", "Banana", "Cherry", "Date"]} fill={true} />
                        </Box>}>
                    <Button text="Select" endIcon="caret-down" />
                </PopoverNext>
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="undefined" />
                <PopoverNext {...args} content={undefined}>
                    <Button text="Open" endIcon="caret-down" />
                </PopoverNext>
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="Empty string" />
                <PopoverNext {...args} content="">
                    <Button text="Open" endIcon="caret-down" />
                </PopoverNext>
            </Flex>
        </Flex>
}`,...B.parameters?.docs?.source},description:{story:"The `content` prop accepts any React node, from a plain string to rich form controls.\nA menu is the most common use case.",...B.parameters?.docs?.description}}};P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  name: "Placement",
  argTypes: {
    placement: {
      table: {
        disable: true
      }
    }
  },
  render: args => <div style={{
    display: "grid",
    gridTemplateColumns: "1fr 2fr 1fr",
    gap: 16
  }}>
            {/* Row 1: bottom placements (buttons at top, popovers open downward) */}
            <div />
            <ControlGroup fill={true}>
                <PlacementPopover {...args} placement="bottom-start" />
                <PlacementPopover {...args} placement="bottom" />
                <PlacementPopover {...args} placement="bottom-end" />
            </ControlGroup>
            <div />

            {/* Row 2: right placements | center label | left placements */}
            <Flex justifyContent="end">
                <ControlGroup vertical={true}>
                    <PlacementPopover {...args} placement="right-start" />
                    <PlacementPopover {...args} placement="right" />
                    <PlacementPopover {...args} placement="right-end" />
                </ControlGroup>
            </Flex>
            <Flex alignItems="center" justifyContent="center">
                <em className={Classes.TEXT_MUTED}>
                    Button positions are flipped here so that all popovers open inward.
                </em>
            </Flex>
            <div>
                <ControlGroup vertical={true}>
                    <PlacementPopover {...args} placement="left-start" />
                    <PlacementPopover {...args} placement="left" />
                    <PlacementPopover {...args} placement="left-end" />
                </ControlGroup>
            </div>

            {/* Row 3: top placements (buttons at bottom, popovers open upward) */}
            <div />
            <ControlGroup fill={true}>
                <PlacementPopover {...args} placement="top-start" />
                <PlacementPopover {...args} placement="top" />
                <PlacementPopover {...args} placement="top-end" />
            </ControlGroup>
            <div />
        </div>
}`,...P.parameters?.docs?.source},description:{story:"Use the `placement` prop to control where the popover appears relative to its target.\nThe popover automatically flips to the opposite side if there is insufficient space.\nButton positions are flipped here so that all popovers open inward.",...P.parameters?.docs?.description}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  name: "Arrow",
  args: {
    placement: "bottom"
  },
  argTypes: {
    arrow: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex gap={4}>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="With Arrow" />
                <PopoverNext {...args} arrow={true} content={<Menu>
                            <MenuItem text="Action 1" icon="play" />
                            <MenuItem text="Action 2" icon="pause" />
                        </Menu>}>
                    <Button text="Open" endIcon="caret-down" />
                </PopoverNext>
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="No Arrow" />
                <PopoverNext {...args} arrow={false} content={<Menu>
                            <MenuItem text="Action 1" icon="play" />
                            <MenuItem text="Action 2" icon="pause" />
                        </Menu>}>
                    <Button text="Open" endIcon="caret-down" />
                </PopoverNext>
            </Flex>
        </Flex>
}`,...D.parameters?.docs?.source},description:{story:"Use `arrow={false}` to hide the arrow pointing to the target. This creates a cleaner\nlook for dropdown menus that should appear directly below the trigger.",...D.parameters?.docs?.description}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  name: "Interaction Kind",
  argTypes: {
    interactionKind: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex gap={4}>
            {([["Click", PopoverInteractionKind.CLICK], ["Click Target Only", PopoverInteractionKind.CLICK_TARGET_ONLY], ["Hover", PopoverInteractionKind.HOVER], ["Hover Target Only", PopoverInteractionKind.HOVER_TARGET_ONLY]] as Array<[string, PopoverInteractionKind]>).map(([label, kind]) => <Flex key={kind} flexDirection="column" gap={1} alignItems="center">
                    <StoryLabel title={label} />
                    <PopoverNext {...args} interactionKind={kind} content={<Menu>
                                <MenuItem text="Option 1" />
                                <MenuItem text="Option 2" />
                            </Menu>}>
                        <Button text={label} />
                    </PopoverNext>
                </Flex>)}
        </Flex>
}`,...T.parameters?.docs?.source},description:{story:'Use `interactionKind` to control how the popover is triggered. `"click"` opens on click,\n`"hover"` opens on mouse hover, and the `"-target-only"` variants open on the same gesture\nbut only track the target element (not the popover content).',...T.parameters?.docs?.description}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  name: "Match Target Width",
  args: {
    animation: "minimal",
    arrow: false,
    isOpen: true,
    placement: "bottom"
  },
  argTypes: {
    matchTargetWidth: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex gap={4}>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="Default" />
                <PopoverNext {...args} matchTargetWidth={false} content={<Menu>
                            <MenuItem text="Short" />
                            <MenuItem text="Option" />
                        </Menu>}>
                    <Button text="Wide Trigger Button" fill={true} style={{
          width: 250
        }} />
                </PopoverNext>
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="Match Target Width" />
                <PopoverNext {...args} matchTargetWidth={true} content={<Menu>
                            <MenuItem text="Short" />
                            <MenuItem text="Option" />
                        </Menu>}>
                    <Button text="Wide Trigger Button" fill={true} style={{
          width: 250
        }} />
                </PopoverNext>
            </Flex>
        </Flex>
}`,...C.parameters?.docs?.source},description:{story:"Use `matchTargetWidth={true}` to make the popover content match the width of the\ntrigger element. This is useful for dropdown menus that should align with a wider trigger.",...C.parameters?.docs?.description}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  name: "Disabled",
  args: {
    content: SAMPLE_MENU
  },
  argTypes: {
    disabled: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex gap={4}>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="Enabled" />
                <PopoverNext {...args} disabled={false}>
                    <Button text="Click Me" endIcon="caret-down" />
                </PopoverNext>
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="Disabled" />
                <PopoverNext {...args} disabled={true}>
                    <Button text="Click Me" endIcon="caret-down" />
                </PopoverNext>
            </Flex>
        </Flex>
}`,...E.parameters?.docs?.source},description:{story:"A disabled popover will not open regardless of user interaction.",...E.parameters?.docs?.description}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  name: "Has Backdrop",
  args: {
    content: SAMPLE_MENU
  },
  argTypes: {
    hasBackdrop: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex gap={4}>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="No Backdrop" />
                <PopoverNext {...args} hasBackdrop={false}>
                    <Button text="Open" endIcon="caret-down" />
                </PopoverNext>
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="Invisible Backdrop" />
                <PopoverNext {...args} hasBackdrop={true}>
                    <Button text="Open" endIcon="caret-down" />
                </PopoverNext>
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="Visible Backdrop" />
                <PopoverNext {...args} hasBackdrop={true} backdropProps={{
        style: {
          backgroundColor: "oklch(from var(--bp-palette-black) l c h / 0.3)"
        }
      }}>
                    <Button text="Open" endIcon="caret-down" />
                </PopoverNext>
            </Flex>
        </Flex>
}`,...F.parameters?.docs?.source},description:{story:"Use `hasBackdrop={true}` with click interaction to render an invisible overlay behind the\npopover that prevents interaction with the rest of the page until it is closed.\nUse `backdropProps` to add a visible background color to the backdrop.",...F.parameters?.docs?.description}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  name: "Fill",
  args: {
    content: SAMPLE_MENU
  },
  argTypes: {
    fill: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="column" gap={4} style={{
    width: 300
  }}>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title="Default (inline)" />
                <PopoverNext {...args} fill={false}>
                    <Button text="Open Menu" endIcon="caret-down" />
                </PopoverNext>
            </Flex>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title="Fill" />
                <PopoverNext {...args} fill={true}>
                    <Button text="Open Menu" endIcon="caret-down" fill={true} />
                </PopoverNext>
            </Flex>
        </Flex>
}`,...S.parameters?.docs?.source},description:{story:'Use `fill={true}` to make the popover target take up the full width of its container.\nThis automatically sets the target tag name to `"div"`.',...S.parameters?.docs?.description}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  name: "Controlled",
  args: {
    isOpen: true,
    content: SAMPLE_MENU
  },
  argTypes: {
    disabled: {
      table: {
        disable: true
      }
    }
  },
  render: function RenderControlled({
    isOpen,
    ...args
  }) {
    const [, updateArgs] = useArgs();
    const handleInteraction = useCallback((nextOpenState: boolean) => updateArgs({
      isOpen: nextOpenState
    }), [updateArgs]);
    return <PopoverNext {...args} isOpen={isOpen} onInteraction={handleInteraction}>
                <Button text="Popover Target" endIcon="caret-down" />
            </PopoverNext>;
  }
}`,...N.parameters?.docs?.source},description:{story:"Set `isOpen` to control the popover's open state externally. In controlled mode, the\npopover only opens or closes when the `isOpen` prop changes. Use `onInteraction` to\nrespond to user interactions that would normally toggle the popover. This story defaults\nto open; toggle the `isOpen` control to drive it.",...N.parameters?.docs?.description}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  name: "Default Is Open",
  args: {
    defaultIsOpen: true,
    content: SAMPLE_MENU
  },
  render: args => <PopoverNext {...args}>
            <Button text="Initially Open" endIcon="caret-down" />
        </PopoverNext>
}`,...k.parameters?.docs?.source},description:{story:"Use `defaultIsOpen={true}` to have the popover open on initial render in uncontrolled mode.",...k.parameters?.docs?.description}}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  name: "Hover Delays",
  args: {
    interactionKind: PopoverInteractionKind.HOVER,
    content: SAMPLE_MENU
  },
  argTypes: {
    interactionKind: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex gap={4}>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="Default delays" />
                <PopoverNext {...args}>
                    <Button text="Hover me" />
                </PopoverNext>
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="Slow open (800ms)" />
                <PopoverNext {...args} hoverOpenDelay={800}>
                    <Button text="Hover me" />
                </PopoverNext>
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="No close delay" />
                <PopoverNext {...args} hoverCloseDelay={0}>
                    <Button text="Hover me" />
                </PopoverNext>
            </Flex>
        </Flex>
}`,...M.parameters?.docs?.source},description:{story:'Use `hoverOpenDelay` and `hoverCloseDelay` to control the timing of hover-triggered popovers.\nThese props only apply when `interactionKind` is `"hover"` or `"hover-target"`.',...M.parameters?.docs?.description}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  name: "Animation",
  args: {
    arrow: false,
    isOpen: true,
    placement: "bottom",
    content: SAMPLE_MENU
  },
  render: args => <Flex gap={4}>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="Scale (default)" />
                <PopoverNext {...args} animation="scale">
                    <Button text="Open" endIcon="caret-down" />
                </PopoverNext>
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="Minimal" />
                <PopoverNext {...args} animation="minimal">
                    <Button text="Open" endIcon="caret-down" />
                </PopoverNext>
            </Flex>
        </Flex>
}`,...R.parameters?.docs?.source},description:{story:'Use the `animation` prop to control the popover\'s entrance animation.\n`"scale"` (default) applies a scale + fade transition, while `"minimal"` uses only a fade.',...R.parameters?.docs?.description}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  name: "Use Portal",
  render: function RenderUsePortal(args) {
    return <div style={{
      border: "2px dashed var(--bp-surface-border-color-default)",
      borderRadius: "var(--bp-surface-border-radius)",
      width: 400,
      height: 250,
      overflow: "auto"
    }}>
                {/* Taller than the container so it scrolls. */}
                <Flex gap={4} justifyContent="center" style={{
        padding: "180px 40px"
      }}>
                    <Flex flexDirection="column" gap={1} alignItems="center">
                        <StoryLabel title="With Portal (default)" />
                        <PopoverNext {...args} usePortal={true} placement="bottom" content={SAMPLE_MENU}>
                            <Button text="Open" endIcon="caret-down" />
                        </PopoverNext>
                    </Flex>
                    <Flex flexDirection="column" gap={1} alignItems="center">
                        <StoryLabel title="No Portal" />
                        <PopoverNext {...args} usePortal={false} content={SAMPLE_MENU}>
                            <Button text="Open" endIcon="caret-down" />
                        </PopoverNext>
                    </Flex>
                </Flex>
            </div>;
  }
}`,...A.parameters?.docs?.source},description:{story:"Set `usePortal={false}` to render the popover inline in the DOM rather than in a portal.\nThis can be useful when the popover needs to inherit CSS styles from surrounding elements.\nUse `portalContainer` to render the portal into a specific DOM element instead of `document.body`.\n\nOpen each popover, then scroll the dashed container. The default (`document.body`) portal stays\nfixed relative to the viewport, while the inline (`usePortal={false}`) popover scrolls with the\ncontainer content.",...A.parameters?.docs?.description}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  name: "Boundary",
  args: {
    defaultIsOpen: true
  },
  render: function RenderBoundary(args) {
    // Use state (not a ref) so the popover re-renders once the boundary element mounts.
    const [boundary, setBoundary] = useState<HTMLDivElement | null>(null);
    return <div ref={setBoundary} style={{
      border: "2px dashed var(--bp-surface-border-color-default)",
      borderRadius: "var(--bp-surface-border-radius)",
      width: 400,
      height: 250,
      overflow: "auto",
      position: "relative"
    }}>
                {/* Taller than the container so it scrolls; extra space above/below lets the
                    targets be scrolled toward the container edges. */}
                <Flex flexDirection="column" alignItems="center" gap={4} style={{
        padding: "180px 40px"
      }}>
                    <Flex gap={4}>
                        <Flex flexDirection="column" gap={1} alignItems="center">
                            <StoryLabel title="With boundary" />
                            <PopoverNext {...args} placement="bottom" boundary={boundary ?? undefined} content={SAMPLE_MENU}>
                                <Button text="Open" endIcon="caret-down" />
                            </PopoverNext>
                        </Flex>
                        <Flex flexDirection="column" gap={1} alignItems="center">
                            <StoryLabel title="No boundary" />
                            <PopoverNext {...args} placement="bottom" content={SAMPLE_MENU}>
                                <Button text="Open" endIcon="caret-down" />
                            </PopoverNext>
                        </Flex>
                    </Flex>
                </Flex>
            </div>;
  }
}`,...L.parameters?.docs?.source},description:{story:"Use the `boundary` prop to constrain the popover within a specific container element.\nWhen the popover would overflow the boundary it flips or shifts to stay inside. Scroll\nthe dashed container so the bottom-placed popover bumps against the top edge: the popover\nwith a `boundary` flips to stay inside the container, while the unbounded popover keeps its\nrequested placement and overflows.",...L.parameters?.docs?.description}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  name: "Opens Dialog",
  render: function RenderOpensDialog(args) {
    const [{
      isOpen,
      dialogOpen
    }, updateArgs] = useArgs<{
      isOpen?: boolean;
      dialogOpen?: boolean;
    }>();
    const handleInteraction = useCallback((nextOpenState: boolean) => updateArgs({
      isOpen: nextOpenState
    }), [updateArgs]);
    const openDialog = useCallback(() => updateArgs({
      dialogOpen: true
    }), [updateArgs]);
    const closeDialog = useCallback(() => updateArgs({
      dialogOpen: false
    }), [updateArgs]);
    return <>
                <PopoverNext {...args} isOpen={isOpen} onInteraction={handleInteraction} content={<Box padding={4}>
                            <Flex flexDirection="column" gap={2}>
                                <span>Choose an action</span>
                                <Button text="Edit details" icon="edit" onClick={openDialog} />
                            </Flex>
                        </Box>}>
                    <Button text="Open menu" endIcon="caret-down" />
                </PopoverNext>
                <Dialog isOpen={dialogOpen === true} title="Edit details" onClose={closeDialog} usePortal={true}>
                    <DialogBody>
                        <p>This dialog was launched from inside a popover. The popover remains open behind it.</p>
                        <Checkbox label={"Clickable"} />
                        <Checkbox label={"Options"} />
                    </DialogBody>
                    <DialogFooter actions={<>
                                <Button text="Cancel" onClick={closeDialog} />
                                <Button text="Save" intent="primary" onClick={closeDialog} />
                            </>} />
                </Dialog>
            </>;
  },
  args: {
    isOpen: false
  },
  play: async ({
    canvas,
    userEvent,
    step
  }) => {
    await step("Open the popover", async () => {
      await userEvent.click(canvas.getByRole("button", {
        name: "Open menu"
      }));
      await waitFor(() => expect(screen.getByRole("button", {
        name: /Edit details/
      })).toBeVisible());
    });
    await step("Open the dialog from inside the popover", async () => {
      await userEvent.click(screen.getByRole("button", {
        name: /Edit details/
      }));
      await waitFor(() => expect(screen.getByRole("dialog")).toBeVisible());
    });
    await step("Popover remains open while dialog is on screen", async () => {
      await expect(screen.getByRole("dialog")).toBeVisible();
      await expect(screen.getByRole("button", {
        name: /Edit details/
      })).toBeVisible();
    });
    await step("Clicking inside the dialog does not close the popover", async () => {
      await userEvent.click(screen.getByLabelText("Clickable"));
      await expect(screen.getByRole("dialog")).toBeVisible();
      await expect(screen.getByRole("button", {
        name: /Edit details/
      })).toBeVisible();
    });
    await step("Closing the dialog leaves the popover open", async () => {
      await userEvent.click(screen.getByRole("button", {
        name: "Cancel"
      }));
      await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
      await expect(screen.getByRole("button", {
        name: /Edit details/
      })).toBeVisible();
    });
  }
}`,..._.parameters?.docs?.source},description:{story:`A popover can open a Dialog from within its content. Even though the dialog is
rendered in a portal outside the popover, PopoverNext recognizes it as a child
overlay and stays open while the dialog is on screen. Closing the dialog leaves
the popover open so the user can take further actions.`,..._.parameters?.docs?.description}}};H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  name: "Opens Dialog (Hover)",
  render: function RenderOpensDialogOnHover(args) {
    const [{
      isOpen,
      dialogOpen
    }, updateArgs] = useArgs<{
      isOpen?: boolean;
      dialogOpen?: boolean;
    }>();
    const openDialog = useCallback(() => updateArgs({
      dialogOpen: true
    }), [updateArgs]);
    const closeDialog = useCallback(() => updateArgs({
      dialogOpen: false
    }), [updateArgs]);
    const handleInteraction = useCallback((nextOpenState: boolean) => updateArgs({
      isOpen: nextOpenState
    }), [updateArgs]);
    return <>
                <PopoverNext {...args} isOpen={isOpen} onInteraction={handleInteraction} interactionKind={PopoverInteractionKind.HOVER} content={<Box padding={4}>
                            <Flex flexDirection="column" gap={2}>
                                <span>Hover-triggered popover</span>
                                <Button text="Open settings" icon="cog" onClick={openDialog} />
                            </Flex>
                        </Box>}>
                    <Button text="Hover me" />
                </PopoverNext>
                <Dialog isOpen={dialogOpen === true} title="Settings" onClose={closeDialog} usePortal={true}>
                    <DialogBody>
                        <p>Clicking inside this dialog does not dismiss the hover-triggered popover behind it.</p>
                        <Checkbox label={"Clickable"} />
                        <Checkbox label={"Options"} />
                    </DialogBody>
                    <DialogFooter actions={<Button text="Done" intent="primary" onClick={closeDialog} />} />
                </Dialog>
            </>;
  },
  args: {
    isOpen: false
  },
  play: async ({
    canvas,
    userEvent,
    step
  }) => {
    await step("Hover the target to open the popover", async () => {
      await userEvent.hover(canvas.getByRole("button", {
        name: "Hover me"
      }));
      await waitFor(() => expect(screen.getByRole("button", {
        name: /Open settings/
      })).toBeVisible());
    });
    await step("Click the popover action to open the dialog", async () => {
      await userEvent.click(screen.getByRole("button", {
        name: /Open settings/
      }));
      await waitFor(() => expect(screen.getByRole("dialog")).toBeVisible());
    });
    await step("Popover stays open while dialog is on screen", async () => {
      await waitFor(() => expect(screen.getByRole("dialog")).toBeVisible());
      await expect(screen.getByRole("button", {
        name: /Open settings/
      })).toBeVisible();
    });
    await step("Close the dialog — popover remains open", async () => {
      await userEvent.click(screen.getByRole("button", {
        name: "Done"
      }));
      await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
      await expect(screen.getByRole("button", {
        name: /Open settings/
      })).toBeVisible();
    });
  }
}`,...H.parameters?.docs?.source},description:{story:`The same child-overlay handling applies when the popover is triggered by hover.
Moving the cursor into a dialog launched from the popover does not count as moving
away from the popover, so the popover stays open while the dialog is on screen.`,...H.parameters?.docs?.description}}};const je=["Default","ContentExample","PlacementExample","ArrowExample","InteractionKindExample","MatchTargetWidthExample","DisabledExample","HasBackdropExample","FillExample","ControlledExample","DefaultIsOpenExample","HoverDelaysExample","AnimationExample","UsePortalExample","BoundaryExample","OpensDialog","OpensDialogOnHover"];export{R as AnimationExample,D as ArrowExample,L as BoundaryExample,B as ContentExample,N as ControlledExample,I as Default,k as DefaultIsOpenExample,E as DisabledExample,S as FillExample,F as HasBackdropExample,M as HoverDelaysExample,T as InteractionKindExample,C as MatchTargetWidthExample,_ as OpensDialog,H as OpensDialogOnHover,P as PlacementExample,A as UsePortalExample,je as __namedExportsOrder,fe as default};
