import{j as e,B as C}from"./iframe-6KWIKMhT.js";import{s as y}from"./common-CGlRPlLv.js";import{M as k,a as p}from"./menuItem-DvErEafd.js";import{M as b}from"./menuDivider-BdV2IxuM.js";import{C as h}from"./contextMenuPopover-CkKEwG-h.js";import"./preload-helper-PPVm8Dsz.js";import"./flex-CfNrUc6L.js";import"./popoverNext-BYxtaCWB.js";import"./popoverNextMigrationUtils-D3izG0g9.js";import"./position-wreWcUSJ.js";import"./check-small-CLtm5zFR.js";const{useArgs:x,useCallback:m}=__STORYBOOK_MODULE_PREVIEW_API__,{expect:f,screen:O,waitFor:v}=__STORYBOOK_MODULE_TEST__,T=e.jsxs(k,{children:[e.jsx(p,{icon:"select",text:"Select all"}),e.jsx(p,{icon:"insert",text:"Insert..."}),e.jsx(p,{icon:"layout",text:"Layout..."}),e.jsx(b,{}),e.jsx(p,{icon:"cross-circle",intent:"danger",text:"Delete"})]}),A={title:"Core/Context Menu/ContextMenuPopover",component:h,decorators:[y],args:{content:T,isOpen:!1,transitionDuration:0,isDarkTheme:!1},argTypes:{content:{control:!1},isOpen:{control:"boolean"},isDarkTheme:{control:"boolean"},targetOffset:{table:{disable:!0}},onClose:{action:"closed"},onOpening:{table:{disable:!0}},onOpened:{table:{disable:!0}},onClosing:{table:{disable:!0}},onClosed:{table:{disable:!0}},popoverClassName:{table:{disable:!0}},popoverRef:{table:{disable:!0}},rootBoundary:{table:{disable:!0}},transitionDuration:{table:{disable:!0}}}};function i(d){const[,o]=x(),u=m(t=>o({isOpen:!0,targetOffset:{left:t.clientX,top:t.clientY}}),[o]),l=m(()=>o({isOpen:!1}),[o]);return e.jsxs(e.Fragment,{children:[e.jsx(C,{text:"Click to open menu",onClick:u}),e.jsx(h,{...d,onClose:l})]})}const n={render:i},r={name:"Custom Placement",args:{placement:"top-end"},render:i},s={name:"Dark Theme",args:{isDarkTheme:!0},render:i},a={render:i},c={name:"Click To Open",render:i,play:async({canvas:d,userEvent:o,step:u})=>{await u("Click button to open menu at click location",async()=>{const l=d.getByRole("button",{name:"Click to open menu"}),t=l.getBoundingClientRect(),g={clientX:t.left+t.width/2,clientY:t.top+t.height/2};await o.pointer({keys:"[MouseLeft]",target:l,coords:g}),await v(()=>f(O.getByText("Select all")).toBeVisible())})}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: ContextMenuPopoverStoryRender
}`,...n.parameters?.docs?.source},description:{story:"A basic controlled context menu popover. Click the button to open the menu\nanchored at the click location. Unlike `ContextMenu`, this lower-level component\ndoes not wire up its own right-click handler — you control its open state directly.",...n.parameters?.docs?.description}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  name: "Custom Placement",
  args: {
    placement: "top-end"
  },
  render: ContextMenuPopoverStoryRender
}`,...r.parameters?.docs?.source},description:{story:"Override `placement` via the prop to control which corner of the menu anchors\nto the click point. The default is `right-start` (menu opens below and to the right).",...r.parameters?.docs?.description}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  name: "Dark Theme",
  args: {
    isDarkTheme: true
  },
  render: ContextMenuPopoverStoryRender
}`,...s.parameters?.docs?.source},description:{story:"Pass `isDarkTheme` to render the popover with dark-theme styling. This is\nneeded when calling the imperative `showContextMenu()` API outside of a\n`.bp6-dark` ancestor, since the singleton renders in its own React root.",...s.parameters?.docs?.description}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: ContextMenuPopoverStoryRender
}`,...a.parameters?.docs?.source},description:{story:"Interactive playground — click the button to open the menu, then adjust props via the controls panel.",...a.parameters?.docs?.description}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: "Click To Open",
  render: ContextMenuPopoverStoryRender,
  play: async ({
    canvas,
    userEvent,
    step
  }) => {
    await step("Click button to open menu at click location", async () => {
      const target = canvas.getByRole("button", {
        name: "Click to open menu"
      });
      const rect = target.getBoundingClientRect();
      const coords = {
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2
      };
      await userEvent.pointer({
        keys: "[MouseLeft]",
        target,
        coords
      });
      await waitFor(() => expect(screen.getByText("Select all")).toBeVisible());
    });
  }
}`,...c.parameters?.docs?.source},description:{story:"Demonstrates the popover opening on click. The play function simulates a left-click\nat the center of the trigger button, which sets `targetOffset` to those coordinates.",...c.parameters?.docs?.description}}};const I=["Default","CustomPlacement","DarkTheme","Playground","ClickToOpen"];export{c as ClickToOpen,r as CustomPlacement,s as DarkTheme,n as Default,a as Playground,I as __namedExportsOrder,A as default};
