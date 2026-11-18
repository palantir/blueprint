import{e as i,F as I,k as _,l as C,m as E,s as L,n as N,o as x,j as e,p as P,g as w}from"./iframe-6KWIKMhT.js";const q=P(),l=o=>{const{buttonText:t,className:p,disabled:n,fill:r,hasSelection:h=!1,inputProps:s={},large:d=!1,onInputChange:u,size:c="medium",small:m=!1,text:f="Choose file...",...T}=o,g=i(p,I,{[E]:n,[C]:r,[_]:h},L(c,{large:d,small:m})),b={[`${q}-button-text`]:t,className:i(N,{[x]:!!t})},y=a=>{u?.(a),s?.onChange?.(a)};return e.jsxs("label",{...T,className:g,children:[e.jsx("input",{...s,onChange:y,type:"file",disabled:n}),e.jsx("span",{...b,children:f})]})};l.displayName=`${w}.FileInput`;l.__docgenInfo={description:`File input component.

@see https://blueprintjs.com/docs/#core/components/file-input`,methods:[],props:{className:{required:!1,tsType:{name:"string"},description:"A space-delimited list of class names to pass along to a child element."},disabled:{required:!1,tsType:{name:"boolean"},description:"Whether the file input is non-interactive.\nSetting this to `true` will automatically disable the child input too."},fill:{required:!1,tsType:{name:"boolean"},description:"Whether the file input should take up the full width of its container."},hasSelection:{required:!1,tsType:{name:"boolean"},description:`Whether the user has made a selection in the input. This will affect the component's
text styling. Make sure to set a non-empty value for the text prop as well.

@default false`},inputProps:{required:!1,tsType:{name:"ReactHTMLProps",raw:"React.HTMLProps<HTMLInputElement>",elements:[{name:"HTMLInputElement"}]},description:'The props to pass to the child input.\n`disabled` will be ignored in favor of the top-level prop.\n`type` will be ignored, because the input _must_ be `type="file"`.\nPass `onChange` here to be notified when the user selects a file.'},large:{required:!1,tsType:{name:"boolean"},description:`Whether the file input should appear with large styling.

@deprecated use \`size="large"\` instead.
@default false`},onInputChange:{required:!1,tsType:{name:"ReactChangeEventHandler",raw:"React.ChangeEventHandler<HTMLInputElement>",elements:[{name:"HTMLInputElement"}]},description:"Callback invoked on `<input>` `change` events.\n\nThis callback is offered as a convenience; it is equivalent to `inputProps.onChange`.\n\n__Note:__ The top-level `onChange` prop is passed to the `<label>` element rather than the `<input>`,\nwhich may not be what you expect."},small:{required:!1,tsType:{name:"boolean"},description:`Whether the file input should appear with small styling.

@deprecated use \`size="small"\` instead.
@default false`},size:{required:!1,tsType:{name:"Size"},description:"The size of the file input."},text:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:`The text to display inside the input.

@default "Choose file..."`},buttonText:{required:!1,tsType:{name:"string"},description:`The button text to display on the right side of the input.

@default "Browse"`}}};export{l as F};
