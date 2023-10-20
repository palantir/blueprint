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
import { Icon, type IconName } from "../icon/icon";
import { normalizeKeyCombo } from "./hotkeyParser";

const KEY_ICONS: Record<string, { icon: IconName; iconTitle: string }> = {
    ArrowDown: { icon: "arrow-down", iconTitle: "Down key" },
    ArrowLeft: { icon: "arrow-left", iconTitle: "Left key" },
    ArrowRight: { icon: "arrow-right", iconTitle: "Right key" },
    ArrowUp: { icon: "arrow-up", iconTitle: "Up key" },
    alt: { icon: "key-option", iconTitle: "Alt/Option key" },
    cmd: { icon: "key-command", iconTitle: "Command key" },
    ctrl: { icon: "key-control", iconTitle: "Control key" },
    delete: { icon: "key-delete", iconTitle: "Delete key" },
    enter: { icon: "key-enter", iconTitle: "Enter key" },
    meta: { icon: "key-command", iconTitle: "Command key" },
    shift: { icon: "key-shift", iconTitle: "Shift key" },
};

/** Reverse table of some CONFIG_ALIASES fields, for display by KeyComboTag */
export const DISPLAY_ALIASES: Record<string, string> = {
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right",
    ArrowUp: "up",
};

export interface KeyComboTagProps extends Props {
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

export class KeyComboTag extends AbstractPureComponent<KeyComboTagProps> {
    public static displayName = `${DISPLAYNAME_PREFIX}.KeyComboTag`;

    public render() {
        const { className, combo, minimal } = this.props;
        const keys = normalizeKeyCombo(combo)
            .map(key => (key.length === 1 ? key.toUpperCase() : key))
            .map(minimal ? this.renderMinimalKey : this.renderKey);
        return <span className={classNames(Classes.KEY_COMBO, className)}>{keys}</span>;
    }

    private renderKey = (key: string, index: number) => {
        const keyString = DISPLAY_ALIASES[key] ?? key;
        const icon = KEY_ICONS[key];
        const reactKey = `key-${index}`;
        return (
            <kbd className={classNames(Classes.KEY, { [Classes.MODIFIER_KEY]: icon != null })} key={reactKey}>
                {icon != null && <Icon icon={icon.icon} title={icon.iconTitle} />}
                {keyString}
            </kbd>
        );
    };

    private renderMinimalKey = (key: string, index: number) => {
        const icon = KEY_ICONS[key];
        return icon == null ? key : <Icon icon={icon.icon} title={icon.iconTitle} key={`key-${index}`} />;
    };
}
