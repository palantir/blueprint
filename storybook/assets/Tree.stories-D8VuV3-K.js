import{r as m,g as D,e as x,cL as j,cM as B,cN as q,m as O,cO as R,j as a,ai as F,cP as W,cQ as X,cR as V,cS as U,cT as J,cU as K,cV as Y,cW as $,cX as Q,ab as z,cY as G}from"./iframe-6KWIKMhT.js";import{S as h}from"./common-CGlRPlLv.js";import{H as Z}from"./home-BddfYDeC.js";import{F as _}from"./flex-CfNrUc6L.js";import{C as ee}from"./collapse-ZAjSlNXb.js";import{C as ne}from"./chevron-right-CS7TWnKY.js";import"./preload-helper-PPVm8Dsz.js";class M extends m.Component{static displayName=`${D}.TreeNode`;static ofType(){return M}render(){const{children:e,className:n,disabled:t,icon:s,isExpanded:d,isSelected:u,label:l}=this.props,c=x(j,{[O]:t,[q]:u,[B]:d},n),S=x(R,`${R}-${this.props.depth}`),w=t===!0?{}:{onClick:this.handleClick,onContextMenu:this.handleContextMenu,onDoubleClick:this.handleDoubleClick,onMouseEnter:this.handleMouseEnter,onMouseLeave:this.handleMouseLeave};return a.jsxs("li",{className:c,children:[a.jsxs("div",{className:S,ref:this.handleContentRef,...w,children:[this.maybeRenderCaret(),a.jsx(F,{className:W,icon:s,"aria-hidden":!0,tabIndex:-1}),a.jsx("span",{className:X,children:l}),this.maybeRenderSecondaryLabel()]}),a.jsx(ee,{isOpen:d,children:e})]})}maybeRenderCaret(){const{children:e,isExpanded:n,disabled:t,hasCaret:s=m.Children.count(e)>0}=this.props;if(s){const d=x(V,n?U:J);return a.jsx(ne,{title:n?"Collapse group":"Expand group",className:d,onClick:t===!0?void 0:this.handleCaretClick})}return a.jsx("span",{className:K})}maybeRenderSecondaryLabel(){if(this.props.secondaryLabel!=null)return a.jsx("span",{className:Y,children:this.props.secondaryLabel})}handleCaretClick=e=>{e.stopPropagation();const{isExpanded:n,onCollapse:t,onExpand:s}=this.props;(n?t:s)?.(this.props,this.props.path,e)};handleClick=e=>{this.props.onClick?.(this.props,this.props.path,e)};handleContentRef=e=>{this.props.contentRef?.(this.props,e)};handleContextMenu=e=>{this.props.onContextMenu?.(this.props,this.props.path,e)};handleDoubleClick=e=>{this.props.onDoubleClick?.(this.props,this.props.path,e)};handleMouseEnter=e=>{this.props.onMouseEnter?.(this.props,this.props.path,e)};handleMouseLeave=e=>{this.props.onMouseLeave?.(this.props,this.props.path,e)}}M.__docgenInfo={description:`Tree node component.

@see https://blueprintjs.com/docs/#core/components/tree.tree-node`,methods:[{name:"ofType",docblock:"@deprecated no longer necessary now that the TypeScript parser supports type arguments on JSX element tags",modifiers:["static"],params:[],returns:null,description:null}],props:{className:{required:!1,tsType:{name:"string"},description:"A space-delimited list of class names for this tree node element."},childNodes:{required:!1,tsType:{name:"Array",elements:[{name:"TreeNodeInfo",elements:[{name:"T"}],raw:"TreeNodeInfo<T>"}],raw:"Array<TreeNodeInfo<T>>"},description:"Child tree nodes of this node."},disabled:{required:!1,tsType:{name:"boolean"},description:`Whether this tree node is non-interactive. Enabling this prop will ignore
mouse event handlers (in particular click, down, enter, leave).`},hasCaret:{required:!1,tsType:{name:"boolean"},description:`Whether the caret to expand/collapse a node should be shown.
If not specified, this will be true if the node has children and false otherwise.`},icon:{required:!1,tsType:{name:"union",raw:"IconName | MaybeElement",elements:[{name:"IconName"},{name:"union",raw:"React.JSX.Element | false | null | undefined",elements:[{name:"React.JSX.Element"},{name:"literal",value:"false"},{name:"null"},{name:"undefined"}]}]},description:"The name of a Blueprint icon (or an icon element) to render next to the node's label."},id:{required:!0,tsType:{name:"union",raw:"string | number",elements:[{name:"string"},{name:"number"}]},description:"A unique identifier for the node."},isExpanded:{required:!1,tsType:{name:"boolean"},description:""},isSelected:{required:!1,tsType:{name:"boolean"},description:`Whether this node is selected.

@default false`},label:{required:!0,tsType:{name:"union",raw:"string | React.JSX.Element",elements:[{name:"string"},{name:"React.JSX.Element"}]},description:"The main label for the node."},secondaryLabel:{required:!1,tsType:{name:"union",raw:"string | MaybeElement",elements:[{name:"string"},{name:"union",raw:"React.JSX.Element | false | null | undefined",elements:[{name:"React.JSX.Element"},{name:"literal",value:"false"},{name:"null"},{name:"undefined"}]}]},description:"A secondary label/component that is displayed at the right side of the node."},nodeData:{required:!1,tsType:{name:"T"},description:"An optional custom user object to associate with the node.\nThis property can then be used in the `onClick`, `onContextMenu` and `onDoubleClick`\nevent handlers for doing custom logic per node."},children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},contentRef:{required:!1,tsType:{name:"signature",type:"function",raw:"(node: TreeNodeInfo<T>, element: HTMLDivElement | null) => void",signature:{arguments:[{type:{name:"TreeNodeInfo",elements:[{name:"T"}],raw:"TreeNodeInfo<T>"},name:"node"},{type:{name:"union",raw:"HTMLDivElement | null",elements:[{name:"HTMLDivElement"},{name:"null"}]},name:"element"}],return:{name:"void"}}},description:""},depth:{required:!0,tsType:{name:"number"},description:""},key:{required:!1,tsType:{name:"union",raw:"string | number",elements:[{name:"string"},{name:"number"}]},description:""},onClick:{required:!1,tsType:{name:"signature",type:"function",raw:`(
    node: TreeNodeInfo<T>,
    nodePath: number[],
    e: React.MouseEvent<HTMLElement>,
) => void`,signature:{arguments:[{type:{name:"TreeNodeInfo",elements:[{name:"T"}],raw:"TreeNodeInfo<T>"},name:"node"},{type:{name:"Array",elements:[{name:"number"}],raw:"number[]"},name:"nodePath"},{type:{name:"ReactMouseEvent",raw:"React.MouseEvent<HTMLElement>",elements:[{name:"HTMLElement"}]},name:"e"}],return:{name:"void"}}},description:""},onCollapse:{required:!1,tsType:{name:"signature",type:"function",raw:`(
    node: TreeNodeInfo<T>,
    nodePath: number[],
    e: React.MouseEvent<HTMLElement>,
) => void`,signature:{arguments:[{type:{name:"TreeNodeInfo",elements:[{name:"T"}],raw:"TreeNodeInfo<T>"},name:"node"},{type:{name:"Array",elements:[{name:"number"}],raw:"number[]"},name:"nodePath"},{type:{name:"ReactMouseEvent",raw:"React.MouseEvent<HTMLElement>",elements:[{name:"HTMLElement"}]},name:"e"}],return:{name:"void"}}},description:""},onContextMenu:{required:!1,tsType:{name:"signature",type:"function",raw:`(
    node: TreeNodeInfo<T>,
    nodePath: number[],
    e: React.MouseEvent<HTMLElement>,
) => void`,signature:{arguments:[{type:{name:"TreeNodeInfo",elements:[{name:"T"}],raw:"TreeNodeInfo<T>"},name:"node"},{type:{name:"Array",elements:[{name:"number"}],raw:"number[]"},name:"nodePath"},{type:{name:"ReactMouseEvent",raw:"React.MouseEvent<HTMLElement>",elements:[{name:"HTMLElement"}]},name:"e"}],return:{name:"void"}}},description:""},onDoubleClick:{required:!1,tsType:{name:"signature",type:"function",raw:`(
    node: TreeNodeInfo<T>,
    nodePath: number[],
    e: React.MouseEvent<HTMLElement>,
) => void`,signature:{arguments:[{type:{name:"TreeNodeInfo",elements:[{name:"T"}],raw:"TreeNodeInfo<T>"},name:"node"},{type:{name:"Array",elements:[{name:"number"}],raw:"number[]"},name:"nodePath"},{type:{name:"ReactMouseEvent",raw:"React.MouseEvent<HTMLElement>",elements:[{name:"HTMLElement"}]},name:"e"}],return:{name:"void"}}},description:""},onExpand:{required:!1,tsType:{name:"signature",type:"function",raw:`(
    node: TreeNodeInfo<T>,
    nodePath: number[],
    e: React.MouseEvent<HTMLElement>,
) => void`,signature:{arguments:[{type:{name:"TreeNodeInfo",elements:[{name:"T"}],raw:"TreeNodeInfo<T>"},name:"node"},{type:{name:"Array",elements:[{name:"number"}],raw:"number[]"},name:"nodePath"},{type:{name:"ReactMouseEvent",raw:"React.MouseEvent<HTMLElement>",elements:[{name:"HTMLElement"}]},name:"e"}],return:{name:"void"}}},description:""},onMouseEnter:{required:!1,tsType:{name:"signature",type:"function",raw:`(
    node: TreeNodeInfo<T>,
    nodePath: number[],
    e: React.MouseEvent<HTMLElement>,
) => void`,signature:{arguments:[{type:{name:"TreeNodeInfo",elements:[{name:"T"}],raw:"TreeNodeInfo<T>"},name:"node"},{type:{name:"Array",elements:[{name:"number"}],raw:"number[]"},name:"nodePath"},{type:{name:"ReactMouseEvent",raw:"React.MouseEvent<HTMLElement>",elements:[{name:"HTMLElement"}]},name:"e"}],return:{name:"void"}}},description:""},onMouseLeave:{required:!1,tsType:{name:"signature",type:"function",raw:`(
    node: TreeNodeInfo<T>,
    nodePath: number[],
    e: React.MouseEvent<HTMLElement>,
) => void`,signature:{arguments:[{type:{name:"TreeNodeInfo",elements:[{name:"T"}],raw:"TreeNodeInfo<T>"},name:"node"},{type:{name:"Array",elements:[{name:"number"}],raw:"number[]"},name:"nodePath"},{type:{name:"ReactMouseEvent",raw:"React.MouseEvent<HTMLElement>",elements:[{name:"HTMLElement"}]},name:"e"}],return:{name:"void"}}},description:""},path:{required:!0,tsType:{name:"Array",elements:[{name:"number"}],raw:"number[]"},description:""}}};class r extends m.Component{static displayName=`${D}.Tree`;static ofType(){return r}static nodeFromPath(e,n){return e.length===1?n[e[0]]:r.nodeFromPath(e.slice(1),n[e[0]].childNodes)}nodeRefs={};render(){return a.jsx("div",{className:x(Q,this.props.className,{[z]:this.props.compact}),children:this.renderNodes(this.props.contents,[],$)})}getNodeContentElement(e){return this.nodeRefs[e]}renderNodes(e,n,t){if(e==null)return null;const s=e.map((d,u)=>{const l=n.concat(u);return m.createElement(M,{...d,key:d.id,contentRef:this.handleContentRef,depth:l.length-1,onClick:this.handleNodeClick,onContextMenu:this.handleNodeContextMenu,onCollapse:this.handleNodeCollapse,onDoubleClick:this.handleNodeDoubleClick,onExpand:this.handleNodeExpand,onMouseEnter:this.handleNodeMouseEnter,onMouseLeave:this.handleNodeMouseLeave,path:l},this.renderNodes(d.childNodes,l))});return a.jsx("ul",{className:x(G,t),children:s})}handleContentRef=(e,n)=>{n!=null?this.nodeRefs[e.id]=n:delete this.nodeRefs[e.id]};handleNodeCollapse=(e,n,t)=>{this.props.onNodeCollapse?.(e,n,t)};handleNodeClick=(e,n,t)=>{this.props.onNodeClick?.(e,n,t)};handleNodeContextMenu=(e,n,t)=>{this.props.onNodeContextMenu?.(e,n,t)};handleNodeDoubleClick=(e,n,t)=>{this.props.onNodeDoubleClick?.(e,n,t)};handleNodeExpand=(e,n,t)=>{this.props.onNodeExpand?.(e,n,t)};handleNodeMouseEnter=(e,n,t)=>{this.props.onNodeMouseEnter?.(e,n,t)};handleNodeMouseLeave=(e,n,t)=>{this.props.onNodeMouseLeave?.(e,n,t)}}r.__docgenInfo={description:`Tree component.

@see https://blueprintjs.com/docs/#core/components/tree`,methods:[{name:"ofType",docblock:null,modifiers:["static"],params:[],returns:null},{name:"nodeFromPath",docblock:null,modifiers:["static"],params:[{name:"path",optional:!1,type:{name:"unknown"}},{name:"treeNodes",optional:!0,type:{name:"ReadonlyArray",elements:[{name:"TreeNodeInfo",elements:[{name:"U"}],raw:"TreeNodeInfo<U>"}],raw:"ReadonlyArray<TreeNodeInfo<U>>",alias:"ReadonlyArray"}}],returns:{type:{name:"TreeNodeInfo",elements:[{name:"U"}],raw:"TreeNodeInfo<U>"}}},{name:"getNodeContentElement",docblock:"Returns the underlying HTML element of the `Tree` node with an id of `nodeId`.\nThis element does not contain the children of the node, only its label and controls.\nIf the node is not currently mounted, `undefined` is returned.",modifiers:[],params:[{name:"nodeId",optional:!1,type:{name:"union",raw:"string | number",elements:[{name:"string"},{name:"number"}]}}],returns:{type:{name:"union",raw:"HTMLElement | undefined",elements:[{name:"HTMLElement"},{name:"undefined"}]}},description:"Returns the underlying HTML element of the `Tree` node with an id of `nodeId`.\nThis element does not contain the children of the node, only its label and controls.\nIf the node is not currently mounted, `undefined` is returned."}],props:{className:{required:!1,tsType:{name:"string"},description:"A space-delimited list of class names to pass along to a child element."},compact:{required:!1,tsType:{name:"boolean"},description:"Whether to use a compact appearance which reduces the visual padding around node content."},contents:{required:!0,tsType:{name:"ReadonlyArray",elements:[{name:"TreeNodeInfo",elements:[{name:"T"}],raw:"TreeNodeInfo<T>"}],raw:"ReadonlyArray<TreeNodeInfo<T>>"},description:"The data specifying the contents and appearance of the tree."},onNodeClick:{required:!1,tsType:{name:"signature",type:"function",raw:`(
    node: TreeNodeInfo<T>,
    nodePath: number[],
    e: React.MouseEvent<HTMLElement>,
) => void`,signature:{arguments:[{type:{name:"TreeNodeInfo",elements:[{name:"T"}],raw:"TreeNodeInfo<T>"},name:"node"},{type:{name:"Array",elements:[{name:"number"}],raw:"number[]"},name:"nodePath"},{type:{name:"ReactMouseEvent",raw:"React.MouseEvent<HTMLElement>",elements:[{name:"HTMLElement"}]},name:"e"}],return:{name:"void"}}},description:"Invoked when a node is clicked anywhere other than the caret for expanding/collapsing the node."},onNodeCollapse:{required:!1,tsType:{name:"signature",type:"function",raw:`(
    node: TreeNodeInfo<T>,
    nodePath: number[],
    e: React.MouseEvent<HTMLElement>,
) => void`,signature:{arguments:[{type:{name:"TreeNodeInfo",elements:[{name:"T"}],raw:"TreeNodeInfo<T>"},name:"node"},{type:{name:"Array",elements:[{name:"number"}],raw:"number[]"},name:"nodePath"},{type:{name:"ReactMouseEvent",raw:"React.MouseEvent<HTMLElement>",elements:[{name:"HTMLElement"}]},name:"e"}],return:{name:"void"}}},description:"Invoked when caret of an expanded node is clicked."},onNodeContextMenu:{required:!1,tsType:{name:"signature",type:"function",raw:`(
    node: TreeNodeInfo<T>,
    nodePath: number[],
    e: React.MouseEvent<HTMLElement>,
) => void`,signature:{arguments:[{type:{name:"TreeNodeInfo",elements:[{name:"T"}],raw:"TreeNodeInfo<T>"},name:"node"},{type:{name:"Array",elements:[{name:"number"}],raw:"number[]"},name:"nodePath"},{type:{name:"ReactMouseEvent",raw:"React.MouseEvent<HTMLElement>",elements:[{name:"HTMLElement"}]},name:"e"}],return:{name:"void"}}},description:"Invoked when a node is right-clicked or the context menu button is pressed on a focused node."},onNodeDoubleClick:{required:!1,tsType:{name:"signature",type:"function",raw:`(
    node: TreeNodeInfo<T>,
    nodePath: number[],
    e: React.MouseEvent<HTMLElement>,
) => void`,signature:{arguments:[{type:{name:"TreeNodeInfo",elements:[{name:"T"}],raw:"TreeNodeInfo<T>"},name:"node"},{type:{name:"Array",elements:[{name:"number"}],raw:"number[]"},name:"nodePath"},{type:{name:"ReactMouseEvent",raw:"React.MouseEvent<HTMLElement>",elements:[{name:"HTMLElement"}]},name:"e"}],return:{name:"void"}}},description:"Invoked when a node is double-clicked. Be careful when using this in combination with\nan `onNodeClick` (single-click) handler, as the way this behaves can vary between browsers.\nSee http://stackoverflow.com/q/5497073/3124288"},onNodeExpand:{required:!1,tsType:{name:"signature",type:"function",raw:`(
    node: TreeNodeInfo<T>,
    nodePath: number[],
    e: React.MouseEvent<HTMLElement>,
) => void`,signature:{arguments:[{type:{name:"TreeNodeInfo",elements:[{name:"T"}],raw:"TreeNodeInfo<T>"},name:"node"},{type:{name:"Array",elements:[{name:"number"}],raw:"number[]"},name:"nodePath"},{type:{name:"ReactMouseEvent",raw:"React.MouseEvent<HTMLElement>",elements:[{name:"HTMLElement"}]},name:"e"}],return:{name:"void"}}},description:"Invoked when the caret of a collapsed node is clicked."},onNodeMouseEnter:{required:!1,tsType:{name:"signature",type:"function",raw:`(
    node: TreeNodeInfo<T>,
    nodePath: number[],
    e: React.MouseEvent<HTMLElement>,
) => void`,signature:{arguments:[{type:{name:"TreeNodeInfo",elements:[{name:"T"}],raw:"TreeNodeInfo<T>"},name:"node"},{type:{name:"Array",elements:[{name:"number"}],raw:"number[]"},name:"nodePath"},{type:{name:"ReactMouseEvent",raw:"React.MouseEvent<HTMLElement>",elements:[{name:"HTMLElement"}]},name:"e"}],return:{name:"void"}}},description:"Invoked when the mouse is moved over a node."},onNodeMouseLeave:{required:!1,tsType:{name:"signature",type:"function",raw:`(
    node: TreeNodeInfo<T>,
    nodePath: number[],
    e: React.MouseEvent<HTMLElement>,
) => void`,signature:{arguments:[{type:{name:"TreeNodeInfo",elements:[{name:"T"}],raw:"TreeNodeInfo<T>"},name:"node"},{type:{name:"Array",elements:[{name:"number"}],raw:"number[]"},name:"nodePath"},{type:{name:"ReactMouseEvent",raw:"React.MouseEvent<HTMLElement>",elements:[{name:"HTMLElement"}]},name:"e"}],return:{name:"void"}}},description:"Invoked when the mouse is moved out of a node."}}};const{expect:i,waitFor:te}=__STORYBOOK_MODULE_TEST__;function P(o,e){if(o!==void 0)for(const n of o)e(n),P(n.childNodes,e)}function k(o,e,n){n(r.nodeFromPath(e,o))}function H(o,e){switch(e.type){case"DESELECT_ALL":{const n=structuredClone(o);return P(n,t=>t.isSelected=!1),n}case"SET_IS_EXPANDED":{const n=structuredClone(o);return k(n,e.payload.path,t=>t.isExpanded=e.payload.isExpanded),n}case"SET_IS_SELECTED":{const n=structuredClone(o);return k(n,e.payload.path,t=>t.isSelected=e.payload.isSelected),n}default:return o}}const I=[{id:0,hasCaret:!0,icon:"folder-close",label:"Folder 0",isExpanded:!0,childNodes:[{id:1,icon:"document",label:"Item 0"},{id:2,icon:"document",label:"Item 1"},{id:3,hasCaret:!0,icon:"folder-close",label:"Folder 1",isExpanded:!1,childNodes:[{id:4,icon:"document",label:"Nested Item 0"},{id:5,icon:"document",label:"Nested Item 1"}]}]},{id:6,hasCaret:!0,icon:"folder-close",label:"Folder 2",isExpanded:!1,childNodes:[{id:7,icon:"document",label:"Item 2"},{id:8,icon:"document",label:"Item 3"}]},{id:9,icon:"document",label:"Item 4"}],A=[{id:0,hasCaret:!0,icon:"folder-close",label:"Folder 0",isExpanded:!0,childNodes:[{id:1,icon:"document",label:"Item 0",isSelected:!0},{id:2,icon:"document",label:"Item 1"}]},{id:3,icon:"document",label:"Item 2"}],ae=[{id:0,icon:"home",label:"String icon"},{id:1,icon:a.jsx(Z,{}),label:"Element icon"}],L=[{id:0,hasCaret:!0,icon:"folder-close",label:"Folder 0 (disabled)",isExpanded:!0,disabled:!0,childNodes:[{id:1,icon:"document",label:"Item 0",disabled:!0},{id:2,icon:"document",label:"Item 1",disabled:!0}]},{id:3,icon:"document",label:"Item 2"}],me={title:"Core/Tree",component:r,decorators:[o=>a.jsx("div",{style:{minWidth:"350px"},children:a.jsx(o,{})})],tags:["autodocs"],args:{contents:I,compact:!1},argTypes:{compact:{control:"boolean"},onNodeClick:{action:"nodeClick"},onNodeCollapse:{action:"nodeCollapse"},onNodeExpand:{action:"nodeExpand"},onNodeContextMenu:{action:"nodeContextMenu"},onNodeDoubleClick:{action:"nodeDoubleClick"},onNodeMouseEnter:{action:"nodeMouseEnter"},onNodeMouseLeave:{action:"nodeMouseLeave"}}},g={},T={name:"Compact",argTypes:{compact:{table:{disable:!0}}},args:{compact:!0}},E={name:"State",render:o=>a.jsxs(_,{gap:8,children:[a.jsxs("div",{children:[a.jsx(h,{title:"Selected"}),a.jsx("div",{style:{minWidth:"300px"},children:a.jsx(r,{...o,contents:A})})]}),a.jsxs("div",{children:[a.jsx(h,{title:"Disabled"}),a.jsx("div",{style:{minWidth:"300px"},children:a.jsx(r,{...o,contents:L})})]})]})},y={name:"All States",render:o=>a.jsxs(_,{gap:8,flexWrap:"wrap",children:[a.jsxs("div",{children:[a.jsx(h,{title:"Default"}),a.jsx("div",{style:{minWidth:"300px"},children:a.jsx(r,{...o,contents:I})})]}),a.jsxs("div",{children:[a.jsx(h,{title:"Selected"}),a.jsx("div",{style:{minWidth:"300px"},children:a.jsx(r,{...o,contents:A})})]}),a.jsxs("div",{children:[a.jsx(h,{title:"Disabled"}),a.jsx("div",{style:{minWidth:"300px"},children:a.jsx(r,{...o,contents:L})})]}),a.jsxs("div",{children:[a.jsx(h,{title:"Compact"}),a.jsx("div",{style:{minWidth:"300px"},children:a.jsx(r,{...o,contents:I,compact:!0})})]})]})},f={name:"Element icon",args:{contents:ae}},p={render:function(e){const[n,t]=m.useReducer(H,I),s=m.useCallback((l,c,S)=>{const w=l.isSelected;S.shiftKey||t({type:"DESELECT_ALL"}),t({payload:{isSelected:w==null?!0:!w,path:c},type:"SET_IS_SELECTED"})},[]),d=m.useCallback((l,c)=>{t({payload:{isExpanded:!1,path:c},type:"SET_IS_EXPANDED"})},[]),u=m.useCallback((l,c)=>{t({payload:{isExpanded:!0,path:c},type:"SET_IS_EXPANDED"})},[]);return a.jsx(r,{...e,contents:n,onNodeClick:s,onNodeCollapse:d,onNodeExpand:u})}},N={name:"Select Node",...p,play:async({canvas:o,userEvent:e,step:n})=>{const t=o.getByText("Item 0"),s=o.getByText("Item 1");await n("Click node to select it",async()=>{await e.click(t),await i(t.closest(".bp6-tree-node")).toHaveClass("bp6-tree-node-selected")}),await n("Click another node — selection moves",async()=>{await e.click(s),await i(s.closest(".bp6-tree-node")).toHaveClass("bp6-tree-node-selected"),await i(t.closest(".bp6-tree-node")).not.toHaveClass("bp6-tree-node-selected")}),await n("Click same node again to deselect",async()=>{await e.click(s),await i(s.closest(".bp6-tree-node")).not.toHaveClass("bp6-tree-node-selected")})}},b={name:"Expand Node",...p,play:async({canvas:o,userEvent:e,step:n})=>{await n("Collapsed folder hides children",async()=>{await i(o.queryByText("Nested Item 0")).toBeNull()}),await n("Click caret to expand folder",async()=>{const t=o.getByText("Folder 1").closest(".bp6-tree-node").querySelector(".bp6-tree-node-caret");await e.click(t),await i(o.getByText("Nested Item 0")).toBeVisible(),await i(o.getByText("Nested Item 1")).toBeVisible()})}},C={name:"Collapse Node",...p,play:async({canvas:o,userEvent:e,step:n})=>{await n("Expanded folder shows children",async()=>{await i(o.getByText("Item 0")).toBeVisible(),await i(o.getByText("Item 1")).toBeVisible()}),await n("Click caret to collapse folder",async()=>{const t=o.getByText("Folder 0").closest(".bp6-tree-node").querySelector(".bp6-tree-node-caret");await e.click(t),await te(()=>i(o.queryByText("Item 0")).toBeNull())})}},v={name:"Disabled Interaction",render:function(e){const[n,t]=m.useReducer(H,L),s=m.useCallback((d,u,l)=>{const c=d.isSelected;l.shiftKey||t({type:"DESELECT_ALL"}),t({payload:{isSelected:c==null?!0:!c,path:u},type:"SET_IS_SELECTED"})},[]);return a.jsx(r,{...e,contents:n,onNodeClick:s})},play:async({canvas:o,userEvent:e,step:n})=>{await n("Click disabled node — no selection",async()=>{const t=o.getByText("Item 0");await e.click(t),await i(t.closest(".bp6-tree-node")).not.toHaveClass("bp6-tree-node-selected")}),await n("Click enabled node — becomes selected",async()=>{const t=o.getByText("Item 2");await e.click(t),await i(t.closest(".bp6-tree-node")).toHaveClass("bp6-tree-node-selected")})}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:"{}",...g.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  name: "Compact",
  argTypes: {
    compact: {
      table: {
        disable: true
      }
    }
  },
  args: {
    compact: true
  }
}`,...T.parameters?.docs?.source},description:{story:"Use the `compact` prop for a denser tree layout.",...T.parameters?.docs?.description}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  name: "State",
  render: args => <Flex gap={8}>
            <div>
                <StoryLabel title="Selected" />
                <div style={{
        minWidth: "300px"
      }}>
                    <Tree {...args} contents={SELECTED_CONTENTS} />
                </div>
            </div>
            <div>
                <StoryLabel title="Disabled" />
                <div style={{
        minWidth: "300px"
      }}>
                    <Tree {...args} contents={DISABLED_CONTENTS} />
                </div>
            </div>
        </Flex>
}`,...E.parameters?.docs?.source},description:{story:"Tree nodes support `isSelected`, `disabled`, and `isExpanded` states.",...E.parameters?.docs?.description}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  name: "All States",
  render: args => <Flex gap={8} flexWrap="wrap">
            <div>
                <StoryLabel title="Default" />
                <div style={{
        minWidth: "300px"
      }}>
                    <Tree {...args} contents={SAMPLE_CONTENTS} />
                </div>
            </div>
            <div>
                <StoryLabel title="Selected" />
                <div style={{
        minWidth: "300px"
      }}>
                    <Tree {...args} contents={SELECTED_CONTENTS} />
                </div>
            </div>
            <div>
                <StoryLabel title="Disabled" />
                <div style={{
        minWidth: "300px"
      }}>
                    <Tree {...args} contents={DISABLED_CONTENTS} />
                </div>
            </div>
            <div>
                <StoryLabel title="Compact" />
                <div style={{
        minWidth: "300px"
      }}>
                    <Tree {...args} contents={SAMPLE_CONTENTS} compact={true} />
                </div>
            </div>
        </Flex>
}`,...y.parameters?.docs?.source},description:{story:"All tree states displayed together for visual comparison.",...y.parameters?.docs?.description}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: "Element icon",
  args: {
    contents: ELEMENT_ICON_CONTENTS
  }
}`,...f.parameters?.docs?.source},description:{story:"`TreeNodeInfo.icon` accepts either a string icon name or a React element.",...f.parameters?.docs?.description}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: function Render(args) {
    const [nodes, dispatch] = useReducer(treeExampleReducer, SAMPLE_CONTENTS);
    const handleNodeClick = useCallback((node: TreeNodeInfo, nodePath: NodePath, e: MouseEvent<HTMLElement>) => {
      const originallySelected = node.isSelected;
      if (!e.shiftKey) {
        dispatch({
          type: "DESELECT_ALL"
        });
      }
      dispatch({
        payload: {
          isSelected: originallySelected == null ? true : !originallySelected,
          path: nodePath
        },
        type: "SET_IS_SELECTED"
      });
    }, []);
    const handleNodeCollapse = useCallback((_node: TreeNodeInfo, nodePath: NodePath) => {
      dispatch({
        payload: {
          isExpanded: false,
          path: nodePath
        },
        type: "SET_IS_EXPANDED"
      });
    }, []);
    const handleNodeExpand = useCallback((_node: TreeNodeInfo, nodePath: NodePath) => {
      dispatch({
        payload: {
          isExpanded: true,
          path: nodePath
        },
        type: "SET_IS_EXPANDED"
      });
    }, []);
    return <Tree {...args} contents={nodes} onNodeClick={handleNodeClick} onNodeCollapse={handleNodeCollapse} onNodeExpand={handleNodeExpand} />;
  }
}`,...p.parameters?.docs?.source},description:{story:"Interactive playground with node click, expand, and collapse handlers.",...p.parameters?.docs?.description}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  name: "Select Node",
  ...Playground,
  play: async ({
    canvas,
    userEvent,
    step
  }) => {
    const item0 = canvas.getByText("Item 0");
    const item1 = canvas.getByText("Item 1");
    await step("Click node to select it", async () => {
      await userEvent.click(item0);
      await expect(item0.closest(".bp6-tree-node")).toHaveClass("bp6-tree-node-selected");
    });
    await step("Click another node — selection moves", async () => {
      await userEvent.click(item1);
      await expect(item1.closest(".bp6-tree-node")).toHaveClass("bp6-tree-node-selected");
      await expect(item0.closest(".bp6-tree-node")).not.toHaveClass("bp6-tree-node-selected");
    });
    await step("Click same node again to deselect", async () => {
      await userEvent.click(item1);
      await expect(item1.closest(".bp6-tree-node")).not.toHaveClass("bp6-tree-node-selected");
    });
  }
}`,...N.parameters?.docs?.source},description:{story:"Clicking a node selects it. Clicking again deselects it.",...N.parameters?.docs?.description}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  name: "Expand Node",
  ...Playground,
  play: async ({
    canvas,
    userEvent,
    step
  }) => {
    await step("Collapsed folder hides children", async () => {
      await expect(canvas.queryByText("Nested Item 0")).toBeNull();
    });
    await step("Click caret to expand folder", async () => {
      const folder1Caret = canvas.getByText("Folder 1").closest(".bp6-tree-node")!.querySelector(".bp6-tree-node-caret")!;
      await userEvent.click(folder1Caret);
      await expect(canvas.getByText("Nested Item 0")).toBeVisible();
      await expect(canvas.getByText("Nested Item 1")).toBeVisible();
    });
  }
}`,...b.parameters?.docs?.source},description:{story:"Clicking the caret expands a collapsed folder and reveals its children.",...b.parameters?.docs?.description}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  name: "Collapse Node",
  ...Playground,
  play: async ({
    canvas,
    userEvent,
    step
  }) => {
    await step("Expanded folder shows children", async () => {
      await expect(canvas.getByText("Item 0")).toBeVisible();
      await expect(canvas.getByText("Item 1")).toBeVisible();
    });
    await step("Click caret to collapse folder", async () => {
      const folder0Caret = canvas.getByText("Folder 0").closest(".bp6-tree-node")!.querySelector(".bp6-tree-node-caret")!;
      await userEvent.click(folder0Caret);
      await waitFor(() => expect(canvas.queryByText("Item 0")).toBeNull());
    });
  }
}`,...C.parameters?.docs?.source},description:{story:"Clicking the caret on an expanded folder collapses it and hides its children.",...C.parameters?.docs?.description}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  name: "Disabled Interaction",
  render: function Render(args) {
    const [nodes, dispatch] = useReducer(treeExampleReducer, DISABLED_CONTENTS);
    const handleNodeClick = useCallback((node: TreeNodeInfo, nodePath: NodePath, e: MouseEvent<HTMLElement>) => {
      const originallySelected = node.isSelected;
      if (!e.shiftKey) {
        dispatch({
          type: "DESELECT_ALL"
        });
      }
      dispatch({
        payload: {
          isSelected: originallySelected == null ? true : !originallySelected,
          path: nodePath
        },
        type: "SET_IS_SELECTED"
      });
    }, []);
    return <Tree {...args} contents={nodes} onNodeClick={handleNodeClick} />;
  },
  play: async ({
    canvas,
    userEvent,
    step
  }) => {
    await step("Click disabled node — no selection", async () => {
      const disabledItem = canvas.getByText("Item 0");
      await userEvent.click(disabledItem);
      await expect(disabledItem.closest(".bp6-tree-node")).not.toHaveClass("bp6-tree-node-selected");
    });
    await step("Click enabled node — becomes selected", async () => {
      const enabledItem = canvas.getByText("Item 2");
      await userEvent.click(enabledItem);
      await expect(enabledItem.closest(".bp6-tree-node")).toHaveClass("bp6-tree-node-selected");
    });
  }
}`,...v.parameters?.docs?.source},description:{story:"Disabled nodes do not respond to click interactions.",...v.parameters?.docs?.description}}};const pe=["Default","CompactExample","StateExample","AllStates","ElementIconExample","Playground","SelectNode","ExpandNode","CollapseNode","DisabledInteraction"];export{y as AllStates,C as CollapseNode,T as CompactExample,g as Default,v as DisabledInteraction,f as ElementIconExample,b as ExpandNode,p as Playground,N as SelectNode,E as StateExample,pe as __namedExportsOrder,me as default};
