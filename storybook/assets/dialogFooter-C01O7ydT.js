import{r as d,j as e,a4 as c,a5 as m,e as h,a6 as p,a7 as f,g as u}from"./iframe-6KWIKMhT.js";const a=d.forwardRef((o,t)=>{const{actions:s,children:n,className:i,minimal:l=!1,...r}=o;return e.jsxs("div",{...r,className:h(p,i,{[f]:!l}),ref:t,children:[e.jsx("div",{className:c,children:n}),s!=null&&e.jsx("div",{className:m,children:s})]})});a.displayName=`${u}.DialogFooter`;a.__docgenInfo={description:`Dialog footer component.

@see https://blueprintjs.com/docs/#core/components/dialog.dialog-footer-props`,methods:[],props:{className:{required:!1,tsType:{name:"string"},description:"A space-delimited list of class names to pass along to a child element."},actions:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"Dialog actions (typically buttons) are rendered on the right side of the footer."},children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"Child contents are rendered on the left side of the footer."},minimal:{required:!1,tsType:{name:"boolean"},description:`Use a "minimal" appearance for the footer, simply applying an HTML role and
some visual padding. This is useful for small dialogs, and should not be used
with \`<DialogBody useOverflowScrollContainer>\`.

Note that this is the default behavior when using the CSS API, since that's
how the \`-dialog-footer\` class was first introduced, so these styles are
applied without a "modifier" class.

When using the JS component API, \`minimal\` is false by default.

Show the footer close from the content.
Do not use with scroll body
Use for small dialogs (confirm)

@default false;`}}};export{a as D};
