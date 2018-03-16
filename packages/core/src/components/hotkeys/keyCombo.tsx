/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";
import { IProps } from "../../common";
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
    allowInInput?: boolean;
    combo: string;
    disabled?: boolean;
    minimal?: boolean;
    preventDefault?: boolean;
    stopPropagation?: boolean;
}

export class KeyCombo extends React.Component<IKeyComboProps, {}> {
    public render() {
        const keys = normalizeKeyCombo(this.props.combo).map(this.renderKey);
        const rootClasses = classNames("pt-key-combo", this.props.className);
        return <span className={rootClasses}>{keys}</span>;
    }

    private renderKey = (key: string, index: number) => {
        const { minimal } = this.props;
        const icon = KeyIcons[key];
        const reactKey = `key-${index}`;
        if (icon != null) {
            return minimal ? (
                <Icon icon={icon} key={reactKey} />
            ) : (
                <kbd className="pt-key pt-modifier-key" key={reactKey}>
                    <Icon icon={icon} /> {key}
                </kbd>
            );
        } else {
            if (key.length === 1) {
                key = key.toUpperCase();
            }
            return minimal ? (
                key
            ) : (
                <kbd className="pt-key" key={reactKey}>
                    {key}
                </kbd>
            );
        }
    };
}
