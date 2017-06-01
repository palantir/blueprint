/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as React from "react";

import { BaseExample, handleStringChange } from "@blueprintjs/docs";
import { Classes, ClipboardTextInput } from "@blueprintjs/core";

export interface IClipboardTextInputExampleState {
    textContent: string;
}

export class ClipboardTextInputExample extends BaseExample<IClipboardTextInputExampleState> {

    public state: IClipboardTextInputExampleState = {
        textContent: "You can change the text in the input below.",
    };

    private onInputChange = handleStringChange((textContent: string) => this.setState({ textContent }));

    protected renderExample() {
        return (
            <div style={{ width: "100%" }}>
                <ClipboardTextInput
                    contents={this.state.textContent}
                    contentDescription="test"
                />
				<input
				     className={Classes.INPUT}
	    			 onChange={this.onInputChange}
	    			 style={{ marginTop: 20 }}
	    			 value={this.state.textContent}
				/>
            </div>
        );
    }
}
