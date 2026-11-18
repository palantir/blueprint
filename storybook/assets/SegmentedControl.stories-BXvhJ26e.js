import{I as o,j as e,r as S}from"./iframe-6KWIKMhT.js";import{s as D,S as a}from"./common-CGlRPlLv.js";import{F as t}from"./flex-CfNrUc6L.js";import{S as l}from"./segmentedControl-C9PUGiG2.js";import{S as f}from"./size-c484FBD7.js";import"./preload-helper-PPVm8Dsz.js";const I=[{label:"List",value:"list"},{label:"Grid",value:"grid"},{label:"Gallery",value:"gallery"}],y=[{label:"List",value:"list",icon:"list"},{label:"Grid",value:"grid",icon:"grid-view"},{label:"Gallery",value:"gallery",icon:"media"}],C=["large","small"],E={title:"Core/Form/Controls/SegmentedControl",component:l,decorators:[D],tags:["autodocs"],args:{options:I,defaultValue:"list",intent:o.NONE,size:"medium",disabled:!1,fill:!1,inline:!1},argTypes:{intent:{control:"select",options:[o.NONE,o.PRIMARY]},size:{control:"select",options:Object.values(f)},disabled:{control:"boolean"},fill:{control:"boolean"},inline:{control:"boolean"},onValueChange:{action:"valueChanged"},...C.reduce((n,r)=>(n[r]={table:{disable:!0}},n),{})}},i={},c={name:"Intent",argTypes:{intent:{table:{disable:!0}}},render:n=>e.jsxs(t,{flexDirection:"column",gap:3,children:[e.jsxs(t,{flexDirection:"column",gap:1,children:[e.jsx(a,{title:"None"}),e.jsx(l,{...n,intent:o.NONE})]}),e.jsxs(t,{flexDirection:"column",gap:1,children:[e.jsx(a,{title:"Primary"}),e.jsx(l,{...n,intent:o.PRIMARY})]})]})},d={name:"Size",argTypes:{size:{table:{disable:!0}}},render:n=>e.jsx(t,{flexDirection:"column",gap:3,alignItems:"center",children:Object.values(f).map(r=>e.jsxs(t,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(a,{title:r}),e.jsx(l,{...n,size:r})]},r))})},p={name:"State",argTypes:{disabled:{table:{disable:!0}}},render:n=>e.jsxs(t,{flexDirection:"column",gap:3,children:[e.jsxs(t,{flexDirection:"column",gap:1,children:[e.jsx(a,{title:"Default"}),e.jsx(l,{...n})]}),e.jsxs(t,{flexDirection:"column",gap:1,children:[e.jsx(a,{title:"Disabled"}),e.jsx(l,{...n,disabled:!0})]})]})},m={name:"Fill",argTypes:{fill:{table:{disable:!0}}},decorators:[n=>e.jsx("div",{style:{width:"500px"},children:e.jsx(n,{})})],render:n=>e.jsxs(t,{flexDirection:"column",gap:3,children:[e.jsxs(t,{flexDirection:"column",gap:1,children:[e.jsx(a,{title:"Fill"}),e.jsx(l,{...n,fill:!0})]}),e.jsxs(t,{flexDirection:"column",gap:1,children:[e.jsx(a,{title:"Auto Width"}),e.jsx(l,{...n,fill:!1})]})]})},u={name:"With Icons",args:{options:y}},x={name:"Aria Labels",render:n=>e.jsxs(t,{flexDirection:"column",gap:3,children:[e.jsxs(t,{flexDirection:"column",gap:1,children:[e.jsx(a,{title:'role="radiogroup" (default) + aria-label'}),e.jsx(l,{...n,"aria-label":"View mode"})]}),e.jsxs(t,{flexDirection:"column",gap:1,children:[e.jsx(a,{title:'role="toolbar" + aria-label'}),e.jsx(l,{...n,role:"toolbar","aria-label":"View mode toolbar"})]}),e.jsxs(t,{flexDirection:"column",gap:1,children:[e.jsx(a,{title:'role="group" + aria-label'}),e.jsx(l,{...n,role:"group","aria-label":"View mode group"})]})]})},g={name:"All Intents & Sizes",argTypes:{intent:{table:{disable:!0}},size:{table:{disable:!0}},disabled:{table:{disable:!0}}},render:n=>e.jsx(t,{flexDirection:"column",gap:4,children:[o.NONE,o.PRIMARY].map(r=>e.jsxs(t,{flexDirection:"column",gap:2,children:[e.jsx(a,{title:`Intent: ${r}`}),Object.values(f).map(s=>e.jsx(l,{...n,intent:r,size:s},s)),e.jsx(l,{...n,intent:r,disabled:!0})]},r))})},b={render:function(r){const[s,h]=S.useState("list"),j=S.useCallback(F=>{h(F)},[]);return e.jsxs(t,{flexDirection:"column",gap:3,alignItems:"center",children:[e.jsx(l,{...r,options:y,value:s,onValueChange:j}),e.jsx(a,{title:`Selected: ${s}`})]})}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:"{}",...i.parameters?.docs?.source},description:{story:"A basic segmented control with default styling.",...i.parameters?.docs?.description}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: "Intent",
  argTypes: {
    intent: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="column" gap={3}>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title="None" />
                <SegmentedControl {...args} intent={Intent.NONE} />
            </Flex>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title="Primary" />
                <SegmentedControl {...args} intent={Intent.PRIMARY} />
            </Flex>
        </Flex>
}`,...c.parameters?.docs?.source},description:{story:'Use the `intent` prop to apply a semantic color to the selected segment.\nSegmentedControl supports `"none"` (default) and `"primary"`.',...c.parameters?.docs?.description}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: "Size",
  argTypes: {
    size: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="column" gap={3} alignItems="center">
            {Object.values(Size).map(size => <Flex key={size} flexDirection="column" gap={1} alignItems="center">
                    <StoryLabel title={size} />
                    <SegmentedControl {...args} size={size} />
                </Flex>)}
        </Flex>
}`,...d.parameters?.docs?.source},description:{story:"Use the `size` prop to adjust the control dimensions.",...d.parameters?.docs?.description}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  name: "State",
  argTypes: {
    disabled: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="column" gap={3}>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title="Default" />
                <SegmentedControl {...args} />
            </Flex>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title="Disabled" />
                <SegmentedControl {...args} disabled={true} />
            </Flex>
        </Flex>
}`,...p.parameters?.docs?.source},description:{story:"The disabled state prevents user interaction with the control.",...p.parameters?.docs?.description}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  name: "Fill",
  argTypes: {
    fill: {
      table: {
        disable: true
      }
    }
  },
  decorators: [Story => <div style={{
    width: "500px"
  }}>
                <Story />
            </div>],
  render: args => <Flex flexDirection="column" gap={3}>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title="Fill" />
                <SegmentedControl {...args} fill={true} />
            </Flex>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title="Auto Width" />
                <SegmentedControl {...args} fill={false} />
            </Flex>
        </Flex>
}`,...m.parameters?.docs?.source},description:{story:"Use the `fill` prop to make the control expand to the full width of its container.",...m.parameters?.docs?.description}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  name: "With Icons",
  args: {
    options: ICON_OPTIONS
  }
}`,...u.parameters?.docs?.source},description:{story:"Each option can include an `icon` prop to display an icon alongside the label.",...u.parameters?.docs?.description}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: "Aria Labels",
  render: args => <Flex flexDirection="column" gap={3}>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title={'role="radiogroup" (default) + aria-label'} />
                <SegmentedControl {...args} aria-label="View mode" />
            </Flex>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title={'role="toolbar" + aria-label'} />
                <SegmentedControl {...args} role="toolbar" aria-label="View mode toolbar" />
            </Flex>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title={'role="group" + aria-label'} />
                <SegmentedControl {...args} role="group" aria-label="View mode group" />
            </Flex>
        </Flex>
}`,...x.parameters?.docs?.source},description:{story:'Use `aria-label` on the container and `role` to control the ARIA semantics.\nThe component supports `"radiogroup"` (default), `"group"`, `"toolbar"`, and `"menu"` roles.',...x.parameters?.docs?.description}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: "All Intents & Sizes",
  argTypes: {
    intent: {
      table: {
        disable: true
      }
    },
    size: {
      table: {
        disable: true
      }
    },
    disabled: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="column" gap={4}>
            {[Intent.NONE, Intent.PRIMARY].map(intent => <Flex key={intent} flexDirection="column" gap={2}>
                    <StoryLabel title={\`Intent: \${intent}\`} />
                    {Object.values(Size).map(size => <SegmentedControl key={size} {...args} intent={intent} size={size} />)}
                    <SegmentedControl {...args} intent={intent} disabled={true} />
                </Flex>)}
        </Flex>
}`,...g.parameters?.docs?.source},description:{story:"All intents across all sizes and states.",...g.parameters?.docs?.description}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: function Render(args) {
    const [value, setValue] = useState("list");
    const handleValueChange = useCallback((newValue: string) => {
      setValue(newValue);
    }, []);
    return <Flex flexDirection="column" gap={3} alignItems="center">
                <SegmentedControl {...args} options={ICON_OPTIONS} value={value} onValueChange={handleValueChange} />
                <StoryLabel title={\`Selected: \${value}\`} />
            </Flex>;
  }
}`,...b.parameters?.docs?.source},description:{story:"Interactive playground demonstrating controlled value state.",...b.parameters?.docs?.description}}};const T=["Default","IntentExample","SizeExample","StateExample","FillExample","WithIcons","AriaLabels","AllIntentsAllSizes","Playground"];export{g as AllIntentsAllSizes,x as AriaLabels,i as Default,m as FillExample,c as IntentExample,b as Playground,d as SizeExample,p as StateExample,u as WithIcons,T as __namedExportsOrder,E as default};
