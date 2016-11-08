/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import * as React from "react";
import { ReactElement } from "react";

import { AbstractComponent } from "../../common";
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
                    </kbd>
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

export interface IHotkeyProps {
    /**
     * Hotkey combination string, such as "space" or "cmd+n".
     */
    combo: string;

    /**
     * Human-friendly label for this hotkey.
     */
    label: string;

    /**
     * If `false`, the hotkey is active only when the target is focused. If
     * `true`, the hotkey can be triggered regardless of what component is
     * focused.
     * @default false
     */
    global?: boolean;

    /**
     * Unless the hotkey is global, you must specify a group where the hotkey
     * will be displayed in the hotkeys dialog. This string will be displayed
     * in a header at the start of the group of hotkeys.
     */
    group?: string;

    /**
     * `keydown` event handler
     */
    onKeyDown?(e: KeyboardEvent): any;

    /**
     * `keyup` event handler
     */
    onKeyUp?(e: KeyboardEvent): any;
}

export class Hotkey extends AbstractComponent<IHotkeyProps, {}> {
    public static defaultProps = {
        global: false,
    };

    public static isInstance(element: ReactElement<any>): element is ReactElement<IHotkeyProps> {
        return element.type === Hotkey;
    }

    public render() {
        const { combo, label } = this.props;
        return <div className="pt-hotkey">
            <div className="pt-hotkey-label">{label}</div>
            <KeyCombo combo={combo} />
        </div>;
    }

    protected validateProps(props: IHotkeyProps) {
        if (props.global !== true && props.group == null) {
            throw new Error("non-global <Hotkey>s must define a group");
        }
    }
}
