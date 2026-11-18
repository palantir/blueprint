import{a8 as P,g as N,j as e,e as m,dH as q,ai as U,dI as $,I as _,dJ as X,dK as F,w as J,r as w,dL as K,l as G,V as Y,dM as Q,s as Z,dz as ee,aq as te,ar as ne,bC as ae,dN as ie,dO as se,dP as le,x as re,z}from"./iframe-6KWIKMhT.js";import{s as de,S as h,D as u}from"./common-CGlRPlLv.js";import{H as oe}from"./home-BddfYDeC.js";import{F as k}from"./flex-CfNrUc6L.js";import{i as O}from"./functionUtils-BGFdVicR.js";import{T as ce}from"./tag-DnuMuEBY.js";import"./preload-helper-PPVm8Dsz.js";import"./tagRemoveButton-DdGBep5P.js";import"./x-small-DmUwHyi-.js";class n extends P{static defaultProps={disabled:!1};static displayName=`${N}.Tab`;render(){const{className:t,panel:a}=this.props;return e.jsx("div",{className:m(q,t),role:"tablist",children:O(a)?a({tabPanelId:"",tabTitleId:""}):a})}}n.__docgenInfo={description:`Tab component.

@see https://blueprintjs.com/docs/#core/components/tabs.tab`,methods:[],props:{className:{required:!1,tsType:{name:"string"},description:"A space-delimited list of class names to pass along to a child element."},children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"Content of tab title, rendered in a list above the active panel.\nCan also be set via the `title` prop."},disabled:{required:!1,tsType:{name:"boolean"},description:`Whether the tab is disabled.

@default false`,defaultValue:{value:"false",computed:!1}},id:{required:!0,tsType:{name:"union",raw:"string | number",elements:[{name:"string"},{name:"number"}]},description:`Unique identifier used to control which tab is selected
and to generate ARIA attributes for accessibility.`},panel:{required:!1,tsType:{name:"union",raw:"React.JSX.Element | ((props: TabIdProps) => React.JSX.Element)",elements:[{name:"React.JSX.Element"},{name:"unknown"}]},description:"Panel content, rendered by the parent `Tabs` when this tab is active.\nIf omitted, no panel will be rendered for this tab.\nCan either be an element or a renderer."},panelClassName:{required:!1,tsType:{name:"string"},description:"Space-delimited string of class names applied to tab panel container."},title:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"Content of tab title element, rendered in a list above the active panel.\nCan also be set via React `children`."},icon:{required:!1,tsType:{name:"union",raw:"IconName | MaybeElement",elements:[{name:"IconName"},{name:"union",raw:"React.JSX.Element | false | null | undefined",elements:[{name:"React.JSX.Element"},{name:"literal",value:"false"},{name:"null"},{name:"undefined"}]}]},description:"Name of a Blueprint UI icon (or an icon element) to render before the children."},tagContent:{required:!1,tsType:{name:'TagProps["children"]',raw:'TagProps["children"]'},description:"Content to render inside a `<Tag>` after the children.\nThe tag is `minimal` by default; it can be further modified by using `tagProps`."},tagProps:{required:!1,tsType:{name:"Omit",elements:[{name:"TagProps"},{name:"literal",value:'"children"'}],raw:'Omit<TagProps, "children">'},description:"Props to customize the `<Tag>` rendered after the children.\nThis has no effect if `tagContent` is `undefined`."}},composes:["Omit"]};class M extends P{static displayName=`${N}.TabTitle`;render(){const{className:t,children:a,disabled:s,id:l,parentId:r,selected:d,title:c,icon:p,tagContent:b,tagProps:I,...E}=this.props,A=d?_.PRIMARY:_.NONE,{tabPanelId:R,tabTitleId:D}=B(r,l);return e.jsxs("div",{...J(E),"aria-controls":R,"aria-disabled":s,"aria-expanded":d,"aria-selected":d,className:m(F,t),"data-tab-id":l,id:D,onClick:s?void 0:this.handleClick,role:"tab",tabIndex:s?void 0:d?0:-1,children:[p!=null&&e.jsx(U,{icon:p,className:$}),c,a,b!=null&&e.jsx(ce,{minimal:!0,intent:A,...I,className:m(X,I?.className),children:b})]})}handleClick=t=>this.props.onClick(this.props.id,t)}function B(i,t){return{tabPanelId:`${q}_${i}_${t}`,tabTitleId:`${F}-title_${i}_${t}`}}M.__docgenInfo={description:"",methods:[],props:{className:{required:!1,tsType:{name:"string"},description:"A space-delimited list of class names to pass along to a child element."},children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"Content of tab title, rendered in a list above the active panel.\nCan also be set via the `title` prop."},disabled:{required:!1,tsType:{name:"boolean"},description:`Whether the tab is disabled.

@default false`},id:{required:!0,tsType:{name:"union",raw:"string | number",elements:[{name:"string"},{name:"number"}]},description:`Unique identifier used to control which tab is selected
and to generate ARIA attributes for accessibility.`},panel:{required:!1,tsType:{name:"union",raw:"React.JSX.Element | ((props: TabIdProps) => React.JSX.Element)",elements:[{name:"React.JSX.Element"},{name:"unknown"}]},description:"Panel content, rendered by the parent `Tabs` when this tab is active.\nIf omitted, no panel will be rendered for this tab.\nCan either be an element or a renderer."},panelClassName:{required:!1,tsType:{name:"string"},description:"Space-delimited string of class names applied to tab panel container."},title:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"Content of tab title element, rendered in a list above the active panel.\nCan also be set via React `children`."},icon:{required:!1,tsType:{name:"union",raw:"IconName | MaybeElement",elements:[{name:"IconName"},{name:"union",raw:"React.JSX.Element | false | null | undefined",elements:[{name:"React.JSX.Element"},{name:"literal",value:"false"},{name:"null"},{name:"undefined"}]}]},description:"Name of a Blueprint UI icon (or an icon element) to render before the children."},tagContent:{required:!1,tsType:{name:'TagProps["children"]',raw:'TagProps["children"]'},description:"Content to render inside a `<Tag>` after the children.\nThe tag is `minimal` by default; it can be further modified by using `tagProps`."},tagProps:{required:!1,tsType:{name:"Omit",elements:[{name:"TagProps"},{name:"literal",value:'"children"'}],raw:'Omit<TagProps, "children">'},description:"Props to customize the `<Tag>` rendered after the children.\nThis has no effect if `tagContent` is `undefined`."},onClick:{required:!0,tsType:{name:"signature",type:"function",raw:"(id: TabId, event: React.MouseEvent<HTMLElement>) => void",signature:{arguments:[{type:{name:"union",raw:"string | number",elements:[{name:"string"},{name:"number"}]},name:"id"},{type:{name:"ReactMouseEvent",raw:"React.MouseEvent<HTMLElement>",elements:[{name:"HTMLElement"}]},name:"event"}],return:{name:"void"}}},description:"Handler invoked when this tab is clicked."},parentId:{required:!0,tsType:{name:"union",raw:"string | number",elements:[{name:"string"},{name:"number"}]},description:"ID of the parent `Tabs` to which this tab belongs. Used to generate ID for ARIA attributes."},selected:{required:!0,tsType:{name:"boolean"},description:"Whether the tab is currently selected."}},composes:["Omit"]};class H extends P{render(){const{className:t,id:a,parentId:s,selectedTabId:l,panel:r,renderActiveTabPanelOnly:d}=this.props,c=a===l;if(r===void 0||d&&!c)return;const{tabTitleId:p,tabPanelId:b}=B(s,a);return e.jsx("div",{"aria-labelledby":p,"aria-hidden":!c,className:m(q,t),id:b,role:"tabpanel",children:O(r)?r({tabPanelId:b,tabTitleId:p}):r})}}H.__docgenInfo={description:"Wraps the passed `panel`.",methods:[],displayName:"TabPanel",props:{selectedTabId:{required:!0,tsType:{name:"union",raw:"TabId | undefined",elements:[{name:"union",raw:"string | number",elements:[{name:"string"},{name:"number"}]},{name:"undefined"}]},description:"Used for setting visibility. This `TabPanel` will be visibile when `selectedTabId === id`, with proper accessibility attributes set."}},composes:["Pick"]};const S=`.${F}`;class o extends P{static Tab=n;static defaultProps={animate:!0,fill:!1,large:!1,renderActiveTabPanelOnly:!1,size:"medium",vertical:!1};static displayName=`${N}.Tabs`;static getDerivedStateFromProps({selectedTabId:t}){return t!==void 0?{selectedTabId:t}:null}tablistElement=null;refHandlers={tablist:t=>this.tablistElement=t};constructor(t){super(t);const a=this.getInitialSelectedTabId();this.state={selectedTabId:a}}render(){const{animate:t,children:a,className:s,fill:l,large:r,renderActiveTabPanelOnly:d,size:c="medium",vertical:p}=this.props,{indicatorWrapperStyle:b,selectedTabId:I}=this.state,E=w.Children.map(a,this.renderTabTitle),A=this.getTabChildren().filter(d?W=>W.props.id===I:()=>!0).map(this.renderTabPanel),R=t?e.jsx("div",{className:ie,style:b,children:e.jsx("div",{className:se})}):null,D=m(K,s,{[Y]:p,[G]:l}),V=m(Q,Z(c,{large:r}));return e.jsxs("div",{className:D,children:[e.jsxs("div",{className:V,onKeyDown:this.handleKeyDown,onKeyPress:this.handleKeyPress,ref:this.refHandlers.tablist,role:"tablist",children:[R,E]}),A]})}componentDidMount(){this.moveSelectionIndicator(!1)}componentDidUpdate(t,a){this.state.selectedTabId!==a.selectedTabId?this.moveSelectionIndicator():a.selectedTabId!=null&&!ee(this.getTabChildrenProps(t),this.getTabChildrenProps(),le)&&this.moveSelectionIndicator()}getInitialSelectedTabId(){const{defaultSelectedTabId:t,selectedTabId:a}=this.props;if(a!==void 0)return a;if(t!==void 0)return t;{const s=this.getTabChildren();return s.length===0?void 0:s[0].props.id}}getTabChildrenProps(t=this.props){return this.getTabChildren(t).map(a=>a.props)}getTabChildren(t=this.props){return w.Children.toArray(t.children).filter(L)}getTabElements(t=""){return this.tablistElement==null?[]:Array.from(this.tablistElement.querySelectorAll(S+t))}handleKeyDown=t=>{const a=te(t,["ArrowLeft","ArrowUp"],["ArrowRight","ArrowDown"]);if(a===void 0)return;const s=ne(this.tablistElement)?.closest(S);if(!s)return;const l=this.getTabElements('[aria-disabled="false"]'),r=l.indexOf(s);if(r<0)return;t.preventDefault();const{length:d}=l,c=(r+a+d)%d;l[c].focus()};handleKeyPress=t=>{const a=t.target.closest(S);a!=null&&ae(t)&&(t.preventDefault(),a.click())};handleTabClick=(t,a)=>{this.props.onChange?.(t,this.state.selectedTabId,a),this.props.selectedTabId===void 0&&this.setState({selectedTabId:t})};moveSelectionIndicator(t=!0){if(this.tablistElement==null||!this.props.animate)return;const a=`${S}[data-tab-id="${this.state.selectedTabId}"]`,s=this.tablistElement.querySelector(a);let l={display:"none"};if(s!=null){const{clientHeight:r,clientWidth:d,offsetLeft:c,offsetTop:p}=s;l={height:r,transform:`translateX(${Math.floor(c)}px) translateY(${Math.floor(p)}px)`,width:d},t||(l.transition="none")}this.setState({indicatorWrapperStyle:l})}renderTabPanel=t=>{const{className:a,panel:s,id:l,panelClassName:r}=t.props;if(s!==void 0)return w.createElement(H,{...t.props,key:l,className:m(a,r),parentId:this.props.id,selectedTabId:this.state.selectedTabId})};renderTabTitle=t=>{if(L(t)){const{id:a}=t.props;return e.jsx(M,{...t.props,parentId:this.props.id,onClick:this.handleTabClick,selected:a===this.state.selectedTabId})}return t}}function L(i){return re(i,n)}o.__docgenInfo={description:`Tabs component.

@see https://blueprintjs.com/docs/#core/components/tabs`,methods:[],props:{className:{required:!1,tsType:{name:"string"},description:"A space-delimited list of class names to pass along to a child element."},animate:{required:!1,tsType:{name:"boolean"},description:`Whether the selected tab indicator should animate its movement.

@default true`,defaultValue:{value:"true",computed:!1}},children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"Tab elements."},defaultSelectedTabId:{required:!1,tsType:{name:"union",raw:"string | number",elements:[{name:"string"},{name:"number"}]},description:"Initial selected tab `id`, for uncontrolled usage.\nNote that this prop refers only to `<Tab>` children; other types of elements are ignored.\n\n@default first tab"},id:{required:!0,tsType:{name:"union",raw:"string | number",elements:[{name:"string"},{name:"number"}]},description:"Unique identifier for this `Tabs` container. This will be combined with the `id` of each\n`Tab` child to generate ARIA accessibility attributes. IDs are required and should be\nunique on the page to support server-side rendering."},large:{required:!1,tsType:{name:"boolean"},description:'If set to `true`, the tab titles will display with larger styling.\nThis will apply large styles only to the tabs at this level, not to nested tabs.\n\n@deprecated use `size="large"` instead\n@default false',defaultValue:{value:"false",computed:!1}},size:{required:!1,tsType:{name:"Exclude",elements:[{name:"Size"},{name:"literal",value:'"small"'}],raw:'Exclude<Size, "small">'},description:`The size of the tab titles.

@default "medium"`,defaultValue:{value:'"medium"',computed:!1}},renderActiveTabPanelOnly:{required:!1,tsType:{name:"boolean"},description:`Whether inactive tab panels should be removed from the DOM and unmounted in React.
This can be a performance enhancement when rendering many complex panels, but requires
careful support for unmounting and remounting.

@default false`,defaultValue:{value:"false",computed:!1}},selectedTabId:{required:!1,tsType:{name:"union",raw:"string | number",elements:[{name:"string"},{name:"number"}]},description:"Selected tab `id`, for controlled usage.\nProviding this prop will put the component in controlled mode.\nUnknown ids will result in empty selection (no errors)."},vertical:{required:!1,tsType:{name:"boolean"},description:`Whether to show tabs stacked vertically on the left side.

@default false`,defaultValue:{value:"false",computed:!1}},fill:{required:!1,tsType:{name:"boolean"},description:`Whether to make the tabs list fill the height of its parent.

This has no effect when \`vertical={true}\`.
This is not recommended when tab panels are defined within this component subtree, as the height computation will
include the panel height, which is usually not intended. Instead, it works well if the panels are rendered
elsewhere in the React tree.

@default false`,defaultValue:{value:"false",computed:!1}}}};const{useArgs:pe}=__STORYBOOK_MODULE_PREVIEW_API__,be=["large","className","children","defaultSelectedTabId","selectedTabId","onChange","id","renderActiveTabPanelOnly"],je={title:"Core/Tabs",component:o,decorators:[de],args:{id:"tabs-story",animate:!0,vertical:!1,fill:!1,size:"medium"},argTypes:{size:{control:"select",options:["medium","large"]},animate:{control:"boolean"},vertical:{control:"boolean"},fill:{control:"boolean"},...be.reduce((i,t)=>(i[t]={table:{disable:!0}},i),{})}},C={render:i=>e.jsxs(o,{...i,children:[e.jsx(n,{id:"tab1",title:"First",panel:e.jsx("p",{children:"First panel content"})}),e.jsx(n,{id:"tab2",title:"Second",panel:e.jsx("p",{children:"Second panel content"})}),e.jsx(n,{id:"tab3",title:"Third",panel:e.jsx("p",{children:"Third panel content"})})]})},T={name:"Size",argTypes:{size:{table:{disable:!0}}},render:i=>e.jsxs(k,{flexDirection:"column",gap:6,alignItems:"start",children:[e.jsxs("div",{children:[e.jsx(h,{title:"Medium"}),e.jsx(u,{children:e.jsxs(o,{...i,id:"size-medium",size:"medium",children:[e.jsx(n,{id:"tab1",title:"First",panel:e.jsx("p",{children:"First panel"})}),e.jsx(n,{id:"tab2",title:"Second",panel:e.jsx("p",{children:"Second panel"})}),e.jsx(n,{id:"tab3",title:"Third",panel:e.jsx("p",{children:"Third panel"})})]})})]}),e.jsxs("div",{children:[e.jsx(h,{title:"Large"}),e.jsx(u,{children:e.jsxs(o,{...i,id:"size-large",size:"large",children:[e.jsx(n,{id:"tab1",title:"First",panel:e.jsx("p",{children:"First panel"})}),e.jsx(n,{id:"tab2",title:"Second",panel:e.jsx("p",{children:"Second panel"})}),e.jsx(n,{id:"tab3",title:"Third",panel:e.jsx("p",{children:"Third panel"})})]})})]})]})},f={name:"State",argTypes:{vertical:{table:{disable:!0}}},render:i=>e.jsxs(k,{gap:8,children:[e.jsxs("div",{children:[e.jsx(h,{title:"Vertical"}),e.jsx(u,{children:e.jsxs(o,{...i,id:"state-vertical",vertical:!0,children:[e.jsx(n,{id:"tab1",title:"First",panel:e.jsx("p",{children:"First panel content"})}),e.jsx(n,{id:"tab2",title:"Second",panel:e.jsx("p",{children:"Second panel content"})}),e.jsx(n,{id:"tab3",title:"Third",panel:e.jsx("p",{children:"Third panel content"})})]})})]}),e.jsxs("div",{children:[e.jsx(h,{title:"With Disabled Tab"}),e.jsx(u,{children:e.jsxs(o,{...i,id:"state-disabled",children:[e.jsx(n,{id:"tab1",title:"Enabled",panel:e.jsx("p",{children:"Enabled panel content"})}),e.jsx(n,{id:"tab2",title:"Disabled",disabled:!0,panel:e.jsx("p",{children:"Disabled panel content"})}),e.jsx(n,{id:"tab3",title:"Also Enabled",panel:e.jsx("p",{children:"Also enabled panel content"})})]})})]})]})},g={name:"Fill Height",argTypes:{fill:{table:{disable:!0}},vertical:{table:{disable:!0}}},render:i=>e.jsxs(k,{flexDirection:"column",gap:6,children:[e.jsxs("div",{children:[e.jsx(h,{title:"Default"}),e.jsx(u,{children:e.jsx("div",{style:{background:z.LIGHT_GRAY3,borderRadius:4,padding:4,height:80},children:e.jsxs(o,{...i,id:"fill-default",fill:!1,children:[e.jsx(n,{id:"tab1",title:"First"}),e.jsx(n,{id:"tab2",title:"Second"}),e.jsx(n,{id:"tab3",title:"Third"})]})})})]}),e.jsxs("div",{children:[e.jsx(h,{title:"Fill Height"}),e.jsx(u,{children:e.jsx("div",{style:{background:z.LIGHT_GRAY3,borderRadius:4,padding:4,height:80},children:e.jsxs(o,{...i,id:"fill-enabled",fill:!0,children:[e.jsx(n,{id:"tab1",title:"First"}),e.jsx(n,{id:"tab2",title:"Second"}),e.jsx(n,{id:"tab3",title:"Third"})]})})})]})]})},x={name:"Vertical",argTypes:{vertical:{table:{disable:!0}},fill:{table:{disable:!0}}},render:i=>e.jsxs(o,{...i,id:"vertical-example",vertical:!0,children:[e.jsx(n,{id:"tab1",title:"First",panel:e.jsx("p",{children:"First panel content"})}),e.jsx(n,{id:"tab2",title:"Second",panel:e.jsx("p",{children:"Second panel content"})}),e.jsx(n,{id:"tab3",title:"Third",panel:e.jsx("p",{children:"Third panel content"})})]})},y={name:"With Tag",render:i=>e.jsxs(o,{...i,id:"with-tag",children:[e.jsx(n,{id:"tab1",title:"Inbox",tagContent:42,panel:e.jsx("p",{children:"Inbox panel content"})}),e.jsx(n,{id:"tab2",title:"Sent",tagContent:3,panel:e.jsx("p",{children:"Sent panel content"})}),e.jsx(n,{id:"tab3",title:"Drafts",panel:e.jsx("p",{children:"Drafts panel content"})})]})},v={name:"Icon",render:i=>e.jsxs(o,{...i,id:"with-icon",children:[e.jsx(n,{id:"tab1",title:"Books",icon:"book",panel:e.jsx("p",{children:"Books panel content"})}),e.jsx(n,{id:"tab2",title:"Documents",icon:"document",panel:e.jsx("p",{children:"Documents panel content"})}),e.jsx(n,{id:"tab3",title:"Applications",icon:"application",panel:e.jsx("p",{children:"Applications panel content"})}),e.jsx(n,{id:"tab4",title:"Element icon",icon:e.jsx(oe,{}),panel:e.jsx("p",{children:"Element icon panel"})})]})},j={args:{selectedTabId:"tab1"},render:function(t){const[,a]=pe(),s=w.useCallback(l=>a({selectedTabId:l}),[a]);return e.jsxs(o,{...t,onChange:s,children:[e.jsx(n,{id:"tab1",title:"Photos",icon:"media",panel:e.jsx("p",{children:"Photos panel content"})}),e.jsx(n,{id:"tab2",title:"Videos",icon:"video",panel:e.jsx("p",{children:"Videos panel content"})}),e.jsx(n,{id:"tab3",title:"Music",icon:"music",panel:e.jsx("p",{children:"Music panel content"})}),e.jsx(n,{id:"tab4",title:"Books",disabled:!0,icon:"book",panel:e.jsx("p",{children:"Books panel content"})})]})}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: args => <Tabs {...args}>
            <Tab id="tab1" title="First" panel={<p>First panel content</p>} />
            <Tab id="tab2" title="Second" panel={<p>Second panel content</p>} />
            <Tab id="tab3" title="Third" panel={<p>Third panel content</p>} />
        </Tabs>
}`,...C.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  name: "Size",
  argTypes: {
    size: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="column" gap={6} alignItems="start">
            <div>
                <StoryLabel title="Medium" />
                <DashedPaddedContainer>
                    <Tabs {...args} id="size-medium" size="medium">
                        <Tab id="tab1" title="First" panel={<p>First panel</p>} />
                        <Tab id="tab2" title="Second" panel={<p>Second panel</p>} />
                        <Tab id="tab3" title="Third" panel={<p>Third panel</p>} />
                    </Tabs>
                </DashedPaddedContainer>
            </div>
            <div>
                <StoryLabel title="Large" />
                <DashedPaddedContainer>
                    <Tabs {...args} id="size-large" size="large">
                        <Tab id="tab1" title="First" panel={<p>First panel</p>} />
                        <Tab id="tab2" title="Second" panel={<p>Second panel</p>} />
                        <Tab id="tab3" title="Third" panel={<p>Third panel</p>} />
                    </Tabs>
                </DashedPaddedContainer>
            </div>
        </Flex>
}`,...T.parameters?.docs?.source},description:{story:"Use the `size` prop to control the tab size. Tabs support `medium` (default) and `large`.",...T.parameters?.docs?.description}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: "State",
  argTypes: {
    vertical: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex gap={8}>
            <div>
                <StoryLabel title="Vertical" />
                <DashedPaddedContainer>
                    <Tabs {...args} id="state-vertical" vertical={true}>
                        <Tab id="tab1" title="First" panel={<p>First panel content</p>} />
                        <Tab id="tab2" title="Second" panel={<p>Second panel content</p>} />
                        <Tab id="tab3" title="Third" panel={<p>Third panel content</p>} />
                    </Tabs>
                </DashedPaddedContainer>
            </div>
            <div>
                <StoryLabel title="With Disabled Tab" />
                <DashedPaddedContainer>
                    <Tabs {...args} id="state-disabled">
                        <Tab id="tab1" title="Enabled" panel={<p>Enabled panel content</p>} />
                        <Tab id="tab2" title="Disabled" disabled={true} panel={<p>Disabled panel content</p>} />
                        <Tab id="tab3" title="Also Enabled" panel={<p>Also enabled panel content</p>} />
                    </Tabs>
                </DashedPaddedContainer>
            </div>
        </Flex>
}`,...f.parameters?.docs?.source},description:{story:"Tabs support vertical layout and individual tabs can be disabled.",...f.parameters?.docs?.description}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: "Fill Height",
  argTypes: {
    fill: {
      table: {
        disable: true
      }
    },
    vertical: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="column" gap={6}>
            <div>
                <StoryLabel title="Default" />
                <DashedPaddedContainer>
                    <div style={{
          background: Colors.LIGHT_GRAY3,
          borderRadius: 4,
          padding: 4,
          height: 80
        }}>
                        <Tabs {...args} id="fill-default" fill={false}>
                            <Tab id="tab1" title="First" />
                            <Tab id="tab2" title="Second" />
                            <Tab id="tab3" title="Third" />
                        </Tabs>
                    </div>
                </DashedPaddedContainer>
            </div>
            <div>
                <StoryLabel title="Fill Height" />
                <DashedPaddedContainer>
                    <div style={{
          background: Colors.LIGHT_GRAY3,
          borderRadius: 4,
          padding: 4,
          height: 80
        }}>
                        <Tabs {...args} id="fill-enabled" fill={true}>
                            <Tab id="tab1" title="First" />
                            <Tab id="tab2" title="Second" />
                            <Tab id="tab3" title="Third" />
                        </Tabs>
                    </div>
                </DashedPaddedContainer>
            </div>
        </Flex>
}`,...g.parameters?.docs?.source},description:{story:`Use the \`fill\` prop to make the tab list fill the height of its parent container.

Whether to make the tabs list fill the height of its parent.
This has no effect when vertical={true}.`,...g.parameters?.docs?.description}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: "Vertical",
  argTypes: {
    vertical: {
      table: {
        disable: true
      }
    },
    fill: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Tabs {...args} id="vertical-example" vertical={true}>
            <Tab id="tab1" title="First" panel={<p>First panel content</p>} />
            <Tab id="tab2" title="Second" panel={<p>Second panel content</p>} />
            <Tab id="tab3" title="Third" panel={<p>Third panel content</p>} />
        </Tabs>
}`,...x.parameters?.docs?.source},description:{story:"Use the `vertical` prop to display tabs in a vertical layout.\n\nIn vertical mode, the tab list is rendered as a column alongside the tab panels.",...x.parameters?.docs?.description}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  name: "With Tag",
  render: args => <Tabs {...args} id="with-tag">
            <Tab id="tab1" title="Inbox" tagContent={42} panel={<p>Inbox panel content</p>} />
            <Tab id="tab2" title="Sent" tagContent={3} panel={<p>Sent panel content</p>} />
            <Tab id="tab3" title="Drafts" panel={<p>Drafts panel content</p>} />
        </Tabs>
}`,...y.parameters?.docs?.source},description:{story:"Tabs can display a `<Tag>` next to the title using the `tagContent` prop.",...y.parameters?.docs?.description}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  name: "Icon",
  render: args => <Tabs {...args} id="with-icon">
            <Tab id="tab1" title="Books" icon="book" panel={<p>Books panel content</p>} />
            <Tab id="tab2" title="Documents" icon="document" panel={<p>Documents panel content</p>} />
            <Tab id="tab3" title="Applications" icon="application" panel={<p>Applications panel content</p>} />
            <Tab id="tab4" title="Element icon" icon={<Home />} panel={<p>Element icon panel</p>} />
        </Tabs>
}`,...v.parameters?.docs?.source},description:{story:"Each tab can display an icon using the `icon` prop.",...v.parameters?.docs?.description}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    selectedTabId: "tab1"
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    const handleChange = useCallback((newTabId: string | number) => updateArgs({
      selectedTabId: newTabId
    }), [updateArgs]);
    return <Tabs {...args} onChange={handleChange}>
                <Tab id="tab1" title="Photos" icon="media" panel={<p>Photos panel content</p>} />
                <Tab id="tab2" title="Videos" icon="video" panel={<p>Videos panel content</p>} />
                <Tab id="tab3" title="Music" icon="music" panel={<p>Music panel content</p>} />
                <Tab id="tab4" title="Books" disabled={true} icon="book" panel={<p>Books panel content</p>} />
            </Tabs>;
  }
}`,...j.parameters?.docs?.source},description:{story:"Interactive playground for experimenting with all Tabs props.",...j.parameters?.docs?.description}}};const Ie=["Default","SizeExample","StateExample","FillExample","VerticalExample","WithTagExample","IconExample","Playground"];export{C as Default,g as FillExample,v as IconExample,j as Playground,T as SizeExample,f as StateExample,x as VerticalExample,y as WithTagExample,Ie as __namedExportsOrder,je as default};
