import{a8 as C,g as w,e as H,b6 as S,aa as A,b7 as F,l as M,b8 as j,b9 as R,m as k,j as s,ba as V,bb as q,bc as W,I as L}from"./iframe-6KWIKMhT.js";import{s as N,S as y,D as T}from"./common-CGlRPlLv.js";import{F as p}from"./flex-CfNrUc6L.js";import"./preload-helper-PPVm8Dsz.js";const O=5;class h extends C{static displayName=`${w}.EditableText`;static defaultProps={alwaysRenderInput:!1,confirmOnEnterKey:!1,defaultValue:"",disabled:!1,fill:!1,maxLines:1/0,minLines:1,minWidth:80,multiline:!1,placeholder:"Click to Edit",type:"text"};inputElement=null;valueElement=null;refHandlers={content:e=>{this.valueElement=e},input:e=>{if(e!=null&&(this.inputElement=e,this.props.alwaysRenderInput||this.inputElement.focus(),this.state!=null&&this.state.isEditing)){const t=P(e);if(t){const{length:i}=e.value;e.setSelectionRange(this.props.selectAllOnFocus?0:i,i)}(!t||!this.props.selectAllOnFocus)&&(e.scrollLeft=e.scrollWidth)}}};constructor(e){super(e);const t=e.value==null?e.defaultValue:e.value;this.state={inputHeight:0,inputWidth:0,isEditing:e.isEditing===!0&&e.disabled===!1,lastValue:t,value:t}}render(){const{alwaysRenderInput:e,disabled:t,elementRef:i,fill:a,multiline:r,contentId:o}=this.props,l=this.props.value??this.state.value,u=l!=null&&l!=="",d=H(S,A(this.props.intent),{[k]:t,[R]:this.state.isEditing,[j]:!u,[M]:a,[F]:r},this.props.className);let c;r?c={height:this.state.isEditing?void 0:this.state.inputHeight}:c={height:this.state.inputHeight,lineHeight:this.state.inputHeight!=null?`${this.state.inputHeight}px`:void 0,minWidth:this.props.minWidth};const x=e||this.state.isEditing||t?void 0:0,v=e&&!this.state.isEditing,D=o!=null?{id:o}:{};return s.jsxs("div",{className:d,onFocus:this.handleFocus,tabIndex:x,ref:i,children:[e||this.state.isEditing?this.renderInput(l):void 0,v?void 0:s.jsx("span",{...D,className:V,ref:this.refHandlers.content,style:c,children:u?l:this.props.placeholder})]})}componentDidMount(){this.updateInputDimensions()}componentDidUpdate(e,t){const i={};this.props.value!==e.value&&(e.value!=null||this.props.value!=null)&&(i.value=this.props.value),this.props.isEditing!=null&&this.props.isEditing!==e.isEditing&&(i.isEditing=this.props.isEditing),(this.props.disabled||this.props.disabled==null&&e.disabled)&&(i.isEditing=!1),this.setState(i),this.state.isEditing&&!t.isEditing&&this.props.onEdit?.(this.state.value),(this.state.value!==t.value||this.props.alwaysRenderInput!==e.alwaysRenderInput||this.props.fill!==e.fill||this.props.maxLines!==e.maxLines||this.props.minLines!==e.minLines||this.props.minWidth!==e.minWidth||this.props.multiline!==e.multiline||this.props.placeholder!==e.placeholder)&&this.updateInputDimensions()}cancelEditing=()=>{const{lastValue:e,value:t}=this.state;this.setState({isEditing:!1,value:e}),t!==e&&this.props.onChange?.(e),this.props.onCancel?.(e)};toggleEditing=()=>{if(this.state.isEditing){const{value:e}=this.state;this.setState({isEditing:!1,lastValue:e}),this.props.onConfirm?.(e)}else this.props.disabled||this.setState({isEditing:!0})};handleFocus=()=>{const{alwaysRenderInput:e,disabled:t,selectAllOnFocus:i}=this.props;if(t||this.setState({isEditing:!0}),e&&i&&this.inputElement!=null){const{length:a}=this.inputElement.value;this.inputElement.setSelectionRange(0,a)}};handleTextChange=e=>{const t=e.target.value;this.props.value==null&&this.setState({value:t}),this.props.onChange?.(t)};handleKeyEvent=e=>{if(e.nativeEvent.isComposing)return;const{altKey:t,ctrlKey:i,metaKey:a,shiftKey:r}=e;if(e.key==="Escape"){this.cancelEditing();return}const o=t||i||a||r;e.key==="Enter"&&((t||r)&&e.preventDefault(),this.props.confirmOnEnterKey&&this.props.multiline?e.target!=null&&o?(K(e.target,`
`),this.handleTextChange(e)):this.toggleEditing():(!this.props.multiline||o)&&this.toggleEditing())};renderInput(e){const{disabled:t,fill:i,maxLength:a,multiline:r,type:o,placeholder:l,customInputAttributes:u}=this.props,d={className:q,disabled:t,maxLength:a,onBlur:this.toggleEditing,onChange:this.handleTextChange,onKeyDown:this.handleKeyEvent,placeholder:l,value:e},{inputHeight:c,inputWidth:x}=this.state;return c!==0&&x!==0&&(d.style={height:c,lineHeight:!r&&c!=null?`${c}px`:void 0,width:i||r?"100%":x}),r?s.jsx("textarea",{ref:this.refHandlers.input,...d,...u}):s.jsx("input",{ref:this.refHandlers.input,type:o,...d,...u})}updateInputDimensions(){if(this.valueElement!=null){const{maxLines:e,minLines:t,minWidth:i,multiline:a}=this.props,{parentElement:r,textContent:o}=this.valueElement;let{scrollHeight:l,scrollWidth:u}=this.valueElement;const d=I(this.valueElement);a&&this.state.isEditing&&/\n$/.test(o??"")&&(l+=d),d>0&&(l=W(l,t*d,e*d)),l=Math.max(l,_(this.valueElement)+1,I(r)),u+=O,this.setState({inputHeight:l,inputWidth:Math.max(u,i)}),a&&this.state.isEditing&&this.setTimeout(()=>r.style.height=`${l}px`)}}}function _(n){const e=getComputedStyle(n).fontSize;return e===""?0:parseInt(e.slice(0,-2),10)}function I(n){let e=parseInt(getComputedStyle(n).lineHeight.slice(0,-2),10);if(isNaN(e)){const t=document.createElement("span");t.innerHTML="<br>",n.appendChild(t);const i=n.offsetHeight;t.innerHTML="<br><br>";const a=n.offsetHeight;n.removeChild(t),e=a-i}return e}function K(n,e){const{selectionEnd:t,selectionStart:i,value:a}=n;if(i>=0){const r=a.substring(0,i),o=a.substring(t,a.length),l=e.length;n.value=`${r}${e}${o}`,n.selectionStart=i+l,n.selectionEnd=i+l}}function P(n){switch(n.type){case"textarea":return!0;case"text":case"search":case"tel":case"url":case"password":return!0;default:return!1}}h.__docgenInfo={description:`EditableText component.

@see https://blueprintjs.com/docs/#core/components/editable-text`,methods:[{name:"cancelEditing",docblock:null,modifiers:[],params:[],returns:null},{name:"toggleEditing",docblock:null,modifiers:[],params:[],returns:null}],props:{intent:{required:!1,tsType:{name:"Intent"},description:"Visual intent color to apply to element."},className:{required:!1,tsType:{name:"string"},description:"A space-delimited list of class names to pass along to a child element."},customInputAttributes:{required:!1,tsType:{name:"intersection",raw:"HTMLInputProps & HTMLTextAreaProps",elements:[{name:"ReactInputHTMLAttributes",raw:"React.InputHTMLAttributes<HTMLInputElement>",elements:[{name:"HTMLInputElement"}]},{name:"ReactTextareaHTMLAttributes",raw:"React.TextareaHTMLAttributes<HTMLTextAreaElement>",elements:[{name:"HTMLTextAreaElement"}]}]},description:"Custom attributes that will be passed to the underlying input (or textarea) element.\nThis allows you to specify additional attributes like\n`aria-` attributes, `data-` attributes, etc."},alwaysRenderInput:{required:!1,tsType:{name:"boolean"},description:`EXPERIMENTAL FEATURE.

When true, this forces the component to _always_ render an editable input (or textarea)
both when the component is focussed and unfocussed, instead of the component's default
behavior of switching between a text span and a text input upon interaction.

This behavior can help in certain applications where, for example, a custom right-click
context menu is used to supply clipboard copy and paste functionality.

@default false`,defaultValue:{value:"false",computed:!1}},confirmOnEnterKey:{required:!1,tsType:{name:"boolean"},description:"If `true` and in multiline mode, the `enter` key will trigger onConfirm and `mod+enter`\nwill insert a newline. If `false`, the key bindings are inverted such that `enter`\nadds a newline.\n\n@default false",defaultValue:{value:"false",computed:!1}},defaultValue:{required:!1,tsType:{name:"string"},description:"Default text value of uncontrolled input.",defaultValue:{value:'""',computed:!1}},disabled:{required:!1,tsType:{name:"boolean"},description:`Whether the text can be edited.

@default false`,defaultValue:{value:"false",computed:!1}},elementRef:{required:!1,tsType:{name:"ReactRef",raw:"React.Ref<HTMLDivElement>",elements:[{name:"HTMLDivElement"}]},description:`Ref to attach to the root element rendered by this component.

N.B. this may be renamed to simply \`ref\` in a future major version of Blueprint, when this class component is
refactored into a function.`},fill:{required:!1,tsType:{name:"boolean"},description:`Whether the component should take up the full width of its container.

@default false`,defaultValue:{value:"false",computed:!1}},isEditing:{required:!1,tsType:{name:"boolean"},description:"Whether the component is currently being edited."},maxLength:{required:!1,tsType:{name:"number"},description:"Maximum number of characters allowed. Unlimited by default."},minWidth:{required:!1,tsType:{name:"number"},description:"Minimum width in pixels of the input, when not `multiline`.",defaultValue:{value:"80",computed:!1}},multiline:{required:!1,tsType:{name:"boolean"},description:`Whether the component supports multiple lines of text.
This prop should not be changed during the component's lifetime.

@default false`,defaultValue:{value:"false",computed:!1}},maxLines:{required:!1,tsType:{name:"number"},description:"Maximum number of lines before scrolling begins, when `multiline`.",defaultValue:{value:"Infinity",computed:!0}},minLines:{required:!1,tsType:{name:"number"},description:"Minimum number of lines (essentially minimum height), when `multiline`.\n\n@default 1",defaultValue:{value:"1",computed:!1}},placeholder:{required:!1,tsType:{name:"string"},description:`Placeholder text when there is no value.

@default "Click to Edit"`,defaultValue:{value:'"Click to Edit"',computed:!1}},selectAllOnFocus:{required:!1,tsType:{name:"boolean"},description:`Whether the entire text field should be selected on focus.
If \`false\`, the cursor is placed at the end of the text.
This prop is ignored on inputs with type other then text, search, url, tel and password. See https://html.spec.whatwg.org/multipage/input.html#do-not-apply for details.

@default false`},type:{required:!1,tsType:{name:"string"},description:"The type of input that should be shown, when not `multiline`.",defaultValue:{value:'"text"',computed:!1}},value:{required:!1,tsType:{name:"string"},description:"Text value of controlled input."},contentId:{required:!1,tsType:{name:"string"},description:"ID attribute to pass to the underlying element that contains the text contents. This allows for referencing via aria attributes"}}};const U=["customInputAttributes","elementRef","contentId"],G={title:"Core/EditableText",component:h,decorators:[N],args:{placeholder:"Click to Edit",disabled:!1,fill:!1,multiline:!1,selectAllOnFocus:!1,confirmOnEnterKey:!1},argTypes:{intent:{control:"select",options:Object.values(L)},disabled:{control:"boolean"},fill:{control:"boolean"},multiline:{control:"boolean"},selectAllOnFocus:{control:"boolean"},confirmOnEnterKey:{control:"boolean"},placeholder:{control:"text"},onCancel:{table:{disable:!0}},onChange:{table:{disable:!0}},onConfirm:{table:{disable:!0}},onEdit:{table:{disable:!0}},className:{table:{disable:!0}},alwaysRenderInput:{table:{disable:!0}},defaultValue:{table:{disable:!0}},isEditing:{table:{disable:!0}},maxLength:{table:{disable:!0}},minWidth:{table:{disable:!0}},maxLines:{table:{disable:!0}},minLines:{table:{disable:!0}},value:{table:{disable:!0}},type:{table:{disable:!0}},...U.reduce((n,e)=>(n[e]={table:{disable:!0}},n),{})}},m={args:{placeholder:"Click to Edit"}},f={name:"Intent",argTypes:{intent:{table:{disable:!0}}},render:n=>s.jsx(p,{flexDirection:"column",gap:4,children:Object.values(L).map(e=>s.jsx(h,{...n,intent:e,placeholder:e.charAt(0).toUpperCase()+e.slice(1)},e))})},g={name:"State",argTypes:{disabled:{table:{disable:!0}}},render:n=>s.jsxs(p,{flexDirection:"column",gap:10,children:[s.jsxs(p,{flexDirection:"column",gap:1,children:[s.jsx(y,{title:"Default"}),s.jsx(T,{children:s.jsx(h,{...n,placeholder:"Click to Edit"})})]}),s.jsxs(p,{flexDirection:"column",gap:1,children:[s.jsx(y,{title:"Disabled"}),s.jsx(T,{children:s.jsx(h,{...n,disabled:!0,placeholder:"Disabled"})})]})]})},b={name:"Multiline",argTypes:{multiline:{table:{disable:!0}}},render:n=>s.jsxs(p,{flexDirection:"column",gap:10,children:[s.jsxs(p,{flexDirection:"column",gap:1,children:[s.jsx(y,{title:"Single line"}),s.jsx(T,{children:s.jsx(h,{...n,multiline:!1,placeholder:"Click to Edit"})})]}),s.jsxs(p,{flexDirection:"column",gap:1,children:[s.jsx(y,{title:"Multiline [4 lines minimum, 6 lines maximum]"}),s.jsx(T,{children:s.jsx(h,{...n,multiline:!0,minLines:4,maxLines:6,placeholder:"Click to edit multiple lines..."})})]})]})},E={args:{placeholder:"Click to Edit",defaultValue:"Hello, world!"}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: "Click to Edit"
  }
}`,...m.parameters?.docs?.source},description:{story:"A basic editable text field with default styling.",...m.parameters?.docs?.description}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: "Intent",
  argTypes: {
    intent: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="column" gap={4}>
            {Object.values(Intent).map(intent => <EditableText key={intent} {...args} intent={intent} placeholder={intent.charAt(0).toUpperCase() + intent.slice(1)} />)}
        </Flex>
}`,...f.parameters?.docs?.source},description:{story:"Use the `intent` prop to apply semantic color to the editable text.",...f.parameters?.docs?.description}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: "State",
  argTypes: {
    disabled: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="column" gap={10}>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title="Default" />
                <DashedPaddedContainer>
                    <EditableText {...args} placeholder="Click to Edit" />
                </DashedPaddedContainer>
            </Flex>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title="Disabled" />
                <DashedPaddedContainer>
                    <EditableText {...args} disabled={true} placeholder="Disabled" />
                </DashedPaddedContainer>
            </Flex>
        </Flex>
}`,...g.parameters?.docs?.source},description:{story:"EditableText supports `disabled` state where editing is prevented.",...g.parameters?.docs?.description}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  name: "Multiline",
  argTypes: {
    multiline: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="column" gap={10}>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title="Single line" />
                <DashedPaddedContainer>
                    <EditableText {...args} multiline={false} placeholder="Click to Edit" />
                </DashedPaddedContainer>
            </Flex>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title="Multiline [4 lines minimum, 6 lines maximum]" />
                <DashedPaddedContainer>
                    <EditableText {...args} multiline={true} minLines={4} maxLines={6} placeholder="Click to edit multiple lines..." />
                </DashedPaddedContainer>
            </Flex>
        </Flex>
}`,...b.parameters?.docs?.source},description:{story:"Enabling the `multiline` prop transforms EditableText into a `<textarea>` that grows and shrinks\nvertically as content changes. Use `minLines` and `maxLines` to constrain the height.\n\nIn multiline mode, press **Ctrl+Enter** (or **Cmd+Enter** on Mac) to confirm. Pressing **Enter**\nalone inserts a newline. This behavior can be inverted with the `confirmOnEnterKey` prop.",...b.parameters?.docs?.description}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: "Click to Edit",
    defaultValue: "Hello, world!"
  }
}`,...E.parameters?.docs?.source},description:{story:"Interactive playground with all props togglable via Storybook controls.",...E.parameters?.docs?.description}}};const Y=["Default","IntentExample","StateExample","MultilineExample","Playground"];export{m as Default,f as IntentExample,b as MultilineExample,E as Playground,g as StateExample,Y as __namedExportsOrder,G as default};
