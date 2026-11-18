import{j as a,e as v,dB as T,g,dC as j,J as h,a as s,q as f,dD as A,dE as B,dF as G,dG as D,B as e}from"./iframe-6KWIKMhT.js";import"./preload-helper-PPVm8Dsz.js";const o=({className:n,...i})=>a.jsx("div",{className:v(T,n),...i});o.displayName=`${g}.NavbarDivider`;o.__docgenInfo={description:"",methods:[]};const r=({align:n=s.START,children:i,className:c,...N})=>{const b=v(j,h(n),c);return f(()=>{n===s.CENTER&&console.warn(A)},[n]),a.jsx("div",{className:b,...N,children:i})};r.displayName=`${g}.NavbarGroup`;r.__docgenInfo={description:"",methods:[],props:{align:{defaultValue:{value:'"start"',computed:!1},required:!1}}};const l=({children:n,className:i,...c})=>a.jsx("div",{className:v(B,i),...c,children:n});l.displayName=`${g}.NavbarHeading`;l.__docgenInfo={description:"",methods:[]};const t=n=>{const{children:i,className:c,fixedToTop:N,...b}=n,x=v(G,{[D]:N},c);return a.jsx("div",{className:x,...b,children:i})};t.displayName=`${g}.Navbar`;t.Divider=o;t.Group=r;t.Heading=l;t.__docgenInfo={description:`Navbar component.

@see https://blueprintjs.com/docs/#core/components/navbar`,methods:[{name:"Divider",docblock:"@deprecated Use `NavbarDivider` instead",modifiers:["static"],params:[{name:"{ className, ...htmlProps }",optional:!1}],returns:null,description:null},{name:"Group",docblock:"@deprecated Use `NavbarGroup` instead",modifiers:["static"],params:[{name:`{
    align = Alignment.START,
    children,
    className,
    ...htmlProps
}`,optional:!1}],returns:null,description:null},{name:"Heading",docblock:"@deprecated Use `NavbarHeading` instead",modifiers:["static"],params:[{name:"{ children, className, ...htmlProps }",optional:!1}],returns:null,description:null}]};const R={title:"Core/Navbar",component:t,subcomponents:{NavbarGroup:r},parameters:{layout:"padded"},tags:["autodocs"],args:{fixedToTop:!1,align:s.START},argTypes:{fixedToTop:{control:"boolean",table:{category:"Navbar"}},align:{control:"select",options:Object.values(s).filter(n=>n!=="center"),description:"`NavbarGroup` alignment",table:{category:"NavbarGroup"}}}},d={argTypes:{align:{table:{disable:!0}}},render:n=>a.jsxs(t,{...n,children:[a.jsxs(r,{align:s.START,children:[a.jsx(l,{children:"Blueprint"}),a.jsx(o,{}),a.jsx(e,{variant:"minimal",icon:"home",text:"Home"}),a.jsx(e,{variant:"minimal",icon:"document",text:"Files"})]}),a.jsxs(r,{align:s.END,children:[a.jsx(e,{variant:"minimal",icon:"notifications"}),a.jsx(e,{variant:"minimal",icon:"cog"})]})]})},m={args:{fixedToTop:!0},argTypes:{align:{table:{disable:!0}},fixedToTop:{table:{disable:!0}}},render:n=>a.jsxs(t,{...n,children:[a.jsxs(r,{align:s.START,children:[a.jsx(l,{children:"Blueprint"}),a.jsx(o,{}),a.jsx(e,{variant:"minimal",icon:"home",text:"Home"}),a.jsx(e,{variant:"minimal",icon:"document",text:"Files"})]}),a.jsxs(r,{align:s.END,children:[a.jsx(e,{variant:"minimal",icon:"notifications"}),a.jsx(e,{variant:"minimal",icon:"cog"})]})]})},p={argTypes:{align:{table:{disable:!0}}},render:({align:n,...i})=>a.jsx(t,{...i,children:a.jsxs(r,{align:s.END,children:[a.jsx(l,{children:"Blueprint"}),a.jsx(o,{}),a.jsx(e,{variant:"minimal",icon:"home",text:"Home"}),a.jsx(e,{variant:"minimal",icon:"document",text:"Files"})]})})},u={render:({align:n,...i})=>a.jsx(t,{...i,children:a.jsxs(r,{align:n,children:[a.jsx(l,{children:"Blueprint"}),a.jsx(o,{}),a.jsx(e,{variant:"minimal",icon:"home",text:"Home"}),a.jsx(e,{variant:"minimal",icon:"document",text:"Files"})]})})};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  argTypes: {
    align: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Navbar {...args}>
            <NavbarGroup align={Alignment.START}>
                <NavbarHeading>Blueprint</NavbarHeading>
                <NavbarDivider />
                <Button variant="minimal" icon="home" text="Home" />
                <Button variant="minimal" icon="document" text="Files" />
            </NavbarGroup>
            <NavbarGroup align={Alignment.END}>
                <Button variant="minimal" icon="notifications" />
                <Button variant="minimal" icon="cog" />
            </NavbarGroup>
        </Navbar>
}`,...d.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    fixedToTop: true
  },
  argTypes: {
    align: {
      table: {
        disable: true
      }
    },
    fixedToTop: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Navbar {...args}>
            <NavbarGroup align={Alignment.START}>
                <NavbarHeading>Blueprint</NavbarHeading>
                <NavbarDivider />
                <Button variant="minimal" icon="home" text="Home" />
                <Button variant="minimal" icon="document" text="Files" />
            </NavbarGroup>
            <NavbarGroup align={Alignment.END}>
                <Button variant="minimal" icon="notifications" />
                <Button variant="minimal" icon="cog" />
            </NavbarGroup>
        </Navbar>
}`,...m.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  argTypes: {
    align: {
      table: {
        disable: true
      }
    }
  },
  render: ({
    align,
    ...args
  }) => <Navbar {...args}>
            <NavbarGroup align={Alignment.END}>
                <NavbarHeading>Blueprint</NavbarHeading>
                <NavbarDivider />
                <Button variant="minimal" icon="home" text="Home" />
                <Button variant="minimal" icon="document" text="Files" />
            </NavbarGroup>
        </Navbar>
}`,...p.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: ({
    align,
    ...args
  }) => <Navbar {...args}>
            <NavbarGroup align={align}>
                <NavbarHeading>Blueprint</NavbarHeading>
                <NavbarDivider />
                <Button variant="minimal" icon="home" text="Home" />
                <Button variant="minimal" icon="document" text="Files" />
            </NavbarGroup>
        </Navbar>
}`,...u.parameters?.docs?.source}}};const _=["Default","FixedToTop","AlignEnd","Playground"];export{p as AlignEnd,d as Default,m as FixedToTop,u as Playground,_ as __namedExportsOrder,R as default};
