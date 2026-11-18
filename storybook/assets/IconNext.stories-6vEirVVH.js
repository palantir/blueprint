import{r,E as A,e as S,aa as w,c5 as R,w as k,j as e,an as q,g as $,I as P,B as D}from"./iframe-6KWIKMhT.js";import{s as H,S as c}from"./common-CGlRPlLv.js";import{I as _,a as d,P as E,b as M,H as X,C as J}from"./iconLoaderNext-WPW-VOzG.js";import"./preload-helper-PPVm8Dsz.js";import"./flex-CfNrUc6L.js";import"./iconNextNames-Ccmkystz.js";const n=r.forwardRef((a,F)=>{const{autoLoad:g=!0,className:h,color:I,htmlTitle:L,icon:i,intent:j,size:C=A.STANDARD,svgProps:B,tagName:O="span",title:V,variant:s=_.OUTLINED,...N}=a,[v,z]=r.useState(()=>{if(typeof i!="string")return;const t=d.getPaths(i,s);return t===void 0?void 0:{icon:i,paths:t,variant:s}});if(r.useEffect(()=>{let t=!1;if(typeof i=="string"){const o=d.getPaths(i,s);o!==void 0?z({icon:i,paths:o,variant:s}):g?d.load(i,s).then(()=>{if(!t){const l=d.getPaths(i,s);l!==void 0&&z({icon:i,paths:l,variant:s})}}).catch(l=>{t||console.error(`[Blueprint] Next icon '${i}' (${s}) could not be loaded.`,l)}):console.error(`[Blueprint] Next icon '${i}' (${s}) is not loaded yet and autoLoad={false}, did you call IconsNext.load('${i}', '${s}')?`)}return()=>{t=!0}},[g,i,s]),i==null||typeof i=="boolean")return null;if(typeof i!="string"){if(r.isValidElement(i)){const t=S(i.props.className,h,w(j));if(R(i)){const o={...k(N),className:t},l=i.props.size??a.size;l!=null&&(o.size=l);const b=i.props.color??I;return b!=null&&(o.color=b),r.cloneElement(i,o)}return r.cloneElement(i,{className:t})}return i}const T=(d.getPaths(i,s)??(v?.icon===i&&v.variant===s?v.paths:void 0))?.map((t,o)=>e.jsx("path",{d:t},o))??[];return e.jsx(q,{children:T,className:S(w(j),h),color:I,htmlTitle:L,iconName:i,ref:F,size:C,svgProps:B,tagName:O,title:V,...k(N)})});n.displayName=`${$}.IconNext`;n.__docgenInfo={description:`Next-generation icon component. Renders icons from \`@blueprintjs/icons/next\` with
dynamic loading support and outlined/filled variant switching.

@see https://blueprintjs.com/docs/#core/components/icon`,methods:[],props:{intent:{required:!1,tsType:{name:"Intent"},description:"Visual intent color to apply to element."},className:{required:!1,tsType:{name:"string"},description:"A space-delimited list of class names to pass along to a child element."},autoLoad:{required:!1,tsType:{name:"boolean"},description:`Whether the component should automatically load icon contents using an async import.

@default true`},icon:{required:!0,tsType:{name:"union",raw:"IconNextName | MaybeElement",elements:[{name:"IconNextName"},{name:"union",raw:"React.JSX.Element | false | null | undefined",elements:[{name:"React.JSX.Element"},{name:"literal",value:"false"},{name:"null"},{name:"undefined"}]}]},description:"Name of a next-generation Blueprint UI icon, or an icon element, to render.\n\n- If `null` or `undefined` or `false`, this component will render nothing.\n- If given a `IconNextName` string, that icon will be rendered as an `<svg>` with `<path>` tags.\n- If given a `React.JSX.Element`, that element is cloned with the parent-provided `className` and intent class\n  merged onto its root. If the element is a Blueprint icon component, DOM attributes and the `color` and\n  `size` props are also forwarded onto it, with the element's own `color`/`size` taking precedence. For any\n  other element type, other props on this component are ignored."},variant:{required:!1,tsType:{name:"IconVariant"},description:'Icon variant. Next icons support outlined (default) and filled variants.\nIf `"filled"` is requested but unavailable for this icon, falls back to `"outlined"`.\n\n@default "outlined"'}}};const ne={title:"Next Icons/IconNext",component:n,decorators:[H],parameters:{layout:"centered"}},p={name:"Dynamic String",render:()=>e.jsxs("div",{style:{display:"flex",gap:16,alignItems:"center"},children:[e.jsx(n,{icon:"house",size:32}),e.jsx(n,{icon:"circle-arrow-down",size:32}),e.jsx(n,{icon:"star",size:32}),e.jsx(n,{icon:"gear",size:32}),e.jsx(n,{icon:"magnifying-glass",size:32})]})},m={name:"Element Passthrough",render:()=>e.jsxs("div",{style:{display:"flex",gap:16,alignItems:"center"},children:[e.jsx(n,{icon:e.jsx(X,{size:32})}),e.jsx(n,{icon:e.jsx(J,{size:32})}),e.jsx(n,{icon:e.jsx(E,{size:32})})]})},x={name:"Variants",render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:24},children:[e.jsxs("div",{children:[e.jsx(c,{title:"Outlined (default)"}),e.jsxs("div",{style:{display:"flex",gap:16,alignItems:"center"},children:[e.jsx(n,{icon:"play",size:32}),e.jsx(n,{icon:"pause",size:32}),e.jsx(n,{icon:"speaker-high",size:32}),e.jsx(n,{icon:"fast-forward",size:32}),e.jsx(n,{icon:"skip-backward",size:32})]})]}),e.jsxs("div",{children:[e.jsx(c,{title:"Filled"}),e.jsxs("div",{style:{display:"flex",gap:16,alignItems:"center"},children:[e.jsx(n,{icon:"play",variant:"filled",size:32}),e.jsx(n,{icon:"pause",variant:"filled",size:32}),e.jsx(n,{icon:"speaker-high",variant:"filled",size:32}),e.jsx(n,{icon:"fast-forward",variant:"filled",size:32}),e.jsx(n,{icon:"skip-backward",variant:"filled",size:32})]})]})]})},f={name:"Filled Fallback",render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:24},children:[e.jsxs("div",{children:[e.jsx(c,{title:"Has filled variant (play)"}),e.jsxs("div",{style:{display:"flex",gap:16,alignItems:"center"},children:[e.jsx(n,{icon:"play",size:32}),e.jsx(n,{icon:"play",variant:"filled",size:32})]})]}),e.jsxs("div",{children:[e.jsx(c,{title:"No filled variant (anchor) — falls back to outlined"}),e.jsxs("div",{style:{display:"flex",gap:16,alignItems:"center"},children:[e.jsx(n,{icon:"anchor",size:32}),e.jsx(n,{icon:"anchor",variant:"filled",size:32})]})]})]})},y={name:"Dynamic vs Static",render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:24},children:[e.jsxs("div",{children:[e.jsx(c,{title:"IconNext (dynamic)"}),e.jsxs("div",{style:{display:"flex",gap:16,alignItems:"center"},children:[e.jsx(n,{icon:"play",size:32}),e.jsx(n,{icon:"play",variant:"filled",size:32})]})]}),e.jsxs("div",{children:[e.jsx(c,{title:"Static import (same icon)"}),e.jsxs("div",{style:{display:"flex",gap:16,alignItems:"center"},children:[e.jsx(E,{size:32}),e.jsx(M,{size:32})]})]})]})},u={name:"In Components",render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:16},children:[e.jsx("div",{style:{display:"flex",gap:8},children:Object.values(P).map(a=>e.jsx(D,{icon:e.jsx(n,{icon:"bell"}),endIcon:e.jsx(n,{icon:"play",variant:"filled"}),intent:a,text:a||"none"},a))}),e.jsx("div",{style:{display:"flex",gap:8},children:Object.values(P).map(a=>e.jsx(D,{icon:e.jsx(n,{icon:"pause",variant:"filled"}),intent:a,text:void 0,"aria-label":"pause"},a))})]})};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  name: "Dynamic String",
  render: () => <div style={{
    display: "flex",
    gap: 16,
    alignItems: "center"
  }}>
            <IconNext icon="house" size={32} />
            <IconNext icon="circle-arrow-down" size={32} />
            <IconNext icon="star" size={32} />
            <IconNext icon="gear" size={32} />
            <IconNext icon="magnifying-glass" size={32} />
        </div>
}`,...p.parameters?.docs?.source},description:{story:"Dynamic string usage — the icon is loaded asynchronously by name.",...p.parameters?.docs?.description}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  name: "Element Passthrough",
  render: () => <div style={{
    display: "flex",
    gap: 16,
    alignItems: "center"
  }}>
            <IconNext icon={<HouseIcon size={32} />} />
            <IconNext icon={<CircleArrowDownIcon size={32} />} />
            <IconNext icon={<PlayIcon size={32} />} />
        </div>
}`,...m.parameters?.docs?.source},description:{story:"Element passthrough — works the same as current Icon.",...m.parameters?.docs?.description}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: "Variants",
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: 24
  }}>
            <div>
                <StoryLabel title="Outlined (default)" />
                <div style={{
        display: "flex",
        gap: 16,
        alignItems: "center"
      }}>
                    <IconNext icon="play" size={32} />
                    <IconNext icon="pause" size={32} />
                    <IconNext icon="speaker-high" size={32} />
                    <IconNext icon="fast-forward" size={32} />
                    <IconNext icon="skip-backward" size={32} />
                </div>
            </div>
            <div>
                <StoryLabel title="Filled" />
                <div style={{
        display: "flex",
        gap: 16,
        alignItems: "center"
      }}>
                    <IconNext icon="play" variant="filled" size={32} />
                    <IconNext icon="pause" variant="filled" size={32} />
                    <IconNext icon="speaker-high" variant="filled" size={32} />
                    <IconNext icon="fast-forward" variant="filled" size={32} />
                    <IconNext icon="skip-backward" variant="filled" size={32} />
                </div>
            </div>
        </div>
}`,...x.parameters?.docs?.source},description:{story:"Outlined vs filled variant switching.",...x.parameters?.docs?.description}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: "Filled Fallback",
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: 24
  }}>
            <div>
                <StoryLabel title="Has filled variant (play)" />
                <div style={{
        display: "flex",
        gap: 16,
        alignItems: "center"
      }}>
                    <IconNext icon="play" size={32} />
                    <IconNext icon="play" variant="filled" size={32} />
                </div>
            </div>
            <div>
                <StoryLabel title="No filled variant (anchor) — falls back to outlined" />
                <div style={{
        display: "flex",
        gap: 16,
        alignItems: "center"
      }}>
                    <IconNext icon="anchor" size={32} />
                    <IconNext icon="anchor" variant="filled" size={32} />
                </div>
            </div>
        </div>
}`,...f.parameters?.docs?.source},description:{story:`Filled fallback — requesting "filled" on an icon without a filled variant
silently falls back to outlined. A dev-mode console warning is emitted.`,...f.parameters?.docs?.description}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  name: "Dynamic vs Static",
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: 24
  }}>
            <div>
                <StoryLabel title="IconNext (dynamic)" />
                <div style={{
        display: "flex",
        gap: 16,
        alignItems: "center"
      }}>
                    <IconNext icon="play" size={32} />
                    <IconNext icon="play" variant="filled" size={32} />
                </div>
            </div>
            <div>
                <StoryLabel title="Static import (same icon)" />
                <div style={{
        display: "flex",
        gap: 16,
        alignItems: "center"
      }}>
                    <PlayIcon size={32} />
                    <PlayFilledIcon size={32} />
                </div>
            </div>
        </div>
}`,...y.parameters?.docs?.source},description:{story:"Side-by-side: dynamic IconNext vs static component.",...y.parameters?.docs?.description}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  name: "In Components",
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: 16
  }}>
            <div style={{
      display: "flex",
      gap: 8
    }}>
                {Object.values(Intent).map(intent => <Button key={intent} icon={<IconNext icon="bell" />} endIcon={<IconNext icon="play" variant="filled" />} intent={intent} text={intent || "none"} />)}
            </div>
            <div style={{
      display: "flex",
      gap: 8
    }}>
                {Object.values(Intent).map(intent => <Button key={intent} icon={<IconNext icon="pause" variant="filled" />} intent={intent} text={undefined} aria-label="pause" />)}
            </div>
        </div>
}`,...u.parameters?.docs?.source},description:{story:"IconNext used inside Blueprint components via icon prop.",...u.parameters?.docs?.description}}};const ie=["DynamicString","ElementPassthrough","VariantComparison","FilledFallback","DynamicVsStatic","InComponents"];export{p as DynamicString,y as DynamicVsStatic,m as ElementPassthrough,f as FilledFallback,u as InComponents,x as VariantComparison,ie as __namedExportsOrder,ne as default};
