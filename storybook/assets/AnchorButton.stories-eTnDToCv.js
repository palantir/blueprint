import{s as r}from"./common-CGlRPlLv.js";import{A as a,a as s,I as i}from"./iframe-6KWIKMhT.js";import{B as l}from"./buttonVariant-Dalv6_qh.js";import{S as c}from"./size-c484FBD7.js";import"./flex-CfNrUc6L.js";import"./preload-helper-PPVm8Dsz.js";const d=["large","minimal","outlined","rightIcon","small","children"],k={title:"Core/Button/AnchorButton",component:a,decorators:[r],tags:["autodocs"],args:{text:"Link",href:"#",target:void 0,intent:"none",variant:"solid",size:"medium",alignText:"center",icon:void 0,endIcon:void 0,fill:!1,active:!1,loading:!1,disabled:!1,ellipsizeText:!1},argTypes:{text:{control:"text"},href:{control:"text"},target:{control:"select",options:["_self","_blank","_parent","_top"]},intent:{control:"select",options:Object.values(i)},size:{control:"select",options:Object.values(c)},variant:{control:"select",options:Object.values(l)},alignText:{control:"select",options:Object.values(s)},icon:{control:"text"},endIcon:{control:"text"},active:{control:"boolean"},disabled:{control:"boolean"},ellipsizeText:{control:"boolean"},fill:{control:"boolean"},loading:{control:"boolean"},onClick:{action:"clicked"},...d.reduce((o,n)=>(o[n]={table:{disable:!0}},o),{})}},t={args:{text:"Link",href:"#",icon:"link",target:"_blank"}},e={args:{text:"Open link",href:"#",target:"_blank",icon:"share",endIcon:void 0,intent:"primary",variant:"solid",size:"medium"}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    text: "Link",
    href: "#",
    icon: "link",
    target: "_blank"
  }
}`,...t.parameters?.docs?.source},description:{story:"A basic anchor button with default styling. Renders an `<a>` element styled as a button.",...t.parameters?.docs?.description}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    text: "Open link",
    href: "#",
    target: "_blank",
    icon: "share",
    endIcon: undefined,
    intent: "primary",
    variant: "solid",
    size: "medium"
  }
}`,...e.parameters?.docs?.source},description:{story:"Interactive playground with all props togglable via Storybook controls.",...e.parameters?.docs?.description}}};const v=["Default","Playground"];export{t as Default,e as Playground,v as __namedExportsOrder,k as default};
