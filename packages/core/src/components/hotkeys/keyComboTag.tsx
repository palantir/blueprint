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

import { AbstractPureComponent, Classes, DISPLAYNAME_PREFIX, type Props } from "../../common";
import { Icon } from "../icon/icon";

import { isMac, normalizeKeyCombo } from "./hotkeyParser";

const KEY_ICONS: Record<string, { icon: React.JSX.Element; iconTitle: string; isMacOnly?: boolean }> = {
    alt: { icon: <KeyOption />, iconTitle: "Alt/Option key", isMacOnly: true },
    arrowdown: { icon: <ArrowDown />, iconTitle: "Down key" },
    arrowleft: { icon: <ArrowLeft />, iconTitle: "Left key" },
    arrowright: { icon: <ArrowRight />, iconTitle: "Right key" },
    arrowup: { icon: <ArrowUp />, iconTitle: "Up key" },
    cmd: { icon: <KeyCommand />, iconTitle: "Command key", isMacOnly: true },
    ctrl: { icon: <KeyControl />, iconTitle: "Control key", isMacOnly: true },
    delete: { icon: <KeyDelete />, iconTitle: "Delete key" },
    enter: { icon: <KeyEnter />, iconTitle: "Enter key" },
    meta: { icon: <KeyCommand />, iconTitle: "Command key", isMacOnly: true },
    shift: { icon: <KeyShift />, iconTitle: "Shift key", isMacOnly: true },
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

interface KeyComboTagInternalProps extends KeyComboTagProps {
    /** Override the oeprating system rendering for internal testing purposes */
    platformOverride?: string;
}

export class KeyComboTagInternal extends AbstractPureComponent<KeyComboTagInternalProps> {
    public static displayName = `${DISPLAYNAME_PREFIX}.KeyComboTag`;

    public render() {
        const { className, combo, minimal, platformOverride } = this.props;
        const normalizedKeys = normalizeKeyCombo(combo, platformOverride);
        const keys = normalizedKeys
            .map(key => (key.length === 1 ? key.toUpperCase() : key))
            .map((key, index) =>
                minimal
                    ? this.renderMinimalKey(key, index, index === normalizedKeys.length - 1)
                    : this.renderKey(key, index),
            );
        return <span className={classNames(Classes.KEY_COMBO, className, { [Classes.MINIMAL]: minimal })}>{keys}</span>;
    }

    private renderKey = (key: string, index: number) => {
        const keyString = DISPLAY_ALIASES[key] ?? key;
        const icon = this.getKeyIcon(key);
        const reactKey = `key-${index}`;
        return (
            <kbd className={classNames(Classes.KEY, { [Classes.MODIFIER_KEY]: icon != null })} key={reactKey}>
                {icon != null && <Icon icon={icon.icon} title={icon.iconTitle} />}
                {keyString}
            </kbd>
        );
    };

    private renderMinimalKey = (key: string, index: number, isLastKey: boolean) => {
        const icon = this.getKeyIcon(key);
        if (icon == null) {
            return isLastKey ? key : <React.Fragment key={`key-${index}`}>{key}&nbsp;+&nbsp;</React.Fragment>;
        }
        return <Icon icon={icon.icon} title={icon.iconTitle} key={`key-${index}`} />;
    };

    private getKeyIcon(key: string) {
        const { platformOverride } = this.props;
        const icon = KEY_ICONS[key];
        if (icon?.isMacOnly && !isMac(platformOverride)) {
            return undefined;
        }
        return icon;
    }
}

export const KeyComboTag: React.ComponentType<KeyComboTagProps> = KeyComboTagInternal;
