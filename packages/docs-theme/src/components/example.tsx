/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { IProps } from "@blueprintjs/core";
import classNames from "classnames";
import React from "react";

export interface IExampleProps<T = {}> extends IProps {
    /**
     * Identifier of this example.
     * This will appear as the `data-example-id` attribute on the DOM element.
     */
    id: string;

    /**
     * Container for arbitary data passed to each example from the parent
     * application. This prop is ignored by the `<Example>` component; it is
     * available for your example implementations to access by providing a `<T>`
     * type to this interface. Pass actual `data` when defining your example map
     * for the `ReactExampleTagRenderer`.
     *
     * A container like this is necessary because unknown props on the
     * `<Example>` component are passed to its underlying DOM element, so adding
     * your own props will result in React "unknown prop" warnings.
     */
    data?: T;
}

/**
 * Props supported by the `Example` component.
 * Additional props will be spread to the root `<div>` element.
 */
export interface IDocsExampleProps extends IExampleProps {
    /**
     * Options for the example, which will typically appear in a narrow column
     * to the right of the example.
     */
    options: React.ReactNode;

    /**
     * Whether options should appear in a full-width row below the example
     * container. By default, options appear in a single column to the right of
     * the example. If this prop is enabled, then the options container becomes
     * a flex row; group options into columns by wrapping them in a `<div>`.
     * @default false
     */
    showOptionsBelowExample?: boolean;

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
        const { children, className, data, html, id, options, showOptionsBelowExample, ...htmlProps } = this.props;
        const classes = classNames(
            "docs-example-frame",
            showOptionsBelowExample ? "docs-example-frame-column" : "docs-example-frame-row",
            className,
        );
        const example =
            html == null ? (
                <div className="docs-example">{children}</div>
            ) : (
                <div className="docs-example" dangerouslySetInnerHTML={{ __html: html }} />
            );

        return (
            <div className={classes} data-example-id={id} {...htmlProps}>
                {example}
                {options && <div className="docs-example-options">{options}</div>}
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
