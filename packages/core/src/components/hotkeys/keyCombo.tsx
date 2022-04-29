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

import { AbstractPureComponent2, Classes, DISPLAYNAME_PREFIX, Props } from "../../common";
import { Icon, IconName } from "../icon/icon";
import { normalizeKeyCombo } from "./hotkeyParser";

const KeyIcons: { [key: string]: { icon: IconName; iconTitle: string } } = {
    alt: { icon: "key-option", iconTitle: "Alt/Option key" },
    cmd: { icon: "key-command", iconTitle: "Command key" },
    ctrl: { icon: "key-control", iconTitle: "Control key" },
    delete: { icon: "key-delete", iconTitle: "Delete key" },
    down: { icon: "arrow-down", iconTitle: "Down key" },
    enter: { icon: "key-enter", iconTitle: "Enter key" },
    left: { icon: "arrow-left", iconTitle: "Left key" },
    meta: { icon: "key-command", iconTitle: "Command key" },
    right: { icon: "arrow-right", iconTitle: "Right key" },
    shift: { icon: "key-shift", iconTitle: "Shift key" },
    up: { icon: "arrow-up", iconTitle: "Up key" },
};

// eslint-disable-next-line deprecation/deprecation
export type KeyComboTagProps = IKeyComboProps;
/** @deprecated use KeyComboTagProps */
export interface IKeyComboProps extends Props {
    /** The key combo to display, such as `"cmd + s"`. */
    combo: string;

    /**
     * Whether to render in a minimal style.
     * If `false`, each key in the combo will be rendered inside a `<kbd>` tag.
     * If `true`, only the icon or short name of a key will be rendered with no wrapper styles.
     *
     * @default false
     */
    minimal?: boolean;
}

export class KeyCombo extends AbstractPureComponent2<KeyComboTagProps> {
    public static displayName = `${DISPLAYNAME_PREFIX}.KeyCombo`;

    public render() {
        const { className, combo, minimal } = this.props;
        const keys = normalizeKeyCombo(combo)
            .map(key => (key.length === 1 ? key.toUpperCase() : key))
            .map(minimal ? this.renderMinimalKey : this.renderKey);
        return <span className={classNames(Classes.KEY_COMBO, className)}>{keys}</span>;
    }

    private renderKey = (key: string, index: number) => {
        const icon = KeyIcons[key];
        const reactKey = `key-${index}`;
        return (
            <kbd className={classNames(Classes.KEY, { [Classes.MODIFIER_KEY]: icon != null })} key={reactKey}>
                {icon != null && <Icon icon={icon.icon} title={icon.iconTitle} />}
                {key}
            </kbd>
        );
    };

    private renderMinimalKey = (key: string, index: number) => {
        const icon = KeyIcons[key];
        return icon == null ? key : <Icon icon={icon.icon} title={icon.iconTitle} key={`key-${index}`} />;
    };
}
