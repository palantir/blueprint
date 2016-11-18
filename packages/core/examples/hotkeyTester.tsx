/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as React from "react";

import { KeyCombo, getKeyComboString } from "../src";
import BaseExample from "./common/baseExample";

export interface IHotkeyTesterState {
    combo: string;
}

export class HotkeyTester extends BaseExample<IHotkeyTesterState> {
    public state: IHotkeyTesterState = { combo: null };

    protected renderExample() {
        return <div
            className="hotkey-tester-example"
            onKeyDown={this.handleKeyDown}
            tabIndex={0}
        >
            {this.renderKeyCombo()}
        </div>;
    }

    private renderKeyCombo(): React.ReactNode {
        const { combo } = this.state;
        if (combo == null) {
            return "Click here then press a key combo";
        } else {
            return <div><KeyCombo combo={combo} /> or <code>{combo}</code></div>;
        }
    }

    private handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const combo = getKeyComboString(e.nativeEvent as KeyboardEvent);
        this.setState({ combo });
    }
}
