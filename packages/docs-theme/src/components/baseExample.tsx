/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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

import { Utils } from "@blueprintjs/core";
import classNames from "classnames";
import * as React from "react";

export const WARNING_BASE_EXAMPLE_DEPRECATED = `[Blueprint] BaseExample is deprecated and will be removed in the next beta. Compose new Example component instead of extending BaseExample.`;

export interface IBaseExampleProps {
    id: string;
    themeName: string;
}

/**
 * Starter class for all React example components.
 * Examples and options are rendered into separate containers.
 * @deprecated
 */
export class BaseExample<S> extends React.Component<IBaseExampleProps, S> {
    /** Define this prop to add a className to the example container */
    protected className: string;

    // Can't put this in state, because the state typing is generic.
    private hasDelayedBeforeInitialRender = false;
    private hasCompletedInitialRender = false;

    public shouldComponentUpdate(nextProps: IBaseExampleProps, nextState: S & object) {
        return (
            // HACKHACK: Permit one redundant re-render after the inital delay. (This will be the first proper render of
            // the component.)
            (this.hasDelayedBeforeInitialRender && !this.hasCompletedInitialRender) ||
            // Now, mimic PureComponent shouldComponentUpdate behavior:
            !Utils.shallowCompareKeys(this.props, nextProps) ||
            !Utils.shallowCompareKeys(this.state, nextState)
        );
    }

    public componentWillMount() {
        // HACKHACK: The docs app suffers from a Flash of Unstyled Content that causes some 'width: 100%' examples to
        // render incorrectly, because they mis-measure the horizontal space available to them. Until that bug is squashed,
        // this is the workaround: delay initial render with a requestAnimationFrame.
        requestAnimationFrame(() => {
            this.hasDelayedBeforeInitialRender = true;
            this.forceUpdate();
        });
    }

    public componentDidMount() {
        console.warn(WARNING_BASE_EXAMPLE_DEPRECATED);
    }

    public componentDidUpdate(_nextProps: IBaseExampleProps, _nextState: S) {
        // HACKHACK: Initial render happens as an *update* due to our requestAnimationFrame shenanigans, not as a mount.
        // Once we've rendered initially, set this flag so that shouldComponentUpdate logic will return to its normal
        // PureComponent-style logic, ignoring these flags henceforth.
        if (!this.hasCompletedInitialRender) {
            this.hasCompletedInitialRender = true;
        }
    }

    public render() {
        // HACKHACK: This is the other required piece. Don't let any React nodes into the DOM until the
        // requestAnimationFrame delay has elapsed. This prevents shouldComponentUpdate snafus at lower levels.
        if (!this.hasDelayedBeforeInitialRender) {
            return null;
        }
        return (
            <div className={classNames("docs-example-frame", this.className)} data-example-id={this.props.id}>
                <div className="docs-example">{this.renderExample()}</div>
                <div className="docs-example-options">{this.actuallyRenderOptions()}</div>
            </div>
        );
    }

    /**
     * Render the example element. Return any valid React node.
     */
    protected renderExample(): React.ReactNode | undefined {
        return undefined;
    }

    /**
     * Render the options controls. Return a single element for simple mode, or an array of arrays
     * of elements to generate columns: each array will be its own column. When using array mode,
     * the inner elements will each need the `key` prop.
     */
    protected renderOptions(): JSX.Element | JSX.Element[][] {
        return [];
    }

    private actuallyRenderOptions(): JSX.Element | JSX.Element[] {
        const options = this.renderOptions();
        if (Array.isArray(options)) {
            return options.map((column, i) => (
                <div className="docs-react-options-column" key={i}>
                    {column}
                </div>
            ));
        } else {
            return options;
        }
    }
}

/** Event handler that exposes the target element's value as a boolean. */
export function handleBooleanChange(handler: (checked: boolean) => void) {
    return (event: React.FormEvent<HTMLElement>) => handler((event.target as HTMLInputElement).checked);
}

/** Event handler that exposes the target element's value as a string. */
export function handleStringChange(handler: (value: string) => void) {
    return (event: React.FormEvent<HTMLElement>) => handler((event.target as HTMLInputElement).value);
}

/** Event handler that exposes the target element's value as a number. */
export function handleNumberChange(handler: (value: number) => void) {
    return handleStringChange(value => handler(+value));
}
