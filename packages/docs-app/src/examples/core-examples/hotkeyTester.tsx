/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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

import { Code, getKeyComboString, KeyCombo } from "@blueprintjs/core";
import { Example, IExampleProps } from "@blueprintjs/docs-theme";

export interface IHotkeyTesterState {
    combo: string;
}

export class HotkeyTester extends React.PureComponent<IExampleProps, IHotkeyTesterState> {
    public state: IHotkeyTesterState = {
        combo: null,
    };

    public render() {
        return (
            <Example options={false} {...this.props}>
                <div
                    className="docs-hotkey-tester"
                    onKeyDown={this.handleKeyDown}
                    onBlur={this.handleBlur}
                    tabIndex={0}
                >
                    {this.renderKeyCombo()}
                </div>
            </Example>
        );
    }

    private renderKeyCombo(): React.ReactNode {
        const { combo } = this.state;
        if (combo == null) {
            return "Click here then press a key combo";
        } else {
            return (
                <>
                    <KeyCombo combo={combo} />
                    <Code>{combo}</Code>
                </>
            );
        }
    }

    private handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const combo = getKeyComboString(e.nativeEvent as KeyboardEvent);
        this.setState({ combo });
    };

    private handleBlur = () => this.setState({ combo: null });
}
