/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { IProps } from "@blueprintjs/core";
import classNames from "classnames";
import React from "react";

export interface IExampleProps extends IProps {
    id: string;
}

/**
 * Props supported by the `Example` component.
 * Additional props will be spread to the root `<div>` element.
 */
export interface IDocsExampleProps extends IExampleProps {
    /**
     * Options for the example, which will appear in a narrow column to the right of the example.
     */
    options: React.ReactNode;

    /**
     * HTML markup for the example, which will be directly injected into the
     * example container using `dangerouslySetInnerHTML`.
     *
     * This prop is mutually exclusive with and takes priority over `children`.
     */
    html?: string;
}

/**
 * Container for an example and its options.
 *
 * ```tsx
 * import { Example, IExampleProps } from "@blueprintjs/docs-theme";
 * // use IExampleProps as your props type,
 * // then spread it to <Example> below
 * export class MyExample extends React.PureComponent<IExampleProps, [your state]> {
 *     public render() {
 *         const options = (
 *             <>
 *                  --- render options here ---
 *             </>
 *         );
 *         return (
 *             <Example options={options} {...this.props}>
 *                 --- render examples here ---
 *             </Example>
 *         );
 *     }
 * ```
 */
export class Example extends React.PureComponent<IDocsExampleProps> {
    private hasDelayedBeforeInitialRender = false;

    public render() {
        // HACKHACK: This is the other required piece. Don't let any React nodes
        // into the DOM until the requestAnimationFrame delay has elapsed. This
        // prevents shouldComponentUpdate snafus at lower levels.
        if (!this.hasDelayedBeforeInitialRender) {
            return null;
        }

        // spread any additional props through to the root element, to support decorators that expect DOM props
        const { children, className, html, id, options, ...htmlProps } = this.props;
        const example =
            html == null ? (
                <div className="docs-example">{children}</div>
            ) : (
                <div className="docs-example" dangerouslySetInnerHTML={{ __html: html }} />
            );

        return (
            <div className={classNames("docs-example-frame", className)} data-example-id={id} {...htmlProps}>
                {example}
                <div className="docs-example-options">{options}</div>
            </div>
        );
    }

    public componentDidMount() {
        // HACKHACK: The docs app suffers from a Flash of Unstyled Content that
        // causes some 'width: 100%' examples to mis-measure the horizontal
        // space available to them. Until that bug is squashed, we must delay
        // initial render till the DOM loads with a requestAnimationFrame.
        requestAnimationFrame(() => {
            this.hasDelayedBeforeInitialRender = true;
            this.forceUpdate();
        });
    }
}
