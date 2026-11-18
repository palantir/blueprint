import{j as e,I as T,B as w}from"./iframe-6KWIKMhT.js";import{s as W,S as l}from"./common-CGlRPlLv.js";import{F as o}from"./flex-CfNrUc6L.js";import{P as F}from"./popoverNext-BYxtaCWB.js";import{a as t,M as i}from"./menuItem-DvErEafd.js";import{M as c}from"./menuDivider-BdV2IxuM.js";import{S as A}from"./size-c484FBD7.js";import"./preload-helper-PPVm8Dsz.js";import"./popoverNextMigrationUtils-D3izG0g9.js";import"./position-wreWcUSJ.js";import"./check-small-CLtm5zFR.js";const{expect:M,screen:j,waitFor:H}=__STORYBOOK_MODULE_TEST__,C=["large","small"],Q={title:"Core/Menu",component:i,subcomponents:{MenuItem:t,MenuDivider:c},decorators:[W],parameters:{layout:"centered"},tags:["autodocs"],args:{size:"medium",active:!1,disabled:!1,multiline:!1,shouldDismissPopover:!0},argTypes:{size:{control:"select",options:Object.values(A),table:{category:"Menu"}},text:{control:"text",table:{category:"MenuItem"}},icon:{control:"text",table:{category:"MenuItem"}},label:{control:"text",table:{category:"MenuItem"}},intent:{control:"select",options:Object.values(T),table:{category:"MenuItem"}},active:{control:"boolean",table:{category:"MenuItem"}},disabled:{control:"boolean",table:{category:"MenuItem"}},multiline:{control:"boolean",table:{category:"MenuItem"}},selected:{control:"boolean",table:{category:"MenuItem"}},roleStructure:{control:"select",options:["menuitem","listoption","listitem","none"],table:{category:"MenuItem"}},shouldDismissPopover:{control:"boolean",table:{category:"MenuItem"}},...C.reduce((r,n)=>(r[n]={table:{disable:!0}},r),{})}};function a({text:r,icon:n,label:s,intent:P,active:E,disabled:k,multiline:z,selected:B,roleStructure:N,shouldDismissPopover:L,...O}){return{menuProps:O,itemArgs:{intent:P,active:E,disabled:k,multiline:z,selected:B,roleStructure:N,shouldDismissPopover:L}}}const I={render:r=>{const{menuProps:n,itemArgs:s}=a(r);return e.jsxs(i,{...n,children:[e.jsx(t,{...s,icon:"new-text-box",text:"New text box"}),e.jsx(t,{...s,icon:"new-object",text:"New object"}),e.jsx(t,{...s,icon:"new-link",text:"New link"}),e.jsx(c,{}),e.jsx(t,{...s,icon:"cog",text:"Settings",label:"⌘,"})]})}},f={name:"Intent",argTypes:{size:{table:{disable:!0}}},render:r=>{const{menuProps:n}=a(r);return e.jsx(o,{gap:2,children:Object.values(T).map(s=>e.jsxs(i,{...n,children:[e.jsx(t,{icon:"graph",text:e.jsx("span",{style:{textTransform:"capitalize"},children:s}),intent:s}),e.jsx(t,{icon:"notifications",text:"Active",intent:s,active:!0})]},s))})}},v={name:"Size",argTypes:{size:{table:{disable:!0}}},render:r=>{const{menuProps:n}=a(r);return e.jsx(o,{gap:4,alignItems:"start",children:Object.values(A).map(s=>e.jsxs(o,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(l,{title:s}),e.jsxs(i,{...n,size:s,children:[e.jsx(t,{icon:"document",text:"New file"}),e.jsx(t,{icon:"folder-close",text:"New folder"}),e.jsx(c,{}),e.jsx(t,{icon:"cog",text:"Settings"})]})]},s))})}},S={name:"State",argTypes:{size:{table:{disable:!0}}},render:r=>{const{menuProps:n}=a(r);return e.jsxs(o,{gap:4,alignItems:"start",children:[e.jsxs(o,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(l,{title:"States"}),e.jsxs(i,{...n,children:[e.jsx(t,{icon:"home",text:"Default"}),e.jsx(t,{active:!0,icon:"walk",text:"Active"}),e.jsx(t,{icon:"ban-circle",text:"Disabled",disabled:!0}),e.jsx(t,{icon:"tick-circle",text:"Selected",roleStructure:"listoption",selected:!0})]})]}),e.jsxs(o,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(l,{title:"Active Combinations"}),e.jsxs(i,{...n,children:[e.jsx(t,{active:!0,icon:"walk",text:"Active"}),e.jsx(t,{active:!0,icon:"ban-circle",text:"Disabled",disabled:!0}),e.jsx(t,{active:!0,icon:"tick-circle",text:"Selected",roleStructure:"listoption",selected:!0})]})]}),e.jsxs(o,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(l,{title:"Disabled Combinations"}),e.jsxs(i,{...n,children:[e.jsx(t,{disabled:!0,icon:"ban-circle",text:"Disabled"}),e.jsx(t,{disabled:!0,active:!0,icon:"walk",text:"Active"}),e.jsx(t,{disabled:!0,icon:"tick-circle",text:"Selected",roleStructure:"listoption",selected:!0})]})]})]})}},y={name:"Icons",render:r=>{const{menuProps:n}=a(r);return e.jsxs(i,{...n,children:[e.jsx(t,{icon:"applications",text:"With icon"}),e.jsx(t,{text:"Without icon"}),e.jsx(t,{icon:"graph",text:"With icon and label",label:"⌘G"}),e.jsx(t,{icon:"add",text:"With label element",labelElement:e.jsx("span",{children:"Ctrl+N"})})]})}},m={name:"Label",render:r=>{const{menuProps:n}=a(r);return e.jsxs(i,{...n,children:[e.jsx(t,{icon:"document",text:"With string label",label:"⌘N"}),e.jsx(t,{icon:"floppy-disk",text:"With label element",labelElement:e.jsx("span",{children:"⌘S"})}),e.jsx(t,{icon:"cog",text:"Without label"})]})}},u={name:"Submenu",render:r=>{const{menuProps:n}=a(r);return e.jsx(i,{...n,children:e.jsxs(t,{icon:"style",text:"Text formatting",children:[e.jsx(t,{icon:"bold",text:"Bold",label:"⌘B"}),e.jsx(t,{icon:"italic",text:"Italic",label:"⌘I"}),e.jsx(t,{icon:"underline",text:"Underline",label:"⌘U"}),e.jsx(c,{}),e.jsx(t,{icon:"font",text:"Font"})]})})}},p={name:"Multiline",argTypes:{size:{table:{disable:!0}}},render:r=>{const{menuProps:n}=a(r),s="This is a very long menu item label that will not fit on a single line";return e.jsxs(o,{gap:4,alignItems:"start",children:[e.jsxs(o,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(l,{title:"Ellipsized (default)"}),e.jsx("div",{style:{width:220},children:e.jsx(i,{...n,children:e.jsx(t,{icon:"paragraph",text:s,multiline:!1})})})]}),e.jsxs(o,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(l,{title:"Multiline"}),e.jsx("div",{style:{width:220},children:e.jsx(i,{...n,children:e.jsx(t,{icon:"paragraph",text:s,multiline:!0})})})]})]})}},x={name:"Role Structure",argTypes:{size:{table:{disable:!0}}},render:r=>{const{menuProps:n}=a(r);return e.jsxs(o,{gap:4,alignItems:"start",children:[e.jsxs(o,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(l,{title:"menuitem"}),e.jsx(i,{...n,children:e.jsx(t,{icon:"home",text:"Home",roleStructure:"menuitem"})})]}),e.jsxs(o,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(l,{title:"listoption (selected)"}),e.jsx(i,{...n,children:e.jsx(t,{icon:"home",text:"Home",roleStructure:"listoption",selected:!0})})]}),e.jsxs(o,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(l,{title:"listoption (unselected)"}),e.jsx(i,{...n,children:e.jsx(t,{icon:"home",text:"Home",roleStructure:"listoption",selected:!1})})]}),e.jsxs(o,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(l,{title:"listitem"}),e.jsx(i,{...n,children:e.jsx(t,{icon:"home",text:"Home",roleStructure:"listitem"})})]})]})}},d={name:"Tag Name",render:r=>{const{menuProps:n}=a(r);return e.jsxs(i,{...n,children:[e.jsx(t,{icon:"link",text:"Anchor (default)",tagName:"a",href:"#"}),e.jsx(t,{icon:"hand-up",text:"Button",tagName:"button"}),e.jsx(t,{icon:"layout",text:"Div",tagName:"div"})]})}},g={name:"Should Dismiss Popover",argTypes:{size:{table:{disable:!0}}},render:r=>{const{menuProps:n}=a(r);return e.jsxs(o,{gap:4,alignItems:"start",children:[e.jsx(o,{flexDirection:"column",gap:1,alignItems:"center",children:e.jsx(F,{content:e.jsx(i,{...n,children:e.jsx(t,{icon:"tick",text:"Dismiss on click",shouldDismissPopover:!0})}),placement:"bottom",children:e.jsx(w,{icon:"caret-down",text:"Dismisses menu (default)"})})}),e.jsx(o,{flexDirection:"column",gap:1,alignItems:"center",children:e.jsx(F,{content:e.jsx(i,{...n,children:e.jsx(t,{icon:"pin",text:"Keep open on click",shouldDismissPopover:!1})}),placement:"bottom",children:e.jsx(w,{icon:"caret-down",text:"Persists menu"})})})]})}},b={name:"Divider",argTypes:{size:{table:{disable:!0}}},render:r=>{const{menuProps:n}=a(r);return e.jsxs(o,{gap:4,alignItems:"start",children:[e.jsxs(o,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(l,{title:"With title (section header)"}),e.jsxs(i,{...n,children:[e.jsx(c,{title:"Edit"}),e.jsx(t,{icon:"cut",text:"Cut",label:"⌘X"}),e.jsx(t,{icon:"duplicate",text:"Copy",label:"⌘C"}),e.jsx(c,{title:"View"}),e.jsx(t,{icon:"zoom-in",text:"Zoom in",label:"⌘+"}),e.jsx(t,{icon:"zoom-out",text:"Zoom out",label:"⌘-"})]})]}),e.jsxs(o,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(l,{title:"Without title (separator)"}),e.jsxs(i,{...n,children:[e.jsx(t,{icon:"document",text:"New file"}),e.jsx(t,{icon:"folder-close",text:"New folder"}),e.jsx(c,{}),e.jsx(t,{icon:"cog",text:"Settings"})]})]})]})}},D={args:{icon:"floppy-disk",text:"Save",label:"⌘S",intent:"primary"},render:r=>{const{menuProps:n,itemArgs:s}=a(r);return e.jsx(i,{...n,children:e.jsx(t,{...s,icon:r.icon,text:r.text,label:r.label})})}},h={name:"Submenu Opens On Hover",...u,play:async({canvas:r,userEvent:n,step:s})=>{await s("Submenu items are not visible before hover",async()=>{await M(j.queryByText("Bold")).not.toBeInTheDocument()}),await s("Hover parent item to open submenu",async()=>{const P=r.getByText("Text formatting");await n.hover(P),await H(()=>M(j.getByText("Bold")).toBeVisible()),await M(j.getByText("Italic")).toBeVisible(),await M(j.getByText("Underline")).toBeVisible()})}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  render: args => {
    const {
      menuProps,
      itemArgs
    } = splitArgs(args);
    return <Menu {...menuProps}>
                <MenuItem {...itemArgs} icon="new-text-box" text="New text box" />
                <MenuItem {...itemArgs} icon="new-object" text="New object" />
                <MenuItem {...itemArgs} icon="new-link" text="New link" />
                <MenuDivider />
                <MenuItem {...itemArgs} icon="cog" text="Settings" label="⌘," />
            </Menu>;
  }
}`,...I.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: "Intent",
  argTypes: {
    size: {
      table: {
        disable: true
      }
    }
  },
  render: args => {
    const {
      menuProps
    } = splitArgs(args);
    return <Flex gap={2}>
                {Object.values(Intent).map(intent => <Menu key={intent} {...menuProps}>
                        <MenuItem icon="graph" text={<span style={{
          textTransform: "capitalize"
        }}>{intent}</span>} intent={intent} />
                        <MenuItem icon="notifications" text="Active" intent={intent} active={true} />
                    </Menu>)}
            </Flex>;
  }
}`,...f.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  name: "Size",
  argTypes: {
    size: {
      table: {
        disable: true
      }
    }
  },
  render: args => {
    const {
      menuProps
    } = splitArgs(args);
    return <Flex gap={4} alignItems="start">
                {Object.values(Size).map(size => <Flex key={size} flexDirection="column" gap={1} alignItems="center">
                        <StoryLabel title={size} />
                        <Menu {...menuProps} size={size}>
                            <MenuItem icon="document" text="New file" />
                            <MenuItem icon="folder-close" text="New folder" />
                            <MenuDivider />
                            <MenuItem icon="cog" text="Settings" />
                        </Menu>
                    </Flex>)}
            </Flex>;
  }
}`,...v.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  name: "State",
  argTypes: {
    size: {
      table: {
        disable: true
      }
    }
  },
  render: args => {
    const {
      menuProps
    } = splitArgs(args);
    return <Flex gap={4} alignItems="start">
                <Flex flexDirection="column" gap={1} alignItems="center">
                    <StoryLabel title="States" />
                    <Menu {...menuProps}>
                        <MenuItem icon="home" text="Default" />
                        <MenuItem active={true} icon="walk" text="Active" />
                        <MenuItem icon="ban-circle" text="Disabled" disabled={true} />
                        <MenuItem icon="tick-circle" text="Selected" roleStructure="listoption" selected={true} />
                    </Menu>
                </Flex>
                <Flex flexDirection="column" gap={1} alignItems="center">
                    <StoryLabel title="Active Combinations" />
                    <Menu {...menuProps}>
                        <MenuItem active={true} icon="walk" text="Active" />
                        <MenuItem active={true} icon="ban-circle" text="Disabled" disabled={true} />
                        <MenuItem active={true} icon="tick-circle" text="Selected" roleStructure="listoption" selected={true} />
                    </Menu>
                </Flex>
                <Flex flexDirection="column" gap={1} alignItems="center">
                    <StoryLabel title="Disabled Combinations" />
                    <Menu {...menuProps}>
                        <MenuItem disabled={true} icon="ban-circle" text="Disabled" />
                        <MenuItem disabled={true} active={true} icon="walk" text="Active" />
                        <MenuItem disabled={true} icon="tick-circle" text="Selected" roleStructure="listoption" selected={true} />
                    </Menu>
                </Flex>
            </Flex>;
  }
}`,...S.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  name: "Icons",
  render: args => {
    const {
      menuProps
    } = splitArgs(args);
    return <Menu {...menuProps}>
                <MenuItem icon="applications" text="With icon" />
                <MenuItem text="Without icon" />
                <MenuItem icon="graph" text="With icon and label" label="⌘G" />
                <MenuItem icon="add" text="With label element" labelElement={<span>Ctrl+N</span>} />
            </Menu>;
  }
}`,...y.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  name: "Label",
  render: args => {
    const {
      menuProps
    } = splitArgs(args);
    return <Menu {...menuProps}>
                <MenuItem icon="document" text="With string label" label="⌘N" />
                <MenuItem icon="floppy-disk" text="With label element" labelElement={<span>⌘S</span>} />
                <MenuItem icon="cog" text="Without label" />
            </Menu>;
  }
}`,...m.parameters?.docs?.source},description:{story:"Use a `MenuItem`'s `label` prop for a string label (e.g. a keyboard shortcut), or `labelElement` for a JSX label.",...m.parameters?.docs?.description}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  name: "Submenu",
  render: args => {
    const {
      menuProps
    } = splitArgs(args);
    return <Menu {...menuProps}>
                <MenuItem icon="style" text="Text formatting">
                    <MenuItem icon="bold" text="Bold" label="⌘B" />
                    <MenuItem icon="italic" text="Italic" label="⌘I" />
                    <MenuItem icon="underline" text="Underline" label="⌘U" />
                    <MenuDivider />
                    <MenuItem icon="font" text="Font" />
                </MenuItem>
            </Menu>;
  }
}`,...u.parameters?.docs?.source},description:{story:"Pass `MenuItem` children to render a submenu that appears in a popover on hover or click.",...u.parameters?.docs?.description}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  name: "Multiline",
  argTypes: {
    size: {
      table: {
        disable: true
      }
    }
  },
  render: args => {
    const {
      menuProps
    } = splitArgs(args);
    const longText = "This is a very long menu item label that will not fit on a single line";
    return <Flex gap={4} alignItems="start">
                <Flex flexDirection="column" gap={1} alignItems="center">
                    <StoryLabel title="Ellipsized (default)" />
                    <div style={{
          width: 220
        }}>
                        <Menu {...menuProps}>
                            <MenuItem icon="paragraph" text={longText} multiline={false} />
                        </Menu>
                    </div>
                </Flex>
                <Flex flexDirection="column" gap={1} alignItems="center">
                    <StoryLabel title="Multiline" />
                    <div style={{
          width: 220
        }}>
                        <Menu {...menuProps}>
                            <MenuItem icon="paragraph" text={longText} multiline={true} />
                        </Menu>
                    </div>
                </Flex>
            </Flex>;
  }
}`,...p.parameters?.docs?.source},description:{story:"Use a `MenuItem`'s `multiline` prop to allow long text to wrap to multiple lines instead of being\ntruncated with an ellipsis. The parent menu must have a constrained width for wrapping to be observable.",...p.parameters?.docs?.description}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: "Role Structure",
  argTypes: {
    size: {
      table: {
        disable: true
      }
    }
  },
  render: args => {
    const {
      menuProps
    } = splitArgs(args);
    return <Flex gap={4} alignItems="start">
                <Flex flexDirection="column" gap={1} alignItems="center">
                    <StoryLabel title="menuitem" />
                    <Menu {...menuProps}>
                        <MenuItem icon="home" text="Home" roleStructure="menuitem" />
                    </Menu>
                </Flex>
                <Flex flexDirection="column" gap={1} alignItems="center">
                    <StoryLabel title="listoption (selected)" />
                    <Menu {...menuProps}>
                        <MenuItem icon="home" text="Home" roleStructure="listoption" selected={true} />
                    </Menu>
                </Flex>
                <Flex flexDirection="column" gap={1} alignItems="center">
                    <StoryLabel title="listoption (unselected)" />
                    <Menu {...menuProps}>
                        <MenuItem icon="home" text="Home" roleStructure="listoption" selected={false} />
                    </Menu>
                </Flex>
                <Flex flexDirection="column" gap={1} alignItems="center">
                    <StoryLabel title="listitem" />
                    <Menu {...menuProps}>
                        <MenuItem icon="home" text="Home" roleStructure="listitem" />
                    </Menu>
                </Flex>
            </Flex>;
  }
}`,...x.parameters?.docs?.source},description:{story:'Use a `MenuItem`\'s `roleStructure` to adapt its ARIA role to the parent. `"menuitem"` (default) suits a\n`<ul role="menu">`, `"listoption"` suits a `<ul role="listbox">` and enables the selected tick icon,\nand `"listitem"` suits a plain `<ul>`.',...x.parameters?.docs?.description}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: "Tag Name",
  render: args => {
    const {
      menuProps
    } = splitArgs(args);
    return <Menu {...menuProps}>
                <MenuItem icon="link" text="Anchor (default)" tagName="a" href="#" />
                <MenuItem icon="hand-up" text="Button" tagName="button" />
                <MenuItem icon="layout" text="Div" tagName="div" />
            </Menu>;
  }
}`,...d.parameters?.docs?.source},description:{story:'Use a `MenuItem`\'s `tagName` to change the HTML tag that wraps it. Defaults to `"a"`; set to `"button"`\nfor items that don\'t navigate, or `"div"` when nesting inside another interactive element.',...d.parameters?.docs?.description}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: "Should Dismiss Popover",
  argTypes: {
    size: {
      table: {
        disable: true
      }
    }
  },
  render: args => {
    const {
      menuProps
    } = splitArgs(args);
    return <Flex gap={4} alignItems="start">
                <Flex flexDirection="column" gap={1} alignItems="center">
                    <PopoverNext content={<Menu {...menuProps}>
                                <MenuItem icon="tick" text="Dismiss on click" shouldDismissPopover={true} />
                            </Menu>} placement="bottom">
                        <Button icon="caret-down" text="Dismisses menu (default)" />
                    </PopoverNext>
                </Flex>
                <Flex flexDirection="column" gap={1} alignItems="center">
                    <PopoverNext content={<Menu {...menuProps}>
                                <MenuItem icon="pin" text="Keep open on click" shouldDismissPopover={false} />
                            </Menu>} placement="bottom">
                        <Button icon="caret-down" text="Persists menu" />
                    </PopoverNext>
                </Flex>
            </Flex>;
  }
}`,...g.parameters?.docs?.source},description:{story:"By default, clicking a non-submenu item dismisses its parent popover. Set `shouldDismissPopover` to\n`false` to keep the popover open after click — useful for multi-select menus or persistent toggles.",...g.parameters?.docs?.description}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  name: "Divider",
  argTypes: {
    size: {
      table: {
        disable: true
      }
    }
  },
  render: args => {
    const {
      menuProps
    } = splitArgs(args);
    return <Flex gap={4} alignItems="start">
                <Flex flexDirection="column" gap={1} alignItems="center">
                    <StoryLabel title="With title (section header)" />
                    <Menu {...menuProps}>
                        <MenuDivider title="Edit" />
                        <MenuItem icon="cut" text="Cut" label="⌘X" />
                        <MenuItem icon="duplicate" text="Copy" label="⌘C" />
                        <MenuDivider title="View" />
                        <MenuItem icon="zoom-in" text="Zoom in" label="⌘+" />
                        <MenuItem icon="zoom-out" text="Zoom out" label="⌘-" />
                    </Menu>
                </Flex>
                <Flex flexDirection="column" gap={1} alignItems="center">
                    <StoryLabel title="Without title (separator)" />
                    <Menu {...menuProps}>
                        <MenuItem icon="document" text="New file" />
                        <MenuItem icon="folder-close" text="New folder" />
                        <MenuDivider />
                        <MenuItem icon="cog" text="Settings" />
                    </Menu>
                </Flex>
            </Flex>;
  }
}`,...b.parameters?.docs?.source},description:{story:"Use `MenuDivider` to separate groups of items. Pass a `title` to render a section header; omit it for a\nplain horizontal separator.",...b.parameters?.docs?.description}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    icon: "floppy-disk",
    text: "Save",
    label: "⌘S",
    intent: "primary"
  },
  render: args => {
    const {
      menuProps,
      itemArgs
    } = splitArgs(args);
    return <Menu {...menuProps}>
                <MenuItem {...itemArgs} icon={args.icon} text={args.text} label={args.label} />
            </Menu>;
  }
}`,...D.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  name: "Submenu Opens On Hover",
  ...SubmenuExample,
  play: async ({
    canvas,
    userEvent,
    step
  }) => {
    await step("Submenu items are not visible before hover", async () => {
      await expect(screen.queryByText("Bold")).not.toBeInTheDocument();
    });
    await step("Hover parent item to open submenu", async () => {
      const parent = canvas.getByText("Text formatting");
      await userEvent.hover(parent);
      await waitFor(() => expect(screen.getByText("Bold")).toBeVisible());
      await expect(screen.getByText("Italic")).toBeVisible();
      await expect(screen.getByText("Underline")).toBeVisible();
    });
  }
}`,...h.parameters?.docs?.source},description:{story:"Hovering a menu item with children opens its submenu popover.",...h.parameters?.docs?.description}}};const $=["Default","IntentExample","SizeExample","StateExample","IconExample","LabelExample","SubmenuExample","MultilineExample","RoleStructureExample","TagNameExample","ShouldDismissPopoverExample","MenuDividerExample","Playground","SubmenuOpensOnHover"];export{I as Default,y as IconExample,f as IntentExample,m as LabelExample,b as MenuDividerExample,p as MultilineExample,D as Playground,x as RoleStructureExample,g as ShouldDismissPopoverExample,v as SizeExample,S as StateExample,u as SubmenuExample,h as SubmenuOpensOnHover,d as TagNameExample,$ as __namedExportsOrder,Q as default};
