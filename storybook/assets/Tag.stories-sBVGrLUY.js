import{j as e,I as l,r as v}from"./iframe-6KWIKMhT.js";import{s as S,S as T}from"./common-CGlRPlLv.js";import{F as r}from"./flex-CfNrUc6L.js";import{T as a}from"./tag-DnuMuEBY.js";import"./preload-helper-PPVm8Dsz.js";import"./tagRemoveButton-DdGBep5P.js";import"./x-small-DmUwHyi-.js";import"./functionUtils-BGFdVicR.js";const R=["large","rightIcon","children"],w={title:"Core/Tag/Tag",component:a,decorators:[S],tags:["autodocs"],args:{children:"Tag",intent:"none",size:"medium",icon:void 0,endIcon:void 0,fill:!1,active:!1,minimal:!1,round:!1,interactive:!1},argTypes:{intent:{control:"select",options:Object.values(l)},size:{control:"select",options:["medium","large"]},icon:{control:"text"},endIcon:{control:"text"},active:{control:"boolean"},fill:{control:"boolean"},interactive:{control:"boolean"},minimal:{control:"boolean"},multiline:{control:"boolean"},round:{control:"boolean"},onClick:{action:"clicked"},onRemove:{action:"removed"},...R.reduce((t,n)=>(t[n]={table:{disable:!0}},t),{})}},c={args:{children:"Tag"}},d={name:"Intent",argTypes:{intent:{table:{disable:!0}}},render:t=>e.jsx(r,{gap:2,children:Object.values(l).filter(n=>n!=="none").map(n=>e.jsx(a,{...t,intent:n,children:n.charAt(0).toUpperCase()+n.slice(1)},n))})},m={name:"Variant",argTypes:{minimal:{table:{disable:!0}}},render:t=>e.jsxs(r,{gap:4,children:[e.jsxs(r,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(T,{title:"Default"}),e.jsx(a,{...t,minimal:!1,children:"Tag"})]}),e.jsxs(r,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(T,{title:"Minimal"}),e.jsx(a,{...t,minimal:!0,children:"Tag"})]})]})},p={name:"Size",argTypes:{size:{table:{disable:!0}}},render:t=>e.jsxs(r,{gap:2,alignItems:"center",children:[e.jsx(a,{...t,size:"medium",children:"Medium"}),e.jsx(a,{...t,size:"large",children:"Large"})]})},g={name:"State",argTypes:{active:{table:{disable:!0}},interactive:{table:{disable:!0}}},render:function(n){return e.jsxs(r,{gap:2,children:[e.jsx(a,{...n,children:"Default"}),e.jsx(a,{...n,active:!0,children:"Active"}),e.jsx(a,{...n,interactive:!0,children:"Interactive"}),e.jsx(a,{...n,onRemove:n.onRemove,children:"Removable"})]})}},u={name:"Icons",argTypes:{icon:{table:{disable:!0}},endIcon:{table:{disable:!0}}},render:t=>e.jsxs(r,{gap:2,children:[e.jsx(a,{...t,icon:"home",children:"Start icon"}),e.jsx(a,{...t,endIcon:"map",children:"End icon"}),e.jsx(a,{...t,icon:"home",endIcon:"map",children:"Both"})]})},x={name:"Fill",argTypes:{fill:{table:{disable:!0}}},decorators:[t=>e.jsx("div",{style:{width:"400px"},children:e.jsx(t,{})})],render:t=>e.jsxs(r,{flexDirection:"column",gap:2,alignItems:"start",children:[e.jsx(a,{...t,fill:!0,children:"Full Width"}),e.jsx(a,{...t,fill:!1,children:"Auto Width"})]})},b={argTypes:{intent:{table:{disable:!0}},minimal:{table:{disable:!0}},interactive:{table:{disable:!0}},active:{table:{disable:!0}}},render:function(n){return e.jsx(r,{flexDirection:"column",gap:4,children:[!1,!0].map(s=>e.jsxs(r,{flexDirection:"column",gap:2,children:[e.jsx(T,{title:s?"Minimal":"Default"}),e.jsx(r,{gap:2,children:Object.values(l).map(i=>e.jsx(a,{...n,minimal:s,intent:i,children:i===l.NONE?"none":i},i))}),e.jsx(r,{gap:2,children:Object.values(l).map(i=>e.jsx(a,{...n,minimal:s,intent:i,active:!0,interactive:!0,children:i===l.NONE?"none":i},i))})]},String(s)))})}},f=["London","New York","San Francisco","Seattle"],h={render:function(n){const[s,i]=v.useState(f),I=v.useCallback(o=>()=>i(y=>y.filter(F=>F!==o)),[]),j=v.useCallback(()=>i(f),[]);return e.jsxs(r,{flexDirection:"column",gap:2,alignItems:"center",children:[e.jsx(r,{gap:2,flexWrap:"wrap",children:s.map(o=>e.jsx(a,{active:n.active,endIcon:n.endIcon,fill:n.fill,icon:n.icon,intent:n.intent,interactive:n.interactive,minimal:n.minimal,onRemove:n.onRemove!=null?I(o):void 0,round:n.round,size:n.size,children:o},o))}),s.length===0&&e.jsx("button",{type:"button",onClick:j,children:"Reset tags"})]})},args:{children:void 0,icon:"home",endIcon:"map",interactive:!0}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Tag"
  }
}`,...c.parameters?.docs?.source},description:{story:"A basic tag with default styling.",...c.parameters?.docs?.description}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: "Intent",
  argTypes: {
    intent: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex gap={2}>
            {Object.values(Intent).filter(i => i !== "none").map(intent => <Tag key={intent} {...args} intent={intent}>
                        {intent.charAt(0).toUpperCase() + intent.slice(1)}
                    </Tag>)}
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
                <Tag {...args} minimal={false}>
                    Tag
                </Tag>
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="Minimal" />
                <Tag {...args} minimal={true}>
                    Tag
                </Tag>
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
            <Tag {...args} size="medium">
                Medium
            </Tag>
            <Tag {...args} size="large">
                Large
            </Tag>
        </Flex>
}`,...p.parameters?.docs?.source},description:{story:'Use the `size` prop to adjust the tag dimensions. Tag supports `"medium"` (default) and `"large"`.',...p.parameters?.docs?.description}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
    return <Flex gap={2}>
                <Tag {...args}>Default</Tag>
                <Tag {...args} active={true}>
                    Active
                </Tag>
                <Tag {...args} interactive={true}>
                    Interactive
                </Tag>
                <Tag {...args} onRemove={args.onRemove}>
                    Removable
                </Tag>
            </Flex>;
  }
}`,...g.parameters?.docs?.source},description:{story:"Tags support `active` and `interactive` states, and can be made removable with the `onRemove` prop.",...g.parameters?.docs?.description}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
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
  render: args => <Flex gap={2}>
            <Tag {...args} icon="home">
                Start icon
            </Tag>
            <Tag {...args} endIcon="map">
                End icon
            </Tag>
            <Tag {...args} icon="home" endIcon="map">
                Both
            </Tag>
        </Flex>
}`,...u.parameters?.docs?.source},description:{story:"Use `icon` and `endIcon` props to render icons alongside the tag content.",...u.parameters?.docs?.description}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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
            <Tag {...args} fill={true}>
                Full Width
            </Tag>
            <Tag {...args} fill={false}>
                Auto Width
            </Tag>
        </Flex>
}`,...x.parameters?.docs?.source},description:{story:"Use the `fill` prop to make the tag expand to the full width of its container.",...x.parameters?.docs?.description}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
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
                        <Flex gap={2}>
                            {Object.values(Intent).map(intent => <Tag key={intent} {...args} minimal={minimal} intent={intent}>
                                    {intent === Intent.NONE ? "none" : intent}
                                </Tag>)}
                        </Flex>
                        <Flex gap={2}>
                            {Object.values(Intent).map(intent => <Tag key={intent} {...args} minimal={minimal} intent={intent} active={true} interactive={true}>
                                    {intent === Intent.NONE ? "none" : intent}
                                </Tag>)}
                        </Flex>
                    </Flex>)}
            </Flex>;
  }
}`,...b.parameters?.docs?.source},description:{story:"All intents across default and minimal variants, with all states (default, active, interactive, removable).",...b.parameters?.docs?.description}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: function Render(args) {
    const [tags, setTags] = useState(PLAYGROUND_INITIAL_TAGS);
    const handleRemove = useCallback((tag: string) => () => setTags(prev => prev.filter(t => t !== tag)), []);
    const handleReset = useCallback(() => setTags(PLAYGROUND_INITIAL_TAGS), []);
    return <Flex flexDirection="column" gap={2} alignItems="center">
                <Flex gap={2} flexWrap="wrap">
                    {tags.map(tag => <Tag key={tag} active={args.active} endIcon={args.endIcon} fill={args.fill} icon={args.icon} intent={args.intent} interactive={args.interactive} minimal={args.minimal} onRemove={args.onRemove != null ? handleRemove(tag) : undefined} round={args.round} size={args.size}>
                            {tag}
                        </Tag>)}
                </Flex>
                {tags.length === 0 && <button type="button" onClick={handleReset}>
                        Reset tags
                    </button>}
            </Flex>;
  },
  args: {
    children: undefined,
    icon: "home",
    endIcon: "map",
    interactive: true
  }
}`,...h.parameters?.docs?.source}}};const C=["Default","IntentExample","VariantExample","SizeExample","StateExample","IconExample","FillExample","AllIntentsAllVariants","Playground"];export{b as AllIntentsAllVariants,c as Default,x as FillExample,u as IconExample,d as IntentExample,h as Playground,p as SizeExample,g as StateExample,m as VariantExample,C as __namedExportsOrder,w as default};
