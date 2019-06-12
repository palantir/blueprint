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

import { IProps } from "@blueprintjs/core";
import classNames from "classnames";
import * as React from "react";

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

    /**
     * Whether `forceUpdate()` should be invoked after the first render to
     * ensure correct DOM sizing.
     * @default true
     */
    forceUpdate?: boolean;
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
    public static defaultProps: Partial<IDocsExampleProps> = {
        forceUpdate: true,
        showOptionsBelowExample: false,
    };

    private hasDelayedInitialRender = false;

    public render() {
        const {
            children,
            className,
            data,
            forceUpdate,
            html,
            id,
            options,
            showOptionsBelowExample,
            // spread any additional props through to the root element,
            // to support decorators that expect DOM props.
            ...htmlProps
        } = this.props;

        // `forceUpdate` -  Don't let any React nodes into the DOM until the
        // `requestAnimationFrame` delay has elapsed.
        if (forceUpdate && !this.hasDelayedInitialRender) {
            return null;
        }

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
        // `forceUpdate` - The docs app suffers from a Flash of Unstyled Content
        // that causes components to mis-measure themselves on first render.
        // Delay initial render till the DOM loads with a requestAnimationFrame.
        if (this.props.forceUpdate) {
            requestAnimationFrame(() => {
                this.hasDelayedInitialRender = true;
                this.forceUpdate();
            });
        }
    }
}
