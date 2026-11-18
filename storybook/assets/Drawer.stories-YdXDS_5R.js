import{a8 as k,g as z,e as R,aZ as B,a_ as M,j as e,av as _,a$ as j,b0 as x,b1 as H,b2 as I,B as w,b3 as q,b4 as G,E as C,b5 as W,ai as F,b as U}from"./iframe-6KWIKMhT.js";import{F as L}from"./flex-CfNrUc6L.js";import{g as O,i as V,P as o}from"./position-wreWcUSJ.js";import"./preload-helper-PPVm8Dsz.js";var a=(t=>(t.SMALL="360px",t.STANDARD="50%",t.LARGE="90%",t))(a||{});class T extends k{static displayName=`${z}.Drawer`;static defaultProps={canOutsideClickClose:!0,isOpen:!1,position:"right",style:{}};render(){const{hasBackdrop:n,size:r,style:i,position:v}=this.props,{className:b,children:P,...E}=this.props,D=O(v),A=R(B,{[M(D)??""]:!0},b),N=r==null?i:{...i,[V(D)?"height":"width"]:r};return e.jsx(_,{...E,className:R({[j]:n}),children:e.jsxs("div",{className:A,style:N,children:[this.maybeRenderHeader(),P]})})}validateProps(n){n.title==null&&(n.icon!=null&&console.warn(x),n.isCloseButtonShown!=null&&console.warn(H)),n.position!=null&&n.position!==O(n.position)&&console.warn(I)}maybeRenderCloseButton(){return this.props.isCloseButtonShown!==!1?e.jsx(w,{"aria-label":"Close",className:q,icon:e.jsx(G,{size:C.LARGE}),onClick:this.props.onClose,variant:"minimal"}):null}maybeRenderHeader(){const{icon:n,title:r}=this.props;return r==null?null:e.jsxs("div",{className:W,children:[e.jsx(F,{icon:n,size:C.LARGE}),e.jsx(U,{children:r}),this.maybeRenderCloseButton()]})}}T.__docgenInfo={description:"",methods:[{name:"validateProps",docblock:null,modifiers:[],params:[{name:"props",optional:!1,type:{name:"DrawerProps",alias:"DrawerProps"}}],returns:null}],props:{onClosing:{required:!1,tsType:{name:"signature",type:"function",raw:"(node: HTMLElement) => void",signature:{arguments:[{type:{name:"HTMLElement"},name:"node"}],return:{name:"void"}}},description:`Lifecycle method invoked just before the CSS _close_ transition begins on
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

@default true`,defaultValue:{value:"true",computed:!1}},hasBackdrop:{required:!1,tsType:{name:"boolean"},description:`Whether a container-spanning backdrop element should be rendered behind the contents.
When \`false\`, users will be able to scroll through and interact with overlaid content.

@default true`},className:{required:!1,tsType:{name:"string"},description:"A space-delimited list of class names to pass along to a child element."},children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"Drawer contents."},icon:{required:!1,tsType:{name:"union",raw:"IconName | MaybeElement",elements:[{name:"IconName"},{name:"union",raw:"React.JSX.Element | false | null | undefined",elements:[{name:"React.JSX.Element"},{name:"literal",value:"false"},{name:"null"},{name:"undefined"}]}]},description:"Name of a Blueprint UI icon (or an icon element) to render in the\ndrawer's header. Note that the header will only be rendered if `title` is\nprovided."},isCloseButtonShown:{required:!1,tsType:{name:"boolean"},description:`Whether to show the close button in the dialog's header.
Note that the header will only be rendered if \`title\` is provided.

@default true`},isOpen:{required:!1,tsType:{name:"boolean"},description:`Toggles the visibility of the overlay and its children.
This prop is required because the component is controlled.`,defaultValue:{value:"false",computed:!1}},position:{required:!1,tsType:{name:"Position"},description:`Position of a drawer. All angled positions will be casted into pure positions
(top, bottom, left, or right).

@default "right"`,defaultValue:{value:'"right"',computed:!1}},size:{required:!1,tsType:{name:"union",raw:"number | string",elements:[{name:"number"},{name:"string"}]},description:'CSS size of the drawer. This sets `width` if horizontal position (default)\nand `height` otherwise.\n\nConstants are available for common sizes:\n- `DrawerSize.SMALL = 360px`\n- `DrawerSize.STANDARD = 50%`\n- `DrawerSize.LARGE = 90%`\n\n@default DrawerSize.STANDARD = "50%"'},style:{required:!1,tsType:{name:"ReactCSSProperties",raw:"React.CSSProperties"},description:`CSS styles to apply to the dialog.

@default {}`,defaultValue:{value:"{}",computed:!1}},title:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"Title of the dialog. If provided, an element with `Classes.DIALOG_HEADER`\nwill be rendered inside the dialog before any children elements."},transitionName:{required:!1,tsType:{name:"string"},description:"Name of the transition for internal `CSSTransition`. Providing your own\nname here will require defining new CSS transition properties."}}};const{useArgs:X,useCallback:S,useState:Y}=__STORYBOOK_MODULE_PREVIEW_API__,Q={title:"Core/Overlays/Drawer",component:T,decorators:[t=>e.jsx(L,{justifyContent:"center",alignItems:"center",children:e.jsx(t,{})})],args:{isOpen:!0,title:"Drawer Title",icon:"cog",position:"right",size:a.STANDARD,isCloseButtonShown:!0,hasBackdrop:!0,transitionDuration:0,transitionName:"no-transition"},argTypes:{position:{control:"select",options:[o.TOP,o.BOTTOM,o.LEFT,o.RIGHT]},size:{control:"select",options:[a.SMALL,a.STANDARD,a.LARGE]},isOpen:{control:"boolean"},isCloseButtonShown:{control:"boolean"},hasBackdrop:{control:"boolean"},icon:{control:"text"},onClose:{action:"closed"}}};function s(t){const[,n]=X(),r=S(()=>n({isOpen:!0}),[n]),i=S(()=>n({isOpen:!1}),[n]);return e.jsxs(e.Fragment,{children:[e.jsx(w,{text:"Open Drawer",onClick:r}),e.jsx(T,{...t,isOpen:t.isOpen,onClose:i,children:e.jsx("div",{style:{padding:20},children:e.jsx("p",{children:"Drawer content goes here."})})})]})}const l={render:s},d={name:"Position: Top",argTypes:{position:{table:{disable:!0}}},args:{position:o.TOP,title:"Top Drawer"},render:s},c={name:"Position: Bottom",argTypes:{position:{table:{disable:!0}}},args:{position:o.BOTTOM,title:"Bottom Drawer"},render:s},p={name:"Position: Left",argTypes:{position:{table:{disable:!0}}},args:{position:o.LEFT,title:"Left Drawer"},render:s},u={name:"Position: Right",argTypes:{position:{table:{disable:!0}}},args:{position:o.RIGHT,title:"Right Drawer"},render:s},m={name:"Size: Small",argTypes:{size:{table:{disable:!0}}},args:{size:a.SMALL,title:"Small Drawer"},render:s},h={name:"Size: Standard",argTypes:{size:{table:{disable:!0}}},args:{size:a.STANDARD,title:"Standard Drawer"},render:s},f={name:"Size: Large",argTypes:{size:{table:{disable:!0}}},args:{size:a.LARGE,title:"Large Drawer"},render:s},g={name:"Close Button Hidden",argTypes:{isCloseButtonShown:{table:{disable:!0}}},args:{isCloseButtonShown:!1,title:"No Close Button"},render:s},y={render:function(n){const[r,i]=Y(!1),v=S(()=>i(!0),[]),b=S(()=>i(!1),[]);return e.jsxs(e.Fragment,{children:[e.jsx(w,{onClick:v,children:"Open Drawer"}),e.jsxs(T,{...n,isOpen:r,onClose:b,children:[e.jsx("div",{className:"bp6-drawer-body",children:e.jsx("div",{style:{padding:20},children:e.jsx("p",{children:"Drawer body content. Use the Storybook controls to adjust props."})})}),e.jsx("div",{className:"bp6-drawer-footer",children:e.jsx(L,{gap:2,justifyContent:"end",children:e.jsx(w,{onClick:b,children:"Close"})})})]})]})}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: DrawerStoryRender
}`,...l.parameters?.docs?.source},description:{story:"A basic drawer opening from the right side with a title and icon.",...l.parameters?.docs?.description}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: "Position: Top",
  argTypes: {
    position: {
      table: {
        disable: true
      }
    }
  },
  args: {
    position: Position.TOP,
    title: "Top Drawer"
  },
  render: DrawerStoryRender
}`,...d.parameters?.docs?.source},description:{story:"Drawer opening from the top edge of the screen.",...d.parameters?.docs?.description}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: "Position: Bottom",
  argTypes: {
    position: {
      table: {
        disable: true
      }
    }
  },
  args: {
    position: Position.BOTTOM,
    title: "Bottom Drawer"
  },
  render: DrawerStoryRender
}`,...c.parameters?.docs?.source},description:{story:"Drawer opening from the bottom edge of the screen.",...c.parameters?.docs?.description}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  name: "Position: Left",
  argTypes: {
    position: {
      table: {
        disable: true
      }
    }
  },
  args: {
    position: Position.LEFT,
    title: "Left Drawer"
  },
  render: DrawerStoryRender
}`,...p.parameters?.docs?.source},description:{story:"Drawer opening from the left edge of the screen.",...p.parameters?.docs?.description}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  name: "Position: Right",
  argTypes: {
    position: {
      table: {
        disable: true
      }
    }
  },
  args: {
    position: Position.RIGHT,
    title: "Right Drawer"
  },
  render: DrawerStoryRender
}`,...u.parameters?.docs?.source},description:{story:"Drawer opening from the right edge of the screen.",...u.parameters?.docs?.description}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  name: "Size: Small",
  argTypes: {
    size: {
      table: {
        disable: true
      }
    }
  },
  args: {
    size: DrawerSize.SMALL,
    title: "Small Drawer"
  },
  render: DrawerStoryRender
}`,...m.parameters?.docs?.source},description:{story:"Drawer with the small size.",...m.parameters?.docs?.description}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  name: "Size: Standard",
  argTypes: {
    size: {
      table: {
        disable: true
      }
    }
  },
  args: {
    size: DrawerSize.STANDARD,
    title: "Standard Drawer"
  },
  render: DrawerStoryRender
}`,...h.parameters?.docs?.source},description:{story:"Drawer with the standard size.",...h.parameters?.docs?.description}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: "Size: Large",
  argTypes: {
    size: {
      table: {
        disable: true
      }
    }
  },
  args: {
    size: DrawerSize.LARGE,
    title: "Large Drawer"
  },
  render: DrawerStoryRender
}`,...f.parameters?.docs?.source},description:{story:"Drawer with the large size.",...f.parameters?.docs?.description}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: "Close Button Hidden",
  argTypes: {
    isCloseButtonShown: {
      table: {
        disable: true
      }
    }
  },
  args: {
    isCloseButtonShown: false,
    title: "No Close Button"
  },
  render: DrawerStoryRender
}`,...g.parameters?.docs?.source},description:{story:"Drawer with the close button hidden.",...g.parameters?.docs?.description}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);
    const handleOpen = useCallback(() => setIsOpen(true), []);
    const handleClose = useCallback(() => setIsOpen(false), []);
    return <>
                <Button onClick={handleOpen}>Open Drawer</Button>
                <Drawer {...args} isOpen={isOpen} onClose={handleClose}>
                    <div className="bp6-drawer-body">
                        <div style={{
            padding: 20
          }}>
                            <p>Drawer body content. Use the Storybook controls to adjust props.</p>
                        </div>
                    </div>
                    <div className="bp6-drawer-footer">
                        <Flex gap={2} justifyContent="end">
                            <Button onClick={handleClose}>Close</Button>
                        </Flex>
                    </div>
                </Drawer>
            </>;
  }
}`,...y.parameters?.docs?.source},description:{story:"Interactive playground with all props togglable via Storybook controls.",...y.parameters?.docs?.description}}};const ee=["Default","PositionTop","PositionBottom","PositionLeft","PositionRight","SizeSmall","SizeStandard","SizeLarge","CloseButtonHidden","Playground"];export{g as CloseButtonHidden,l as Default,y as Playground,c as PositionBottom,p as PositionLeft,u as PositionRight,d as PositionTop,f as SizeLarge,m as SizeSmall,h as SizeStandard,ee as __namedExportsOrder,Q as default};
