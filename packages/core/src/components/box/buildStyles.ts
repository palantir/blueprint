/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

/* eslint-disable sort-keys */

import { Classes } from "../../common";

import type {
    AlignContent,
    AlignItems,
    AlignSelf,
    Display,
    Flex,
    FlexDirection,
    FlexWrap,
    Gap,
    Height,
    Inset,
    JustifyContent,
    JustifyItems,
    JustifySelf,
    Margin,
    Overflow,
    Padding,
    Position,
    Width,
} from "./boxProps";

const NS = Classes.getClassNamespace();

/**
 * Runtime helper that converts <Box> style-props into utility class names.
 *
 * The implementation is intentionally simple:
 *   1. A prop key that exists in the `styles` map is considered a style prop.
 *      Its value is run through a converter (created via `appendValue` or
 *      `mapping`) which returns the corresponding class string, e.g.
 *      `display="flex"` → `"flex"`.
 *   2. Any prop that is *not* in the map is assumed to be a valid intrinsic
 *      DOM attribute (e.g. `id`, `title`) or a component-specific prop and is
 *      therefore forwarded untouched.
 *
 * Returns an object with two pieces of information:
 *   • `generatedClassNames` – an array of class names to apply to the element.
 *   • `passThroughProps`    – the remaining props to forward.
 *
 * @param props - The props object to convert.
 * @returns An object with `generatedClassNames` and `passThroughProps`.
 */
export function buildStyles<T extends Record<string, any>>(props: T) {
    const classNames = new Set<string>();
    const passThroughProps: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(props)) {
        if (Object.prototype.hasOwnProperty.call(styles, key)) {
            const className = styles[key]?.(value);
            if (className != null) {
                classNames.add(className);
            }
        } else {
            passThroughProps[key] = value;
        }
    }

    return { generatedClassNames: Array.from(classNames), passThroughProps };
}

function appendValue<T>(prefix: string) {
    return (value: T) => `${NS}-${prefix}-${value}`;
}

function mapping<T extends string | number | symbol>(styleMap: Record<T, string>) {
    return (value: T) => `${NS}-${styleMap[value]}`;
}

const gap = appendValue<Gap>("gap");

const margin = appendValue<Margin>("margin");
const marginX = appendValue<Margin>("margin-inline");
const marginXStart = appendValue<Margin>("margin-inline-start");
const marginXEnd = appendValue<Margin>("margin-inline-end");
const marginY = appendValue<Margin>("margin-block");
const marginYStart = appendValue<Margin>("margin-block-start");
const marginYEnd = appendValue<Margin>("margin-block-end");
const marginTop = appendValue<Margin>("margin-top");
const marginRight = appendValue<Margin>("margin-right");
const marginBottom = appendValue<Margin>("margin-bottom");
const marginLeft = appendValue<Margin>("margin-left");

const padding = appendValue<Padding>("padding");
const paddingX = appendValue<Padding>("padding-inline");
const paddingXStart = appendValue<Padding>("padding-inline-start");
const paddingXEnd = appendValue<Padding>("padding-inline-end");
const paddingY = appendValue<Padding>("padding-block");
const paddingYStart = appendValue<Padding>("padding-block-start");
const paddingYEnd = appendValue<Padding>("padding-block-end");
const paddingTop = appendValue<Padding>("padding-top");
const paddingRight = appendValue<Padding>("padding-right");
const paddingBottom = appendValue<Padding>("padding-bottom");
const paddingLeft = appendValue<Padding>("padding-left");

const width = mapping<Width>({
    25: "width-25",
    50: "width-50",
    75: "width-75",
    100: "width-100",
    auto: "width-auto",
});

const height = mapping<Height>({
    25: "height-25",
    50: "height-50",
    75: "height-75",
    100: "height-100",
    auto: "height-auto",
});

const inset = appendValue<Inset>("inset");
const insetX = appendValue<Inset>("inset-inline");
const insetXStart = appendValue<Inset>("inset-inline-start");
const insetXEnd = appendValue<Inset>("inset-inline-end");
const insetY = appendValue<Inset>("inset-block");
const insetYStart = appendValue<Inset>("inset-block-start");
const insetYEnd = appendValue<Inset>("inset-block-end");
const insetTop = appendValue<Inset>("inset-top");
const insetRight = appendValue<Inset>("inset-right");
const insetBottom = appendValue<Inset>("inset-bottom");
const insetLeft = appendValue<Inset>("inset-left");

