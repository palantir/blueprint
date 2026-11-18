import{r as b,e as I,ad as V,cl as G,aa as M,s as P,ae as Y,af as B,ag as H,l as j,ah as X,j as e,cm as $,ai as S,ak as N,cn as q,co as J,aj as Q,cp as Z,g as ee,I as l,B as ne}from"./iframe-6KWIKMhT.js";import{s as te,S as R}from"./common-CGlRPlLv.js";import{F as o}from"./flex-CfNrUc6L.js";import{T as ae}from"./tagRemoveButton-DdGBep5P.js";import{i as re}from"./functionUtils-BGFdVicR.js";import"./preload-helper-PPVm8Dsz.js";import"./x-small-DmUwHyi-.js";const a=b.forwardRef((t,n)=>{const{active:s=!1,children:r,className:h,endIcon:T,fill:i=!1,icon:v,intent:y,interactive:F=!1,leftContent:D,large:E=!1,minimal:O=!1,onRemove:k,rightIcon:z,round:w=!1,size:L="medium",tabIndex:_=0,...K}=t,U=re(k),W=I(V,G,M(y),P(L,{large:E}),{[X]:s,[j]:i,[H]:F,[B]:O,[Y]:w},h);return e.jsxs("span",{...K,className:W,tabIndex:F?_:void 0,ref:n,children:[e.jsxs("span",{className:$,children:[e.jsx(S,{icon:v}),e.jsx(N,{className:I(q,j),tagName:"span",children:D})]}),e.jsxs("span",{className:J,children:[!Q(r)&&e.jsx(N,{className:I(Z,j),tagName:"span",children:r}),e.jsx(S,{icon:T??z}),U&&e.jsx(ae,{...t})]})]})});a.displayName=`${ee}.CompoundTag`;a.__docgenInfo={description:`Compound tag component.

@see https://blueprintjs.com/docs/#core/components/compound-tag`,methods:[]};const oe=["large","rightIcon","children"],ue={title:"Core/Tag/CompoundTag",component:a,decorators:[te],tags:["autodocs"],args:{leftContent:"Key",children:"Value",intent:"none",size:"medium",icon:void 0,endIcon:void 0,fill:!1,active:!1,minimal:!1,round:!1,interactive:!1},argTypes:{intent:{control:"select",options:Object.values(l)},size:{control:"select",options:["medium","large"]},icon:{control:"text"},endIcon:{control:"text"},active:{control:"boolean"},fill:{control:"boolean"},interactive:{control:"boolean"},minimal:{control:"boolean"},round:{control:"boolean"},onClick:{action:"clicked"},onRemove:{action:"removed"},...oe.reduce((t,n)=>(t[n]={table:{disable:!0}},t),{})}},c={args:{leftContent:"Key",children:"Value"}},d={name:"Intent",argTypes:{intent:{table:{disable:!0}}},render:t=>e.jsx(o,{gap:2,flexWrap:"wrap",children:Object.values(l).filter(n=>n!=="none").map(n=>e.jsx(a,{...t,leftContent:"Status",intent:n,children:n.charAt(0).toUpperCase()+n.slice(1)},n))})},m={name:"Variant",argTypes:{minimal:{table:{disable:!0}}},render:t=>e.jsxs(o,{gap:4,children:[e.jsxs(o,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(R,{title:"Default"}),e.jsx(a,{...t,leftContent:"Key",minimal:!1,children:"Value"})]}),e.jsxs(o,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(R,{title:"Minimal"}),e.jsx(a,{...t,leftContent:"Key",minimal:!0,children:"Value"})]})]})},p={name:"Size",argTypes:{size:{table:{disable:!0}}},render:t=>e.jsxs(o,{gap:2,alignItems:"center",children:[e.jsx(a,{...t,leftContent:"Size",size:"medium",children:"Medium"}),e.jsx(a,{...t,leftContent:"Size",size:"large",children:"Large"})]})},u={name:"State",argTypes:{active:{table:{disable:!0}},interactive:{table:{disable:!0}}},render:function(n){return e.jsxs(o,{gap:2,flexWrap:"wrap",children:[e.jsx(a,{...n,leftContent:"Key",children:"Default"}),e.jsx(a,{...n,leftContent:"Key",active:!0,children:"Active"}),e.jsx(a,{...n,leftContent:"Key",interactive:!0,children:"Interactive"}),e.jsx(a,{...n,leftContent:"Key",onRemove:n.onRemove,children:"Removable"})]})}},g={name:"Icons",argTypes:{icon:{table:{disable:!0}},endIcon:{table:{disable:!0}}},render:t=>e.jsxs(o,{gap:2,flexWrap:"wrap",children:[e.jsx(a,{...t,leftContent:"City",icon:"globe",children:"London"}),e.jsx(a,{...t,leftContent:"City",endIcon:"map-marker",children:"Seattle"}),e.jsx(a,{...t,leftContent:"City",icon:"globe",endIcon:"map-marker",children:"New York"})]})},f={name:"Fill",argTypes:{fill:{table:{disable:!0}}},decorators:[t=>e.jsx("div",{style:{width:"400px"},children:e.jsx(t,{})})],render:t=>e.jsxs(o,{flexDirection:"column",gap:2,alignItems:"start",children:[e.jsx(a,{...t,leftContent:"Region",fill:!0,children:"Full Width"}),e.jsx(a,{...t,leftContent:"Region",fill:!1,children:"Auto Width"})]})},x={argTypes:{intent:{table:{disable:!0}},minimal:{table:{disable:!0}},interactive:{table:{disable:!0}},active:{table:{disable:!0}}},render:function(n){return e.jsx(o,{flexDirection:"column",gap:4,children:[!1,!0].map(s=>e.jsxs(o,{flexDirection:"column",gap:2,children:[e.jsx(R,{title:s?"Minimal":"Default"}),e.jsx(o,{gap:2,flexWrap:"wrap",children:Object.values(l).map(r=>e.jsx(a,{...n,leftContent:"Key",minimal:s,intent:r,children:r===l.NONE?"none":r},r))}),e.jsx(o,{gap:2,flexWrap:"wrap",children:Object.values(l).map(r=>e.jsx(a,{...n,leftContent:"Key",minimal:s,intent:r,active:!0,interactive:!0,children:r===l.NONE?"none":r},r))})]},String(s)))})}},A=["London","New York","San Francisco","Seattle"],C={render:function(n){const[s,r]=b.useState(A),h=b.useCallback(i=>()=>r(v=>v.filter(y=>y!==i)),[]),T=b.useCallback(()=>r(A),[]);return e.jsxs(o,{flexDirection:"column",gap:2,alignItems:"center",children:[e.jsx(o,{gap:2,flexWrap:"wrap",children:s.map(i=>e.jsx(a,{active:n.active,endIcon:n.endIcon,fill:n.fill,icon:n.icon,intent:n.intent,interactive:n.interactive,leftContent:"City",minimal:n.minimal,onRemove:n.onRemove!=null?h(i):void 0,round:n.round,size:n.size,children:i},i))}),s.length===0&&e.jsx(ne,{icon:"refresh",variant:"outlined",size:"small",text:"Reset tags",onClick:T})]})},args:{leftContent:"City",children:void 0,icon:"globe",endIcon:"map-marker",interactive:!0}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    leftContent: "Key",
    children: "Value"
  }
}`,...c.parameters?.docs?.source},description:{story:"A basic compound tag displaying a key-value pair.",...c.parameters?.docs?.description}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: "Intent",
  argTypes: {
    intent: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex gap={2} flexWrap="wrap">
            {Object.values(Intent).filter(i => i !== "none").map(intent => <CompoundTag key={intent} {...args} leftContent="Status" intent={intent}>
                        {intent.charAt(0).toUpperCase() + intent.slice(1)}
                    </CompoundTag>)}
        </Flex>
}`,...d.parameters?.docs?.source},description:{story:"Use the `intent` prop to apply a semantic color that conveys the purpose or status of the tag.",...d.parameters?.docs?.description}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  name: "Variant",
  argTypes: {
    minimal: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex gap={4}>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="Default" />
                <CompoundTag {...args} leftContent="Key" minimal={false}>
                    Value
                </CompoundTag>
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="Minimal" />
                <CompoundTag {...args} leftContent="Key" minimal={true}>
                    Value
                </CompoundTag>
            </Flex>
        </Flex>
}`,...m.parameters?.docs?.source},description:{story:"Use the `minimal` prop to render a tag with reduced visual weight, without a filled background.",...m.parameters?.docs?.description}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  name: "Size",
  argTypes: {
    size: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex gap={2} alignItems="center">
            <CompoundTag {...args} leftContent="Size" size="medium">
                Medium
            </CompoundTag>
            <CompoundTag {...args} leftContent="Size" size="large">
                Large
            </CompoundTag>
        </Flex>
}`,...p.parameters?.docs?.source},description:{story:'Use the `size` prop to adjust the tag dimensions. CompoundTag supports `"medium"` (default) and `"large"`.',...p.parameters?.docs?.description}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  name: "State",
  argTypes: {
    active: {
      table: {
        disable: true
      }
    },
    interactive: {
      table: {
        disable: true
      }
    }
  },
  render: function Render(args) {
    return <Flex gap={2} flexWrap="wrap">
                <CompoundTag {...args} leftContent="Key">
                    Default
                </CompoundTag>
                <CompoundTag {...args} leftContent="Key" active={true}>
                    Active
                </CompoundTag>
                <CompoundTag {...args} leftContent="Key" interactive={true}>
                    Interactive
                </CompoundTag>
                <CompoundTag {...args} leftContent="Key" onRemove={args.onRemove}>
                    Removable
                </CompoundTag>
            </Flex>;
  }
}`,...u.parameters?.docs?.source},description:{story:"CompoundTags support `active` and `interactive` states, and can be made removable with the `onRemove` prop.",...u.parameters?.docs?.description}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: "Icons",
  argTypes: {
    icon: {
      table: {
        disable: true
      }
    },
    endIcon: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex gap={2} flexWrap="wrap">
            <CompoundTag {...args} leftContent="City" icon="globe">
                London
            </CompoundTag>
            <CompoundTag {...args} leftContent="City" endIcon="map-marker">
                Seattle
            </CompoundTag>
            <CompoundTag {...args} leftContent="City" icon="globe" endIcon="map-marker">
                New York
            </CompoundTag>
        </Flex>
}`,...g.parameters?.docs?.source},description:{story:"Use `icon` and `endIcon` props to render icons before the left content or after the right content.",...g.parameters?.docs?.description}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: "Fill",
  argTypes: {
    fill: {
      table: {
        disable: true
      }
    }
  },
  decorators: [Story => <div style={{
    width: "400px"
  }}>
                <Story />
            </div>],
  render: args => <Flex flexDirection="column" gap={2} alignItems="start">
            <CompoundTag {...args} leftContent="Region" fill={true}>
                Full Width
            </CompoundTag>
            <CompoundTag {...args} leftContent="Region" fill={false}>
                Auto Width
            </CompoundTag>
        </Flex>
}`,...f.parameters?.docs?.source},description:{story:"Use the `fill` prop to make the tag expand to the full width of its container.",...f.parameters?.docs?.description}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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
    },
    interactive: {
      table: {
        disable: true
      }
    },
    active: {
      table: {
        disable: true
      }
    }
  },
  render: function Render(args) {
    return <Flex flexDirection="column" gap={4}>
                {[false, true].map(minimal => <Flex key={String(minimal)} flexDirection="column" gap={2}>
                        <StoryLabel title={minimal ? "Minimal" : "Default"} />
                        <Flex gap={2} flexWrap="wrap">
                            {Object.values(Intent).map(intent => <CompoundTag key={intent} {...args} leftContent="Key" minimal={minimal} intent={intent}>
                                    {intent === Intent.NONE ? "none" : intent}
                                </CompoundTag>)}
                        </Flex>
                        <Flex gap={2} flexWrap="wrap">
                            {Object.values(Intent).map(intent => <CompoundTag key={intent} {...args} leftContent="Key" minimal={minimal} intent={intent} active={true} interactive={true}>
                                    {intent === Intent.NONE ? "none" : intent}
                                </CompoundTag>)}
                        </Flex>
                    </Flex>)}
            </Flex>;
  }
}`,...x.parameters?.docs?.source},description:{story:"All intents across default and minimal variants, with all states (default, active, interactive, removable).",...x.parameters?.docs?.description}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: function Render(args) {
    const [tags, setTags] = useState(PLAYGROUND_INITIAL_TAGS);
    const handleRemove = useCallback((tag: string) => () => setTags(prev => prev.filter(t => t !== tag)), []);
    const handleReset = useCallback(() => setTags(PLAYGROUND_INITIAL_TAGS), []);
    return <Flex flexDirection="column" gap={2} alignItems="center">
                <Flex gap={2} flexWrap="wrap">
                    {tags.map(tag => <CompoundTag key={tag} active={args.active} endIcon={args.endIcon} fill={args.fill} icon={args.icon} intent={args.intent} interactive={args.interactive} leftContent="City" minimal={args.minimal} onRemove={args.onRemove != null ? handleRemove(tag) : undefined} round={args.round} size={args.size}>
                            {tag}
                        </CompoundTag>)}
                </Flex>
                {tags.length === 0 && <Button icon="refresh" variant="outlined" size="small" text="Reset tags" onClick={handleReset} />}
            </Flex>;
  },
  args: {
    leftContent: "City",
    children: undefined,
    icon: "globe",
    endIcon: "map-marker",
    interactive: true
  }
}`,...C.parameters?.docs?.source}}};const ge=["Basic","IntentExample","VariantExample","SizeExample","StateExample","IconExample","FillExample","AllIntentsAllVariants","Playground"];export{x as AllIntentsAllVariants,c as Basic,f as FillExample,g as IconExample,d as IntentExample,C as Playground,p as SizeExample,u as StateExample,m as VariantExample,ge as __namedExportsOrder,ue as default};
