/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as classNames from "classnames";
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
    preventDefault?: boolean;
    stopPropagation?: boolean;
}

export class KeyCombo extends React.Component<IKeyComboProps, {}> {
    public render() {
        const keys = normalizeKeyCombo(this.props.combo);
        const components = [] as JSX.Element[];
        const rootClasses = classNames("pt-key-combo", this.props.className);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            const icon = KeyIcons[key];
            if (icon != null) {
                components.push(
                    <kbd className="pt-key pt-modifier-key" key={`key-${i}`}>
                        <Icon icon={icon} /> {key}
                    </kbd>,
                );
            } else {
                if (key.length === 1) {
                    key = key.toUpperCase();
                }
                components.push(
                    <kbd className="pt-key" key={`key-${i}`}>
                        {key}
                    </kbd>,
                );
            }
        }
        return <span className={rootClasses}>{components}</span>;
    }
}
