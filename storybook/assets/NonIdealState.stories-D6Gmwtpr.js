import{E as h,j as e,cb as I,ai as N,e as b,cc as T,cd as z,b as j,ce as E,cf as f,g as M,aB as D,B as _}from"./iframe-6KWIKMhT.js";import{s as R,S as m,D as u}from"./common-CGlRPlLv.js";import"./preload-helper-PPVm8Dsz.js";import"./flex-CfNrUc6L.js";var s=(a=>(a[a.STANDARD=h.STANDARD*3]="STANDARD",a[a.SMALL=h.STANDARD*2]="SMALL",a[a.EXTRA_SMALL=h.LARGE]="EXTRA_SMALL",a))(s||{});const n=a=>{const{action:r,children:t,className:v,description:y,icon:g,iconMuted:A=!0,iconSize:S=s.STANDARD,layout:L="vertical",title:x}=a;return e.jsxs("div",{className:b(f,`${f}-${L}`,v),children:[g==null?void 0:e.jsx("div",{className:I,style:{fontSize:`${S}px`,lineHeight:`${S}px`},children:e.jsx(N,{className:b({[T]:A}),icon:g,size:S,"aria-hidden":!0,tabIndex:-1})}),x==null&&y==null?void 0:e.jsxs("div",{className:z,children:[x&&e.jsx(j,{children:x}),y&&E(y,"div")]}),r,t]})};n.displayName=`${M}.NonIdealState`;n.__docgenInfo={description:`Non-ideal state component.

@see https://blueprintjs.com/docs/#core/components/non-ideal-state`,methods:[]};const X={title:"Core/NonIdealState",component:n,decorators:[R],args:{icon:"search",title:"No search results",description:"Try a different search query or check your filters.",layout:"vertical",iconMuted:!0,iconSize:s.STANDARD},argTypes:{icon:{control:"text"},iconSize:{control:"select",options:Object.values(s).filter(a=>typeof a=="number")},iconMuted:{control:"boolean"},layout:{control:"select",options:["vertical","horizontal"]}}},i={},o={name:"Layout",argTypes:{layout:{table:{disable:!0}}},render:a=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:40},children:[e.jsxs("div",{children:[e.jsx(m,{title:"Vertical (default)"}),e.jsx(u,{children:e.jsx(n,{...a,layout:"vertical"})})]}),e.jsxs("div",{children:[e.jsx(m,{title:"Horizontal"}),e.jsx(u,{children:e.jsx(n,{...a,layout:"horizontal"})})]})]})},l={name:"Icon Size",argTypes:{iconSize:{table:{disable:!0}}},render:a=>e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:40,alignItems:"flex-start"},children:[{size:s.EXTRA_SMALL,label:"Extra Small"},{size:s.SMALL,label:"Small"},{size:s.STANDARD,label:"Standard"}].map(({size:r,label:t})=>e.jsxs("div",{children:[e.jsx(m,{title:t}),e.jsx(u,{children:e.jsx(n,{...a,iconSize:r})})]},t))})},c={name:"Icon Muted",argTypes:{iconSize:{table:{disable:!0}},iconMuted:{table:{disable:!0}}},render:a=>e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:40,alignItems:"flex-start"},children:[{iconMuted:!0,label:"Icon muted (Default)"},{iconMuted:!1,label:"Icon isn't muted"}].map(({iconMuted:r,label:t})=>e.jsxs("div",{children:[e.jsx(m,{title:t}),e.jsx(u,{children:e.jsx(n,{...a,iconMuted:r})})]},t))})},d={name:"Loading",args:{icon:e.jsx(D,{}),title:"Loading search results",description:"This may take a moment."},argTypes:{icon:{table:{disable:!0}}},render:a=>e.jsx(n,{...a,icon:e.jsx(D,{size:a.iconSize})})},p={args:{icon:"search",title:"No search results",description:"Your search didn't match any files. Try searching for something else.",action:e.jsx(_,{icon:"refresh",text:"Clear search",intent:"primary"})}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:"{}",...i.parameters?.docs?.source},description:{story:"A basic NonIdealState with an icon, title, and description.",...i.parameters?.docs?.description}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: "Layout",
  argTypes: {
    layout: {
      table: {
        disable: true
      }
    }
  },
  render: args => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: 40
  }}>
            <div>
                <StoryLabel title="Vertical (default)" />
                <DashedPaddedContainer>
                    <NonIdealState {...args} layout="vertical" />
                </DashedPaddedContainer>
            </div>
            <div>
                <StoryLabel title="Horizontal" />
                <DashedPaddedContainer>
                    <NonIdealState {...args} layout="horizontal" />
                </DashedPaddedContainer>
            </div>
        </div>
}`,...o.parameters?.docs?.source},description:{story:"Horizontal vs vertical layout.",...o.parameters?.docs?.description}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  name: "Icon Size",
  argTypes: {
    iconSize: {
      table: {
        disable: true
      }
    }
  },
  render: args => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: 40,
    alignItems: "flex-start"
  }}>
            {([{
      size: NonIdealStateIconSize.EXTRA_SMALL,
      label: "Extra Small"
    }, {
      size: NonIdealStateIconSize.SMALL,
      label: "Small"
    }, {
      size: NonIdealStateIconSize.STANDARD,
      label: "Standard"
    }] as const).map(({
      size,
      label
    }) => <div key={label}>
                    <StoryLabel title={label} />
                    <DashedPaddedContainer>
                        <NonIdealState {...args} iconSize={size} />
                    </DashedPaddedContainer>
                </div>)}
        </div>
}`,...l.parameters?.docs?.source},description:{story:"Icon size options available for the visual element.",...l.parameters?.docs?.description}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: "Icon Muted",
  argTypes: {
    iconSize: {
      table: {
        disable: true
      }
    },
    iconMuted: {
      table: {
        disable: true
      }
    }
  },
  render: args => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: 40,
    alignItems: "flex-start"
  }}>
            {([{
      iconMuted: true,
      label: "Icon muted (Default)"
    }, {
      iconMuted: false,
      label: "Icon isn't muted"
    }] as const).map(({
      iconMuted,
      label
    }) => <div key={label}>
                    <StoryLabel title={label} />
                    <DashedPaddedContainer>
                        <NonIdealState {...args} iconMuted={iconMuted} />
                    </DashedPaddedContainer>
                </div>)}
        </div>
}`,...c.parameters?.docs?.source},description:{story:"Icon size options available for the visual element.",...c.parameters?.docs?.description}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: "Loading",
  args: {
    icon: <Spinner />,
    title: "Loading search results",
    description: "This may take a moment."
  },
  argTypes: {
    icon: {
      table: {
        disable: true
      }
    }
  },
  render: args => <NonIdealState {...args} icon={<Spinner size={args.iconSize} />} />
}`,...d.parameters?.docs?.source},description:{story:"Pass a `<Spinner>` as the `icon` to communicate a loading state.",...d.parameters?.docs?.description}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    icon: "search",
    title: "No search results",
    description: "Your search didn't match any files. Try searching for something else.",
    action: <Button icon="refresh" text="Clear search" intent="primary" />
  }
}`,...p.parameters?.docs?.source},description:{story:"Interactive playground for experimenting with NonIdealState props.",...p.parameters?.docs?.description}}};const H=["Default","LayoutExample","IconSizeExample","IconMutedExample","LoadingExample","Playground"];export{i as Default,c as IconMutedExample,l as IconSizeExample,o as LayoutExample,d as LoadingExample,p as Playground,H as __namedExportsOrder,X as default};