const alignContent = mapping<AlignContent>({
    start: "content-start",
    center: "content-center",
    end: "content-end",
    "space-between": "content-between",
    "space-around": "content-around",
    "space-evenly": "content-evenly",
    stretch: "content-stretch",
    normal: "content-normal",
    baseline: "content-baseline",
});

const alignItems = mapping<AlignItems>({
    start: "items-start",
    end: "items-end",
    center: "items-center",
    baseline: "items-baseline",
    stretch: "items-stretch",
});

const alignSelf = mapping<AlignSelf>({
    auto: "self-auto",
    start: "self-start",
    end: "self-end",
    center: "self-center",
    baseline: "self-baseline",
    stretch: "self-stretch",
});

const display = mapping<Display>({
    block: "block",
    "inline-block": "inline-block",
    inline: "inline",
    flex: "flex",
    "inline-flex": "inline-flex",
    grid: "grid",
    "inline-grid": "inline-grid",
    table: "table",
    "inline-table": "inline-table",
    "table-row": "table-row",
    "table-cell": "table-cell",
    none: "none",
});

const flex = mapping<Flex>({
    "1": "flex-1",
    auto: "flex-auto",
    initial: "flex-initial",
    none: "flex-none",
});

const flexDirection = mapping<FlexDirection>({
    row: "flex-row",
    "row-reverse": "flex-row-reverse",
    column: "flex-column",
    "column-reverse": "flex-column-reverse",
});

const flexWrap = mapping<FlexWrap>({
    nowrap: "flex-nowrap",
    wrap: "flex-wrap",
    "wrap-reverse": "flex-wrap-reverse",
});

const justifyContent = mapping<JustifyContent>({
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    "space-between": "justify-between",
    "space-around": "justify-around",
    "space-evenly": "justify-evenly",
    normal: "justify-normal",
    stretch: "justify-stretch",
});

const justifyItems = mapping<JustifyItems>({
    start: "justify-items-start",
    end: "justify-items-end",
    center: "justify-items-center",
    stretch: "justify-items-stretch",
});

const justifySelf = mapping<JustifySelf>({
    auto: "justify-self-auto",
    start: "justify-self-start",
    end: "justify-self-end",
    center: "justify-self-center",
    stretch: "justify-self-stretch",
});

const position = mapping<Position>({
    static: "static",
    relative: "relative",
    absolute: "absolute",
    fixed: "fixed",
    sticky: "sticky",
});

const overflow = mapping<Overflow>({
    visible: "overflow-visible",
    hidden: "overflow-hidden",
    scroll: "overflow-scroll",
    auto: "overflow-auto",
});

const overflowX = mapping<Overflow>({
    visible: "overflow-x-visible",
    hidden: "overflow-x-hidden",
    scroll: "overflow-x-scroll",
    auto: "overflow-x-auto",
});

const overflowY = mapping<Overflow>({
    visible: "overflow-y-visible",
    hidden: "overflow-y-hidden",
    scroll: "overflow-y-scroll",
    auto: "overflow-y-auto",
});

// Look-up table of style-prop name → converter function
const styles: Record<string, (value: any) => string> = {
    gap,

    margin,
    marginX,
    marginXStart,
    marginXEnd,
    marginY,
    marginYStart,
    marginYEnd,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,

    padding,
    paddingX,
    paddingXStart,
    paddingXEnd,
    paddingY,
    paddingYStart,
    paddingYEnd,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,

    inset,
    insetX,
    insetXStart,
    insetXEnd,
    insetY,
    insetYStart,
    insetYEnd,
    insetTop,
    insetRight,
    insetBottom,
    insetLeft,

    width,
    height,

    alignContent,
    alignItems,
    alignSelf,
    display,
    flex,
    flexDirection,
    flexWrap,
    justifyContent,
    justifyItems,
    justifySelf,
    position,
    overflow,
    overflowX,
    overflowY,
};
