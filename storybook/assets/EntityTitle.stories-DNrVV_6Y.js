import{r as E,ak as j,e as c,bd as Y,be as W,az as v,j as e,bf as R,bg as O,ai as B,bh as J,bi as M,bj as G,bk as $,bl as K,bm as V,l as Z,bn as Q,p as ee,bo as _,bp as C,H,b as P,ax as U,U as k,g as te,z}from"./iframe-6KWIKMhT.js";import{s as ne,S as a,D as l}from"./common-CGlRPlLv.js";import{H as ie}from"./home-BddfYDeC.js";import{F as s}from"./flex-CfNrUc6L.js";import{T as ae}from"./tag-DnuMuEBY.js";import{S as le}from"./square-BUt5Me0A.js";import"./preload-helper-PPVm8Dsz.js";import"./tagRemoveButton-DdGBep5P.js";import"./x-small-DmUwHyi-.js";import"./functionUtils-BGFdVicR.js";const n=E.forwardRef((t,i)=>{const{className:o,ellipsize:d=!1,fill:A=!1,heading:m=j,icon:N,loading:r=!1,subtitle:D,tags:F,title:I,titleURL:L}=t,q=E.useMemo(()=>{const X=L!=null?e.jsx("a",{target:"_blank",href:L,rel:"noreferrer",children:I}):I;return E.createElement(m,{className:c(Y,{[v]:r,[W]:m!==j&&d}),ellipsize:m===j?d:void 0},X)},[L,I,m,r,d]),w=E.useMemo(()=>D==null?null:e.jsx(j,{className:c(R,O,{[v]:r}),ellipsize:d,children:D}),[d,r,D]);return e.jsxs("div",{className:c(o,V,se(m),{[Q]:d,[Z]:A}),ref:i,children:[N!=null&&e.jsx("div",{className:c(J,{[M]:w!=null}),children:e.jsx(B,{"aria-hidden":!0,className:c(R,{[v]:r}),icon:r?e.jsx(le,{}):N,tabIndex:-1})}),e.jsxs("div",{className:G,children:[e.jsxs("div",{className:c(K,{[v]:r}),children:[q,F!=null&&e.jsx("div",{className:$,children:F})]}),w]})]})});n.displayName=`${te}.EntityTitle`;function se(t){const i=[_,C,H,P,U,k].findIndex(o=>o===t);if(!(i<0))return[ee(),"entity-title-heading",`h${i+1}`].join("-")}n.__docgenInfo={description:`EntityTitle component.

@see https://blueprintjs.com/docs/#core/components/entity-title`,methods:[],props:{className:{required:!1,tsType:{name:"string"},description:"A space-delimited list of class names to pass along to a child element."},ellipsize:{required:!1,tsType:{name:"boolean"},description:`Whether the overflowing text content should be ellipsized.

@default false`},fill:{required:!1,tsType:{name:"boolean"},description:"Whether the component should expand to fill its container."},heading:{required:!1,tsType:{name:"ReactFC",raw:"React.FC<any>",elements:[{name:"any"}]},description:`React component to render the main title heading. This defaults to
Blueprint's \`<Text>\` component, * which inherits font size from its
containing element(s).

To render larger, more prominent titles, Use Blueprint's heading
components instead (e.g. \`{ H1 } from "@blueprintjs/core"\`).

@default Text`},icon:{required:!1,tsType:{name:"union",raw:"IconName | MaybeElement",elements:[{name:"IconName"},{name:"union",raw:"React.JSX.Element | false | null | undefined",elements:[{name:"React.JSX.Element"},{name:"literal",value:"false"},{name:"null"},{name:"undefined"}]}]},description:"Name of a Blueprint UI icon (or an icon element) to render in the section's header.\nNote that the header will only be rendered if `title` is provided."},loading:{required:!1,tsType:{name:"boolean"},description:`Whether to render as loading state.

@default false`},subtitle:{required:!1,tsType:{name:"union",raw:"React.JSX.Element | string",elements:[{name:"React.JSX.Element"},{name:"string"}]},description:"The content to render below the title. Defaults to render muted text."},title:{required:!0,tsType:{name:"union",raw:"React.JSX.Element | string",elements:[{name:"React.JSX.Element"},{name:"string"}]},description:"The primary title to render."},titleURL:{required:!1,tsType:{name:"string"},description:"If specified, the title will be wrapped in an anchor with this URL."},tags:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"<Tag> components work best - if multiple, wrap in <React.Fragment>"}}};const S=[{heading:_,label:"H1"},{heading:C,label:"H2"},{heading:H,label:"H3"},{heading:P,label:"H4"},{heading:U,label:"H5"},{heading:k,label:"H6"}],xe={title:"Core/EntityTitle",component:n,decorators:[ne],tags:["autodocs"],args:{title:"Entity Title",icon:void 0,heading:void 0,ellipsize:!1,fill:!1,loading:!1},argTypes:{title:{control:"text"},icon:{control:"text",table:{disable:!0}},heading:{control:"select",options:["Text",...S.map(t=>t.label)],mapping:{Text:void 0,...Object.fromEntries(S.map(({label:t,heading:i})=>[t,i]))}},ellipsize:{control:"boolean"},fill:{control:"boolean"},loading:{control:"boolean"},subtitle:{control:"text"}}},p={args:{title:"Entity Title"}},u={name:"Heading",argTypes:{heading:{table:{disable:!0}},title:{table:{disable:!0}}},render:t=>e.jsxs(s,{flexDirection:"column",gap:5,children:[S.map(({heading:i,label:o})=>e.jsx(n,{...t,icon:"document",title:`Heading ${o}`,heading:i},o)),e.jsx(n,{...t,icon:"document",title:"Default (no heading)"})]})},g={name:"Icon",argTypes:{title:{table:{disable:!0}}},render:t=>e.jsxs(s,{flexDirection:"column",gap:3,children:[e.jsx(n,{...t,icon:"document",title:"Document"}),e.jsx(n,{...t,icon:"folder-close",title:"Folder"}),e.jsx(n,{...t,icon:"user",title:"User"}),e.jsx(n,{...t,icon:e.jsx(ie,{}),title:"Element icon"}),e.jsx(n,{...t,icon:void 0,title:"No icon"})]})},h={name:"Fill",argTypes:{fill:{table:{disable:!0}},title:{table:{disable:!0}}},render:t=>e.jsxs(s,{flexDirection:"column",gap:4,children:[e.jsxs("div",{children:[e.jsx(a,{title:"Fill enabled"}),e.jsx(l,{children:e.jsx("div",{style:{background:z.RED5,borderRadius:4,padding:4},children:e.jsx(n,{...t,fill:!0,title:"Fill enabled",icon:"document"})})})]}),e.jsxs("div",{children:[e.jsx(a,{title:"Fill disabled"}),e.jsx(l,{children:e.jsx("div",{style:{background:z.BLUE5,borderRadius:4,display:"inline-block",padding:4},children:e.jsx(n,{...t,fill:!1,title:"Fill disabled",icon:"document"})})})]})]})},b={name:"Ellipsize",argTypes:{ellipsize:{table:{disable:!0}},title:{table:{disable:!0}}},decorators:[t=>e.jsx(s,{justifyContent:"center",alignItems:"center",children:e.jsx(t,{})})],render:t=>e.jsxs(s,{flexDirection:"column",gap:4,children:[e.jsxs("div",{children:[e.jsx(a,{title:"Ellipsize enabled"}),e.jsx(l,{width:250,children:e.jsx(n,{...t,ellipsize:!0,icon:"document",title:"This is a very long entity title that should be ellipsized"})})]}),e.jsxs("div",{children:[e.jsx(a,{title:"Ellipsize disabled"}),e.jsx(l,{width:250,children:e.jsx(n,{...t,ellipsize:!1,icon:"document",title:"This is a very long entity title that will not be ellipsized"})})]})]})},x={name:"Loading",argTypes:{loading:{table:{disable:!0}},title:{table:{disable:!0}}},render:t=>e.jsxs(s,{flexDirection:"column",gap:4,children:[e.jsxs("div",{children:[e.jsx(a,{title:"Loading"}),e.jsx(l,{width:250,children:e.jsx(n,{...t,loading:!0,icon:"document",title:"Loading Entity"})})]}),e.jsxs("div",{children:[e.jsx(a,{title:"Not loading"}),e.jsx(l,{width:250,children:e.jsx(n,{...t,loading:!1,icon:"document",title:"Loaded Entity"})})]})]})},T={name:"Tags",argTypes:{title:{table:{disable:!0}}},render:t=>e.jsxs(s,{flexDirection:"column",gap:4,children:[e.jsxs("div",{children:[e.jsx(a,{title:"With tag"}),e.jsx(l,{children:e.jsx(n,{...t,icon:"document",title:"Document",tags:e.jsx(ae,{minimal:!0,children:"Draft"})})})]}),e.jsxs("div",{children:[e.jsx(a,{title:"Without tag"}),e.jsx(l,{children:e.jsx(n,{...t,icon:"document",title:"Document"})})]})]})},y={name:"Subtitle",argTypes:{title:{table:{disable:!0}}},render:t=>e.jsxs(s,{flexDirection:"column",gap:3,children:[e.jsx(n,{...t,icon:"document",title:"Annual Report",subtitle:"Last edited 2 hours ago"}),e.jsx(n,{...t,icon:"folder-close",title:"Project Files",subtitle:"12 items"})]})},f={args:{title:"Playground Entity",icon:"document",heading:void 0,ellipsize:!1,fill:!1,loading:!1}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    title: "Entity Title"
  }
}`,...p.parameters?.docs?.source},description:{story:"A basic entity title with default styling.",...p.parameters?.docs?.description}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  name: "Heading",
  argTypes: {
    heading: {
      table: {
        disable: true
      }
    },
    title: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="column" gap={5}>
            {HEADINGS.map(({
      heading,
      label
    }) => <EntityTitle key={label} {...args} icon="document" title={\`Heading \${label}\`} heading={heading} />)}
            <EntityTitle {...args} icon="document" title="Default (no heading)" />
        </Flex>
}`,...u.parameters?.docs?.source},description:{story:"Use the `heading` prop to control the size of the entity title by rendering it as an HTML heading element.",...u.parameters?.docs?.description}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: "Icon",
  argTypes: {
    title: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="column" gap={3}>
            <EntityTitle {...args} icon="document" title="Document" />
            <EntityTitle {...args} icon="folder-close" title="Folder" />
            <EntityTitle {...args} icon="user" title="User" />
            <EntityTitle {...args} icon={<Home />} title="Element icon" />
            <EntityTitle {...args} icon={undefined} title="No icon" />
        </Flex>
}`,...g.parameters?.docs?.source},description:{story:"Use the `icon` prop to render an icon alongside the title.",...g.parameters?.docs?.description}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  name: "Fill",
  argTypes: {
    fill: {
      table: {
        disable: true
      }
    },
    title: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="column" gap={4}>
            <div>
                <StoryLabel title="Fill enabled" />
                <DashedPaddedContainer>
                    <div style={{
          background: Colors.RED5,
          borderRadius: 4,
          padding: 4
        }}>
                        <EntityTitle {...args} fill={true} title="Fill enabled" icon="document" />
                    </div>
                </DashedPaddedContainer>
            </div>
            <div>
                <StoryLabel title="Fill disabled" />
                <DashedPaddedContainer>
                    <div style={{
          background: Colors.BLUE5,
          borderRadius: 4,
          display: "inline-block",
          padding: 4
        }}>
                        <EntityTitle {...args} fill={false} title="Fill disabled" icon="document" />
                    </div>
                </DashedPaddedContainer>
            </div>
        </Flex>
}`,...h.parameters?.docs?.source},description:{story:"Use the `fill` prop to make the entity title expand to fill its container.",...h.parameters?.docs?.description}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  name: "Ellipsize",
  argTypes: {
    ellipsize: {
      table: {
        disable: true
      }
    },
    title: {
      table: {
        disable: true
      }
    }
  },
  decorators: [Story => <Flex justifyContent="center" alignItems="center">
                <Story />
            </Flex>],
  render: args => <Flex flexDirection="column" gap={4}>
            <div>
                <StoryLabel title="Ellipsize enabled" />
                <DashedPaddedContainer width={250}>
                    <EntityTitle {...args} ellipsize={true} icon="document" title="This is a very long entity title that should be ellipsized" />
                </DashedPaddedContainer>
            </div>
            <div>
                <StoryLabel title="Ellipsize disabled" />
                <DashedPaddedContainer width={250}>
                    <EntityTitle {...args} ellipsize={false} icon="document" title="This is a very long entity title that will not be ellipsized" />
                </DashedPaddedContainer>
            </div>
        </Flex>
}`,...b.parameters?.docs?.source},description:{story:"Use the `ellipsize` prop to truncate long titles with an ellipsis when they overflow their container.",...b.parameters?.docs?.description}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: "Loading",
  argTypes: {
    loading: {
      table: {
        disable: true
      }
    },
    title: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="column" gap={4}>
            <div>
                <StoryLabel title="Loading" />
                <DashedPaddedContainer width={250}>
                    <EntityTitle {...args} loading={true} icon="document" title="Loading Entity" />
                </DashedPaddedContainer>
            </div>
            <div>
                <StoryLabel title="Not loading" />
                <DashedPaddedContainer width={250}>
                    <EntityTitle {...args} loading={false} icon="document" title="Loaded Entity" />
                </DashedPaddedContainer>
            </div>
        </Flex>
}`,...x.parameters?.docs?.source},description:{story:"Use the `loading` prop to show a skeleton loading state.",...x.parameters?.docs?.description}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  name: "Tags",
  argTypes: {
    title: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="column" gap={4}>
            <div>
                <StoryLabel title="With tag" />
                <DashedPaddedContainer>
                    <EntityTitle {...args} icon="document" title="Document" tags={<Tag minimal={true}>Draft</Tag>} />
                </DashedPaddedContainer>
            </div>
            <div>
                <StoryLabel title="Without tag" />
                <DashedPaddedContainer>
                    <EntityTitle {...args} icon="document" title="Document" />
                </DashedPaddedContainer>
            </div>
        </Flex>
}`,...T.parameters?.docs?.source},description:{story:"Use the `tags` prop to render `Tag` components alongside the title.",...T.parameters?.docs?.description}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  name: "Subtitle",
  argTypes: {
    title: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="column" gap={3}>
            <EntityTitle {...args} icon="document" title="Annual Report" subtitle="Last edited 2 hours ago" />
            <EntityTitle {...args} icon="folder-close" title="Project Files" subtitle="12 items" />
        </Flex>
}`,...y.parameters?.docs?.source},description:{story:"Use the `subtitle` prop to render secondary descriptive text below the title.",...y.parameters?.docs?.description}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    title: "Playground Entity",
    icon: "document",
    heading: undefined,
    ellipsize: false,
    fill: false,
    loading: false
  }
}`,...f.parameters?.docs?.source},description:{story:"Interactive playground with all props togglable via Storybook controls.",...f.parameters?.docs?.description}}};const Te=["Default","HeadingsExample","IconExample","FillExample","EllipsizeExample","LoadingExample","TagsExample","SubtitleExample","Playground"];export{p as Default,b as EllipsizeExample,h as FillExample,u as HeadingsExample,g as IconExample,x as LoadingExample,f as Playground,y as SubtitleExample,T as TagsExample,Te as __namedExportsOrder,xe as default};
