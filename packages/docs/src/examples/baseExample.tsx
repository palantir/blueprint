/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import * as PureRender from "pure-render-decorator";
import * as React from "react";

/**
 * Starter class for all React example components.
 * Examples and options are rendered into separate containers.
 */
@PureRender
export default class BaseExample<S> extends React.Component<void, S> {
    /** Define this prop to add a className to the example container */
    protected className: string;

    public render() {
        return (
            <div className={this.className}>
                <div className="docs-react-example">{this.renderExample()}</div>
                <div className="docs-react-options">{this.actuallyRenderOptions()}</div>
            </div>
        );
    }

    /**
     * Render the example element. Return any valid React node.
     */
    protected renderExample(): React.ReactNode {
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
            return options.map((column, i) => <div className="docs-react-options-column" key={i}>{column}</div>);
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
    return handleStringChange((value) => handler(+value));
}
