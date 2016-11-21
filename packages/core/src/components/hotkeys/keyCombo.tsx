/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import * as React from "react";
import { normalizeKeyCombo } from "./hotkeyParser";

const KeyIcons = {
    alt: "pt-icon-key-option",
    ctrl: "pt-icon-key-control",
    delete: "pt-icon-key-delete",
    down: "pt-icon-arrow-down",
    enter: "pt-icon-key-enter",
    left: "pt-icon-arrow-left",
    meta: "pt-icon-key-command",
    right: "pt-icon-arrow-right",
    shift: "pt-icon-key-shift",
    up: "pt-icon-arrow-up",
} as {[key: string]: string};

export interface IKeyComboProps {
    combo: string;
}

export class KeyCombo extends React.Component<IKeyComboProps, {}> {
    public render() {
        const keys = normalizeKeyCombo(this.props.combo);
        const components = [] as JSX.Element[];
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            const icon = KeyIcons[key];
            if (icon != null) {
                components.push(
                    <kbd className="pt-key pt-modifier-key" key={`key-${i}`}>
                        <span className={`pt-icon-standard ${icon}`} />
                        {key}
                    </kbd>,
                );
            } else {
                if (key.length === 1) {
                    key = key.toUpperCase();
                }
                components.push(<kbd className="pt-key" key={`key-${i}`}>{key}</kbd>);
            }
        }
        return <div className="pt-key-combo">{components}</div>;
    }
}
