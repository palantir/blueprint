/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Text, TextArea } from "@blueprintjs/core";
import { BaseExample, handleStringChange } from "@blueprintjs/docs-theme";

export interface ITextExampleState {
    textContent: string;
}

export class TextExample extends BaseExample<ITextExampleState> {
    public state: ITextExampleState = {
        textContent:
            "You can change the text in the input below. Hover to see full text. " +
            "If the text is long enough, then the content will overflow. This is done by setting " +
            "ellipsize to true.",
    };

    private onInputChange = handleStringChange((textContent: string) => this.setState({ textContent }));

    protected renderExample() {
        return (
            <div style={{ width: "100%" }}>
                <Text ellipsize={true}>
                    {this.state.textContent}
                    &nbsp;
                </Text>
                <TextArea
                    fill={true}
                    onChange={this.onInputChange}
                    style={{ marginTop: 20 }}
                    value={this.state.textContent}
                />
            </div>
        );
    }
}
