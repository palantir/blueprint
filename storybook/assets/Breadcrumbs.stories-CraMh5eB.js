import{e as R,dQ as k,m as M,dR as P,j as r,ai as _,g as S,a8 as q,r as d,dP as z,dS as V,dT as U,dU as W,w as H,dV as X,dW as $}from"./iframe-6KWIKMhT.js";import{s as G,S as T}from"./common-CGlRPlLv.js";import{F}from"./flex-CfNrUc6L.js";import{a as J,M as Y}from"./menuItem-DvErEafd.js";import{P as K}from"./popoverNext-BYxtaCWB.js";import{p as Q}from"./popoverNextMigrationUtils-D3izG0g9.js";import"./preload-helper-PPVm8Dsz.js";import"./check-small-CLtm5zFR.js";import"./position-wreWcUSJ.js";const l={START:"start",END:"end"},I=t=>{const e=R(k,{[P]:t.current,[M]:t.disabled},t.className),s=t.icon!=null?r.jsx(_,{title:t.iconTitle,icon:t.icon}):void 0;return t.href==null&&t.onClick==null?r.jsxs("span",{className:e,children:[s,t.text,t.children]}):r.jsxs("a",{className:e,href:t.href,onClick:t.disabled?void 0:t.onClick,onFocus:t.disabled?void 0:t.onFocus,tabIndex:t.disabled?void 0:0,target:t.target,children:[s,t.text,t.children]})};I.displayName=`${S}.Breadcrumb`;I.__docgenInfo={description:`Breadcrumb component.

@see https://blueprintjs.com/docs/#core/components/breadcrumbs`,methods:[]};class A extends q{static displayName=`${S}.ResizeSensor`;targetRef=this.props.targetRef??d.createRef();prevElement=void 0;observer;render(){const e=d.Children.only(this.props.children);return this.props.targetRef!==void 0?e:d.cloneElement(e,{ref:this.targetRef})}componentDidMount(){this.observer=globalThis.ResizeObserver!=null?new ResizeObserver(e=>this.props.onResize?.(e)):void 0,this.observeElement()}componentDidUpdate(e){this.observeElement(this.props.observeParents!==e.observeParents)}componentWillUnmount(){this.observer?.disconnect(),this.prevElement=void 0}observeElement(e=!1){if(this.observer!==void 0){if(!(this.targetRef.current instanceof Element)){this.observer.disconnect();return}if(!(this.targetRef.current===this.prevElement&&!e)&&(this.observer.disconnect(),this.prevElement=this.targetRef.current,this.observer.observe(this.targetRef.current),this.props.observeParents)){let s=this.targetRef.current.parentElement;for(;s!=null;)this.observer.observe(s),s=s.parentElement}}}}A.__docgenInfo={description:`Resize sensor component.

It requires a single DOM element child and will error otherwise.

@see https://blueprintjs.com/docs/#core/components/resize-sensor`,methods:[],props:{children:{required:!0,tsType:{name:"React.JSX.Element"},description:"Single child, must be an element and not a string or fragment."},onResize:{required:!0,tsType:{name:"signature",type:"function",raw:"(entries: ResizeObserverEntry[]) => void",signature:{arguments:[{type:{name:"Array",elements:[{name:"ResizeObserverEntry"}],raw:"ResizeObserverEntry[]"},name:"entries"}],return:{name:"void"}}},description:`Callback invoked when the wrapped element resizes.

The \`entries\` array contains an entry for each observed element. In the
default case (no \`observeParents\`), the array will contain only one
element: the single child of the \`ResizeSensor\`.

Note that this method is called _asynchronously_ after a resize is
detected and typically it will be called no more than once per frame.`},observeParents:{required:!1,tsType:{name:"boolean"},description:`If \`true\`, all parent DOM elements of the container will also be
observed for size changes. The array of entries passed to \`onResize\`
will now contain an entry for each parent element up to the root of the
document.

Only enable this prop if a parent element resizes in a way that does
not also cause the child element to resize.

@default false`},targetRef:{required:!1,tsType:{name:"ReactRefObject",raw:"React.RefObject<HTMLElement>",elements:[{name:"HTMLElement"}]},description:"If you attach a `ref` to the child yourself when rendering it, you must pass the\nsame value here (otherwise, ResizeSensor won't be able to attach its own)."}}};class x extends d.Component{static displayName=`${S}.OverflowList`;static defaultProps={alwaysRenderOverflow:!1,collapseFrom:l.START,minVisibleItems:0};static ofType(){return x}state={chopSize:this.defaultChopSize(),lastChopSize:null,lastOverflowCount:0,overflow:[],repartitioning:!1,visible:this.props.items};spacer=null;componentDidMount(){this.repartition()}shouldComponentUpdate(e,s){return this.props!==e||!(this.state!==s&&z(this.state,s))}componentDidUpdate(e,s){e.observeParents!==this.props.observeParents&&console.warn(V),(e.collapseFrom!==this.props.collapseFrom||e.items!==this.props.items||e.minVisibleItems!==this.props.minVisibleItems||e.overflowRenderer!==this.props.overflowRenderer||e.alwaysRenderOverflow!==this.props.alwaysRenderOverflow||e.visibleItemRenderer!==this.props.visibleItemRenderer)&&this.setState({chopSize:this.defaultChopSize(),lastChopSize:null,lastOverflowCount:0,overflow:[],repartitioning:!0,visible:this.props.items});const{repartitioning:o,overflow:i,lastOverflowCount:n}=this.state;o===!1&&s.repartitioning===!0?i.length!==n&&this.props.onOverflow?.(i.slice()):z(s,this.state)||this.repartition()}render(){const{className:e,collapseFrom:s,observeParents:o,style:i,tagName:n="div",visibleItemRenderer:u,navigable:p=!1,navigationAriaLabel:c=""}=this.props,v=this.maybeRenderOverflow();let f=d.createElement(n,{className:R(U,e),style:i},s===l.START?v:null,this.state.visible.map(u),s===l.END?v:null,r.jsx("div",{className:W,ref:E=>this.spacer=E}));return p&&(f=r.jsx("nav",{"aria-label":c,children:f})),r.jsx(A,{onResize:this.resize,observeParents:o,children:f})}maybeRenderOverflow(){const{overflow:e}=this.state;return e.length===0&&!this.props.alwaysRenderOverflow?null:this.props.overflowRenderer(e.slice())}resize=()=>{this.repartition()};repartition(){if(this.spacer==null)return;const e=this.state.lastChopSize===1,s=this.props.minVisibleItems??0,o=this.spacer.offsetWidth<.9&&this.state.visible.length>s,i=(this.spacer.offsetWidth>=1||this.state.visible.length<s)&&this.state.overflow.length>0&&!e;o||i?this.setState(n=>{let u,p;if(this.props.collapseFrom===l.END){const c=N(n.visible,n.overflow,this.state.chopSize*(o?1:-1));u=c[0],p=c[1]}else{const c=N(n.overflow,n.visible,this.state.chopSize*(o?-1:1));p=c[0],u=c[1]}return{chopSize:j(n.chopSize),lastChopSize:n.chopSize,lastOverflowCount:this.isFirstPartitionCycle(n.chopSize)?n.overflow.length:n.lastOverflowCount,overflow:p,repartitioning:!0,visible:u}}):this.setState({chopSize:this.defaultChopSize(),lastChopSize:null,repartitioning:!1})}defaultChopSize(){return j(this.props.items.length)}isFirstPartitionCycle(e){return e===this.defaultChopSize()}}function j(t){return Math.ceil(t/2)}function N(t,e,s){const o=t.concat(e),i=t.length-s;if(i<=0)return[[],o];if(i>=o.length)return[o,[]];const n=o.length-i;return[o.slice(0,-n),o.slice(-n)]}x.__docgenInfo={description:`Overflow list component.

@see https://blueprintjs.com/docs/#core/components/overflow-list`,methods:[{name:"ofType",docblock:null,modifiers:["static"],params:[],returns:null}],props:{className:{required:!1,tsType:{name:"string"},description:"A space-delimited list of class names to pass along to a child element."},alwaysRenderOverflow:{required:!1,tsType:{name:"boolean"},description:`Whether to force the overflowRenderer to always be called, even if there are zero items
overflowing. This may be useful, for example, if your overflow renderer contains a Popover
which you do not want to close as the list is resized.

@default false`,defaultValue:{value:"false",computed:!1}},collapseFrom:{required:!1,tsType:{name:"Boundary"},description:"Which direction the items should collapse from: start or end of the\nchildren. This also determines whether `overflowRenderer` appears before\n(`START`) or after (`END`) the visible items.\n\n@default Boundary.START",defaultValue:{value:'"start"',computed:!1}},items:{required:!0,tsType:{name:"unknown"},description:`All items to display in the list. Items that do not fit in the container
will be rendered in the overflow instead.`},minVisibleItems:{required:!1,tsType:{name:"number"},description:`The minimum number of visible items that should never collapse into the
overflow menu, regardless of DOM dimensions.

@default 0`,defaultValue:{value:"0",computed:!1}},observeParents:{required:!1,tsType:{name:"boolean"},description:`If \`true\`, all parent DOM elements of the container will also be
observed. If changes to a parent's size is detected, the overflow will be
recalculated.

Only enable this prop if the overflow should be recalculated when a
parent element resizes in a way that does not also cause the
\`OverflowList\` to resize.

@default false`},onOverflow:{required:!1,tsType:{name:"signature",type:"function",raw:"(overflowItems: T[]) => void",signature:{arguments:[{type:{name:"Array",elements:[{name:"T"}],raw:"T[]"},name:"overflowItems"}],return:{name:"void"}}},description:`Callback invoked when the overflowed items change. This is called once
after the DOM has settled, rather that on every intermediate change. It
is not invoked if resizing produces an unchanged overflow state.`},overflowRenderer:{required:!0,tsType:{name:"signature",type:"function",raw:"(overflowItems: T[]) => React.ReactNode",signature:{arguments:[{type:{name:"Array",elements:[{name:"T"}],raw:"T[]"},name:"overflowItems"}],return:{name:"ReactReactNode",raw:"React.ReactNode"}}},description:`Callback invoked to render the overflowed items. Unlike
\`visibleItemRenderer\`, this prop is invoked once with all items that do
not fit in the container.

Typical use cases for this prop will put overflowed items in a dropdown
menu or display a "+X items" label.`},style:{required:!1,tsType:{name:"ReactCSSProperties",raw:"React.CSSProperties"},description:"CSS properties to apply to the root element."},tagName:{required:!1,tsType:{name:"React.JSX.IntrinsicElements"},description:`HTML tag name for the container element.

@default "div"`},visibleItemRenderer:{required:!0,tsType:{name:"signature",type:"function",raw:"(item: T, index: number) => React.ReactNode",signature:{arguments:[{type:{name:"T"},name:"item"},{type:{name:"number"},name:"index"}],return:{name:"ReactReactNode",raw:"React.ReactNode"}}},description:"Callback invoked to render each visible item.\nRemember to set a `key` on the rendered element!"},navigable:{required:!1,tsType:{name:"boolean"},description:"If true, the overflow list will be wrapped with a `nav` element.\n\n@default false"},navigationAriaLabel:{required:!1,tsType:{name:"string"},description:'ARIA label to apply to the `nav` element. Only used if `navigable` is true.\n\n@default ""'}}};const Z=[],h=d.memo(t=>{const{breadcrumbRenderer:e,className:s,collapseFrom:o=l.START,currentBreadcrumbRenderer:i,items:n=Z,minVisibleItems:u=0,overflowButtonProps:p,overflowListProps:c={},popoverProps:v}=t,f=d.useCallback((a,m)=>m&&i!=null?i(a):e!=null?e(a):r.jsx(I,{current:m,...a}),[e,i]),E=d.useCallback((a,m)=>{const C=n[n.length-1]===a;return r.jsx("li",{children:f(a,C)},m)},[n,f]),O=d.useCallback((a,m)=>{const C=a.href!=null||a.onClick!=null,L=H(a);return d.createElement(J,{disabled:!C,...L,text:a.text,key:m})},[]),D=d.useCallback(a=>{let m=a;return o===l.START&&(m=a.slice().reverse()),r.jsx("li",{children:r.jsx(K,{content:r.jsx(Y,{children:m.map(O)}),disabled:m.length===0,placement:o===l.END?"bottom-end":"bottom-start",...Q(v),children:r.jsx("span",{"aria-label":"collapsed breadcrumbs",role:"button",tabIndex:0,...p,className:R(X,p?.className)})})})},[o,p,v,O]);return r.jsx(x,{collapseFrom:o,minVisibleItems:u,tagName:"ol",navigable:!0,navigationAriaLabel:"Breadcrumb",...c,className:R($,c.className,s),items:n,overflowRenderer:D,visibleItemRenderer:E})});h.displayName=`${S}.Breadcrumbs`;h.__docgenInfo={description:`Breadcrumbs component.

@see https://blueprintjs.com/docs/#core/components/breadcrumbs`,methods:[]};const B=[{text:"Home",href:"#",icon:"home"},{text:"Projects",href:"#",icon:"projects"},{text:"Blueprint",href:"#"},{text:"Components",href:"#"},{text:"Breadcrumbs"}],de={title:"Core/Breadcrumbs",component:h,decorators:[G],tags:["autodocs"],args:{items:B,collapseFrom:l.START,width:400},argTypes:{collapseFrom:{control:"select",options:Object.values(l)},minVisibleItems:{control:"number"},width:{control:{type:"range",min:100,max:800,step:10}}}},b={render:({width:t,...e})=>r.jsx("div",{style:{width:t},children:r.jsx(h,{...e})})},w={name:"Collapse From",argTypes:{collapseFrom:{table:{disable:!0}}},render:({width:t,...e})=>r.jsxs(F,{flexDirection:"column",gap:4,alignItems:"start",children:[r.jsxs("div",{style:{width:t},children:[r.jsx(T,{title:"Collapse from start (default)"}),r.jsx(h,{...e,collapseFrom:l.START})]}),r.jsxs("div",{style:{width:t},children:[r.jsx(T,{title:"Collapse from end"}),r.jsx(h,{...e,collapseFrom:l.END})]})]})},y={name:"Overflow",render:t=>r.jsxs(F,{flexDirection:"column",gap:4,children:[r.jsxs("div",{children:[r.jsx(T,{title:"Constrained width (300px)"}),r.jsx("div",{style:{width:300},children:r.jsx(h,{...t})})]}),r.jsxs("div",{children:[r.jsx(T,{title:"Full width"}),r.jsx("div",{style:{width:600},children:r.jsx(h,{...t})})]})]})},g={args:{items:B,collapseFrom:l.START,minVisibleItems:0},render:({width:t,...e})=>r.jsx("div",{style:{width:t},children:r.jsx(h,{...e})})};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: ({
    width,
    ...args
  }) => <div style={{
    width
  }}>
            <Breadcrumbs {...args} />
        </div>
}`,...b.parameters?.docs?.source},description:{story:"A basic breadcrumbs component with default styling. Adjust the width slider to see overflow behavior.",...b.parameters?.docs?.description}}};w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  name: "Collapse From",
  argTypes: {
    collapseFrom: {
      table: {
        disable: true
      }
    }
  },
  render: ({
    width,
    ...args
  }) => <Flex flexDirection="column" gap={4} alignItems="start">
            <div style={{
      width
    }}>
                <StoryLabel title="Collapse from start (default)" />
                <Breadcrumbs {...args} collapseFrom={Boundary.START} />
            </div>
            <div style={{
      width
    }}>
                <StoryLabel title="Collapse from end" />
                <Breadcrumbs {...args} collapseFrom={Boundary.END} />
            </div>
        </Flex>
}`,...w.parameters?.docs?.source},description:{story:"Use the `collapseFrom` prop to control which end of the breadcrumb trail is collapsed when items overflow.",...w.parameters?.docs?.description}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  name: "Overflow",
  render: args => <Flex flexDirection="column" gap={4}>
            <div>
                <StoryLabel title="Constrained width (300px)" />
                <div style={{
        width: 300
      }}>
                    <Breadcrumbs {...args} />
                </div>
            </div>
            <div>
                <StoryLabel title="Full width" />
                <div style={{
        width: 600
      }}>
                    <Breadcrumbs {...args} />
                </div>
            </div>
        </Flex>
}`,...y.parameters?.docs?.source},description:{story:"When the breadcrumb trail contains many items, overflow is handled by collapsing items into a dropdown.",...y.parameters?.docs?.description}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    items: SAMPLE_ITEMS,
    collapseFrom: Boundary.START,
    minVisibleItems: 0
  },
  render: ({
    width,
    ...args
  }) => <div style={{
    width
  }}>
            <Breadcrumbs {...args} />
        </div>
}`,...g.parameters?.docs?.source},description:{story:"Interactive playground with all props toggleable via Storybook controls.",...g.parameters?.docs?.description}}};const ce=["Default","CollapseFromExample","OverflowExample","Playground"];export{w as CollapseFromExample,b as Default,y as OverflowExample,g as Playground,ce as __namedExportsOrder,de as default};
