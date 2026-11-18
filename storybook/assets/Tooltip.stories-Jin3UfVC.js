import{I as D,j as e,B as r,X as O}from"./iframe-6KWIKMhT.js";import{s as j}from"./common-CGlRPlLv.js";import{F as x}from"./flex-CfNrUc6L.js";import{M as H,a as B}from"./menuItem-DvErEafd.js";import{P as I}from"./popoverNext-BYxtaCWB.js";import{T as s}from"./tooltip-DkP1kDvm.js";import"./preload-helper-PPVm8Dsz.js";import"./popoverNextMigrationUtils-D3izG0g9.js";import"./position-wreWcUSJ.js";import"./check-small-CLtm5zFR.js";import"./tooltipContext-B1TZx9Ko.js";const{expect:i,screen:l,waitFor:T}=__STORYBOOK_MODULE_TEST__,E=e.jsxs(H,{children:[e.jsx(B,{icon:"edit",text:"Rename"}),e.jsx(B,{icon:"duplicate",text:"Duplicate"}),e.jsx(B,{icon:"trash",intent:"danger",text:"Delete"})]}),k={title:"Core/Overlays/Tooltip",component:s,decorators:[j],tags:["autodocs"],args:{content:"This is a tooltip",intent:D.NONE,compact:!1,minimal:!1,disabled:!1},argTypes:{intent:{control:"select",options:Object.values(D)},compact:{control:"boolean"},minimal:{control:"boolean"},disabled:{control:"boolean"},content:{control:"text"}}},c={args:{content:"This is a tooltip",isOpen:!0,children:e.jsx(r,{children:"Hover me"})}},p={name:"Intent",argTypes:{intent:{table:{disable:!0}}},render:t=>{const n=Object.values(D),o=Math.ceil(n.length/2),a=[n.slice(0,o),n.slice(o)];return e.jsx(x,{flexDirection:"row",gap:10,children:a.map((w,f)=>e.jsx(x,{flexDirection:"column",gap:10,alignItems:"center",children:w.map(b=>e.jsx("div",{style:{padding:80},children:e.jsx(s,{...t,intent:b,placement:"bottom",isOpen:!0,children:e.jsx(r,{children:b.charAt(0).toUpperCase()+b.slice(1)})})},b))},f))})}},m={name:"Variant",argTypes:{compact:{table:{disable:!0}},minimal:{table:{disable:!0}}},render:t=>e.jsxs(x,{flexDirection:"row",gap:10,children:[e.jsxs(x,{flexDirection:"column",gap:10,alignItems:"center",children:[e.jsx("div",{style:{padding:80},children:e.jsx(s,{...t,compact:!1,placement:"bottom",minimal:!1,isOpen:!0,children:e.jsx(r,{children:"Default"})})}),e.jsx("div",{style:{padding:80},children:e.jsx(s,{...t,compact:!0,placement:"bottom",minimal:!1,isOpen:!0,children:e.jsx(r,{children:"Compact"})})})]}),e.jsxs(x,{flexDirection:"column",gap:10,alignItems:"center",children:[e.jsx("div",{style:{padding:80},children:e.jsx(s,{...t,compact:!1,placement:"bottom",minimal:!0,isOpen:!0,children:e.jsx(r,{children:"Minimal"})})}),e.jsx("div",{style:{padding:80},children:e.jsx(s,{...t,compact:!0,placement:"bottom",minimal:!0,isOpen:!0,children:e.jsx(r,{children:"Compact + Minimal"})})})]})]})},d={args:{content:"Tooltip content",children:e.jsx(r,{children:"Hover over me"})}},u={name:"With Popover",args:{content:"Tooltip: more actions",placement:"top"},render:t=>e.jsx(I,{content:E,placement:"bottom",transitionDuration:0,renderTarget:({ref:n,...o})=>e.jsx(s,{...t,renderTarget:({ref:a,...w})=>e.jsx(r,{...o,...w,ref:O(n,a),icon:"more",text:"Actions"})})})},h={name:"Hover Open",args:{content:"I appeared on hover!",hoverOpenDelay:0,children:e.jsx(r,{children:"Hover me"})},play:async({canvas:t,userEvent:n,step:o})=>{await o("Hover target to open tooltip",async()=>{const a=t.getByRole("button",{name:"Hover me"});await n.hover(a),await T(()=>i(l.getByText("I appeared on hover!")).toBeVisible())})}},v={name:"Hover Close",args:{content:"Now you see me",hoverOpenDelay:0,hoverCloseDelay:0,transitionDuration:0,children:e.jsx(r,{children:"Hover then leave"})},play:async({canvas:t,userEvent:n,step:o})=>{const a=t.getByRole("button",{name:"Hover then leave"});await o("Hover to open tooltip",async()=>{await n.hover(a),await T(()=>i(l.getByText("Now you see me")).toBeVisible())}),await o("Unhover to close tooltip",async()=>{await n.unhover(a),await T(()=>i(l.queryByText("Now you see me")).not.toBeInTheDocument())})}},y={name:"Hover Disabled",args:{content:"You should not see this",disabled:!0,hoverOpenDelay:0,children:e.jsx(r,{children:"Tooltip is disabled"})},play:async({canvas:t,userEvent:n,step:o})=>{await o("Hover disabled tooltip — nothing appears",async()=>{const a=t.getByRole("button",{name:"Tooltip is disabled"});await n.hover(a),await i(l.queryByText("You should not see this")).not.toBeInTheDocument()})}},g={name:"Hover Open Delay",args:{content:"Delayed tooltip",hoverOpenDelay:500,children:e.jsx(r,{children:"500ms delay"})},play:async({canvas:t,userEvent:n,step:o})=>{await o("Hover — tooltip not visible immediately due to delay",async()=>{const a=t.getByRole("button",{name:"500ms delay"});await n.hover(a),await i(l.queryByText("Delayed tooltip")).not.toBeInTheDocument()}),await o("Wait for delay — tooltip becomes visible",async()=>{await T(()=>i(l.getByText("Delayed tooltip")).toBeVisible())})}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    content: "This is a tooltip",
    isOpen: true,
    children: <Button>Hover me</Button>
  }
}`,...c.parameters?.docs?.source},description:{story:"A basic tooltip that appears on hover.",...c.parameters?.docs?.description}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  name: "Intent",
  argTypes: {
    intent: {
      table: {
        disable: true
      }
    }
  },
  render: args => {
    const intents = Object.values(Intent);
    const mid = Math.ceil(intents.length / 2);
    const columns = [intents.slice(0, mid), intents.slice(mid)];
    return <Flex flexDirection="row" gap={10}>
                {columns.map((col, i) => <Flex key={i} flexDirection="column" gap={10} alignItems="center">
                        {col.map(intent => <div key={intent} style={{
          padding: 80
        }}>
                                <Tooltip {...args} intent={intent} placement="bottom" isOpen={true}>
                                    <Button>{intent.charAt(0).toUpperCase() + intent.slice(1)}</Button>
                                </Tooltip>
                            </div>)}
                    </Flex>)}
            </Flex>;
  }
}`,...p.parameters?.docs?.source},description:{story:"Use the `intent` prop to apply a semantic color to the tooltip background.",...p.parameters?.docs?.description}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  name: "Variant",
  argTypes: {
    compact: {
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
  render: args => <Flex flexDirection="row" gap={10}>
            <Flex flexDirection="column" gap={10} alignItems="center">
                <div style={{
        padding: 80
      }}>
                    <Tooltip {...args} compact={false} placement="bottom" minimal={false} isOpen={true}>
                        <Button>Default</Button>
                    </Tooltip>
                </div>
                <div style={{
        padding: 80
      }}>
                    <Tooltip {...args} compact={true} placement="bottom" minimal={false} isOpen={true}>
                        <Button>Compact</Button>
                    </Tooltip>
                </div>
            </Flex>
            <Flex flexDirection="column" gap={10} alignItems="center">
                <div style={{
        padding: 80
      }}>
                    <Tooltip {...args} compact={false} placement="bottom" minimal={true} isOpen={true}>
                        <Button>Minimal</Button>
                    </Tooltip>
                </div>
                <div style={{
        padding: 80
      }}>
                    <Tooltip {...args} compact={true} placement="bottom" minimal={true} isOpen={true}>
                        <Button>Compact + Minimal</Button>
                    </Tooltip>
                </div>
            </Flex>
        </Flex>
}`,...m.parameters?.docs?.source},description:{story:"The `compact` prop renders a more condensed tooltip, and the `minimal` prop removes the arrow.",...m.parameters?.docs?.description}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    content: "Tooltip content",
    children: <Button>Hover over me</Button>
  }
}`,...d.parameters?.docs?.source},description:{story:"Interactive playground with all props togglable via Storybook controls.",...d.parameters?.docs?.description}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  name: "With Popover",
  args: {
    content: "Tooltip: more actions",
    placement: "top"
  },
  render: args => <PopoverNext content={TOOLTIP_POPOVER_MENU} placement="bottom" transitionDuration={0}
  // eslint-disable-next-line react/jsx-no-bind
  renderTarget={({
    ref: popoverRef,
    ...popoverProps
  }) => <Tooltip {...args}
  // eslint-disable-next-line react/jsx-no-bind
  renderTarget={({
    ref: tooltipRef,
    ...tooltipProps
  }) => <Button {...popoverProps} {...tooltipProps} ref={mergeRefs(popoverRef, tooltipRef)} icon="more" text="Actions" />} />} />
}`,...u.parameters?.docs?.source},description:{story:"A tooltip can share a single target with a click popover. Tooltip render-target\nprops are spread after PopoverNext's props here to verify that Tooltip does not\ninject an `onClick` handler which would shadow the popover trigger.",...u.parameters?.docs?.description}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  name: "Hover Open",
  args: {
    content: "I appeared on hover!",
    hoverOpenDelay: 0,
    children: <Button>Hover me</Button>
  },
  play: async ({
    canvas,
    userEvent,
    step
  }) => {
    await step("Hover target to open tooltip", async () => {
      const target = canvas.getByRole("button", {
        name: "Hover me"
      });
      await userEvent.hover(target);
      await waitFor(() => expect(screen.getByText("I appeared on hover!")).toBeVisible());
    });
  }
}`,...h.parameters?.docs?.source},description:{story:"Demonstrates the tooltip appearing on hover. The `play` function simulates\na user hovering over the target, causing the tooltip to open.",...h.parameters?.docs?.description}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  name: "Hover Close",
  args: {
    content: "Now you see me",
    hoverOpenDelay: 0,
    hoverCloseDelay: 0,
    transitionDuration: 0,
    children: <Button>Hover then leave</Button>
  },
  play: async ({
    canvas,
    userEvent,
    step
  }) => {
    const target = canvas.getByRole("button", {
      name: "Hover then leave"
    });
    await step("Hover to open tooltip", async () => {
      await userEvent.hover(target);
      await waitFor(() => expect(screen.getByText("Now you see me")).toBeVisible());
    });
    await step("Unhover to close tooltip", async () => {
      await userEvent.unhover(target);
      await waitFor(() => expect(screen.queryByText("Now you see me")).not.toBeInTheDocument());
    });
  }
}`,...v.parameters?.docs?.source},description:{story:`Demonstrates the tooltip closing when the user moves the cursor away.
After hovering to open, the cursor is moved off and the tooltip disappears.`,...v.parameters?.docs?.description}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  name: "Hover Disabled",
  args: {
    content: "You should not see this",
    disabled: true,
    hoverOpenDelay: 0,
    children: <Button>Tooltip is disabled</Button>
  },
  play: async ({
    canvas,
    userEvent,
    step
  }) => {
    await step("Hover disabled tooltip — nothing appears", async () => {
      const target = canvas.getByRole("button", {
        name: "Tooltip is disabled"
      });
      await userEvent.hover(target);
      await expect(screen.queryByText("You should not see this")).not.toBeInTheDocument();
    });
  }
}`,...y.parameters?.docs?.source},description:{story:"When `disabled` is true, hovering over the target does not open the tooltip.",...y.parameters?.docs?.description}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: "Hover Open Delay",
  args: {
    content: "Delayed tooltip",
    hoverOpenDelay: 500,
    children: <Button>500ms delay</Button>
  },
  play: async ({
    canvas,
    userEvent,
    step
  }) => {
    await step("Hover — tooltip not visible immediately due to delay", async () => {
      const target = canvas.getByRole("button", {
        name: "500ms delay"
      });
      await userEvent.hover(target);
      await expect(screen.queryByText("Delayed tooltip")).not.toBeInTheDocument();
    });
    await step("Wait for delay — tooltip becomes visible", async () => {
      await waitFor(() => expect(screen.getByText("Delayed tooltip")).toBeVisible());
    });
  }
}`,...g.parameters?.docs?.source},description:{story:"Demonstrates `hoverOpenDelay` — the tooltip waits before appearing.\nWith a 500ms delay, the tooltip is not yet visible immediately after hover.",...g.parameters?.docs?.description}}};const A=["Default","IntentExample","VariantExample","Playground","WithPopover","HoverOpen","HoverClose","HoverDisabled","HoverOpenDelay"];export{c as Default,v as HoverClose,y as HoverDisabled,h as HoverOpen,g as HoverOpenDelay,p as IntentExample,d as Playground,m as VariantExample,u as WithPopover,A as __namedExportsOrder,k as default};
