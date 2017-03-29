/*
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as React from "react";

export interface IBaseExampleProps {
    getTheme: () => string;
    id: string;
}

/**
 * Starter class for all React example components.
 * Examples and options are rendered into separate containers.
 */
export default class BaseExample<S> extends React.PureComponent<IBaseExampleProps, S> {
    /** Define this prop to add a className to the example container */
    protected className: string;

    public render() {
        return (
            <div className={classNames("docs-example", this.className)} data-example-id={this.props.id}>
                <div className="docs-react-example">{this.renderExample()}</div>
                <div className="docs-react-options">{this.actuallyRenderOptions()}</div>
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
