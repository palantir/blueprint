import{r as h,e as y,c2 as j,ag as L,c3 as E,c4 as M,ab as S,j as e,g as H}from"./iframe-6KWIKMhT.js";import{s as f}from"./common-CGlRPlLv.js";import"./preload-helper-PPVm8Dsz.js";import"./flex-CfNrUc6L.js";const a=h.forwardRef((r,i)=>{const{bordered:p,className:m,compact:b,interactive:T,striped:u,...g}=r,x=y(j,{[S]:b,[M]:p,[E]:u,[L]:T},m);return e.jsx("table",{...g,ref:i,className:x})});a.displayName=`${H}.HTMLTable`;a.__docgenInfo={description:`HTML table component.

@see https://blueprintjs.com/docs/#core/components/html-table`,methods:[]};const v=[{name:"Blueprint",role:"UI Framework",location:"GitHub"},{name:"TSX",role:"Type-safe JSX",location:"TypeScript"},{name:"Sass",role:"CSS Preprocessor",location:"Node"},{name:"Storybook",role:"Component Explorer",location:"Browser"},{name:"React",role:"View Library",location:"npm"}];function t(){return e.jsxs(e.Fragment,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Project"}),e.jsx("th",{children:"Role"}),e.jsx("th",{children:"Location"})]})}),e.jsx("tbody",{children:v.map(r=>e.jsxs("tr",{children:[e.jsx("td",{children:r.name}),e.jsx("td",{children:r.role}),e.jsx("td",{children:r.location})]},r.name))})]})}const P={title:"Core/HTMLTable",component:a,decorators:[f],tags:["autodocs"],args:{bordered:!1,compact:!1,interactive:!1,striped:!1},argTypes:{bordered:{control:"boolean"},compact:{control:"boolean"},interactive:{control:"boolean"},striped:{control:"boolean"}}},s={render:r=>e.jsx(a,{...r,children:e.jsx(t,{})})},o={name:"Bordered",argTypes:{bordered:{table:{disable:!0}}},render:r=>e.jsx(a,{...r,bordered:!0,children:e.jsx(t,{})})},n={name:"Striped",argTypes:{striped:{table:{disable:!0}}},render:r=>e.jsx(a,{...r,striped:!0,children:e.jsx(t,{})})},c={name:"Compact",argTypes:{compact:{table:{disable:!0}}},render:r=>e.jsx(a,{...r,compact:!0,children:e.jsx(t,{})})},d={name:"Interactive",argTypes:{interactive:{table:{disable:!0}}},render:r=>e.jsx(a,{...r,interactive:!0,children:e.jsx(t,{})})},l={args:{bordered:!0,compact:!1,interactive:!0,striped:!0},render:r=>e.jsx(a,{...r,children:e.jsx(t,{})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: args => <HTMLTable {...args}>
            <TableContents />
        </HTMLTable>
}`,...s.parameters?.docs?.source},description:{story:"A basic HTML table with default styling.",...s.parameters?.docs?.description}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: "Bordered",
  argTypes: {
    bordered: {
      table: {
        disable: true
      }
    }
  },
  render: args => <HTMLTable {...args} bordered={true}>
            <TableContents />
        </HTMLTable>
}`,...o.parameters?.docs?.source},description:{story:"Use the `bordered` prop to add borders between rows and cells.",...o.parameters?.docs?.description}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  name: "Striped",
  argTypes: {
    striped: {
      table: {
        disable: true
      }
    }
  },
  render: args => <HTMLTable {...args} striped={true}>
            <TableContents />
        </HTMLTable>
}`,...n.parameters?.docs?.source},description:{story:"Use the `striped` prop to apply an alternate background color on odd-numbered rows.",...n.parameters?.docs?.description}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: "Compact",
  argTypes: {
    compact: {
      table: {
        disable: true
      }
    }
  },
  render: args => <HTMLTable {...args} compact={true}>
            <TableContents />
        </HTMLTable>
}`,...c.parameters?.docs?.source},description:{story:"Use the `compact` prop for a denser appearance with less padding.",...c.parameters?.docs?.description}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: "Interactive",
  argTypes: {
    interactive: {
      table: {
        disable: true
      }
    }
  },
  render: args => <HTMLTable {...args} interactive={true}>
            <TableContents />
        </HTMLTable>
}`,...d.parameters?.docs?.source},description:{story:"Use the `interactive` prop to enable hover styles on rows.",...d.parameters?.docs?.description}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    bordered: true,
    compact: false,
    interactive: true,
    striped: true
  },
  render: args => <HTMLTable {...args}>
            <TableContents />
        </HTMLTable>
}`,...l.parameters?.docs?.source},description:{story:"Interactive playground with all props toggleable via Storybook controls.",...l.parameters?.docs?.description}}};const R=["Default","BorderedExample","StripedExample","CompactExample","InteractiveExample","Playground"];export{o as BorderedExample,c as CompactExample,s as Default,d as InteractiveExample,l as Playground,n as StripedExample,R as __namedExportsOrder,P as default};
