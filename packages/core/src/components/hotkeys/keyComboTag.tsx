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

import {
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    ArrowUp,
    KeyCommand,
    KeyControl,
    KeyDelete,
    KeyEnter,
    KeyOption,
    KeyShift,
} from "@blueprintjs/icons";

import { Classes, DISPLAYNAME_PREFIX, type Props } from "../../common";
import { Icon } from "../icon/icon";

import { normalizeKeyCombo } from "./hotkeyParser";

const KEY_ICONS: Record<string, { icon: React.JSX.Element; iconTitle: string }> = {
    ArrowDown: { icon: <ArrowDown />, iconTitle: "Down key" },
    ArrowLeft: { icon: <ArrowLeft />, iconTitle: "Left key" },
    ArrowRight: { icon: <ArrowRight />, iconTitle: "Right key" },
    ArrowUp: { icon: <ArrowUp />, iconTitle: "Up key" },
    alt: { icon: <KeyOption />, iconTitle: "Alt/Option key" },
    cmd: { icon: <KeyCommand />, iconTitle: "Command key" },
    ctrl: { icon: <KeyControl />, iconTitle: "Control key" },
    delete: { icon: <KeyDelete />, iconTitle: "Delete key" },
    enter: { icon: <KeyEnter />, iconTitle: "Enter key" },
    meta: { icon: <KeyCommand />, iconTitle: "Command key" },
    shift: { icon: <KeyShift />, iconTitle: "Shift key" },
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

const KeyComboTag: React.FC<KeyComboTagProps> = ({ className, combo, minimal = false }) => {
    const renderKey = (key: string, index: number) => {
        const keyString = DISPLAY_ALIASES[key] ?? key;
        const icon = KEY_ICONS[key];
        const reactKey = `key-${index}`;
        return (
            <kbd className={classNames(Classes.KEY, { [Classes.MODIFIER_KEY]: !!icon })} key={reactKey}>
                {!!icon && <Icon icon={icon.icon} title={icon.iconTitle} />}
                {keyString}
            </kbd>
        );
    };

    const renderMinimalKey = (key: string, index: number) => {
        const icon = KEY_ICONS[key];
        return !!icon ? <Icon icon={icon.icon} title={icon.iconTitle} key={`key-${index}`} /> : key;
    };

    const keys = normalizeKeyCombo(combo)
        .map(key => (key.length === 1 ? key.toUpperCase() : key))
        .map(minimal ? renderMinimalKey : renderKey);

    return <span className={classNames(Classes.KEY_COMBO, className)}>{keys}</span>;
};

KeyComboTag.displayName = `${DISPLAYNAME_PREFIX}.KeyComboTag`;
