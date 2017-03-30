/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as React from "react";

import { BaseExample, handleStringChange } from "@blueprintjs/docs";
import * as Classes from "../src/common/classes";
import { Text } from "../src/components/text/text";

export interface ITextExampleState {
    textContent: string;
}

export class TextExample extends BaseExample<ITextExampleState> {

    public state: ITextExampleState = {
        textContent: "You can change the text in the input below. Hover to see full text. " +
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
                <textarea
                    className={classNames(Classes.INPUT, Classes.FILL)}
                    onChange={this.onInputChange}
                    style={{ marginTop: 20 }}
                    value={this.state.textContent}
                />
            </div>
        );
    }
}
