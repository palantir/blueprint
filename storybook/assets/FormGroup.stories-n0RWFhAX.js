import{e as Q,dd as se,aa as te,_ as de,l as ie,m as be,j as l,t as pe,bf as ue,de as ce,df as me,dg as fe,g as Z,r as m,a8 as he,br as le,bt as ne,bU as xe,dh as Fe,s as ge,di as Ge,I as je}from"./iframe-6KWIKMhT.js";import{F as h}from"./flex-CfNrUc6L.js";import{H as d}from"./htmlSelect-uzBgO6cZ.js";import{S as T}from"./segmentedControl-C9PUGiG2.js";import{S as J}from"./slider-DH1BaE4A.js";import{S as b,C as t,R as Ie}from"./controls-DUXJJE55.js";import{F as X}from"./fileInput-CDkalMiM.js";import{I as o}from"./inputGroup-Csz7Qhv0.js";import{N as I}from"./numericInput-33y2bkPW.js";import{R as w}from"./radioGroup-BILGjkZI.js";import"./preload-helper-PPVm8Dsz.js";import"./carets-vertical-DFIbhOR4.js";import"./functionUtils-BGFdVicR.js";import"./buttonGroup-Dt--H6MV.js";import"./controlGroup-DgQe6Apf.js";import"./position-wreWcUSJ.js";import"./chevron-up-Dg4RJcAC.js";import"./radioCard-C-b2twbm.js";import"./controlCard-C1sq-t4J.js";import"./card-C6ssIv7b.js";const n=e=>{const{children:a,className:r,contentClassName:i,disabled:y,fill:p,helperText:u,inline:x,intent:F,label:g,labelFor:G,labelInfo:j,style:c,subLabel:S,...$}=e,Y=Q(se,te(F),{[be]:y,[ie]:p,[de]:x},r);return l.jsxs("div",{className:Y,style:c,...$,children:[g&&l.jsxs("label",{className:pe,htmlFor:G,children:[g," ",l.jsx("span",{className:ue,children:j})]}),S&&l.jsx("div",{className:ce,children:S}),l.jsxs("div",{className:Q(fe,i),children:[a,u&&l.jsx("div",{className:me,children:u})]})]})};n.displayName=`${Z}.FormGroup`;n.__docgenInfo={description:`Form group component.

@see https://blueprintjs.com/docs/#core/components/form-group`,methods:[]};const ye=10;function Se(e){const{onCompositionStart:a,onCompositionEnd:r,value:i,onChange:y}=e,[p,u]=m.useState(i),[x,F]=m.useState(i),[g,G]=m.useState(!1),[j,c]=m.useState(!1),S=m.useRef(),$=m.useCallback(s=>{S.current?.(),G(!0),a?.(s)},[a]),Y=m.useCallback(()=>{const s=window.setTimeout(()=>G(!1),ye);return()=>window.clearTimeout(s)},[]),ae=m.useCallback(s=>{S.current=Y(),r?.(s)},[Y,r]),re=m.useCallback(s=>{const{value:oe}=s.target;F(oe),y?.(s)},[y]);if(!(g||i===void 0)){const s=x!==p;s&&i===x?(u(i),c(!1)):s&&i===p?j||c(!0):s&&i!==p?(u(i),F(i),c(!1)):s||(p!==i||j)&&(u(i),F(i),c(!1))}return{onChange:re,onCompositionEnd:ae,onCompositionStart:$,value:g||j?x:p}}const ee=m.forwardRef(function(a,r){const{value:i,onChange:y,onCompositionStart:p,onCompositionEnd:u,...x}=a,{value:F,onChange:g,onCompositionStart:G,onCompositionEnd:j}=Se({onChange:y,onCompositionEnd:u,onCompositionStart:p,value:i});return l.jsx("textarea",{...x,value:F,onChange:g,onCompositionStart:G,onCompositionEnd:j,ref:r})});ee.displayName=`${Z}.AsyncControllableTextArea`;ee.__docgenInfo={description:`A wrapper around the low-level <textarea> component which works around a React bug
the same way <AsyncControllableInput> does.`,methods:[]};class f extends he{static defaultProps={autoResize:!1,fill:!1,large:!1,size:"medium",small:!1};static displayName=`${Z}.TextArea`;state={};textareaElement=null;handleRef=le(this,"textareaElement",this.props.inputRef);maybeSyncHeightToScrollHeight=()=>{const{autoResize:a}=this.props;if(this.textareaElement!=null){const{scrollHeight:r}=this.textareaElement;a&&(this.textareaElement.style.height="0px",this.textareaElement.style.height=r.toString()+"px",this.setState({height:r}))}if(this.props.autoResize&&this.textareaElement!=null){this.textareaElement.style.height="0px";const{scrollHeight:r}=this.textareaElement;this.textareaElement.style.height=r.toString()+"px",this.setState({height:r})}};componentDidMount(){this.maybeSyncHeightToScrollHeight()}componentDidUpdate(a){a.inputRef!==this.props.inputRef&&(ne(a.inputRef,null),this.handleRef=le(this,"textareaElement",this.props.inputRef),ne(this.props.inputRef,this.textareaElement)),(a.value!==this.props.value||a.style!==this.props.style)&&this.maybeSyncHeightToScrollHeight()}render(){const{asyncControl:a,autoResize:r,className:i,fill:y,inputRef:p,intent:u,large:x,size:F="medium",small:g,...G}=this.props,j=Q(xe,Fe,te(u),ge(F,{large:x,small:g}),{[ie]:y,[Ge]:r},i);let{style:c={}}=G;r&&this.state.height!=null&&(c={...c,height:`${this.state.height}px`});const S=a?ee:"textarea";return l.jsx(S,{...G,className:j,onChange:this.handleChange,style:c,ref:this.handleRef})}handleChange=a=>{this.maybeSyncHeightToScrollHeight(),this.props.onChange?.(a)}}f.__docgenInfo={description:`Text area component.

@see https://blueprintjs.com/docs/#core/components/text-area`,methods:[],props:{intent:{required:!1,tsType:{name:"Intent"},description:"Visual intent color to apply to element."},className:{required:!1,tsType:{name:"string"},description:"A space-delimited list of class names to pass along to a child element."},asyncControl:{required:!1,tsType:{name:"boolean"},description:"Set this to `true` if you will be controlling the `value` of this input with asynchronous updates.\nThese may occur if you do not immediately call setState in a parent component with the value from\nthe `onChange` handler, or if working with certain libraries like __redux-form__.\n\n@default false"},autoResize:{required:!1,tsType:{name:"boolean"},description:`Whether the component should automatically resize vertically as a user types in the text input.
This will disable manual resizing in the vertical dimension.

@default false`,defaultValue:{value:"false",computed:!1}},fill:{required:!1,tsType:{name:"boolean"},description:`Whether the text area should take up the full width of its container.

@default false`,defaultValue:{value:"false",computed:!1}},inputRef:{required:!1,tsType:{name:"ReactRef",raw:"React.Ref<HTMLTextAreaElement>",elements:[{name:"HTMLTextAreaElement"}]},description:"Ref handler that receives HTML `<textarea>` element backing this component."},large:{required:!1,tsType:{name:"boolean"},description:`Whether the text area should appear with large styling.

@deprecated use \`size="large"\` instead.
@default false`,defaultValue:{value:"false",computed:!1}},small:{required:!1,tsType:{name:"boolean"},description:`Whether the text area should appear with small styling.

@deprecated use \`size="small"\` instead.
@default false`,defaultValue:{value:"false",computed:!1}},size:{required:!1,tsType:{name:"Size"},description:`The size styling of the text area.

@default "medium"`,defaultValue:{value:'"medium"',computed:!1}}}};const C=()=>{},ze={title:"Core/Form/FormGroup",component:n,decorators:[e=>l.jsx(h,{flexDirection:"column",gap:3,style:{width:"100%",minWidth:"400px"},children:l.jsx(e,{})})],tags:["autodocs"],args:{label:"Label",helperText:"",labelInfo:"",subLabel:"",intent:"none",disabled:!1,fill:!1,inline:!1},argTypes:{label:{control:"text"},helperText:{control:"text"},labelInfo:{control:"text"},subLabel:{control:"text"},intent:{control:"select",options:Object.values(je)},disabled:{control:"boolean"},fill:{control:"boolean"},inline:{control:"boolean"}}},v={render:e=>l.jsx(n,{...e,labelFor:"default-input",children:l.jsx(o,{id:"default-input",intent:e.intent,disabled:e.disabled,fill:e.fill,placeholder:"Enter value..."})})},E={args:{label:"Description",helperText:"Provide a detailed description"},render:e=>l.jsx(n,{...e,labelFor:"textarea-input",children:l.jsx(f,{id:"textarea-input",intent:e.intent,disabled:e.disabled,fill:e.fill,placeholder:"Enter description..."})})},A={args:{label:"Quantity",helperText:"Enter a number between 1 and 100"},render:e=>l.jsx(n,{...e,labelFor:"numeric-input",children:l.jsx(I,{id:"numeric-input",intent:e.intent,disabled:e.disabled,fill:e.fill,min:1,max:100,placeholder:"Enter quantity..."})})},O={args:{label:"Country",helperText:"Select your country of residence"},render:e=>l.jsx(n,{...e,labelFor:"select-input",children:l.jsx(d,{id:"select-input",disabled:e.disabled,fill:e.fill,options:["United States","Canada","United Kingdom","Germany","France","Japan"]})})},k={args:{label:"Attachment",helperText:"Upload a PDF or image file"},render:e=>l.jsx(n,{...e,labelFor:"file-input",children:l.jsx(X,{inputProps:{id:"file-input"},disabled:e.disabled,fill:e.fill,text:"Choose file..."})})},L={args:{label:"Notifications",helperText:"Enable or disable email notifications"},render:e=>l.jsx(n,{...e,children:l.jsx(b,{label:"Email notifications",disabled:e.disabled})})},R={args:{label:"Interests",helperText:"Select all that apply"},render:e=>l.jsxs(n,{...e,children:[l.jsx(t,{label:"Engineering",disabled:e.disabled}),l.jsx(t,{label:"Design",disabled:e.disabled}),l.jsx(t,{label:"Marketing",disabled:e.disabled}),l.jsx(t,{label:"Sales",disabled:e.disabled})]})},D={args:{label:"Priority",helperText:"Select the task priority"},render:e=>l.jsx(n,{...e,children:l.jsx(w,{disabled:e.disabled,onChange:C,selectedValue:"medium",options:[{label:"Low",value:"low"},{label:"Medium",value:"medium"},{label:"High",value:"high"},{label:"Critical",value:"critical"}]})})},N={args:{label:"Volume",helperText:"Adjust the output volume"},render:e=>l.jsx(n,{...e,children:l.jsx(J,{intent:e.intent,disabled:e.disabled,min:0,max:100,stepSize:1,value:50,labelStepSize:25})})},P={args:{label:"View mode",helperText:"Choose how items are displayed"},render:e=>l.jsx(n,{...e,children:l.jsx(T,{disabled:e.disabled,fill:e.fill,options:[{label:"List",value:"list"},{label:"Grid",value:"grid"},{label:"Table",value:"table"}]})})},H={name:"Intent",args:{label:"Label",helperText:"Helper text styled by intent"},argTypes:{intent:{table:{disable:!0}}},render:e=>l.jsxs(h,{flexDirection:"column",gap:4,style:{width:"100%"},children:[l.jsx(n,{...e,intent:"primary",labelInfo:"(text input)",labelFor:"intent-primary-input",children:l.jsx(o,{id:"intent-primary-input",intent:"primary",disabled:e.disabled,fill:e.fill,placeholder:"Primary input..."})}),l.jsx(n,{...e,intent:"success",labelInfo:"(text area)",labelFor:"intent-success-textarea",children:l.jsx(f,{id:"intent-success-textarea",intent:"success",disabled:e.disabled,fill:e.fill,placeholder:"Success textarea..."})}),l.jsx(n,{...e,intent:"warning",labelInfo:"(numeric input)",children:l.jsx(I,{intent:"warning",disabled:e.disabled,fill:e.fill,placeholder:"Warning numeric..."})}),l.jsx(n,{...e,intent:"danger",labelInfo:"(select)",labelFor:"intent-danger-select",children:l.jsx(d,{id:"intent-danger-select",disabled:e.disabled,fill:e.fill,options:["Option A","Option B","Option C"]})}),l.jsxs(n,{...e,intent:"primary",labelInfo:"(checkbox)",children:[l.jsx(t,{label:"Option one",disabled:e.disabled}),l.jsx(t,{label:"Option two",disabled:e.disabled})]}),l.jsx(n,{...e,intent:"success",labelInfo:"(switch)",children:l.jsx(b,{label:"Enable feature",disabled:e.disabled})}),l.jsx(n,{...e,intent:"warning",labelInfo:"(radio group)",children:l.jsx(w,{disabled:e.disabled,onChange:C,selectedValue:"a",options:[{label:"Option A",value:"a"},{label:"Option B",value:"b"}]})})]})},B={name:"State",args:{label:"Label",helperText:"Helper text for this field"},argTypes:{disabled:{table:{disable:!0}}},render:e=>l.jsxs(h,{flexDirection:"column",gap:4,style:{width:"100%"},children:[l.jsx(n,{...e,labelInfo:"(text input, enabled)",labelFor:"state-enabled-input",children:l.jsx(o,{id:"state-enabled-input",intent:e.intent,fill:e.fill,placeholder:"Enabled input..."})}),l.jsx(n,{...e,disabled:!0,labelInfo:"(text input, disabled)",labelFor:"state-disabled-input",children:l.jsx(o,{id:"state-disabled-input",disabled:!0,intent:e.intent,fill:e.fill,placeholder:"Disabled input..."})}),l.jsx(n,{...e,labelInfo:"(switch, enabled)",children:l.jsx(b,{label:"Notifications"})}),l.jsx(n,{...e,disabled:!0,labelInfo:"(switch, disabled)",children:l.jsx(b,{disabled:!0,label:"Notifications"})}),l.jsx(n,{...e,labelInfo:"(checkbox, enabled)",children:l.jsx(t,{label:"Accept terms"})}),l.jsx(n,{...e,disabled:!0,labelInfo:"(checkbox, disabled)",children:l.jsx(t,{disabled:!0,label:"Accept terms"})}),l.jsx(n,{...e,labelInfo:"(select, enabled)",labelFor:"state-enabled-select",children:l.jsx(d,{id:"state-enabled-select",fill:e.fill,options:["Option A","Option B"]})}),l.jsx(n,{...e,disabled:!0,labelInfo:"(select, disabled)",labelFor:"state-disabled-select",children:l.jsx(d,{id:"state-disabled-select",disabled:!0,fill:e.fill,options:["Option A","Option B"]})})]})},M={name:"Labels & Helper Text",argTypes:{helperText:{table:{disable:!0}},labelInfo:{table:{disable:!0}},subLabel:{table:{disable:!0}}},render:e=>l.jsxs(h,{flexDirection:"column",gap:4,style:{width:"100%"},children:[l.jsx(n,{...e,label:"Text input",labelFor:"labels-basic-input",children:l.jsx(o,{id:"labels-basic-input",intent:e.intent,disabled:e.disabled,fill:e.fill,placeholder:"Basic..."})}),l.jsx(n,{...e,label:"Text area",labelFor:"labels-textarea",helperText:"Helper text appears below the control",children:l.jsx(f,{id:"labels-textarea",intent:e.intent,disabled:e.disabled,fill:e.fill,placeholder:"With helper..."})}),l.jsx(n,{...e,label:"Numeric input",labelInfo:"(required)",children:l.jsx(I,{intent:e.intent,disabled:e.disabled,fill:e.fill,placeholder:"Required field..."})}),l.jsx(n,{...e,label:"Select",labelFor:"labels-select",subLabel:"Additional context below the label",children:l.jsx(d,{id:"labels-select",disabled:e.disabled,fill:e.fill,options:["Option A","Option B","Option C"]})}),l.jsxs(n,{...e,label:"Checkbox group",labelInfo:"(optional)",subLabel:"Select your preferences",helperText:"You may choose more than one",children:[l.jsx(t,{label:"Option one",disabled:e.disabled}),l.jsx(t,{label:"Option two",disabled:e.disabled}),l.jsx(t,{label:"Option three",disabled:e.disabled})]}),l.jsx(n,{...e,label:"Switch",subLabel:"Toggle this setting on or off",helperText:"Changes take effect immediately",children:l.jsx(b,{label:"Dark mode",disabled:e.disabled})}),l.jsx(n,{...e,label:"Radio group",labelInfo:"(required)",helperText:"Choose exactly one option",children:l.jsx(w,{disabled:e.disabled,onChange:C,selectedValue:"a",options:[{label:"Option A",value:"a"},{label:"Option B",value:"b"}]})})]})},U={name:"Inline",argTypes:{inline:{table:{disable:!0}}},render:e=>l.jsxs(h,{flexDirection:"column",gap:4,style:{width:"100%"},children:[l.jsx(n,{...e,inline:!0,labelInfo:"(text input)",labelFor:"inline-name-input",children:l.jsx(o,{id:"inline-name-input",intent:e.intent,disabled:e.disabled,fill:e.fill,placeholder:"Enter name..."})}),l.jsx(n,{...e,inline:!0,labelInfo:"(text area)",labelFor:"inline-textarea",children:l.jsx(f,{id:"inline-textarea",intent:e.intent,disabled:e.disabled,fill:e.fill,placeholder:"Enter description..."})}),l.jsx(n,{...e,inline:!0,labelInfo:"(numeric input)",children:l.jsx(I,{intent:e.intent,disabled:e.disabled,fill:e.fill,placeholder:"0"})}),l.jsx(n,{...e,inline:!0,labelInfo:"(select)",labelFor:"inline-select",children:l.jsx(d,{id:"inline-select",disabled:e.disabled,fill:e.fill,options:["United States","Canada","United Kingdom"]})}),l.jsx(n,{...e,inline:!0,labelInfo:"(switch)",children:l.jsx(b,{label:"Toggle",disabled:e.disabled})}),l.jsx(n,{...e,inline:!0,labelInfo:"(checkbox)",children:l.jsx(t,{label:"I accept the terms",disabled:e.disabled})})]})},_={name:"Fill",argTypes:{fill:{table:{disable:!0}}},decorators:[e=>l.jsx("div",{style:{width:"400px"},children:l.jsx(e,{})})],render:e=>l.jsxs(h,{flexDirection:"column",gap:4,alignItems:"start",children:[l.jsx(n,{...e,fill:!0,labelInfo:"(text input, fill)",labelFor:"fill-full-input",children:l.jsx(o,{id:"fill-full-input",fill:!0,intent:e.intent,disabled:e.disabled,placeholder:"Full width input..."})}),l.jsx(n,{...e,fill:!1,labelInfo:"(text input, auto)",labelFor:"fill-auto-input",children:l.jsx(o,{id:"fill-auto-input",intent:e.intent,disabled:e.disabled,placeholder:"Auto width input..."})}),l.jsx(n,{...e,fill:!0,labelInfo:"(text area, fill)",labelFor:"fill-textarea",children:l.jsx(f,{id:"fill-textarea",fill:!0,intent:e.intent,disabled:e.disabled,placeholder:"Full width textarea..."})}),l.jsx(n,{...e,fill:!0,labelInfo:"(select, fill)",labelFor:"fill-select",children:l.jsx(d,{id:"fill-select",fill:!0,disabled:e.disabled,options:["Option A","Option B","Option C"]})}),l.jsx(n,{...e,fill:!1,labelInfo:"(select, auto)",labelFor:"fill-select-auto",children:l.jsx(d,{id:"fill-select-auto",disabled:e.disabled,options:["Option A","Option B","Option C"]})}),l.jsx(n,{...e,fill:!0,labelInfo:"(switch, fill)",children:l.jsx(b,{label:"Enable feature",disabled:e.disabled})}),l.jsx(n,{...e,fill:!0,labelInfo:"(segmented control, fill)",children:l.jsx(T,{fill:!0,disabled:e.disabled,options:[{label:"List",value:"list"},{label:"Grid",value:"grid"},{label:"Table",value:"table"}]})})]})},V={args:{label:"Label",helperText:"Helper text for this field"},argTypes:{disabled:{table:{disable:!0}}},render:e=>l.jsxs(h,{flexDirection:"column",gap:4,children:[l.jsx(n,{...e,labelInfo:"(text input, enabled)",labelFor:"allstates-input",children:l.jsx(o,{id:"allstates-input",intent:e.intent,fill:e.fill,placeholder:"Enter value..."})}),l.jsx(n,{...e,disabled:!0,labelInfo:"(text input, disabled)",labelFor:"allstates-input-dis",children:l.jsx(o,{id:"allstates-input-dis",disabled:!0,intent:e.intent,fill:e.fill,placeholder:"Enter value..."})}),l.jsx(n,{...e,labelInfo:"(text area, enabled)",labelFor:"allstates-textarea",children:l.jsx(f,{id:"allstates-textarea",intent:e.intent,fill:e.fill,placeholder:"Enter text..."})}),l.jsx(n,{...e,disabled:!0,labelInfo:"(text area, disabled)",labelFor:"allstates-textarea-dis",children:l.jsx(f,{id:"allstates-textarea-dis",disabled:!0,intent:e.intent,fill:e.fill,placeholder:"Enter text..."})}),l.jsx(n,{...e,labelInfo:"(numeric input, enabled)",children:l.jsx(I,{intent:e.intent,fill:e.fill,placeholder:"0"})}),l.jsx(n,{...e,disabled:!0,labelInfo:"(numeric input, disabled)",children:l.jsx(I,{disabled:!0,intent:e.intent,fill:e.fill,placeholder:"0"})}),l.jsx(n,{...e,labelInfo:"(select, enabled)",labelFor:"allstates-select",children:l.jsx(d,{id:"allstates-select",fill:e.fill,options:["Option A","Option B"]})}),l.jsx(n,{...e,disabled:!0,labelInfo:"(select, disabled)",labelFor:"allstates-select-dis",children:l.jsx(d,{id:"allstates-select-dis",disabled:!0,fill:e.fill,options:["Option A","Option B"]})}),l.jsx(n,{...e,labelInfo:"(file input, enabled)",labelFor:"allstates-file",children:l.jsx(X,{inputProps:{id:"allstates-file"},fill:e.fill,text:"Choose file..."})}),l.jsx(n,{...e,disabled:!0,labelInfo:"(file input, disabled)",labelFor:"allstates-file-dis",children:l.jsx(X,{inputProps:{id:"allstates-file-dis"},disabled:!0,fill:e.fill,text:"Choose file..."})}),l.jsx(n,{...e,labelInfo:"(switch, enabled)",children:l.jsx(b,{label:"Toggle"})}),l.jsx(n,{...e,disabled:!0,labelInfo:"(switch, disabled)",children:l.jsx(b,{disabled:!0,label:"Toggle"})}),l.jsx(n,{...e,labelInfo:"(checkbox, enabled)",children:l.jsx(t,{label:"Accept terms"})}),l.jsx(n,{...e,disabled:!0,labelInfo:"(checkbox, disabled)",children:l.jsx(t,{disabled:!0,label:"Accept terms"})}),l.jsx(n,{...e,labelInfo:"(radio group, enabled)",children:l.jsx(w,{onChange:C,selectedValue:"a",options:[{label:"Option A",value:"a"},{label:"Option B",value:"b"}]})}),l.jsx(n,{...e,disabled:!0,labelInfo:"(radio group, disabled)",children:l.jsx(w,{disabled:!0,onChange:C,selectedValue:"a",options:[{label:"Option A",value:"a"},{label:"Option B",value:"b"}]})}),l.jsx(n,{...e,labelInfo:"(slider, enabled)",children:l.jsx(J,{intent:e.intent,min:0,max:10,value:5})}),l.jsx(n,{...e,disabled:!0,labelInfo:"(slider, disabled)",children:l.jsx(J,{disabled:!0,intent:e.intent,min:0,max:10,value:5})}),l.jsx(n,{...e,labelInfo:"(segmented control, enabled)",children:l.jsx(T,{fill:e.fill,options:[{label:"A",value:"a"},{label:"B",value:"b"}]})}),l.jsx(n,{...e,disabled:!0,labelInfo:"(segmented control, disabled)",children:l.jsx(T,{disabled:!0,fill:e.fill,options:[{label:"A",value:"a"},{label:"B",value:"b"}]})})]})},W={render:e=>l.jsxs(h,{flexDirection:"column",gap:4,children:[l.jsx(n,{...e,disabled:!0,labelInfo:"(text input)",labelFor:"disabled-text",children:l.jsx(o,{id:"disabled-text",disabled:!0,intent:e.intent,placeholder:"Disabled input..."})}),l.jsx(n,{...e,disabled:!0,labelInfo:"(text area)",labelFor:"disabled-textarea",children:l.jsx(f,{id:"disabled-textarea",disabled:!0,intent:e.intent,placeholder:"Disabled textarea...",fill:!0})}),l.jsx(n,{...e,disabled:!0,labelInfo:"(numeric input)",children:l.jsx(I,{disabled:!0,intent:e.intent,placeholder:"Disabled..."})}),l.jsx(n,{...e,disabled:!0,labelInfo:"(select)",labelFor:"disabled-select",children:l.jsx(d,{id:"disabled-select",disabled:!0,options:["Option A","Option B"]})}),l.jsx(n,{...e,disabled:!0,labelInfo:"(file input)",labelFor:"disabled-file",children:l.jsx(X,{inputProps:{id:"disabled-file"},disabled:!0,text:"Choose file..."})}),l.jsx(n,{...e,disabled:!0,labelInfo:"(switch)",children:l.jsx(b,{disabled:!0,label:"Disabled switch"})}),l.jsx(n,{...e,disabled:!0,labelInfo:"(checkbox)",children:l.jsx(t,{disabled:!0,label:"Disabled checkbox"})}),l.jsx(n,{...e,disabled:!0,labelInfo:"(radio)",children:l.jsx(Ie,{disabled:!0,label:"Disabled radio"})}),l.jsx(n,{...e,disabled:!0,labelInfo:"(slider)",children:l.jsx(J,{disabled:!0,intent:e.intent,value:30})}),l.jsx(n,{...e,disabled:!0,labelInfo:"(segmented control)",children:l.jsx(T,{disabled:!0,options:[{label:"A",value:"a"},{label:"B",value:"b"}]})})]})},q={render:e=>l.jsxs(h,{flexDirection:"column",gap:4,style:{width:"100%"},children:[l.jsx(n,{...e,inline:!0,labelInfo:"(text input)",labelFor:"inline-name",children:l.jsx(o,{id:"inline-name",intent:e.intent,disabled:e.disabled,fill:e.fill,placeholder:"Enter name..."})}),l.jsx(n,{...e,inline:!0,labelInfo:"(numeric input)",children:l.jsx(I,{intent:e.intent,disabled:e.disabled,fill:e.fill,placeholder:"0"})}),l.jsx(n,{...e,inline:!0,labelInfo:"(select)",labelFor:"inline-country",children:l.jsx(d,{id:"inline-country",disabled:e.disabled,fill:e.fill,options:["United States","Canada","United Kingdom"]})}),l.jsx(n,{...e,inline:!0,labelInfo:"(switch)",children:l.jsx(b,{disabled:e.disabled})}),l.jsx(n,{...e,inline:!0,labelInfo:"(checkbox)",children:l.jsx(t,{label:"I accept the terms",disabled:e.disabled})})]})},z={decorators:[e=>l.jsx("div",{style:{width:"100%",minWidth:"500px"},children:l.jsx(e,{})})],render:e=>l.jsxs(h,{flexDirection:"column",gap:4,children:[l.jsx(n,{...e,label:"Full name",labelFor:"mixed-name",labelInfo:"(required)",children:l.jsx(o,{id:"mixed-name",intent:e.intent,disabled:e.disabled,fill:e.fill,placeholder:"Jane Doe"})}),l.jsx(n,{...e,label:"Email",labelFor:"mixed-email",labelInfo:"(required)",children:l.jsx(o,{id:"mixed-email",intent:e.intent,disabled:e.disabled,fill:e.fill,placeholder:"jane@example.com",type:"email"})}),l.jsx(n,{...e,label:"Bio",labelFor:"mixed-bio",helperText:"Brief description of yourself",children:l.jsx(f,{id:"mixed-bio",intent:e.intent,disabled:e.disabled,fill:e.fill,placeholder:"Tell us about yourself..."})}),l.jsx(n,{...e,label:"Age",children:l.jsx(I,{intent:e.intent,disabled:e.disabled,fill:e.fill,min:0,max:150,placeholder:"Enter age..."})}),l.jsx(n,{...e,label:"Country",labelFor:"mixed-country",children:l.jsx(d,{id:"mixed-country",disabled:e.disabled,fill:e.fill,options:["","United States","Canada","United Kingdom","Germany"]})}),l.jsx(n,{...e,label:"Resume",labelFor:"mixed-resume",helperText:"PDF format preferred",children:l.jsx(X,{inputProps:{id:"mixed-resume"},disabled:e.disabled,fill:e.fill,text:"Choose file..."})}),l.jsx(n,{...e,label:"Role",children:l.jsx(w,{disabled:e.disabled,onChange:C,selectedValue:"engineer",options:[{label:"Engineer",value:"engineer"},{label:"Designer",value:"designer"},{label:"Manager",value:"manager"}]})}),l.jsxs(n,{...e,label:"Skills",helperText:"Select all that apply",children:[l.jsx(t,{label:"JavaScript",disabled:e.disabled}),l.jsx(t,{label:"TypeScript",disabled:e.disabled}),l.jsx(t,{label:"React",disabled:e.disabled}),l.jsx(t,{label:"Node.js",disabled:e.disabled})]}),l.jsx(n,{...e,label:"Experience level",children:l.jsx(J,{intent:e.intent,disabled:e.disabled,min:0,max:10,stepSize:1,value:3,labelStepSize:5})}),l.jsx(n,{...e,label:"Employment type",children:l.jsx(T,{disabled:e.disabled,fill:e.fill,options:[{label:"Full-time",value:"full"},{label:"Part-time",value:"part"},{label:"Contract",value:"contract"}]})}),l.jsxs(n,{...e,label:"Preferences",children:[l.jsx(b,{label:"Subscribe to newsletter",disabled:e.disabled}),l.jsx(b,{label:"Allow data collection",disabled:e.disabled})]})]})},K={render:e=>l.jsx(n,{disabled:e.disabled,fill:e.fill,helperText:e.helperText,inline:e.inline,intent:e.intent,label:e.label,labelFor:"playground-input",labelInfo:e.labelInfo,subLabel:e.subLabel,children:l.jsx(o,{id:"playground-input",intent:e.intent,disabled:e.disabled,fill:e.fill,placeholder:"Enter value..."})}),args:{label:"Full Name",helperText:"Enter your full legal name",labelInfo:"(required)",intent:"none"}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: args => <FormGroup {...args} labelFor="default-input">
            <InputGroup id="default-input" intent={args.intent} disabled={args.disabled} fill={args.fill} placeholder="Enter value..." />
        </FormGroup>
}`,...v.parameters?.docs?.source},description:{story:"A basic form group with a text input.",...v.parameters?.docs?.description}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Description",
    helperText: "Provide a detailed description"
  },
  render: args => <FormGroup {...args} labelFor="textarea-input">
            <TextArea id="textarea-input" intent={args.intent} disabled={args.disabled} fill={args.fill} placeholder="Enter description..." />
        </FormGroup>
}`,...E.parameters?.docs?.source},description:{story:"FormGroup works with TextArea for multi-line text input.",...E.parameters?.docs?.description}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Quantity",
    helperText: "Enter a number between 1 and 100"
  },
  render: args => <FormGroup {...args} labelFor="numeric-input">
            <NumericInput id="numeric-input" intent={args.intent} disabled={args.disabled} fill={args.fill} min={1} max={100} placeholder="Enter quantity..." />
        </FormGroup>
}`,...A.parameters?.docs?.source},description:{story:"FormGroup works with NumericInput for numeric values.",...A.parameters?.docs?.description}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Country",
    helperText: "Select your country of residence"
  },
  render: args => <FormGroup {...args} labelFor="select-input">
            <HTMLSelect id="select-input" disabled={args.disabled} fill={args.fill} options={["United States", "Canada", "United Kingdom", "Germany", "France", "Japan"]} />
        </FormGroup>
}`,...O.parameters?.docs?.source},description:{story:"FormGroup works with HTMLSelect for dropdown selections.",...O.parameters?.docs?.description}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Attachment",
    helperText: "Upload a PDF or image file"
  },
  render: args => <FormGroup {...args} labelFor="file-input">
            <FileInput inputProps={{
      id: "file-input"
    }} disabled={args.disabled} fill={args.fill} text="Choose file..." />
        </FormGroup>
}`,...k.parameters?.docs?.source},description:{story:"FormGroup works with FileInput for file uploads.",...k.parameters?.docs?.description}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Notifications",
    helperText: "Enable or disable email notifications"
  },
  render: args => <FormGroup {...args}>
            <Switch label="Email notifications" disabled={args.disabled} />
        </FormGroup>
}`,...L.parameters?.docs?.source},description:{story:"FormGroup works with Switch for toggling a boolean setting.",...L.parameters?.docs?.description}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Interests",
    helperText: "Select all that apply"
  },
  render: args => <FormGroup {...args}>
            <Checkbox label="Engineering" disabled={args.disabled} />
            <Checkbox label="Design" disabled={args.disabled} />
            <Checkbox label="Marketing" disabled={args.disabled} />
            <Checkbox label="Sales" disabled={args.disabled} />
        </FormGroup>
}`,...R.parameters?.docs?.source},description:{story:"FormGroup works with Checkbox for single or multiple boolean selections.",...R.parameters?.docs?.description}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Priority",
    helperText: "Select the task priority"
  },
  render: args => <FormGroup {...args}>
            <RadioGroup disabled={args.disabled} onChange={NOOP} selectedValue="medium" options={[{
      label: "Low",
      value: "low"
    }, {
      label: "Medium",
      value: "medium"
    }, {
      label: "High",
      value: "high"
    }, {
      label: "Critical",
      value: "critical"
    }]} />
        </FormGroup>
}`,...D.parameters?.docs?.source},description:{story:"FormGroup works with RadioGroup for mutually exclusive selections.",...D.parameters?.docs?.description}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Volume",
    helperText: "Adjust the output volume"
  },
  render: args => <FormGroup {...args}>
            <Slider intent={args.intent} disabled={args.disabled} min={0} max={100} stepSize={1} value={50} labelStepSize={25} />
        </FormGroup>
}`,...N.parameters?.docs?.source},description:{story:"FormGroup works with Slider for selecting a value in a range.",...N.parameters?.docs?.description}}};P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    label: "View mode",
    helperText: "Choose how items are displayed"
  },
  render: args => <FormGroup {...args}>
            <SegmentedControl disabled={args.disabled} fill={args.fill} options={[{
      label: "List",
      value: "list"
    }, {
      label: "Grid",
      value: "grid"
    }, {
      label: "Table",
      value: "table"
    }]} />
        </FormGroup>
}`,...P.parameters?.docs?.source},description:{story:"FormGroup works with SegmentedControl for selecting one of a few options.",...P.parameters?.docs?.description}}};H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  name: "Intent",
  args: {
    label: "Label",
    helperText: "Helper text styled by intent"
  },
  argTypes: {
    intent: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="column" gap={4} style={{
    width: "100%"
  }}>
            <FormGroup {...args} intent="primary" labelInfo="(text input)" labelFor="intent-primary-input">
                <InputGroup id="intent-primary-input" intent="primary" disabled={args.disabled} fill={args.fill} placeholder="Primary input..." />
            </FormGroup>
            <FormGroup {...args} intent="success" labelInfo="(text area)" labelFor="intent-success-textarea">
                <TextArea id="intent-success-textarea" intent="success" disabled={args.disabled} fill={args.fill} placeholder="Success textarea..." />
            </FormGroup>
            <FormGroup {...args} intent="warning" labelInfo="(numeric input)">
                <NumericInput intent="warning" disabled={args.disabled} fill={args.fill} placeholder="Warning numeric..." />
            </FormGroup>
            <FormGroup {...args} intent="danger" labelInfo="(select)" labelFor="intent-danger-select">
                <HTMLSelect id="intent-danger-select" disabled={args.disabled} fill={args.fill} options={["Option A", "Option B", "Option C"]} />
            </FormGroup>
            <FormGroup {...args} intent="primary" labelInfo="(checkbox)">
                <Checkbox label="Option one" disabled={args.disabled} />
                <Checkbox label="Option two" disabled={args.disabled} />
            </FormGroup>
            <FormGroup {...args} intent="success" labelInfo="(switch)">
                <Switch label="Enable feature" disabled={args.disabled} />
            </FormGroup>
            <FormGroup {...args} intent="warning" labelInfo="(radio group)">
                <RadioGroup disabled={args.disabled} onChange={NOOP} selectedValue="a" options={[{
        label: "Option A",
        value: "a"
      }, {
        label: "Option B",
        value: "b"
      }]} />
            </FormGroup>
        </Flex>
}`,...H.parameters?.docs?.source},description:{story:"Use the `intent` prop to apply a semantic color to the helper text and sub label.\nShown here with various form controls.",...H.parameters?.docs?.description}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  name: "State",
  args: {
    label: "Label",
    helperText: "Helper text for this field"
  },
  argTypes: {
    disabled: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="column" gap={4} style={{
    width: "100%"
  }}>
            <FormGroup {...args} labelInfo="(text input, enabled)" labelFor="state-enabled-input">
                <InputGroup id="state-enabled-input" intent={args.intent} fill={args.fill} placeholder="Enabled input..." />
            </FormGroup>
            <FormGroup {...args} disabled={true} labelInfo="(text input, disabled)" labelFor="state-disabled-input">
                <InputGroup id="state-disabled-input" disabled={true} intent={args.intent} fill={args.fill} placeholder="Disabled input..." />
            </FormGroup>
            <FormGroup {...args} labelInfo="(switch, enabled)">
                <Switch label="Notifications" />
            </FormGroup>
            <FormGroup {...args} disabled={true} labelInfo="(switch, disabled)">
                <Switch disabled={true} label="Notifications" />
            </FormGroup>
            <FormGroup {...args} labelInfo="(checkbox, enabled)">
                <Checkbox label="Accept terms" />
            </FormGroup>
            <FormGroup {...args} disabled={true} labelInfo="(checkbox, disabled)">
                <Checkbox disabled={true} label="Accept terms" />
            </FormGroup>
            <FormGroup {...args} labelInfo="(select, enabled)" labelFor="state-enabled-select">
                <HTMLSelect id="state-enabled-select" fill={args.fill} options={["Option A", "Option B"]} />
            </FormGroup>
            <FormGroup {...args} disabled={true} labelInfo="(select, disabled)" labelFor="state-disabled-select">
                <HTMLSelect id="state-disabled-select" disabled={true} fill={args.fill} options={["Option A", "Option B"]} />
            </FormGroup>
        </Flex>
}`,...B.parameters?.docs?.source},description:{story:"FormGroup supports `disabled` state which visually dims the label and helper text.\nShown here with various form controls in enabled and disabled states.",...B.parameters?.docs?.description}}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  name: "Labels & Helper Text",
  argTypes: {
    helperText: {
      table: {
        disable: true
      }
    },
    labelInfo: {
      table: {
        disable: true
      }
    },
    subLabel: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="column" gap={4} style={{
    width: "100%"
  }}>
            <FormGroup {...args} label="Text input" labelFor="labels-basic-input">
                <InputGroup id="labels-basic-input" intent={args.intent} disabled={args.disabled} fill={args.fill} placeholder="Basic..." />
            </FormGroup>
            <FormGroup {...args} label="Text area" labelFor="labels-textarea" helperText="Helper text appears below the control">
                <TextArea id="labels-textarea" intent={args.intent} disabled={args.disabled} fill={args.fill} placeholder="With helper..." />
            </FormGroup>
            <FormGroup {...args} label="Numeric input" labelInfo="(required)">
                <NumericInput intent={args.intent} disabled={args.disabled} fill={args.fill} placeholder="Required field..." />
            </FormGroup>
            <FormGroup {...args} label="Select" labelFor="labels-select" subLabel="Additional context below the label">
                <HTMLSelect id="labels-select" disabled={args.disabled} fill={args.fill} options={["Option A", "Option B", "Option C"]} />
            </FormGroup>
            <FormGroup {...args} label="Checkbox group" labelInfo="(optional)" subLabel="Select your preferences" helperText="You may choose more than one">
                <Checkbox label="Option one" disabled={args.disabled} />
                <Checkbox label="Option two" disabled={args.disabled} />
                <Checkbox label="Option three" disabled={args.disabled} />
            </FormGroup>
            <FormGroup {...args} label="Switch" subLabel="Toggle this setting on or off" helperText="Changes take effect immediately">
                <Switch label="Dark mode" disabled={args.disabled} />
            </FormGroup>
            <FormGroup {...args} label="Radio group" labelInfo="(required)" helperText="Choose exactly one option">
                <RadioGroup disabled={args.disabled} onChange={NOOP} selectedValue="a" options={[{
        label: "Option A",
        value: "a"
      }, {
        label: "Option B",
        value: "b"
      }]} />
            </FormGroup>
        </Flex>
}`,...M.parameters?.docs?.source},description:{story:"Use `helperText`, `labelInfo`, and `subLabel` to add additional context to the form group.\nShown here with various form controls.",...M.parameters?.docs?.description}}};U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  name: "Inline",
  argTypes: {
    inline: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="column" gap={4} style={{
    width: "100%"
  }}>
            <FormGroup {...args} inline={true} labelInfo="(text input)" labelFor="inline-name-input">
                <InputGroup id="inline-name-input" intent={args.intent} disabled={args.disabled} fill={args.fill} placeholder="Enter name..." />
            </FormGroup>
            <FormGroup {...args} inline={true} labelInfo="(text area)" labelFor="inline-textarea">
                <TextArea id="inline-textarea" intent={args.intent} disabled={args.disabled} fill={args.fill} placeholder="Enter description..." />
            </FormGroup>
            <FormGroup {...args} inline={true} labelInfo="(numeric input)">
                <NumericInput intent={args.intent} disabled={args.disabled} fill={args.fill} placeholder="0" />
            </FormGroup>
            <FormGroup {...args} inline={true} labelInfo="(select)" labelFor="inline-select">
                <HTMLSelect id="inline-select" disabled={args.disabled} fill={args.fill} options={["United States", "Canada", "United Kingdom"]} />
            </FormGroup>
            <FormGroup {...args} inline={true} labelInfo="(switch)">
                <Switch label="Toggle" disabled={args.disabled} />
            </FormGroup>
            <FormGroup {...args} inline={true} labelInfo="(checkbox)">
                <Checkbox label="I accept the terms" disabled={args.disabled} />
            </FormGroup>
        </Flex>
}`,...U.parameters?.docs?.source},description:{story:"Use the `inline` prop to render the label and input on a single line.\nShown here with various form controls.",...U.parameters?.docs?.description}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  name: "Fill",
  argTypes: {
    fill: {
      table: {
        disable: true
      }
    }
  },
  decorators: [Story => <div style={{
    width: "400px"
  }}>
                <Story />
            </div>],
  render: args => <Flex flexDirection="column" gap={4} alignItems="start">
            <FormGroup {...args} fill={true} labelInfo="(text input, fill)" labelFor="fill-full-input">
                <InputGroup id="fill-full-input" fill={true} intent={args.intent} disabled={args.disabled} placeholder="Full width input..." />
            </FormGroup>
            <FormGroup {...args} fill={false} labelInfo="(text input, auto)" labelFor="fill-auto-input">
                <InputGroup id="fill-auto-input" intent={args.intent} disabled={args.disabled} placeholder="Auto width input..." />
            </FormGroup>
            <FormGroup {...args} fill={true} labelInfo="(text area, fill)" labelFor="fill-textarea">
                <TextArea id="fill-textarea" fill={true} intent={args.intent} disabled={args.disabled} placeholder="Full width textarea..." />
            </FormGroup>
            <FormGroup {...args} fill={true} labelInfo="(select, fill)" labelFor="fill-select">
                <HTMLSelect id="fill-select" fill={true} disabled={args.disabled} options={["Option A", "Option B", "Option C"]} />
            </FormGroup>
            <FormGroup {...args} fill={false} labelInfo="(select, auto)" labelFor="fill-select-auto">
                <HTMLSelect id="fill-select-auto" disabled={args.disabled} options={["Option A", "Option B", "Option C"]} />
            </FormGroup>
            <FormGroup {...args} fill={true} labelInfo="(switch, fill)">
                <Switch label="Enable feature" disabled={args.disabled} />
            </FormGroup>
            <FormGroup {...args} fill={true} labelInfo="(segmented control, fill)">
                <SegmentedControl fill={true} disabled={args.disabled} options={[{
        label: "List",
        value: "list"
      }, {
        label: "Grid",
        value: "grid"
      }, {
        label: "Table",
        value: "table"
      }]} />
            </FormGroup>
        </Flex>
}`,..._.parameters?.docs?.source},description:{story:"Use the `fill` prop to make the form group expand to the full width of its container.\nShown here with various form controls.",..._.parameters?.docs?.description}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Label",
    helperText: "Helper text for this field"
  },
  argTypes: {
    disabled: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="column" gap={4}>
            <FormGroup {...args} labelInfo="(text input, enabled)" labelFor="allstates-input">
                <InputGroup id="allstates-input" intent={args.intent} fill={args.fill} placeholder="Enter value..." />
            </FormGroup>
            <FormGroup {...args} disabled={true} labelInfo="(text input, disabled)" labelFor="allstates-input-dis">
                <InputGroup id="allstates-input-dis" disabled={true} intent={args.intent} fill={args.fill} placeholder="Enter value..." />
            </FormGroup>
            <FormGroup {...args} labelInfo="(text area, enabled)" labelFor="allstates-textarea">
                <TextArea id="allstates-textarea" intent={args.intent} fill={args.fill} placeholder="Enter text..." />
            </FormGroup>
            <FormGroup {...args} disabled={true} labelInfo="(text area, disabled)" labelFor="allstates-textarea-dis">
                <TextArea id="allstates-textarea-dis" disabled={true} intent={args.intent} fill={args.fill} placeholder="Enter text..." />
            </FormGroup>
            <FormGroup {...args} labelInfo="(numeric input, enabled)">
                <NumericInput intent={args.intent} fill={args.fill} placeholder="0" />
            </FormGroup>
            <FormGroup {...args} disabled={true} labelInfo="(numeric input, disabled)">
                <NumericInput disabled={true} intent={args.intent} fill={args.fill} placeholder="0" />
            </FormGroup>
            <FormGroup {...args} labelInfo="(select, enabled)" labelFor="allstates-select">
                <HTMLSelect id="allstates-select" fill={args.fill} options={["Option A", "Option B"]} />
            </FormGroup>
            <FormGroup {...args} disabled={true} labelInfo="(select, disabled)" labelFor="allstates-select-dis">
                <HTMLSelect id="allstates-select-dis" disabled={true} fill={args.fill} options={["Option A", "Option B"]} />
            </FormGroup>
            <FormGroup {...args} labelInfo="(file input, enabled)" labelFor="allstates-file">
                <FileInput inputProps={{
        id: "allstates-file"
      }} fill={args.fill} text="Choose file..." />
            </FormGroup>
            <FormGroup {...args} disabled={true} labelInfo="(file input, disabled)" labelFor="allstates-file-dis">
                <FileInput inputProps={{
        id: "allstates-file-dis"
      }} disabled={true} fill={args.fill} text="Choose file..." />
            </FormGroup>
            <FormGroup {...args} labelInfo="(switch, enabled)">
                <Switch label="Toggle" />
            </FormGroup>
            <FormGroup {...args} disabled={true} labelInfo="(switch, disabled)">
                <Switch disabled={true} label="Toggle" />
            </FormGroup>
            <FormGroup {...args} labelInfo="(checkbox, enabled)">
                <Checkbox label="Accept terms" />
            </FormGroup>
            <FormGroup {...args} disabled={true} labelInfo="(checkbox, disabled)">
                <Checkbox disabled={true} label="Accept terms" />
            </FormGroup>
            <FormGroup {...args} labelInfo="(radio group, enabled)">
                <RadioGroup onChange={NOOP} selectedValue="a" options={[{
        label: "Option A",
        value: "a"
      }, {
        label: "Option B",
        value: "b"
      }]} />
            </FormGroup>
            <FormGroup {...args} disabled={true} labelInfo="(radio group, disabled)">
                <RadioGroup disabled={true} onChange={NOOP} selectedValue="a" options={[{
        label: "Option A",
        value: "a"
      }, {
        label: "Option B",
        value: "b"
      }]} />
            </FormGroup>
            <FormGroup {...args} labelInfo="(slider, enabled)">
                <Slider intent={args.intent} min={0} max={10} value={5} />
            </FormGroup>
            <FormGroup {...args} disabled={true} labelInfo="(slider, disabled)">
                <Slider disabled={true} intent={args.intent} min={0} max={10} value={5} />
            </FormGroup>
            <FormGroup {...args} labelInfo="(segmented control, enabled)">
                <SegmentedControl fill={args.fill} options={[{
        label: "A",
        value: "a"
      }, {
        label: "B",
        value: "b"
      }]} />
            </FormGroup>
            <FormGroup {...args} disabled={true} labelInfo="(segmented control, disabled)">
                <SegmentedControl disabled={true} fill={args.fill} options={[{
        label: "A",
        value: "a"
      }, {
        label: "B",
        value: "b"
      }]} />
            </FormGroup>
        </Flex>
}`,...V.parameters?.docs?.source},description:{story:"All form controls in their enabled and disabled states within FormGroups.",...V.parameters?.docs?.description}}};W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  render: args => <Flex flexDirection="column" gap={4}>
            <FormGroup {...args} disabled={true} labelInfo="(text input)" labelFor="disabled-text">
                <InputGroup id="disabled-text" disabled={true} intent={args.intent} placeholder="Disabled input..." />
            </FormGroup>
            <FormGroup {...args} disabled={true} labelInfo="(text area)" labelFor="disabled-textarea">
                <TextArea id="disabled-textarea" disabled={true} intent={args.intent} placeholder="Disabled textarea..." fill={true} />
            </FormGroup>
            <FormGroup {...args} disabled={true} labelInfo="(numeric input)">
                <NumericInput disabled={true} intent={args.intent} placeholder="Disabled..." />
            </FormGroup>
            <FormGroup {...args} disabled={true} labelInfo="(select)" labelFor="disabled-select">
                <HTMLSelect id="disabled-select" disabled={true} options={["Option A", "Option B"]} />
            </FormGroup>
            <FormGroup {...args} disabled={true} labelInfo="(file input)" labelFor="disabled-file">
                <FileInput inputProps={{
        id: "disabled-file"
      }} disabled={true} text="Choose file..." />
            </FormGroup>
            <FormGroup {...args} disabled={true} labelInfo="(switch)">
                <Switch disabled={true} label="Disabled switch" />
            </FormGroup>
            <FormGroup {...args} disabled={true} labelInfo="(checkbox)">
                <Checkbox disabled={true} label="Disabled checkbox" />
            </FormGroup>
            <FormGroup {...args} disabled={true} labelInfo="(radio)">
                <Radio disabled={true} label="Disabled radio" />
            </FormGroup>
            <FormGroup {...args} disabled={true} labelInfo="(slider)">
                <Slider disabled={true} intent={args.intent} value={30} />
            </FormGroup>
            <FormGroup {...args} disabled={true} labelInfo="(segmented control)">
                <SegmentedControl disabled={true} options={[{
        label: "A",
        value: "a"
      }, {
        label: "B",
        value: "b"
      }]} />
            </FormGroup>
        </Flex>
}`,...W.parameters?.docs?.source},description:{story:"All form controls in their disabled state within FormGroups.",...W.parameters?.docs?.description}}};q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  render: args => <Flex flexDirection="column" gap={4} style={{
    width: "100%"
  }}>
            <FormGroup {...args} inline={true} labelInfo="(text input)" labelFor="inline-name">
                <InputGroup id="inline-name" intent={args.intent} disabled={args.disabled} fill={args.fill} placeholder="Enter name..." />
            </FormGroup>
            <FormGroup {...args} inline={true} labelInfo="(numeric input)">
                <NumericInput intent={args.intent} disabled={args.disabled} fill={args.fill} placeholder="0" />
            </FormGroup>
            <FormGroup {...args} inline={true} labelInfo="(select)" labelFor="inline-country">
                <HTMLSelect id="inline-country" disabled={args.disabled} fill={args.fill} options={["United States", "Canada", "United Kingdom"]} />
            </FormGroup>
            <FormGroup {...args} inline={true} labelInfo="(switch)">
                <Switch disabled={args.disabled} />
            </FormGroup>
            <FormGroup {...args} inline={true} labelInfo="(checkbox)">
                <Checkbox label="I accept the terms" disabled={args.disabled} />
            </FormGroup>
        </Flex>
}`,...q.parameters?.docs?.source},description:{story:"All form controls rendered inline within FormGroups.",...q.parameters?.docs?.description}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  decorators: [Story => <div style={{
    width: "100%",
    minWidth: "500px"
  }}>
                <Story />
            </div>],
  render: args => <Flex flexDirection="column" gap={4}>
            <FormGroup {...args} label="Full name" labelFor="mixed-name" labelInfo="(required)">
                <InputGroup id="mixed-name" intent={args.intent} disabled={args.disabled} fill={args.fill} placeholder="Jane Doe" />
            </FormGroup>
            <FormGroup {...args} label="Email" labelFor="mixed-email" labelInfo="(required)">
                <InputGroup id="mixed-email" intent={args.intent} disabled={args.disabled} fill={args.fill} placeholder="jane@example.com" type="email" />
            </FormGroup>
            <FormGroup {...args} label="Bio" labelFor="mixed-bio" helperText="Brief description of yourself">
                <TextArea id="mixed-bio" intent={args.intent} disabled={args.disabled} fill={args.fill} placeholder="Tell us about yourself..." />
            </FormGroup>
            <FormGroup {...args} label="Age">
                <NumericInput intent={args.intent} disabled={args.disabled} fill={args.fill} min={0} max={150} placeholder="Enter age..." />
            </FormGroup>
            <FormGroup {...args} label="Country" labelFor="mixed-country">
                <HTMLSelect id="mixed-country" disabled={args.disabled} fill={args.fill} options={["", "United States", "Canada", "United Kingdom", "Germany"]} />
            </FormGroup>
            <FormGroup {...args} label="Resume" labelFor="mixed-resume" helperText="PDF format preferred">
                <FileInput inputProps={{
        id: "mixed-resume"
      }} disabled={args.disabled} fill={args.fill} text="Choose file..." />
            </FormGroup>
            <FormGroup {...args} label="Role">
                <RadioGroup disabled={args.disabled} onChange={NOOP} selectedValue="engineer" options={[{
        label: "Engineer",
        value: "engineer"
      }, {
        label: "Designer",
        value: "designer"
      }, {
        label: "Manager",
        value: "manager"
      }]} />
            </FormGroup>
            <FormGroup {...args} label="Skills" helperText="Select all that apply">
                <Checkbox label="JavaScript" disabled={args.disabled} />
                <Checkbox label="TypeScript" disabled={args.disabled} />
                <Checkbox label="React" disabled={args.disabled} />
                <Checkbox label="Node.js" disabled={args.disabled} />
            </FormGroup>
            <FormGroup {...args} label="Experience level">
                <Slider intent={args.intent} disabled={args.disabled} min={0} max={10} stepSize={1} value={3} labelStepSize={5} />
            </FormGroup>
            <FormGroup {...args} label="Employment type">
                <SegmentedControl disabled={args.disabled} fill={args.fill} options={[{
        label: "Full-time",
        value: "full"
      }, {
        label: "Part-time",
        value: "part"
      }, {
        label: "Contract",
        value: "contract"
      }]} />
            </FormGroup>
            <FormGroup {...args} label="Preferences">
                <Switch label="Subscribe to newsletter" disabled={args.disabled} />
                <Switch label="Allow data collection" disabled={args.disabled} />
            </FormGroup>
        </Flex>
}`,...z.parameters?.docs?.source},description:{story:"A realistic form combining multiple input types within FormGroups.",...z.parameters?.docs?.description}}};K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  render: args => <FormGroup disabled={args.disabled} fill={args.fill} helperText={args.helperText} inline={args.inline} intent={args.intent} label={args.label} labelFor="playground-input" labelInfo={args.labelInfo} subLabel={args.subLabel}>
            <InputGroup id="playground-input" intent={args.intent} disabled={args.disabled} fill={args.fill} placeholder="Enter value..." />
        </FormGroup>,
  args: {
    label: "Full Name",
    helperText: "Enter your full legal name",
    labelInfo: "(required)",
    intent: "none"
  }
}`,...K.parameters?.docs?.source},description:{story:"Interactive playground with all props togglable via Storybook controls.",...K.parameters?.docs?.description}}};const Ke=["Default","WithTextArea","WithNumericInput","WithHTMLSelect","WithFileInput","WithSwitch","WithCheckboxes","WithRadioGroup","WithSlider","WithSegmentedControl","IntentExample","StateExample","LabelsExample","InlineExample","FillExample","AllStates","AllControlsDisabled","InlineControls","MixedForm","Playground"];export{W as AllControlsDisabled,V as AllStates,v as Default,_ as FillExample,q as InlineControls,U as InlineExample,H as IntentExample,M as LabelsExample,z as MixedForm,K as Playground,B as StateExample,R as WithCheckboxes,k as WithFileInput,O as WithHTMLSelect,A as WithNumericInput,D as WithRadioGroup,P as WithSegmentedControl,N as WithSlider,L as WithSwitch,E as WithTextArea,Ke as __namedExportsOrder,ze as default};
