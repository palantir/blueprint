import{r as p,j as n,B as c,b as u,C as d}from"./iframe-6KWIKMhT.js";import{F as i}from"./flex-CfNrUc6L.js";import{C as l}from"./collapse-ZAjSlNXb.js";import"./preload-helper-PPVm8Dsz.js";const{useArgs:g}=__STORYBOOK_MODULE_PREVIEW_API__,h=n.jsx("div",{style:{padding:12,background:"var(--pt-app-background-color)",border:"1px solid var(--gray3)"},children:n.jsx("p",{style:{margin:0},children:"This is an example of collapsible content. It can contain any valid React elements, including paragraphs, lists, forms, or other components."})}),y={title:"Core/Collapse",component:l,decorators:[r=>n.jsx(i,{flexDirection:"column",gap:2,style:{minWidth:"400px",maxWidth:"500px"},children:n.jsx(r,{})})],tags:["autodocs"],args:{isOpen:!1,keepChildrenMounted:!1,transitionDuration:200},argTypes:{isOpen:{control:"boolean"},keepChildrenMounted:{control:"boolean"},transitionDuration:{control:"number"},component:{control:"text"}}},t={args:{isOpen:!0},argTypes:{component:{table:{disable:!0}}},render:function(e){const[,o]=g(),a=p.useCallback(()=>o({isOpen:!e.isOpen}),[e.isOpen,o]);return n.jsxs(i,{flexDirection:"column",gap:2,children:[n.jsx(c,{text:e.isOpen?"Hide content":"Show content",onClick:a}),n.jsx(l,{...e,children:h})]})}},s={args:{isOpen:!1},argTypes:{component:{table:{disable:!0}}},render:function(e){const[,o]=g(),a=p.useCallback(()=>o({isOpen:!e.isOpen}),[e.isOpen,o]);return n.jsxs(i,{flexDirection:"column",gap:2,style:{minWidth:400},children:[n.jsx(c,{text:e.isOpen?"Collapse":"Expand",onClick:a,icon:"exchange"}),n.jsx(l,{...e,children:n.jsxs("div",{style:{padding:16,background:"var(--pt-app-background-color)",border:"1px solid var(--gray3)",borderRadius:4},children:[n.jsx(u,{style:{marginTop:0},children:"Collapsible Content"}),n.jsx("p",{children:"This content is revealed and hidden with a smooth sliding animation. Toggle the controls in the Storybook panel to adjust the component behavior."}),n.jsxs("p",{style:{marginBottom:0},children:["Try adjusting ",n.jsx(d,{children:"transitionDuration"})," and ",n.jsx(d,{children:"keepChildrenMounted"})," to see their effects."]})]})})]})}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    isOpen: true
  },
  argTypes: {
    component: {
      table: {
        disable: true
      }
    }
  },
  render: function RenderDefault(args) {
    const [, updateArgs] = useArgs();
    const handleToggle = useCallback(() => updateArgs({
      isOpen: !args.isOpen
    }), [args.isOpen, updateArgs]);
    return <Flex flexDirection="column" gap={2}>
                <Button text={args.isOpen ? "Hide content" : "Show content"} onClick={handleToggle} />
                <Collapse {...args}>{sampleContent}</Collapse>
            </Flex>;
  }
}`,...t.parameters?.docs?.source},description:{story:"A basic collapse that reveals and hides content with a smooth sliding animation.\nUse the `isOpen` control to toggle visibility.",...t.parameters?.docs?.description}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    isOpen: false
  },
  argTypes: {
    component: {
      table: {
        disable: true
      }
    }
  },
  render: function RenderPlayground(args) {
    const [, updateArgs] = useArgs();
    const handleToggle = useCallback(() => updateArgs({
      isOpen: !args.isOpen
    }), [args.isOpen, updateArgs]);
    return <Flex flexDirection="column" gap={2} style={{
      minWidth: 400
    }}>
                <Button text={args.isOpen ? "Collapse" : "Expand"} onClick={handleToggle} icon="exchange" />
                <Collapse {...args}>
                    <div style={{
          padding: 16,
          background: "var(--pt-app-background-color)",
          border: "1px solid var(--gray3)",
          borderRadius: 4
        }}>
                        <H4 style={{
            marginTop: 0
          }}>Collapsible Content</H4>
                        <p>
                            This content is revealed and hidden with a smooth sliding animation. Toggle the controls in
                            the Storybook panel to adjust the component behavior.
                        </p>
                        <p style={{
            marginBottom: 0
          }}>
                            Try adjusting <Code>transitionDuration</Code> and <Code>keepChildrenMounted</Code> to see
                            their effects.
                        </p>
                    </div>
                </Collapse>
            </Flex>;
  }
}`,...s.parameters?.docs?.source},description:{story:"Interactive playground with all props toggleable via Storybook controls.",...s.parameters?.docs?.description}}};const O=["Default","Playground"];export{t as Default,s as Playground,O as __namedExportsOrder,y as default};
