/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";
import { Classes, IProps } from "../../common";
import { Icon, IconName } from "../icon/icon";
import { normalizeKeyCombo } from "./hotkeyParser";

const KeyIcons: { [key: string]: IconName } = {
    alt: "key-option",
    cmd: "key-command",
    ctrl: "key-control",
    delete: "key-delete",
    down: "arrow-down",
    enter: "key-enter",
    left: "arrow-left",
    meta: "key-command",
    right: "arrow-right",
    shift: "key-shift",
    up: "arrow-up",
};

export interface IKeyComboProps extends IProps {
    /** The key combo to display, such as `"cmd + s"`. */
    combo: string;

    /**
     * Whether to render in a minimal style.
     * If `false`, each key in the combo will be rendered inside a `<kbd>` tag.
     * If `true`, only the icon or short name of a key will be rendered with no wrapper styles.
     * @default false
     */
    minimal?: boolean;
}

export class KeyCombo extends React.Component<IKeyComboProps, {}> {
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
        return icon == null ? (
            <kbd className={Classes.KEY} key={reactKey}>
                {key}
            </kbd>
        ) : (
            <kbd className={classNames(Classes.KEY, Classes.MODIFIER_KEY)} key={reactKey}>
                <Icon icon={icon} /> {key}
            </kbd>
        );
    };

    private renderMinimalKey = (key: string, index: number) => {
        const icon = KeyIcons[key];
        return icon == null ? key : <Icon icon={icon} key={`key-${index}`} />;
    };
}
