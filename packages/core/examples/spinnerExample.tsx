/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
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

import * as React from "react";

import { Classes, Spinner } from "@blueprintjs/core";
import { handleStringChange } from "@blueprintjs/docs";
import { ProgressExample } from "./progressExample";

const SIZES = [
    { label: "Default", value: "" },
    { label: "Small", value: Classes.SMALL },
    { label: "Large", value: Classes.LARGE },
];

export class SpinnerExample extends ProgressExample {
    private handleSizeChange = handleStringChange(className => this.setState({ className }));

    protected renderExample() {
        const { className, hasValue, intent, value } = this.state;
        return <Spinner className={className} intent={intent} value={hasValue ? value : null} />;
    }

    protected renderOptions() {
        const options = super.renderOptions();
        options[0].push(
            <label className={Classes.LABEL} key="size">
                Size (via <code>className</code>)
                <div className={Classes.SELECT}>
                    <select value={this.state.className} onChange={this.handleSizeChange}>
                        {SIZES.map((opt, i) => (
                            <option key={i} {...opt}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
            </label>,
        );
        return options;
    }
}
