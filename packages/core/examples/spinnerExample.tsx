/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as React from "react";

import { Classes, Spinner } from "../src";
import { handleStringChange } from "./common/baseExample";
import { ProgressExample } from "./progressExample";

const SIZES = [
    { label: "Default", value: "" },
    { label: "Small", value: Classes.SMALL },
    { label: "Large", value: Classes.LARGE },
];

export class SpinnerExample extends ProgressExample {
    private handleSizeChange = handleStringChange((className) => this.setState({ className }));

    protected renderExample() {
        const {className, hasValue, intent, value} = this.state;
        return <Spinner className={className} intent={intent} value={hasValue ? value : null} />;
    }

    protected renderOptions() {
        const options = super.renderOptions();
        options[0].push(
            <label className={Classes.LABEL} key="size">
                Size (via <code>className</code>)
                <div className={Classes.SELECT}>
                    <select value={this.state.className} onChange={this.handleSizeChange}>
                        {SIZES.map((opt, i) => <option key={i} {...opt}>{opt.label}</option>)}
                    </select>
                </div>
            </label>
        );
        return options;
    }
}
