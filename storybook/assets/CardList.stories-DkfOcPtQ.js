import{r as f,e as h,aU as I,ab as j,aV as S,j as e,g as L}from"./iframe-6KWIKMhT.js";import{s as y,S as x}from"./common-CGlRPlLv.js";import{F as d}from"./flex-CfNrUc6L.js";import{C as r,E as v}from"./card-C6ssIv7b.js";import"./preload-helper-PPVm8Dsz.js";const n=f.forwardRef((t,a)=>{const{bordered:c=!0,className:C,children:u,compact:g=!1,...s}=t,m=h(C,I,{[S]:c,[j]:g});return e.jsx(r,{role:"list",elevation:v.ZERO,className:m,...s,ref:a,children:u})});n.displayName=`${L}.CardList`;n.__docgenInfo={description:"",methods:[]};const{useArgs:D,useCallback:F}=__STORYBOOK_MODULE_PREVIEW_API__,_={title:"Core/CardList",component:n,decorators:[y],tags:["autodocs"],args:{bordered:!0,compact:!1},argTypes:{bordered:{control:"boolean"},compact:{control:"boolean"}}},b=["Apples","Oranges","Bananas","Grapes","Mangoes"],o={render:t=>e.jsx(n,{...t,children:b.map(a=>e.jsx(r,{children:a},a))})},l={name:"State",argTypes:{bordered:{table:{disable:!0}},compact:{table:{disable:!0}}},render:t=>e.jsxs(d,{gap:6,children:[e.jsxs(d,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(x,{title:"Bordered"}),e.jsxs(n,{...t,bordered:!0,compact:!1,children:[e.jsx(r,{children:"Plain"}),e.jsx(r,{interactive:!0,children:"Interactive"}),e.jsx(r,{selected:!0,children:"Selected"})]})]}),e.jsxs(d,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(x,{title:"Compact"}),e.jsxs(n,{...t,bordered:!0,compact:!0,children:[e.jsx(r,{children:"Plain"}),e.jsx(r,{interactive:!0,children:"Interactive"}),e.jsx(r,{selected:!0,children:"Selected"})]})]}),e.jsxs(d,{flexDirection:"column",gap:1,alignItems:"center",children:[e.jsx(x,{title:"Not bordered"}),e.jsxs(n,{...t,bordered:!1,compact:!1,children:[e.jsx(r,{children:"Plain"}),e.jsx(r,{interactive:!0,children:"Interactive"}),e.jsx(r,{selected:!0,children:"Selected"})]})]})]})},i={argTypes:{bordered:{table:{disable:!0}},compact:{table:{disable:!0}}},render:()=>e.jsx(d,{flexDirection:"column",gap:6,children:[!1,!0].map(t=>e.jsxs(d,{flexDirection:"column",gap:2,children:[e.jsx(x,{title:t?"Compact":"Default"}),e.jsx(d,{gap:4,children:[!0,!1].map(a=>e.jsxs(n,{bordered:a,compact:t,children:[e.jsx(r,{children:"Plain"}),e.jsx(r,{interactive:!0,children:"Interactive"}),e.jsx(r,{selected:!0,children:"Selected"})]},String(a)))})]},String(t)))})},p={args:{selectedIndex:-1},argTypes:{selectedIndex:{control:"number",description:"Index of the currently selected card (-1 for none)"}},render:function(a){const{selectedIndex:c,...C}=a,[,u]=D(),g=F(s=>()=>{u({selectedIndex:c===s?-1:s})},[c,u]);return e.jsx(n,{...C,children:b.map((s,m)=>e.jsx(r,{interactive:!0,selected:c===m,onClick:g(m),children:s},s))})}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: args => <CardList {...args}>
            {FRUITS.map(fruit => <Card key={fruit}>{fruit}</Card>)}
        </CardList>
}`,...o.parameters?.docs?.source},description:{story:"A basic CardList with simple Card children.",...o.parameters?.docs?.description}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  name: "State",
  argTypes: {
    bordered: {
      table: {
        disable: true
      }
    },
    compact: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex gap={6}>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="Bordered" />
                <CardList {...args} bordered={true} compact={false}>
                    <Card>Plain</Card>
                    <Card interactive={true}>Interactive</Card>
                    <Card selected={true}>Selected</Card>
                </CardList>
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="Compact" />
                <CardList {...args} bordered={true} compact={true}>
                    <Card>Plain</Card>
                    <Card interactive={true}>Interactive</Card>
                    <Card selected={true}>Selected</Card>
                </CardList>
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="Not bordered" />
                <CardList {...args} bordered={false} compact={false}>
                    <Card>Plain</Card>
                    <Card interactive={true}>Interactive</Card>
                    <Card selected={true}>Selected</Card>
                </CardList>
            </Flex>
        </Flex>
}`,...l.parameters?.docs?.source},description:{story:"CardList supports `bordered`, `compact`, `interactive`, and `selected` states across its Card children.",...l.parameters?.docs?.description}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  argTypes: {
    bordered: {
      table: {
        disable: true
      }
    },
    compact: {
      table: {
        disable: true
      }
    }
  },
  render: () => <Flex flexDirection="column" gap={6}>
            {[false, true].map(compact => <Flex key={String(compact)} flexDirection="column" gap={2}>
                    <StoryLabel title={compact ? "Compact" : "Default"} />
                    <Flex gap={4}>
                        {[true, false].map(bordered => <CardList key={String(bordered)} bordered={bordered} compact={compact}>
                                <Card>Plain</Card>
                                <Card interactive={true}>Interactive</Card>
                                <Card selected={true}>Selected</Card>
                            </CardList>)}
                    </Flex>
                </Flex>)}
        </Flex>
}`,...i.parameters?.docs?.source},description:{story:"All configurations: bordered vs non-bordered, default vs compact, with interactive and selected states.",...i.parameters?.docs?.description}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    selectedIndex: -1
  },
  argTypes: {
    selectedIndex: {
      control: "number",
      description: "Index of the currently selected card (-1 for none)"
    }
  },
  render: function Render(args) {
    const {
      selectedIndex,
      ...cardListProps
    } = args;
    const [, updateArgs] = useArgs();
    const handleCardClick = useCallback((index: number) => () => {
      updateArgs({
        selectedIndex: selectedIndex === index ? -1 : index
      });
    }, [selectedIndex, updateArgs]);
    return <CardList {...cardListProps}>
                {FRUITS.map((fruit, i) => <Card key={fruit} interactive={true} selected={selectedIndex === i} onClick={handleCardClick(i)}>
                        {fruit}
                    </Card>)}
            </CardList>;
  }
}`,...p.parameters?.docs?.source},description:{story:`Interactive playground with all props exposed via Storybook controls.
Click a card to select it. Click again to deselect.`,...p.parameters?.docs?.description}}};const T=["Default","StateExample","AllConfigurations","Playground"];export{i as AllConfigurations,o as Default,p as Playground,l as StateExample,T as __namedExportsOrder,_ as default};
