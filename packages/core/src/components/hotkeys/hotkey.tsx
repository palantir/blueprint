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

import classNames from "classnames";
import * as React from "react";

import { AbstractPureComponent, Classes, DISPLAYNAME_PREFIX, type Props } from "../../common";
import type { HotkeyConfig } from "../../hooks";
import { KeyComboTag } from "./keyComboTag";

export type HotkeyProps = Props & HotkeyConfig;

/**
 * Hotkey component used to display a hotkey in the HotkeysDialog.
 * Should not be used by consumers directly.
 */
export class Hotkey extends AbstractPureComponent<HotkeyProps> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Hotkey`;

    public static defaultProps = {
        allowInInput: false,
        disabled: false,
        global: false,
        preventDefault: false,
        stopPropagation: false,
    };

    public render() {
        const { label, className, ...spreadableProps } = this.props;

        const rootClasses = classNames(Classes.HOTKEY, className);
        return (
            <div className={rootClasses}>
                <div className={Classes.HOTKEY_LABEL}>{label}</div>
                <KeyComboTag {...spreadableProps} />
            </div>
        );
    }

    protected validateProps(props: HotkeyProps) {
        if (props.global !== true && props.group == null) {
            console.error("non-global Hotkeys must define a group");
        }
    }
}
