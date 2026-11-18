import{a8 as d,g as u,r as c,j as t,e as m,a9 as f,aa as h,ab as T}from"./iframe-6KWIKMhT.js";import{P as v,T as y}from"./popoverNext-BYxtaCWB.js";import{T as P,a as R}from"./tooltipContext-B1TZx9Ko.js";import{p as g}from"./popoverNextMigrationUtils-D3izG0g9.js";class O extends d{static displayName=`${u}.Tooltip`;static defaultProps={compact:!1,hoverCloseDelay:0,hoverOpenDelay:100,interactionKind:"hover-target",minimal:!1,transitionDuration:100};popoverRef=c.createRef();render(){return t.jsx(P.Consumer,{children:([e])=>t.jsx(R,{...e,children:this.renderPopover})})}reposition(){this.popoverRef.current?.reposition()}renderPopover=e=>{const{children:n,compact:a,disabled:r,intent:i,popoverClassName:s,...l}=this.props,p=m(f,h(i),s,{[T]:a}),o=g(l);return t.jsx(v,{...o,middleware:{offset:{mainAxis:y/2},...o.middleware},autoFocus:!1,disabled:e.forceDisabled??r,enforceFocus:!1,lazy:!0,popoverClassName:p,portalContainer:this.props.portalContainer,ref:this.popoverRef,children:n})}}O.__docgenInfo={description:`Tooltip component.

@see https://blueprintjs.com/docs/#core/components/tooltip`,methods:[{name:"reposition",docblock:null,modifiers:[],params:[],returns:null}],props:{intent:{required:!1,tsType:{name:"Intent"},description:"Visual intent color to apply to element."},content:{required:!0,tsType:{name:"union",raw:"React.JSX.Element | string",elements:[{name:"React.JSX.Element"},{name:"string"}]},description:"The content that will be displayed inside of the tooltip."},compact:{required:!1,tsType:{name:"boolean"},description:`Whether to use a compact appearance, which reduces the visual padding around
tooltip content.

@default false`,defaultValue:{value:"false",computed:!1}},hoverCloseDelay:{required:!1,tsType:{name:"number"},description:`The amount of time in milliseconds the tooltip should remain open after
the user hovers off the trigger. The timer is canceled if the user mouses
over the target before it expires.

@default 0`,defaultValue:{value:"0",computed:!1}},hoverOpenDelay:{required:!1,tsType:{name:"number"},description:`The amount of time in milliseconds the tooltip should wait before opening
after the user hovers over the trigger. The timer is canceled if the user
mouses away from the target before it expires.

@default 100`,defaultValue:{value:"100",computed:!1}},interactionKind:{required:!1,tsType:{name:"union",raw:"typeof PopoverInteractionKind.HOVER | typeof PopoverInteractionKind.HOVER_TARGET_ONLY",elements:[{name:"PopoverInteractionKind.HOVER"},{name:"PopoverInteractionKind.HOVER_TARGET_ONLY"}]},description:`The kind of hover interaction that triggers the display of the tooltip.
Tooltips do not support click interactions.

@default PopoverInteractionKind.HOVER_TARGET_ONLY`,defaultValue:{value:'"hover-target"',computed:!1}},transitionDuration:{required:!1,tsType:{name:"number"},description:`Indicates how long (in milliseconds) the tooltip's appear/disappear
transition takes. This is used by React \`CSSTransition\` to know when a
transition completes and must match the duration of the animation in CSS.
Only set this prop if you override Blueprint's default transitions with
new transitions of a different length.

@default 100`,defaultValue:{value:"100",computed:!1}},minimal:{defaultValue:{value:"false",computed:!1},required:!1}},composes:["Omit"]};export{O as T};
