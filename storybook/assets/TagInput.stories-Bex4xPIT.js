import{r as p,j as n,cD as H,g as D,a8 as B,br as P,e as F,bU as M,cE as K,l as W,m as G,ah as X,aa as $,s as J,al as Y,cF as Z,ai as Q,E as S,cG as ee,cH as te,bt as N,bc as ne,ar as ae,aq as se,I as L,B as V}from"./iframe-6KWIKMhT.js";import{s as le}from"./common-CGlRPlLv.js";import{H as re}from"./home-BddfYDeC.js";import{F as m}from"./flex-CfNrUc6L.js";import{T as ie}from"./tag-DnuMuEBY.js";import{i as j}from"./functionUtils-BGFdVicR.js";import"./preload-helper-PPVm8Dsz.js";import"./tagRemoveButton-DdGBep5P.js";import"./x-small-DmUwHyi-.js";const z=p.forwardRef(function(e,t){const[a,l]=p.useState(""),[r,o]=p.useState(0),d=p.useRef(null);p.useEffect(()=>{d.current!=null&&o(d.current.offsetWidth)},[a]);const{onChange:u,style:c,...g}=e,b=f=>{u?.(f),l(f?.target?.value??"")};return n.jsxs(n.Fragment,{children:[n.jsx("span",{ref:d,className:H,"aria-hidden":!0,children:a.replace(/ /g," ")}),n.jsx("input",{...g,type:"text",style:{...c,width:r},onChange:b,ref:t})]})});z.displayName=`${D}.ResizableInput`;z.__docgenInfo={description:"",methods:[]};const h=-1;class i extends B{static displayName=`${D}.TagInput`;static defaultProps={addOnBlur:!1,addOnPaste:!0,autoResize:!1,inputProps:{},separator:/[,\n\r]/,tagProps:{}};static getDerivedStateFromProps(e,t){return e.inputValue!==t.prevInputValueProp?{inputValue:e.inputValue,prevInputValueProp:e.inputValue}:null}state={activeIndex:h,inputValue:this.props.inputValue||"",isInputFocused:!1};inputElement=null;handleRef=P(this,"inputElement",this.props.inputRef);render(){const{autoResize:e,className:t,disabled:a,fill:l,inputProps:r,intent:o,large:d,leftIcon:u,placeholder:c,size:g="medium",values:b}=this.props,f=F(M,K,{[X]:this.state.isInputFocused,[G]:a,[W]:l},$(o),J(g,{large:d}),t),_=f.indexOf(Y)>h,U=b.some(O=>!!O),q=c==null||U?r?.placeholder:c,C={value:this.state.inputValue,...r,className:F(Z,r?.className),disabled:a,onChange:this.handleInputChange,onFocus:this.handleInputFocus,onKeyDown:this.handleInputKeyDown,onKeyUp:this.handleInputKeyUp,onPaste:this.handleInputPaste,placeholder:q,ref:this.handleRef};return n.jsxs("div",{className:f,onBlur:this.handleContainerBlur,onClick:this.handleContainerClick,children:[n.jsx(Q,{className:ee,icon:u,size:_?S.LARGE:S.STANDARD}),n.jsxs("div",{className:te,children:[b.map(this.maybeRenderTag),this.props.children,e?n.jsx(z,{...C}):n.jsx("input",{...C})]}),this.props.rightElement]})}componentDidUpdate(e){e.inputRef!==this.props.inputRef&&(N(e.inputRef,null),this.handleRef=P(this,"inputElement",this.props.inputRef),N(this.props.inputRef,this.inputElement))}addTags=(e,t="default")=>{const{inputValue:a,onAdd:l,onChange:r,values:o}=this.props,d=this.getValues(e);let u=l?.(d,t)!==!1&&a===void 0;j(r)&&(u=r([...o,...d])!==!1&&u),u&&this.setState({inputValue:""})};maybeRenderTag=(e,t)=>{if(!e)return null;const{large:a,size:l,tagProps:r}=this.props,o=j(r)?r(e,t):r;return n.jsx(ie,{active:t===this.state.activeIndex,"data-tag-index":t,large:a,onRemove:this.props.disabled?void 0:this.handleRemoveTag,size:l,...o,children:e},e+"__"+t)};getNextActiveIndex(e){const{activeIndex:t}=this.state;return t===h?e<0?this.findNextIndex(this.props.values.length,-1):h:this.findNextIndex(t,e)}findNextIndex(e,t){const{values:a}=this.props;let l=e+t;for(;l>0&&l<a.length&&!a[l];)l+=t;return ne(l,0,a.length)}getValues(e){const{separator:t}=this.props;return(t===!1?[e]:e.split(t)).map(a=>a.trim()).filter(a=>a.length>0)}handleContainerClick=()=>{this.inputElement?.focus()};handleContainerBlur=({currentTarget:e})=>{this.requestAnimationFrame(()=>{e.contains(ae(this.inputElement))||(this.props.addOnBlur&&this.state.inputValue!==void 0&&this.state.inputValue.length>0&&this.addTags(this.state.inputValue,"blur"),this.setState({activeIndex:h,isInputFocused:!1}))})};handleInputFocus=e=>{this.setState({isInputFocused:!0}),this.props.inputProps?.onFocus?.(e)};handleInputChange=e=>{this.setState({activeIndex:h,inputValue:e.currentTarget.value}),this.props.onInputChange?.(e),this.props.inputProps?.onChange?.(e)};handleInputKeyDown=e=>{const{selectionEnd:t,value:a}=e.currentTarget,{activeIndex:l}=this.state;let r=l;if(e.key==="Enter"&&!e.nativeEvent.isComposing&&a.length>0)this.addTags(a,"default");else if(t===0&&this.props.values.length>0){const o=se(e,["ArrowLeft"],["ArrowRight"]);if(o!==void 0){const d=this.getNextActiveIndex(o);d!==l&&(e.stopPropagation(),r=d,this.setState({activeIndex:d}))}else e.key==="Backspace"?this.handleBackspaceToRemove(e):e.key==="Delete"&&this.handleDeleteToRemove(e)}this.invokeKeyPressCallback("onKeyDown",e,r)};handleInputKeyUp=e=>{this.invokeKeyPressCallback("onKeyUp",e,this.state.activeIndex)};handleInputPaste=e=>{const{separator:t}=this.props,a=e.clipboardData.getData("text");!this.props.addOnPaste||a.length===0||t===!1||a.split(t).length===1||(e.preventDefault(),this.addTags(a,"paste"))};handleRemoveTag=e=>{const t=+e.currentTarget.parentElement.getAttribute("data-tag-index");this.removeIndexFromValues(t)};handleBackspaceToRemove(e){const t=this.state.activeIndex;this.setState({activeIndex:this.getNextActiveIndex(-1)}),this.isValidIndex(t)&&(e.stopPropagation(),this.removeIndexFromValues(t))}handleDeleteToRemove(e){const{activeIndex:t}=this.state;this.isValidIndex(t)&&(e.stopPropagation(),this.removeIndexFromValues(t))}removeIndexFromValues(e){const{onChange:t,onRemove:a,values:l}=this.props;a?.(l[e],e),t?.(l.filter((r,o)=>o!==e))}invokeKeyPressCallback(e,t,a){this.props[e]?.(t,a===h?void 0:a),this.props.inputProps[e]?.(t)}isValidIndex(e){return e!==h&&e<this.props.values.length}}i.__docgenInfo={description:`Tag input component.

@see https://blueprintjs.com/docs/#core/components/tag-input`,methods:[],props:{intent:{required:!1,tsType:{name:"Intent"},description:"Visual intent color to apply to element."},className:{required:!1,tsType:{name:"string"},description:"A space-delimited list of class names to pass along to a child element."},addOnBlur:{required:!1,tsType:{name:"boolean"},description:"If true, `onAdd` will be invoked when the input loses focus.\nOtherwise, `onAdd` is only invoked when `enter` is pressed.\n\n@default false",defaultValue:{value:"false",computed:!1}},addOnPaste:{required:!1,tsType:{name:"boolean"},description:'If true, `onAdd` will be invoked when the user pastes text containing the `separator`\ninto the input. Otherwise, pasted text will remain in the input.\n\n__Note:__ For example, if `addOnPaste=true` and `separator="\\n"` (new line), then:\n- Pasting `"hello"` will _not_ invoke `onAdd`\n- Pasting `"hello\\n"` will invoke `onAdd` with `["hello"]`\n- Pasting `"hello\\nworld"` will invoke `onAdd` with `["hello", "world"]`\n\n@default true',defaultValue:{value:"true",computed:!1}},autoResize:{required:!1,tsType:{name:"boolean"},description:`Whether the component should automatically resize as a user types in the text input.
This will have no effect when \`fill={true}\`.

@default false`,defaultValue:{value:"false",computed:!1}},children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:`Optional child elements which will be rendered between the selected tags and
the text input. Rendering children is usually unnecessary.

@default undefined`},disabled:{required:!1,tsType:{name:"boolean"},description:`Whether the component is non-interactive.
Note that you'll also need to disable the component's \`rightElement\`,
if appropriate.

@default false`},fill:{required:!1,tsType:{name:"boolean"},description:"Whether the tag input should take up the full width of its container."},inputProps:{required:!1,tsType:{name:"ReactInputHTMLAttributes",raw:"React.InputHTMLAttributes<HTMLInputElement>",elements:[{name:"HTMLInputElement"}]},description:"React props to pass to the `<input>` element.\nNote that `ref` and `key` are not supported here; use `inputRef` below.\nAlso note that `inputProps.style.width` will be overriden if `autoResize={true}`.",defaultValue:{value:"{}",computed:!1}},inputRef:{required:!1,tsType:{name:"ReactRef",raw:"React.Ref<HTMLInputElement>",elements:[{name:"HTMLInputElement"}]},description:"Ref handler for the `<input>` element."},inputValue:{required:!1,tsType:{name:"string"},description:"Controlled value of the `<input>` element. This is shorthand for `inputProps={{ value }}`."},large:{required:!1,tsType:{name:"boolean"},description:`Whether the tag input should use a large size.

@deprecated use \`size="large"\` instead.
@default false`},leftIcon:{required:!1,tsType:{name:"union",raw:"IconName | MaybeElement",elements:[{name:"IconName"},{name:"union",raw:"React.JSX.Element | false | null | undefined",elements:[{name:"React.JSX.Element"},{name:"literal",value:"false"},{name:"null"},{name:"undefined"}]}]},description:"Name of a Blueprint UI icon (or an icon element) to render on the left side of the input."},onAdd:{required:!1,tsType:{name:"signature",type:"function",raw:"(values: string[], method: TagInputAddMethod) => boolean | void",signature:{arguments:[{type:{name:"Array",elements:[{name:"string"}],raw:"string[]"},name:"values"},{type:{name:"union",raw:'"default" | "blur" | "paste"',elements:[{name:"literal",value:'"default"'},{name:"literal",value:'"blur"'},{name:"literal",value:'"paste"'}]},name:"method"}],return:{name:"union",raw:"boolean | void",elements:[{name:"boolean"},{name:"void"}]}}},description:"Callback invoked when new tags are added by the user pressing `enter` on the input.\nReceives the current value of the input field split by `separator` into an array.\nNew tags are expected to be appended to the list.\n\nThe input will be cleared after `onAdd` is invoked _unless_ the callback explicitly\nreturns `false`. This is useful if the provided `value` is somehow invalid and should\nnot be added as a tag."},onChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(values: React.ReactNode[]) => boolean | void",signature:{arguments:[{type:{name:"Array",elements:[{name:"ReactReactNode",raw:"React.ReactNode"}],raw:"React.ReactNode[]"},name:"values"}],return:{name:"union",raw:"boolean | void",elements:[{name:"boolean"},{name:"void"}]}}},description:"Callback invoked when new tags are added or removed. Receives the updated list of `values`:\nnew tags are appended to the end of the list, removed tags are removed at their index.\n\nLike `onAdd`, the input will be cleared after this handler is invoked _unless_ the callback\nexplicitly returns `false`.\n\nThis callback essentially implements basic `onAdd` and `onRemove` functionality and merges\nthe two handlers into one to simplify controlled usage.\n```"},onInputChange:{required:!1,tsType:{name:"ReactChangeEventHandler",raw:"React.ChangeEventHandler<HTMLInputElement>",elements:[{name:"HTMLInputElement"}]},description:"Callback invoked when the value of `<input>` element is changed.\nThis is shorthand for `inputProps={{ onChange }}`."},onKeyDown:{required:!1,tsType:{name:"signature",type:"function",raw:"(event: React.KeyboardEvent<HTMLElement>, index?: number) => void",signature:{arguments:[{type:{name:"ReactKeyboardEvent",raw:"React.KeyboardEvent<HTMLElement>",elements:[{name:"HTMLElement"}]},name:"event"},{type:{name:"number"},name:"index"}],return:{name:"void"}}},description:"Callback invoked when the user depresses a keyboard key.\nReceives the event and the index of the active tag (or `undefined` if\nfocused in the input)."},onKeyUp:{required:!1,tsType:{name:"signature",type:"function",raw:"(event: React.KeyboardEvent<HTMLElement>, index?: number) => void",signature:{arguments:[{type:{name:"ReactKeyboardEvent",raw:"React.KeyboardEvent<HTMLElement>",elements:[{name:"HTMLElement"}]},name:"event"},{type:{name:"number"},name:"index"}],return:{name:"void"}}},description:"Callback invoked when the user releases a keyboard key.\nReceives the event and the index of the active tag (or `undefined` if\nfocused in the input)."},onRemove:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: React.ReactNode, index: number) => void",signature:{arguments:[{type:{name:"ReactReactNode",raw:"React.ReactNode"},name:"value"},{type:{name:"number"},name:"index"}],return:{name:"void"}}},description:`Callback invoked when the user clicks the X button on a tag.
Receives value and index of removed tag.`},placeholder:{required:!1,tsType:{name:"string"},description:"Input placeholder text which will not appear if `values` contains any items\n(consistent with default HTML input behavior).\nUse `inputProps.placeholder` if you want the placeholder text to _always_ appear.\n\nIf you define both `placeholder` and `inputProps.placeholder`, then the former will appear\nwhen `values` is empty and the latter at all other times."},rightElement:{required:!1,tsType:{name:"React.JSX.Element"},description:"Element to render on right side of input.\nFor best results, use a small spinner or minimal button (button height will adjust if `TagInput` uses large styles).\nOther elements will likely require custom styles for correct positioning."},separator:{required:!1,tsType:{name:"union",raw:"string | RegExp | false",elements:[{name:"string"},{name:"RegExp"},{name:"literal",value:"false"}]},description:"Separator pattern used to split input text into multiple values. Default value splits on commas and newlines.\nExplicit `false` value disables splitting (note that `onAdd` will still receive an array of length 1).\n\n@default /[,\\n\\r]/",defaultValue:{value:"/[,\\n\\r]/",computed:!1}},size:{required:!1,tsType:{name:"Exclude",elements:[{name:"Size"},{name:"literal",value:'"small"'}],raw:'Exclude<Size, "small">'},description:`The size of the tag input.

@default "medium"`},tagProps:{required:!1,tsType:{name:"union",raw:"TagProps | ((value: React.ReactNode, index: number) => TagProps)",elements:[{name:"TagProps"},{name:"unknown"}]},description:"React props to pass to each `Tag`. Provide an object to pass the same props to every tag,\nor a function to customize props per tag.\n\nIf you define `onRemove` here then you will have to implement your own tag removal\nhandling as `TagInput`'s own `onRemove` handler will never be invoked.",defaultValue:{value:"{}",computed:!1}},values:{required:!0,tsType:{name:"unknown"},description:"Controlled tag values. Each value will be rendered inside a `Tag`, which can be customized\nusing `tagProps`. Therefore, any valid React node can be used as a `TagInput` value; falsy\nvalues will not be rendered."}}};const oe=["large","children"],k=["London","New York","San Francisco"],ve={title:"Core/Form/Inputs/TagInput",component:i,decorators:[le],tags:["autodocs"],args:{values:k,intent:"none",size:"medium",placeholder:"Add tags...",leftIcon:void 0,fill:!1,disabled:!1,autoResize:!1},argTypes:{intent:{control:"select",options:Object.values(L)},size:{control:"select",options:["medium","large"]},leftIcon:{control:"text"},placeholder:{control:"text"},autoResize:{control:"boolean"},disabled:{control:"boolean"},fill:{control:"boolean"},onAdd:{action:"added"},onChange:{action:"changed"},onRemove:{action:"removed"},onInputChange:{action:"changed"},...oe.reduce((s,e)=>(s[e]={table:{disable:!0}},s),{})}},v={args:{values:k}},y={name:"Intent",argTypes:{intent:{table:{disable:!0}},placeholder:{table:{disable:!0}},rightElement:{table:{disable:!0}},separator:{table:{disable:!0}}},render:s=>n.jsx(m,{flexDirection:"column",gap:3,style:{width:"100%"},children:Object.values(L).map(e=>n.jsx(i,{...s,intent:e,values:[e.charAt(0).toUpperCase()+e.slice(1)],placeholder:`${e} intent...`},e))})},x={name:"Size",argTypes:{size:{table:{disable:!0}},placeholder:{table:{disable:!0}},rightElement:{table:{disable:!0}},separator:{table:{disable:!0}}},render:s=>n.jsxs(m,{flexDirection:"column",gap:3,style:{width:"100%"},children:[n.jsx(i,{...s,size:"medium",values:["Medium"],placeholder:"Medium size..."}),n.jsx(i,{...s,size:"large",values:["Large"],placeholder:"Large size..."})]})},I={name:"State",argTypes:{disabled:{table:{disable:!0}},placeholder:{table:{disable:!0}},rightElement:{table:{disable:!0}},separator:{table:{disable:!0}}},render:s=>n.jsxs(m,{flexDirection:"column",gap:3,style:{width:"100%"},children:[n.jsx(i,{...s,values:["Enabled"],placeholder:"Enabled..."}),n.jsx(i,{...s,disabled:!0,values:["Disabled"],placeholder:"Disabled..."})]})},T={name:"Icons",argTypes:{leftIcon:{table:{disable:!0}},placeholder:{table:{disable:!0}},rightElement:{table:{disable:!0}},separator:{table:{disable:!0}}},render:s=>n.jsxs(m,{flexDirection:"column",gap:3,style:{width:"100%"},children:[n.jsx(i,{...s,leftIcon:"search",values:["Search"],placeholder:"With left icon..."}),n.jsx(i,{...s,leftIcon:"tag",values:["Tags"],placeholder:"With tag icon..."}),n.jsx(i,{...s,leftIcon:n.jsx(re,{}),values:["Element icon"],placeholder:"leftIcon={<Home />}"})]})},R={name:"Fill",argTypes:{fill:{table:{disable:!0}},placeholder:{table:{disable:!0}},rightElement:{table:{disable:!0}},separator:{table:{disable:!0}}},decorators:[s=>n.jsx("div",{style:{width:"500px"},children:n.jsx(s,{})})],render:s=>n.jsxs(m,{flexDirection:"column",gap:3,children:[n.jsx(i,{...s,fill:!0,values:["Full Width"],placeholder:"Fill..."}),n.jsx(i,{...s,fill:!1,values:["Auto Width"],placeholder:"Auto..."})]})},w={name:"Auto Resize",argTypes:{autoResize:{table:{disable:!0}},placeholder:{table:{disable:!0}},rightElement:{table:{disable:!0}},separator:{table:{disable:!0}}},render:s=>n.jsxs(m,{flexDirection:"column",gap:3,children:[n.jsx(i,{...s,autoResize:!0,values:["Auto Resize"],placeholder:"Type to resize..."}),n.jsx(i,{...s,autoResize:!1,values:["Fixed Width"],placeholder:"Fixed input width..."})]})},E={name:"Focused",play:async({canvas:s,userEvent:e})=>{const t=s.getByPlaceholderText("Click to focus...");await e.click(t)},render:s=>n.jsx(m,{gap:3,children:n.jsx(i,{...s,values:k,inputProps:{placeholder:"Click to focus..."}})})},A={argTypes:{values:{table:{disable:!0}}},render:function(e){const[t,a]=p.useState([...k]),l=p.useCallback(u=>{a(c=>[...c,...u]),e.onAdd?.(u,"default")},[e]),r=p.useCallback((u,c)=>{a(g=>g.filter((b,f)=>f!==c)),e.onRemove?.(u,c)},[e]),o=p.useCallback(()=>a([]),[]),d=p.useCallback(()=>a([...k]),[]);return n.jsxs(m,{flexDirection:"column",gap:3,style:{minWidth:"400px"},children:[n.jsx(i,{addOnBlur:e.addOnBlur,addOnPaste:e.addOnPaste,autoResize:e.autoResize,disabled:e.disabled,fill:e.fill,intent:e.intent,leftIcon:e.leftIcon,onAdd:l,onRemove:r,placeholder:e.placeholder,rightElement:t.length>0?n.jsx(V,{icon:"cross",variant:"minimal",size:"small",onClick:o}):void 0,size:e.size,values:t}),t.length===0&&n.jsx(V,{icon:"refresh",variant:"outlined",size:"small",text:"Reset tags",onClick:d})]})},args:{leftIcon:"tag",placeholder:"Add cities..."}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    values: INITIAL_VALUES
  }
}`,...v.parameters?.docs?.source},description:{story:"A basic tag input with default styling and pre-populated values.",...v.parameters?.docs?.description}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  name: "Intent",
  argTypes: {
    intent: {
      table: {
        disable: true
      }
    },
    placeholder: {
      table: {
        disable: true
      }
    },
    rightElement: {
      table: {
        disable: true
      }
    },
    separator: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="column" gap={3} style={{
    width: "100%"
  }}>
            {Object.values(Intent).map(intent => <TagInput key={intent} {...args} intent={intent} values={[intent.charAt(0).toUpperCase() + intent.slice(1)]} placeholder={\`\${intent} intent...\`} />)}
        </Flex>
}`,...y.parameters?.docs?.source},description:{story:"Use the `intent` prop to apply a semantic color that conveys the purpose or status of the tag input.",...y.parameters?.docs?.description}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: "Size",
  argTypes: {
    size: {
      table: {
        disable: true
      }
    },
    placeholder: {
      table: {
        disable: true
      }
    },
    rightElement: {
      table: {
        disable: true
      }
    },
    separator: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="column" gap={3} style={{
    width: "100%"
  }}>
            <TagInput {...args} size="medium" values={["Medium"]} placeholder="Medium size..." />
            <TagInput {...args} size="large" values={["Large"]} placeholder="Large size..." />
        </Flex>
}`,...x.parameters?.docs?.source},description:{story:'Use the `size` prop to adjust the tag input dimensions. TagInput supports `"medium"` (default) and `"large"`.',...x.parameters?.docs?.description}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  name: "State",
  argTypes: {
    disabled: {
      table: {
        disable: true
      }
    },
    placeholder: {
      table: {
        disable: true
      }
    },
    rightElement: {
      table: {
        disable: true
      }
    },
    separator: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="column" gap={3} style={{
    width: "100%"
  }}>
            <TagInput {...args} values={["Enabled"]} placeholder="Enabled..." />
            <TagInput {...args} disabled={true} values={["Disabled"]} placeholder="Disabled..." />
        </Flex>
}`,...I.parameters?.docs?.source},description:{story:"TagInput supports `disabled` state which prevents all interaction.",...I.parameters?.docs?.description}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  name: "Icons",
  argTypes: {
    leftIcon: {
      table: {
        disable: true
      }
    },
    placeholder: {
      table: {
        disable: true
      }
    },
    rightElement: {
      table: {
        disable: true
      }
    },
    separator: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="column" gap={3} style={{
    width: "100%"
  }}>
            <TagInput {...args} leftIcon="search" values={["Search"]} placeholder="With left icon..." />
            <TagInput {...args} leftIcon="tag" values={["Tags"]} placeholder="With tag icon..." />
            <TagInput {...args} leftIcon={<Home />} values={["Element icon"]} placeholder="leftIcon={<Home />}" />
        </Flex>
}`,...T.parameters?.docs?.source},description:{story:"Use the `leftIcon` prop to render an icon on the left side of the input.",...T.parameters?.docs?.description}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  name: "Fill",
  argTypes: {
    fill: {
      table: {
        disable: true
      }
    },
    placeholder: {
      table: {
        disable: true
      }
    },
    rightElement: {
      table: {
        disable: true
      }
    },
    separator: {
      table: {
        disable: true
      }
    }
  },
  decorators: [Story => <div style={{
    width: "500px"
  }}>
                <Story />
            </div>],
  render: args => <Flex flexDirection="column" gap={3}>
            <TagInput {...args} fill={true} values={["Full Width"]} placeholder="Fill..." />
            <TagInput {...args} fill={false} values={["Auto Width"]} placeholder="Auto..." />
        </Flex>
}`,...R.parameters?.docs?.source},description:{story:"Use the `fill` prop to make the tag input expand to the full width of its container.",...R.parameters?.docs?.description}}};w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  name: "Auto Resize",
  argTypes: {
    autoResize: {
      table: {
        disable: true
      }
    },
    placeholder: {
      table: {
        disable: true
      }
    },
    rightElement: {
      table: {
        disable: true
      }
    },
    separator: {
      table: {
        disable: true
      }
    }
  },
  render: args => <Flex flexDirection="column" gap={3}>
            <TagInput {...args} autoResize={true} values={["Auto Resize"]} placeholder="Type to resize..." />
            <TagInput {...args} autoResize={false} values={["Fixed Width"]} placeholder="Fixed input width..." />
        </Flex>
}`,...w.parameters?.docs?.source},description:{story:"Use the `autoResize` prop to automatically resize the input as the user types.\nThis has no effect when `fill={true}`.",...w.parameters?.docs?.description}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  name: "Focused",
  play: async ({
    canvas,
    userEvent
  }) => {
    const input = canvas.getByPlaceholderText("Click to focus...");
    await userEvent.click(input);
  },
  render: args => <Flex gap={3}>
            <TagInput {...args} values={INITIAL_VALUES} inputProps={{
      placeholder: "Click to focus..."
    }} />
        </Flex>
}`,...E.parameters?.docs?.source},description:{story:"A tag input in the focused state, showing the focus ring. Use controls to change the intent.",...E.parameters?.docs?.description}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  argTypes: {
    values: {
      table: {
        disable: true
      }
    }
  },
  render: function Render(args) {
    const [values, setValues] = useState<string[]>([...INITIAL_VALUES]);
    const handleAdd = useCallback((newValues: string[]) => {
      setValues(prev => [...prev, ...newValues]);
      args.onAdd?.(newValues, "default");
    }, [args]);
    const handleRemove = useCallback((_value: React.ReactNode, index: number) => {
      setValues(prev => prev.filter((_, i) => i !== index));
      args.onRemove?.(_value, index);
    }, [args]);
    const handleClear = useCallback(() => setValues([]), []);
    const handleReset = useCallback(() => setValues([...INITIAL_VALUES]), []);
    return <Flex flexDirection="column" gap={3} style={{
      minWidth: "400px"
    }}>
                <TagInput addOnBlur={args.addOnBlur} addOnPaste={args.addOnPaste} autoResize={args.autoResize} disabled={args.disabled} fill={args.fill} intent={args.intent} leftIcon={args.leftIcon} onAdd={handleAdd} onRemove={handleRemove} placeholder={args.placeholder} rightElement={values.length > 0 ? <Button icon="cross" variant="minimal" size="small" onClick={handleClear} /> : undefined} size={args.size} values={values} />
                {values.length === 0 && <Button icon="refresh" variant="outlined" size="small" text="Reset tags" onClick={handleReset} />}
            </Flex>;
  },
  args: {
    leftIcon: "tag",
    placeholder: "Add cities..."
  }
}`,...A.parameters?.docs?.source},description:{story:"Interactive playground with fully functional add/remove and all props togglable via Storybook controls.",...A.parameters?.docs?.description}}};const ye=["Default","IntentExample","SizeExample","StateExample","IconExample","FillExample","AutoResizeExample","FocusedExample","Playground"];export{w as AutoResizeExample,v as Default,R as FillExample,E as FocusedExample,T as IconExample,y as IntentExample,A as Playground,x as SizeExample,I as StateExample,ye as __namedExportsOrder,ve as default};
