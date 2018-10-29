/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Text, TextArea } from "@blueprintjs/core";
import { Example, handleStringChange, IExampleProps } from "@blueprintjs/docs-theme";

export interface ITextExampleState {
    textContent: string;
}

export class TextExample extends React.PureComponent<IExampleProps, ITextExampleState> {
    public state: ITextExampleState = {
        textContent:
            "You can change the text in the input below. Hover to see full text. " +
            "If the text is long enough, then the content will overflow. This is done by setting " +
            "ellipsize to true.",
    };

    private onInputChange = handleStringChange((textContent: string) => this.setState({ textContent }));

    public render() {
        return (
            <Example options={false} {...this.props}>
                <Text ellipsize={true}>
                    {this.state.textContent}
                    &nbsp;
                </Text>
                <TextArea fill={true} onChange={this.onInputChange} value={this.state.textContent} />
            </Example>
        );
    }
}
