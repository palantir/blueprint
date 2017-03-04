/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as React from "react";

import * as Classes from "../src/common/classes";
import { OverflowEllipsis } from "../src/components/overflow-ellipsis/overflowEllipsis";
import BaseExample from "./common/baseExample";
import { handleStringChange } from "./common/baseExample";

export interface IOverflowEllipsisExampleState {
    textContent: string;
}

export class OverflowEllipsisExample extends BaseExample<IOverflowEllipsisExampleState> {

    public state: IOverflowEllipsisExampleState = {
        textContent: "You can change the text in the input below. Hover to see full text. " +
                 "If the text is long enough, then the content will overflow",
    };

    private onInputChange = handleStringChange((value: string) => {
        this.setState({ textContent: value });
    });

    protected renderExample() {
        return (
            <div style={{ maxWidth: "100%" }}>
                <OverflowEllipsis>
                    {this.state.textContent}
                    &nbsp;
                </OverflowEllipsis>
                <input className={Classes.INPUT} onChange={this.onInputChange} value={this.state.textContent} />
            </div>
        );
    }
}
