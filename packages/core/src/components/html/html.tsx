/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";
import { BLOCKQUOTE, CODE, CODE_BLOCK, HEADING, LABEL, LIST } from "../../common/classes";

export interface IElementRefProps<E extends HTMLElement> {
    /** Ref handler to access the instance of the internal HTML element. */
    elementRef?: (ref: E | null) => void;
}

function htmlElement<E extends HTMLElement>(
    tagName: keyof JSX.IntrinsicElements,
    tagClassName: string,
): React.SFC<React.HTMLProps<E> & IElementRefProps<E>> {
    return props => {
        const { className, elementRef, ...htmlProps } = props;
        return React.createElement(tagName, {
            ...htmlProps,
            className: classNames(tagClassName, className),
            ref: elementRef,
        });
    };
}

// the following components are linted by blueprint-html-components because
// they should rarely be used without the Blueprint classes/styles:

export const H1 = htmlElement<HTMLHeadingElement>("h1", HEADING);
export const H2 = htmlElement<HTMLHeadingElement>("h2", HEADING);
export const H3 = htmlElement<HTMLHeadingElement>("h3", HEADING);
export const H4 = htmlElement<HTMLHeadingElement>("h4", HEADING);
export const H5 = htmlElement<HTMLHeadingElement>("h5", HEADING);
export const H6 = htmlElement<HTMLHeadingElement>("h6", HEADING);

export const Blockquote = htmlElement<HTMLElement>("blockquote", BLOCKQUOTE);
export const Code = htmlElement<HTMLElement>("code", CODE);
export const Pre = htmlElement<HTMLElement>("pre", CODE_BLOCK);
export const Label = htmlElement<HTMLLabelElement>("label", LABEL);

// these two are not linted by blueprint-html-components because there are valid
// uses of these elements without Blueprint styles:
export const OL = htmlElement<HTMLOListElement>("ol", LIST);
export const UL = htmlElement<HTMLUListElement>("ul", LIST);
