import{K as l,j as e}from"./iframe-6KWIKMhT.js";import{s as y,S as p,D as b}from"./common-CGlRPlLv.js";import{F as g}from"./flex-CfNrUc6L.js";import"./preload-helper-PPVm8Dsz.js";const E={title:"Core/Hotkeys/KeyComboTag",component:l,decorators:[y],args:{minimal:!1},argTypes:{minimal:{control:"boolean"}}},o={name:"Command",args:{combo:"cmd + s"}},r={name:"Shift",args:{combo:"shift + a"}},s={name:"Space",args:{combo:"space"}},n={name:"Control",args:{combo:"ctrl + c"}},m={name:"Option",args:{combo:"option + delete"}},u=["cmd + s","shift + a","ctrl + c","option + delete","space","cmd + shift + p"],t={name:"Minimal",argTypes:{minimal:{table:{disable:!0}},combo:{table:{disable:!0}}},render:()=>e.jsx(g,{flexWrap:"wrap",gap:2,children:u.map(a=>e.jsxs("div",{style:{width:100},children:[e.jsx(p,{title:a}),e.jsx(b,{width:100,children:e.jsx(l,{combo:a,minimal:!0})})]},a))})},x=["cmd + s","cmd + shift + p","cmd + del","alt + tab","option + delete","ctrl + z","shift + enter"],i={name:"Common key combos",args:{minimal:!1},render:a=>e.jsx(g,{flexDirection:"row",gap:2,children:x.map(d=>e.jsxs("div",{children:[e.jsx(p,{title:d}),e.jsx(b,{width:160,children:e.jsx(l,{combo:d,minimal:a.minimal})})]},d))})},c={name:"Playground",argTypes:{combo:{table:{disable:!1}}},args:{combo:"cmd + shift + p",minimal:!1}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: "Command",
  args: {
    combo: "cmd + s"
  }
}`,...o.parameters?.docs?.source},description:{story:"Command/meta modifier key.",...o.parameters?.docs?.description}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  name: "Shift",
  args: {
    combo: "shift + a"
  }
}`,...r.parameters?.docs?.source},description:{story:"Shift modifier key.",...r.parameters?.docs?.description}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  name: "Space",
  args: {
    combo: "space"
  }
}`,...s.parameters?.docs?.source},description:{story:"Space key with special icon.",...s.parameters?.docs?.description}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  name: "Control",
  args: {
    combo: "ctrl + c"
  }
}`,...n.parameters?.docs?.source},description:{story:"Control modifier key.",...n.parameters?.docs?.description}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  name: "Option",
  args: {
    combo: "option + delete"
  }
}`,...m.parameters?.docs?.source},description:{story:"Alt/Option modifier key.",...m.parameters?.docs?.description}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  name: "Minimal",
  argTypes: {
    minimal: {
      table: {
        disable: true
      }
    },
    combo: {
      table: {
        disable: true
      }
    }
  },
  render: () => <Flex flexWrap="wrap" gap={2}>
            {MINIMAL_COMBOS.map(combo => <div key={combo} style={{
      width: 100
    }}>
                    <StoryLabel title={combo} />
                    <DashedPaddedContainer width={100}>
                        <KeyComboTag combo={combo} minimal={true} />
                    </DashedPaddedContainer>
                </div>)}
        </Flex>
}`,...t.parameters?.docs?.source},description:{story:"Minimal rendering shows compact key combos, useful when displayed inline or in a row.",...t.parameters?.docs?.description}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  name: "Common key combos",
  args: {
    minimal: false
  },
  render: args => <Flex flexDirection="row" gap={2}>
            {COMMON_COMBOS.map(combo => <div key={combo}>
                    <StoryLabel title={combo} />
                    <DashedPaddedContainer width={160}>
                        <KeyComboTag combo={combo} minimal={args.minimal} />
                    </DashedPaddedContainer>
                </div>)}
        </Flex>
}`,...i.parameters?.docs?.source},description:{story:"Grid of common real-world key combos.",...i.parameters?.docs?.description}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: "Playground",
  argTypes: {
    combo: {
      table: {
        disable: false
      }
    }
  },
  args: {
    combo: "cmd + shift + p",
    minimal: false
  }
}`,...c.parameters?.docs?.source},description:{story:"Interactive playground with all props togglable via Storybook controls.",...c.parameters?.docs?.description}}};const O=["CommandExample","ShiftExample","SpaceExample","ControlExample","OptionExample","MinimalExample","AllKeysExample","PlaygroundExample"];export{i as AllKeysExample,o as CommandExample,n as ControlExample,t as MinimalExample,m as OptionExample,c as PlaygroundExample,r as ShiftExample,s as SpaceExample,O as __namedExportsOrder,E as default};
