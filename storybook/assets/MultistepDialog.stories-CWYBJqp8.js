import{j as e,c$ as S,e as b,d0 as x,g as C,A as M,a8 as E,h as D,d1 as A,d2 as R,d3 as O,d4 as N,d5 as B,d6 as H,bL as k,d7 as j,ah as _,d8 as q,r as F,x as G,B as I,i as V}from"./iframe-6KWIKMhT.js";import{F as W}from"./flex-CfNrUc6L.js";import{D as U}from"./dialogFooter-C01O7ydT.js";import{T as K}from"./tooltip-DkP1kDvm.js";import"./preload-helper-PPVm8Dsz.js";import"./popoverNext-BYxtaCWB.js";import"./tooltipContext-B1TZx9Ko.js";import"./popoverNextMigrationUtils-D3izG0g9.js";import"./position-wreWcUSJ.js";const r=s=>{const{className:t,id:n,title:o,...i}=s;return e.jsx("div",{...i,className:S,role:"tab",children:e.jsx("div",{className:b(x,t)})})};r.displayName=`${C}.DialogStep`;r.__docgenInfo={description:`Dialog step component.

@see https://blueprintjs.com/docs/#core/components/dialog.dialogstep`,methods:[]};function u({tooltipContent:s,...t}){const n=e.jsx(M,{...t});return s!==void 0?e.jsx(K,{content:s,children:n}):n}u.__docgenInfo={description:"",methods:[],displayName:"DialogStepButton",props:{tooltipContent:{required:!1,tsType:{name:'TooltipProps["content"]',raw:'TooltipProps["content"]'},description:"If defined, the button will be wrapped with a tooltip with the specified content."}}};const X=0,Y=800;class w extends E{static displayName=`${C}.MultistepDialog`;static defaultProps={canOutsideClickClose:!0,isOpen:!1,navigationPosition:"left",resetOnClose:!0,showCloseButtonInFooter:!1};state=this.getInitialIndexFromProps(this.props);render(){const{className:t,navigationPosition:n,showCloseButtonInFooter:o,isCloseButtonShown:i,...a}=this.props;return e.jsx(D,{isCloseButtonShown:i,...a,className:b({[O]:n==="right",[R]:n==="top"},t),style:this.getDialogStyle(),children:e.jsxs("div",{className:A,children:[this.renderLeftPanel(),this.maybeRenderRightPanel()]})})}componentDidUpdate(t){(t.resetOnClose||t.initialStepIndex!==this.props.initialStepIndex)&&!t.isOpen&&this.props.isOpen&&this.setState(this.getInitialIndexFromProps(this.props))}getDialogStyle(){return{minWidth:Y,paddingBottom:X,...this.props.style}}renderLeftPanel(){return e.jsx("div",{className:N,role:"tablist","aria-label":"steps",children:this.getDialogStepChildren().filter(v).map(this.renderDialogStep)})}renderDialogStep=(t,n)=>{const o=n+1,i=this.state.lastViewedIndex>=n,a=this.state.selectedIndex===n,P=n>this.state.lastViewedIndex?void 0:this.getDialogStepChangeHandler(n);return e.jsx("div",{className:b(S,{[_]:a,[j]:i}),"aria-disabled":!a&&!i,"aria-selected":a,role:"tab",children:e.jsxs("div",{className:x,onClick:P,tabIndex:P?0:-1,onKeyDown:k(["Enter"," "]),role:"button",children:[e.jsx("div",{className:B,children:o}),e.jsx("div",{className:H,children:t.props.title})]})},n)};maybeRenderRightPanel(){const t=this.getDialogStepChildren();if(t.length<=this.state.selectedIndex)return null;const{className:n,panel:o,panelClassName:i}=t[this.state.selectedIndex].props;return e.jsxs("div",{className:b(q,n,i),children:[o,this.renderFooter()]})}renderFooter(){const{closeButtonProps:t,showCloseButtonInFooter:n,onClose:o}=this.props,i=n?e.jsx(u,{text:"Close",onClick:o,...t}):void 0;return e.jsx(U,{actions:this.renderButtons(),children:i})}renderButtons(){const{selectedIndex:t}=this.state,n=this.getDialogStepChildren(),o=[];if(this.state.selectedIndex>0){const i=n[t].props.backButtonProps??this.props.backButtonProps;o.push(e.jsx(u,{onClick:this.getDialogStepChangeHandler(t-1),text:"Back",...i},"back"))}if(t===this.getDialogStepChildren().length-1)o.push(e.jsx(u,{intent:"primary",text:"Submit",...this.props.finalButtonProps},"final"));else{const i=n[t].props.nextButtonProps??this.props.nextButtonProps;o.push(e.jsx(u,{intent:"primary",onClick:this.getDialogStepChangeHandler(t+1),text:"Next",...i},"next"))}return o}getDialogStepChangeHandler(t){return n=>{if(this.props.onChange!==void 0){const o=this.getDialogStepChildren(),i=o[this.state.selectedIndex].props.id,a=o[t].props.id;this.props.onChange(a,i,n)}this.setState({lastViewedIndex:Math.max(this.state.lastViewedIndex,t),selectedIndex:t})}}getDialogStepChildren(t=this.props){return F.Children.toArray(t.children).filter(v)}getInitialIndexFromProps(t){if(t.initialStepIndex!==void 0){const n=Math.max(0,Math.min(t.initialStepIndex,this.getDialogStepChildren(t).length-1));return{lastViewedIndex:n,selectedIndex:n}}else return{lastViewedIndex:0,selectedIndex:0}}}function v(s){return G(s,r)}w.__docgenInfo={description:`Multi-step dialog component.

@see https://blueprintjs.com/docs/#core/components/dialog.multistep-dialog`,methods:[],props:{onClosing:{required:!1,tsType:{name:"signature",type:"function",raw:"(node: HTMLElement) => void",signature:{arguments:[{type:{name:"HTMLElement"},name:"node"}],return:{name:"void"}}},description:`Lifecycle method invoked just before the CSS _close_ transition begins on
a child. Receives the DOM element of the child being closed.`},onClosed:{required:!1,tsType:{name:"signature",type:"function",raw:"(node: HTMLElement) => void",signature:{arguments:[{type:{name:"HTMLElement"},name:"node"}],return:{name:"void"}}},description:`Lifecycle method invoked just after the CSS _close_ transition ends but
before the child has been removed from the DOM. Receives the DOM element
of the child being closed.`},onOpening:{required:!1,tsType:{name:"signature",type:"function",raw:"(node: HTMLElement) => void",signature:{arguments:[{type:{name:"HTMLElement"},name:"node"}],return:{name:"void"}}},description:`Lifecycle method invoked just after mounting the child in the DOM but
just before the CSS _open_ transition begins. Receives the DOM element of
the child being opened.`},onOpened:{required:!1,tsType:{name:"signature",type:"function",raw:"(node: HTMLElement) => void",signature:{arguments:[{type:{name:"HTMLElement"},name:"node"}],return:{name:"void"}}},description:`Lifecycle method invoked just after the CSS _open_ transition ends.
Receives the DOM element of the child being opened.`},autoFocus:{required:!1,tsType:{name:"boolean"},description:`Whether the overlay should acquire application focus when it first opens.

@default true`},canEscapeKeyClose:{required:!1,tsType:{name:"boolean"},description:"Whether pressing the `esc` key should invoke `onClose`.\n\n@default true"},enforceFocus:{required:!1,tsType:{name:"boolean"},description:`Whether the overlay should prevent focus from leaving itself. That is, if the user attempts
to focus an element outside the overlay and this prop is enabled, then the overlay will
immediately bring focus back to itself. If you are nesting overlay components, either disable
this prop on the "outermost" overlays or mark the nested ones \`usePortal={false}\`.

@default true`},lazy:{required:!1,tsType:{name:"boolean"},description:"If `true` and `usePortal={true}`, the `Portal` containing the children is created and attached\nto the DOM when the overlay is opened for the first time; otherwise this happens when the\ncomponent mounts. Lazy mounting provides noticeable performance improvements if you have lots\nof overlays at once, such as on each row of a table.\n\n@default true"},shouldReturnFocusOnClose:{required:!1,tsType:{name:"boolean"},description:`Whether the application should return focus to the last active element in the
document after this overlay closes.

@default true`},transitionDuration:{required:!1,tsType:{name:"number"},description:`Indicates how long (in milliseconds) the overlay's enter/leave transition takes.
This is used by React \`CSSTransition\` to know when a transition completes and must match
the duration of the animation in CSS. Only set this prop if you override Blueprint's default
transitions with new transitions of a different length.

@default 300`},usePortal:{required:!1,tsType:{name:"boolean"},description:"Whether the overlay should be wrapped in a `Portal`, which renders its contents in a new\nelement attached to `portalContainer` prop.\n\nThis prop essentially determines which element is covered by the backdrop: if `false`,\nthen only its parent is covered; otherwise, the entire page is covered (because the parent\nof the `Portal` is the `<body>` itself).\n\nSet this prop to `false` on nested overlays (such as `Dialog` or `Popover`) to ensure that they\nare rendered above their parents.\n\n@default true"},portalClassName:{required:!1,tsType:{name:"string"},description:"Space-delimited string of class names applied to the `Portal` element if\n`usePortal={true}`."},portalContainer:{required:!1,tsType:{name:"HTMLElement"},description:"The container element into which the overlay renders its contents, when `usePortal` is `true`.\nThis prop is ignored if `usePortal` is `false`.\n\n@default document.body"},portalStopPropagationEvents:{required:!1,tsType:{name:"Array",elements:[{name:"HTMLElementEventMap"}],raw:"Array<keyof HTMLElementEventMap>"},description:`A list of DOM events which should be stopped from propagating through the Portal.
This prop is ignored if \`usePortal\` is \`false\`.

@deprecated this prop's implementation no longer works in React v17+
@see https://legacy.reactjs.org/docs/portals.html#event-bubbling-through-portals
@see https://github.com/palantir/blueprint/issues/6124
@see https://github.com/palantir/blueprint/issues/6580`},onClose:{required:!1,tsType:{name:"signature",type:"function",raw:"(event: React.SyntheticEvent<HTMLElement>) => void",signature:{arguments:[{type:{name:"ReactSyntheticEvent",raw:"React.SyntheticEvent<HTMLElement>",elements:[{name:"HTMLElement"}]},name:"event"}],return:{name:"void"}}},description:"A callback that is invoked when user interaction causes the overlay to close, such as\nclicking on the overlay or pressing the `esc` key (if enabled).\n\nReceives the event from the user's interaction, if there was an event (generally either a\nmouse or key event). Note that, since this component is controlled by the `isOpen` prop, it\nwill not actually close itself until that prop becomes `false`."},backdropClassName:{required:!1,tsType:{name:"string"},description:"CSS class names to apply to backdrop element."},backdropProps:{required:!1,tsType:{name:"ReactHTMLProps",raw:"React.HTMLProps<HTMLDivElement>",elements:[{name:"HTMLDivElement"}]},description:"HTML props for the backdrop element."},canOutsideClickClose:{required:!1,tsType:{name:"boolean"},description:`Whether clicking outside the overlay element (either on backdrop when present or on document)
should invoke \`onClose\`.

@default true`,defaultValue:{value:"true",computed:!1}},hasBackdrop:{required:!1,tsType:{name:"never"},description:`Whether a container-spanning backdrop element should be rendered behind the contents.
When \`false\`, users will be able to scroll through and interact with overlaid content.

@default true`},className:{required:!1,tsType:{name:"string"},description:"A space-delimited list of class names to pass along to a child element."},children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"Dialog contents."},containerRef:{required:!1,tsType:{name:"ReactRef",raw:"React.Ref<HTMLDivElement>",elements:[{name:"HTMLDivElement"}]},description:"Ref attached to the `Classes.DIALOG_CONTAINER` element."},isOpen:{required:!1,tsType:{name:"boolean"},description:`Toggles the visibility of the overlay and its children.
This prop is required because the component is controlled.

@default false`,defaultValue:{value:"false",computed:!1}},icon:{required:!1,tsType:{name:"union",raw:"IconName | MaybeElement",elements:[{name:"IconName"},{name:"union",raw:"React.JSX.Element | false | null | undefined",elements:[{name:"React.JSX.Element"},{name:"literal",value:"false"},{name:"null"},{name:"undefined"}]}]},description:"Name of a Blueprint UI icon (or an icon element) to render in the\ndialog's header. Note that the header will only be rendered if `title` is\nnot null or undefined."},isCloseButtonShown:{required:!1,tsType:{name:"boolean"},description:`Whether to show the close button in the dialog's header.
Note that the header will only be rendered if \`title\` is not null or undefined.

@default true`},role:{required:!1,tsType:{name:"Extract",elements:[{name:"ReactAriaRole",raw:"React.AriaRole"},{name:"union",raw:'"dialog" | "alertdialog"',elements:[{name:"literal",value:'"dialog"'},{name:"literal",value:'"alertdialog"'}]}],raw:'Extract<React.AriaRole, "dialog" | "alertdialog">'},description:'@default "dialog"'},style:{required:!1,tsType:{name:"ReactCSSProperties",raw:"React.CSSProperties"},description:`CSS styles to apply to the dialog.

@default {}`},title:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:'Title of the dialog. If not null or undefined, an element with `Classes.DIALOG_HEADER`\nwill be rendered inside the dialog before any children elements.\nAn empty string `""` will render the header without a visible title (useful for\nshowing the close button without a title).'},titleTagName:{required:!1,tsType:{name:"ReactElementType",raw:"React.ElementType<React.HTMLAttributes<HTMLElement>>",elements:[{name:"ReactHTMLAttributes",raw:"React.HTMLAttributes<HTMLElement>",elements:[{name:"HTMLElement"}]}]},description:`HTML heading component to use for the dialog title.

@default H2`},transitionName:{required:!1,tsType:{name:"string"},description:"Name of the transition for internal `CSSTransition`. Providing your own\nname here will require defining new CSS transition properties."},"aria-labelledby":{required:!1,tsType:{name:"string"},description:"ID of the element that contains title or label text for this dialog.\n\nBy default, if the `title` prop is supplied, this component will generate\na unique ID for the `<H5>` title element and use that ID here."},"aria-describedby":{required:!1,tsType:{name:"string"},description:"ID of an element that contains description text inside this dialog."},backButtonProps:{required:!1,tsType:{name:"intersection",raw:`Partial<ButtonSharedPropsAndAttributes> & {
    /** If defined, the button will be wrapped with a tooltip with the specified content. */
    tooltipContent?: TooltipProps["content"];
}`,elements:[{name:"Partial",elements:[{name:"intersection",raw:"ButtonSharedProps & React.HTMLAttributes<HTMLElement>",elements:[{name:"ButtonSharedProps"},{name:"ReactHTMLAttributes",raw:"React.HTMLAttributes<HTMLElement>",elements:[{name:"HTMLElement"}]}]}],raw:"Partial<ButtonSharedPropsAndAttributes>"},{name:"signature",type:"object",raw:`{
    /** If defined, the button will be wrapped with a tooltip with the specified content. */
    tooltipContent?: TooltipProps["content"];
}`,signature:{properties:[{key:"tooltipContent",value:{name:'TooltipProps["content"]',raw:'TooltipProps["content"]',required:!1},description:"If defined, the button will be wrapped with a tooltip with the specified content."}]}}]},description:"Props for the back button."},closeButtonProps:{required:!1,tsType:{name:"intersection",raw:`Partial<ButtonSharedPropsAndAttributes> & {
    /** If defined, the button will be wrapped with a tooltip with the specified content. */
    tooltipContent?: TooltipProps["content"];
}`,elements:[{name:"Partial",elements:[{name:"intersection",raw:"ButtonSharedProps & React.HTMLAttributes<HTMLElement>",elements:[{name:"ButtonSharedProps"},{name:"ReactHTMLAttributes",raw:"React.HTMLAttributes<HTMLElement>",elements:[{name:"HTMLElement"}]}]}],raw:"Partial<ButtonSharedPropsAndAttributes>"},{name:"signature",type:"object",raw:`{
    /** If defined, the button will be wrapped with a tooltip with the specified content. */
    tooltipContent?: TooltipProps["content"];
}`,signature:{properties:[{key:"tooltipContent",value:{name:'TooltipProps["content"]',raw:'TooltipProps["content"]',required:!1},description:"If defined, the button will be wrapped with a tooltip with the specified content."}]}}]},description:"Props for the close button that appears in the footer."},finalButtonProps:{required:!1,tsType:{name:"intersection",raw:`Partial<ButtonSharedPropsAndAttributes> & {
    /** If defined, the button will be wrapped with a tooltip with the specified content. */
    tooltipContent?: TooltipProps["content"];
}`,elements:[{name:"Partial",elements:[{name:"intersection",raw:"ButtonSharedProps & React.HTMLAttributes<HTMLElement>",elements:[{name:"ButtonSharedProps"},{name:"ReactHTMLAttributes",raw:"React.HTMLAttributes<HTMLElement>",elements:[{name:"HTMLElement"}]}]}],raw:"Partial<ButtonSharedPropsAndAttributes>"},{name:"signature",type:"object",raw:`{
    /** If defined, the button will be wrapped with a tooltip with the specified content. */
    tooltipContent?: TooltipProps["content"];
}`,signature:{properties:[{key:"tooltipContent",value:{name:'TooltipProps["content"]',raw:'TooltipProps["content"]',required:!1},description:"If defined, the button will be wrapped with a tooltip with the specified content."}]}}]},description:"Props for the button to display on the final step."},navigationPosition:{required:!1,tsType:{name:"union",raw:"typeof Position.TOP | typeof Position.LEFT | typeof Position.RIGHT",elements:[{name:"Position.TOP"},{name:"Position.LEFT"},{name:"Position.RIGHT"}]},description:`Position of the step navigation within the dialog.

@default "left"`,defaultValue:{value:'"left"',computed:!1}},nextButtonProps:{required:!1,tsType:{name:"intersection",raw:`Partial<ButtonSharedPropsAndAttributes> & {
    /** If defined, the button will be wrapped with a tooltip with the specified content. */
    tooltipContent?: TooltipProps["content"];
}`,elements:[{name:"Partial",elements:[{name:"intersection",raw:"ButtonSharedProps & React.HTMLAttributes<HTMLElement>",elements:[{name:"ButtonSharedProps"},{name:"ReactHTMLAttributes",raw:"React.HTMLAttributes<HTMLElement>",elements:[{name:"HTMLElement"}]}]}],raw:"Partial<ButtonSharedPropsAndAttributes>"},{name:"signature",type:"object",raw:`{
    /** If defined, the button will be wrapped with a tooltip with the specified content. */
    tooltipContent?: TooltipProps["content"];
}`,signature:{properties:[{key:"tooltipContent",value:{name:'TooltipProps["content"]',raw:'TooltipProps["content"]',required:!1},description:"If defined, the button will be wrapped with a tooltip with the specified content."}]}}]},description:"Props for the next button."},resetOnClose:{required:!1,tsType:{name:"boolean"},description:`Whether to reset the dialog state to its initial state on close.
By default, closing the dialog will reset its state.

@default true`,defaultValue:{value:"true",computed:!1}},showCloseButtonInFooter:{required:!1,tsType:{name:"boolean"},description:`Whether the footer close button is shown. When this value is true, the button will appear
regardless of the value of \`isCloseButtonShown\`.

@default false`,defaultValue:{value:"false",computed:!1}},initialStepIndex:{required:!1,tsType:{name:"number"},description:`A 0 indexed initial step to start off on, to start in the middle of the dialog, for example.
If the provided index exceeds the number of steps, it defaults to the last step.
If a negative index is provided, it defaults to the first step.`}}};const{useArgs:L,useCallback:T}=__STORYBOOK_MODULE_PREVIEW_API__,$=["containerRef","hasBackdrop","transitionName","backButtonProps","closeButtonProps","finalButtonProps","nextButtonProps"];function l({stepNumber:s}){return e.jsxs(V,{children:[e.jsxs("p",{children:["This is the content for step ",s,"."]}),e.jsx("p",{children:"You can place forms, instructions, or any other content here."})]})}function z(s){const{buttonText:t="Open Multistep Dialog",children:n,onOpen:o,onClose:i,...a}=s;return e.jsxs(e.Fragment,{children:[e.jsx(I,{text:t,onClick:o}),e.jsxs(w,{...a,onClose:i,children:[e.jsx(r,{id:"select",title:"Select items",panel:e.jsx(l,{stepNumber:1})}),e.jsx(r,{id:"confirm",title:"Confirm selection",panel:e.jsx(l,{stepNumber:2})}),e.jsx(r,{id:"complete",title:"Complete",panel:e.jsx(l,{stepNumber:3})})]})]})}const ae={title:"Core/Overlays/MultistepDialog",component:w,decorators:[s=>e.jsx(W,{justifyContent:"center",alignItems:"center",style:{minWidth:"300px"},children:e.jsx(s,{})})],args:{title:"Multistep Dialog",isOpen:!0,isCloseButtonShown:!0,navigationPosition:"left",resetOnClose:!0,showCloseButtonInFooter:!1},argTypes:{icon:{control:"text"},title:{control:"text"},isCloseButtonShown:{control:"boolean"},navigationPosition:{control:"select",options:["left","top","right"]},resetOnClose:{control:"boolean"},showCloseButtonInFooter:{control:"boolean"},initialStepIndex:{control:"number"},...$.reduce((s,t)=>(s[t]={table:{disable:!0}},s),{})}};function h(s){return function(n){const[,o]=L(),i=T(()=>o({isOpen:!0}),[o]),a=T(()=>o({isOpen:!1}),[o]);return e.jsx(z,{...n,finalButtonProps:{text:"Submit",onClick:a},onOpen:i,onClose:a,...s})}}const y={argTypes:{navigationPosition:{table:{disable:!0}}}},m={render:h()},p={name:"Left Navigation",...y,render:h({navigationPosition:"left",buttonText:"Open Left Navigation (default)"})},f={name:"Right Navigation",...y,render:h({navigationPosition:"right",buttonText:"Open Right Navigation"})},g={name:"Top Navigation",...y,render:h({navigationPosition:"top",buttonText:"Open Top Navigation"})},d={name:"Icon",args:{icon:"cog"},render:h({title:"Settings"})},c={render:function(t){const[,n]=L(),o=T(()=>n({isOpen:!0}),[n]),i=T(()=>n({isOpen:!1}),[n]);return e.jsxs(e.Fragment,{children:[e.jsx(I,{text:"Open Multistep Dialog",onClick:o}),e.jsxs(w,{...t,isOpen:t.isOpen,onClose:i,finalButtonProps:{text:"Submit",onClick:i},children:[e.jsx(r,{id:"step1",title:"Select items",panel:e.jsx(l,{stepNumber:1})}),e.jsx(r,{id:"step2",title:"Confirm selection",panel:e.jsx(l,{stepNumber:2})}),e.jsx(r,{id:"step3",title:"Complete",panel:e.jsx(l,{stepNumber:3})})]})]})}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: renderMultistepDialog()
}`,...m.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  name: "Left Navigation",
  ...disableNavigationPosition,
  render: renderMultistepDialog({
    navigationPosition: "left",
    buttonText: "Open Left Navigation (default)"
  })
}`,...p.parameters?.docs?.source},description:{story:"The `navigationPosition` prop controls where step navigation appears: left, top, or right.",...p.parameters?.docs?.description}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: "Right Navigation",
  ...disableNavigationPosition,
  render: renderMultistepDialog({
    navigationPosition: "right",
    buttonText: "Open Right Navigation"
  })
}`,...f.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: "Top Navigation",
  ...disableNavigationPosition,
  render: renderMultistepDialog({
    navigationPosition: "top",
    buttonText: "Open Top Navigation"
  })
}`,...g.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: "Icon",
  args: {
    icon: "cog"
  },
  render: renderMultistepDialog({
    title: "Settings"
  })
}`,...d.parameters?.docs?.source},description:{story:"Use the `icon` prop to display an icon in the dialog header.",...d.parameters?.docs?.description}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    const handleOpen = useCallback(() => updateArgs({
      isOpen: true
    }), [updateArgs]);
    const handleClose = useCallback(() => updateArgs({
      isOpen: false
    }), [updateArgs]);
    return <>
                <Button text="Open Multistep Dialog" onClick={handleOpen} />
                <MultistepDialog {...args} isOpen={args.isOpen} onClose={handleClose} finalButtonProps={{
        text: "Submit",
        onClick: handleClose
      }}>
                    <DialogStep id="step1" title="Select items" panel={<StepPanel stepNumber={1} />} />
                    <DialogStep id="step2" title="Confirm selection" panel={<StepPanel stepNumber={2} />} />
                    <DialogStep id="step3" title="Complete" panel={<StepPanel stepNumber={3} />} />
                </MultistepDialog>
            </>;
  }
}`,...c.parameters?.docs?.source},description:{story:"Interactive playground with all props togglable via Storybook controls.",...c.parameters?.docs?.description}}};const re=["Default","LeftPositionExample","RightPositionExample","TopPositionExample","IconExample","Playground"];export{m as Default,d as IconExample,p as LeftPositionExample,c as Playground,f as RightPositionExample,g as TopPositionExample,re as __namedExportsOrder,ae as default};
