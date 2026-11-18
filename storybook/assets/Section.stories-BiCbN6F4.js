import{r as C,U as V,u as R,j as e,ct as Z,ai as q,bf as j,cu as z,e as y,cv as K,cw as X,cx as Y,bL as $,cy as G,ag as J,cz as Q,cA as W,aj as ee,ab as te,g as H,cB as ae,cC as ne,B as oe}from"./iframe-6KWIKMhT.js";import{s as ie,S as v}from"./common-CGlRPlLv.js";import{F as w}from"./flex-CfNrUc6L.js";import{C as se,a as ce}from"./chevron-up-uP7nbuFB.js";import{E as p,C as re}from"./card-C6ssIv7b.js";import{C as le}from"./collapse-ZAjSlNXb.js";import"./preload-helper-PPVm8Dsz.js";const s=C.forwardRef((t,m)=>{const{children:c,className:l,collapseProps:o,collapsible:a,compact:d=!1,elevation:B=p.ZERO,icon:I,rightElement:O,subtitle:A,title:f,titleRenderer:k=V,...L}=t,T=o?.isOpen!=null,[F,P]=C.useState(!(o?.defaultIsOpen??!0)),r=T?!o?.isOpen:F,U=C.useCallback(()=>{T?o?.onToggle?.():P(!r)},[o,r,T]),M=O!=null||a,N=R("section"),D=f?R("section-title"):void 0;return e.jsxs(re,{className:y(l,Q,{[te]:d,[W]:a&&r||ee(c)}),elevation:B,ref:m,"aria-labelledby":D,...L,id:N,children:[f&&e.jsxs("div",{className:y(G,{[J]:a}),onClick:a?U:void 0,children:[e.jsxs("div",{className:Z,children:[I&&e.jsx(q,{icon:I,"aria-hidden":!0,tabIndex:-1,className:j}),e.jsxs("div",{children:[C.createElement(k,{className:z,id:D},f),A&&e.jsx("div",{className:y(j,K),children:A})]})]}),M&&e.jsxs("div",{className:X,children:[O,a&&e.jsx("span",{role:"button",tabIndex:0,"aria-pressed":r,"aria-expanded":r,"aria-controls":N,"aria-label":r?"expand section":"collapse section",onKeyDown:$(["Enter"," "]),className:y(j,Y),children:r?e.jsx(se,{}):e.jsx(ce,{})})]})]}),a?e.jsx(le,{...o,isOpen:!r,children:c}):c]})});s.displayName=`${H}.Section`;s.__docgenInfo={description:`Section component.

@see https://blueprintjs.com/docs/#core/components/section`,methods:[]};const n=C.forwardRef((t,m)=>{const{className:c,children:l,padded:o=!0,...a}=t,d=y(ae,{[ne]:o},c);return e.jsx("div",{className:d,ref:m,...a,children:l})});n.displayName=`${H}.SectionCard`;n.__docgenInfo={description:`Section card component.

@see https://blueprintjs.com/docs/#core/components/section.section-card`,methods:[]};const{expect:i,waitFor:_}=__STORYBOOK_MODULE_TEST__,xe={title:"Core/Section",component:s,decorators:[ie],parameters:{layout:"centered"},tags:["autodocs"],args:{title:"Section title",elevation:p.ZERO,compact:!1,collapsible:!1},argTypes:{elevation:{control:"select",options:[p.ZERO,p.ONE]},compact:{control:"boolean"},collapsible:{control:"boolean"},icon:{control:"text"},subtitle:{control:"text"}}},u={args:{title:"Section title",children:e.jsx(n,{children:"Section content goes here."})}},b={name:"Elevation",argTypes:{elevation:{table:{disable:!0}}},render:t=>e.jsxs(w,{flexDirection:"column",gap:4,children:[e.jsx(v,{title:"Elevation 0"}),e.jsx(s,{...t,elevation:p.ZERO,children:e.jsx(n,{children:"Content with zero elevation."})}),e.jsx(v,{title:"Elevation 1"}),e.jsx(s,{...t,elevation:p.ONE,children:e.jsx(n,{children:"Content with elevation one."})})]})},h={name:"Compact",argTypes:{compact:{table:{disable:!0}}},render:t=>e.jsxs(w,{flexDirection:"column",gap:4,children:[e.jsx(v,{title:"Default"}),e.jsx(s,{...t,compact:!1,children:e.jsx(n,{children:"Default padding."})}),e.jsx(v,{title:"Compact"}),e.jsx(s,{...t,compact:!0,children:e.jsx(n,{children:"Compact padding."})})]})},g={name:"Icon & Subtitle",argTypes:{icon:{table:{disable:!0}},subtitle:{table:{disable:!0}},title:{table:{disable:!0}}},render:t=>e.jsxs(w,{flexDirection:"column",gap:4,children:[e.jsx(s,{...t,icon:"settings",title:"Settings",children:e.jsx(n,{children:"Section with an icon."})}),e.jsx(s,{...t,title:"Configuration",subtitle:"Manage your application settings",children:e.jsx(n,{children:"Section with a subtitle."})}),e.jsx(s,{...t,icon:"cog",title:"Advanced",subtitle:"Expert-level options",children:e.jsx(n,{children:"Section with both icon and subtitle."})})]})},x={name:"Right Element",argTypes:{rightElement:{table:{disable:!0}}},render:t=>e.jsx(w,{flexDirection:"column",gap:4,children:e.jsx(s,{...t,rightElement:e.jsx(oe,{intent:"primary",text:"Edit",variant:"minimal"}),children:e.jsx(n,{children:"Section with a right element action button."})})})},S={args:{title:"Playground section",icon:"folder-open",subtitle:"Explore section props",elevation:p.ONE,children:e.jsx(n,{children:"Section content goes here."})}},E={args:{title:"Collapsible section",collapsible:!0,children:e.jsx(n,{children:"This section's content can be toggled by clicking the header."})},argTypes:{collapsible:{table:{disable:!0}}},play:async({canvas:t,userEvent:m,step:c})=>{const l=t.getByText("Collapsible section").closest(".bp6-section-header"),o=l.closest(".bp6-section"),a=o.querySelector(".bp6-collapse-body"),d=t.getByRole("button",{name:/collapse section|expand section/});await c("Section starts expanded with content visible",async()=>{await i(t.getByText(/content can be toggled/)).toBeVisible(),await i(a).toHaveAttribute("aria-hidden","false"),await i(d).toHaveAttribute("aria-expanded","false")}),await c("Click header to collapse the section",async()=>{await m.click(l),await _(()=>i(a).toHaveAttribute("aria-hidden","true")),await i(o).toHaveClass("bp6-section-collapsed"),await i(a).toHaveAttribute("aria-hidden","true"),await i(d).toHaveAttribute("aria-expanded","true")}),await c("Click header again to re-expand the section",async()=>{await m.click(l),await _(()=>i(a).toHaveAttribute("aria-hidden","false")),await i(t.getByText(/content can be toggled/)).toBeVisible(),await i(o).not.toHaveClass("bp6-section-collapsed"),await i(d).toHaveAttribute("aria-expanded","false")})}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    title: "Section title",
    children: <SectionCard>Section content goes here.</SectionCard>
  }
}`,...u.parameters?.docs?.source},description:{story:"A basic section with a title and some content.",...u.parameters?.docs?.description}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  name: "Elevation",
  argTypes: {
    elevation: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="column" gap={4}>
            <StoryLabel title="Elevation 0" />
            <Section {...args} elevation={Elevation.ZERO}>
                <SectionCard>Content with zero elevation.</SectionCard>
            </Section>
            <StoryLabel title="Elevation 1" />
            <Section {...args} elevation={Elevation.ONE}>
                <SectionCard>Content with elevation one.</SectionCard>
            </Section>
        </Flex>
}`,...b.parameters?.docs?.source},description:{story:"Use the `elevation` prop to control the visual depth of the section.\nSection supports `Elevation.ZERO` and `Elevation.ONE`.",...b.parameters?.docs?.description}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  name: "Compact",
  argTypes: {
    compact: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="column" gap={4}>
            <StoryLabel title="Default" />
            <Section {...args} compact={false}>
                <SectionCard>Default padding.</SectionCard>
            </Section>
            <StoryLabel title="Compact" />
            <Section {...args} compact={true}>
                <SectionCard>Compact padding.</SectionCard>
            </Section>
        </Flex>
}`,...h.parameters?.docs?.source},description:{story:"Use the `compact` prop to render a section with reduced padding.",...h.parameters?.docs?.description}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: "Icon & Subtitle",
  argTypes: {
    icon: {
      table: {
        disable: true
      }
    },
    subtitle: {
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
            <Section {...args} icon="settings" title="Settings">
                <SectionCard>Section with an icon.</SectionCard>
            </Section>
            <Section {...args} title="Configuration" subtitle="Manage your application settings">
                <SectionCard>Section with a subtitle.</SectionCard>
            </Section>
            <Section {...args} icon="cog" title="Advanced" subtitle="Expert-level options">
                <SectionCard>Section with both icon and subtitle.</SectionCard>
            </Section>
        </Flex>
}`,...g.parameters?.docs?.source},description:{story:"Use the `icon` prop to render an icon in the section header,\nand `subtitle` to display additional context below the title.",...g.parameters?.docs?.description}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: "Right Element",
  argTypes: {
    rightElement: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="column" gap={4}>
            <Section {...args} rightElement={<Button intent="primary" text="Edit" variant="minimal" />}>
                <SectionCard>Section with a right element action button.</SectionCard>
            </Section>
        </Flex>
}`,...x.parameters?.docs?.source},description:{story:"Use the `rightElement` prop to render an element on the right side of the section header.\nThis is commonly used for action buttons.",...x.parameters?.docs?.description}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    title: "Playground section",
    icon: "folder-open",
    subtitle: "Explore section props",
    elevation: Elevation.ONE,
    children: <SectionCard>Section content goes here.</SectionCard>
  }
}`,...S.parameters?.docs?.source},description:{story:"Interactive playground with all props toggleable via Storybook controls.",...S.parameters?.docs?.description}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    title: "Collapsible section",
    collapsible: true,
    children: <SectionCard>This section's content can be toggled by clicking the header.</SectionCard>
  },
  argTypes: {
    collapsible: {
      table: {
        disable: true
      }
    }
  },
  play: async ({
    canvas,
    userEvent,
    step
  }) => {
    const header = canvas.getByText("Collapsible section").closest(".bp6-section-header")!;
    const section = header.closest(".bp6-section")!;
    const collapseBody = section.querySelector(".bp6-collapse-body")!;
    const caret = canvas.getByRole("button", {
      name: /collapse section|expand section/
    });
    await step("Section starts expanded with content visible", async () => {
      await expect(canvas.getByText(/content can be toggled/)).toBeVisible();
      await expect(collapseBody).toHaveAttribute("aria-hidden", "false");
      await expect(caret).toHaveAttribute("aria-expanded", "false");
    });
    await step("Click header to collapse the section", async () => {
      await userEvent.click(header);
      await waitFor(() => expect(collapseBody).toHaveAttribute("aria-hidden", "true"));
      await expect(section).toHaveClass("bp6-section-collapsed");
      await expect(collapseBody).toHaveAttribute("aria-hidden", "true");
      await expect(caret).toHaveAttribute("aria-expanded", "true");
    });
    await step("Click header again to re-expand the section", async () => {
      await userEvent.click(header);
      await waitFor(() => expect(collapseBody).toHaveAttribute("aria-hidden", "false"));
      await expect(canvas.getByText(/content can be toggled/)).toBeVisible();
      await expect(section).not.toHaveClass("bp6-section-collapsed");
      await expect(caret).toHaveAttribute("aria-expanded", "false");
    });
  }
}`,...E.parameters?.docs?.source},description:{story:"Use the `collapsible` prop to make the section's contents collapsible.\nClicking the section header toggles between expanded and collapsed states.",...E.parameters?.docs?.description}}};const Se=["Default","ElevationExample","CompactExample","IconExample","RightElementExample","Playground","Collapsible"];export{E as Collapsible,h as CompactExample,u as Default,b as ElevationExample,g as IconExample,S as Playground,x as RightElementExample,Se as __namedExportsOrder,xe as default};
