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
import { Fragment, memo, useCallback } from "react";

import {
    ArrowDownIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
    ArrowUpIcon,
    KeyCommandIcon,
    KeyControlIcon,
    KeyDeleteIcon,
    KeyEnterIcon,
    KeyOptionIcon,
    KeyShiftIcon,
} from "@blueprintjs/icons";

import { Classes, DISPLAYNAME_PREFIX, type Props } from "../../common";
import { Icon } from "../icon/icon";

import { isMac, normalizeKeyCombo } from "./hotkeyParser";

const KEY_ICONS: Record<string, { icon: React.JSX.Element; iconTitle: string; isMacOnly?: boolean }> = {
    alt: { icon: <KeyOptionIcon />, iconTitle: "Alt/Option key", isMacOnly: true },
    arrowdown: { icon: <ArrowDownIcon />, iconTitle: "Down key" },
    arrowleft: { icon: <ArrowLeftIcon />, iconTitle: "Left key" },
    arrowright: { icon: <ArrowRightIcon />, iconTitle: "Right key" },
    arrowup: { icon: <ArrowUpIcon />, iconTitle: "Up key" },
    cmd: { icon: <KeyCommandIcon />, iconTitle: "Command key", isMacOnly: true },
    ctrl: { icon: <KeyControlIcon />, iconTitle: "Control key", isMacOnly: true },
    delete: { icon: <KeyDeleteIcon />, iconTitle: "Delete key" },
    enter: { icon: <KeyEnterIcon />, iconTitle: "Enter key" },
    meta: { icon: <KeyCommandIcon />, iconTitle: "Command key", isMacOnly: true },
    shift: { icon: <KeyShiftIcon />, iconTitle: "Shift key", isMacOnly: true },
};

/** Reverse table of some CONFIG_ALIASES fields, for display by KeyComboTag */
export const DISPLAY_ALIASES: Record<string, string> = {
    arrowdown: "down",
    arrowleft: "left",
    arrowright: "right",
    arrowup: "up",
};

/**
 * Display aliases which only apply on macOS, where some modifier keys are named differently than on
 * other platforms (for example, the `alt` key is labeled "option").
 */
const MAC_DISPLAY_ALIASES: Record<string, string> = {
    alt: "option",
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

export const KeyComboTagInternal: React.FC<KeyComboTagInternalProps> = memo(props => {
    const { className, combo, minimal, platformOverride } = props;

    const getKeyIcon = useCallback(
        (key: string) => {
            const icon = KEY_ICONS[key.toLowerCase()];
            if (icon?.isMacOnly && !isMac(platformOverride)) {
                return undefined;
            }
            return icon;
        },
        [platformOverride],
    );

    const renderKey = useCallback(
        (key: string, index: number) => {
            const lowerKey = key.toLowerCase();
            const keyString =
                (isMac(platformOverride) ? MAC_DISPLAY_ALIASES[lowerKey] : undefined) ??
                DISPLAY_ALIASES[lowerKey] ??
                key;
            const icon = getKeyIcon(key);
            const reactKey = `key-${index}`;
            return (
                <kbd className={classNames(Classes.KEY, { [Classes.MODIFIER_KEY]: icon != null })} key={reactKey}>
                    {icon != null && <Icon icon={icon.icon} title={icon.iconTitle} />}
                    {keyString}
                </kbd>
            );
        },
        [getKeyIcon, platformOverride],
    );

    const renderMinimalKey = useCallback(
        (key: string, index: number, isLastKey: boolean) => {
            const icon = getKeyIcon(key);
            if (icon == null) {
                return isLastKey ? key : <Fragment key={`key-${index}`}>{key}&nbsp;+&nbsp;</Fragment>;
            }
            return <Icon icon={icon.icon} title={icon.iconTitle} key={`key-${index}`} />;
        },
        [getKeyIcon],
    );

    const normalizedKeys = normalizeKeyCombo(combo, platformOverride);
    const keys = normalizedKeys
        .map(key => (key.length === 1 ? key.toUpperCase() : key))
        .map((key, index) =>
            minimal ? renderMinimalKey(key, index, index === normalizedKeys.length - 1) : renderKey(key, index),
        );
    return <span className={classNames(Classes.KEY_COMBO, className, { [Classes.MINIMAL]: minimal })}>{keys}</span>;
});

KeyComboTagInternal.displayName = `${DISPLAYNAME_PREFIX}.KeyComboTag`;

export const KeyComboTag: React.ComponentType<KeyComboTagProps> = KeyComboTagInternal;
