/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { createElement } from "react";

import { DISPLAYNAME_PREFIX, type Props } from "../../common/props";

export interface SampleComponentProps extends Props, React.HTMLAttributes<HTMLElement> {
    /**
     * Name to display.
     */
    name: string;

    /**
     * HTML tag to use for element.
     *
     * @default "h1"
     */
    tagName?: keyof React.JSX.IntrinsicElements;
}

export const SampleComponent: React.FC<SampleComponentProps> = ({ name, className, tagName = "h1", ...htmlProps }) => {
    return createElement(tagName, { ...htmlProps, className: "greeting" }, name + "'s Sample Component in Labs!");
};

SampleComponent.displayName = `${DISPLAYNAME_PREFIX}.SampleComponent`;
