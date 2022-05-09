/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import classNames from "classnames";
import * as React from "react";

import { IElementRefProps } from "../../common";
import { BLOCKQUOTE, CODE, CODE_BLOCK, HEADING, LABEL, LIST } from "../../common/classes";

function htmlElement<E extends HTMLElement>(
    tagName: keyof JSX.IntrinsicElements,
    tagClassName: string,
    // eslint-disable-next-line deprecation/deprecation
): React.FC<React.HTMLProps<E> & IElementRefProps<E> & { children?: React.ReactNode }> {
    /* eslint-disable-next-line react/display-name */
    return props => {
        const { className, elementRef, children, ...htmlProps } = props;
        return React.createElement(
            tagName,
            {
                ...htmlProps,
                className: classNames(tagClassName, className),
                ref: elementRef,
            },
            children,
        );
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
