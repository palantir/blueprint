/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as React from "react";
import { ReactElement } from "react";

import { AbstractComponent } from "../../common";
import { PlatformType } from "../../common/platformType";
import { KeyCombo } from "./keyCombo";

export interface IHotkeyProps {
    /**
     * Whether the hotkey should be triggerable when focused in a text input.
     * @default false
     */
    allowInInput?: boolean;

    /**
     * Hotkey combination string, such as "space" or "cmd+n".
     */
    combo: string;

    /**
     * Whether the hotkey cannot be triggered.
     * @default false
     */
    disabled?: boolean;

    /**
     * Human-friendly label for the hotkey.
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
     * The platform type on which the application is running. This informs how keys will be named
     * within the hotkey dialog. For example, on `PlatformType.MAC`, the hotkey dialog will refer to
     * the "meta" key as <kbd>Cmd</kbd>, while on Windows, the hotkey dialog will refer to the
     * "meta" key as <kbd>Ctrl</kbd>.
     */

    platformType?: PlatformType;

    /**
     * When `true`, invokes `event.preventDefault()` before the respective `onKeyDown` and
     * `onKeyUp` callbacks are invoked. Enabling this can simplify handler implementations.
     * @default false
     */
    preventDefault?: boolean;

    /**
     * When `true`, invokes `event.stopPropagation()` before the respective `onKeyDown` and
     * `onKeyUp` callbacks are invoked. Enabling this can simplify handler implementations.
     * @default false
     */
    stopPropagation?: boolean;

    /**
     * `keydown` event handler.
     */
    onKeyDown?(e: KeyboardEvent): any;

    /**
     * `keyup` event handler.
     */
    onKeyUp?(e: KeyboardEvent): any;
}

export class Hotkey extends AbstractComponent<IHotkeyProps, {}> {
    public static defaultProps = {
        allowInInput: false,
        disabled: false,
        global: false,
        preventDefault: false,
        stopPropagation: false,
    };

    public static isInstance(element: any): element is ReactElement<IHotkeyProps> {
        return element != null && (element as JSX.Element).type === Hotkey;
    }

    public render() {
        const { label, ...spreadableProps } = this.props;
        return <div className="pt-hotkey">
            <div className="pt-hotkey-label">{label}</div>
            <KeyCombo {...spreadableProps} />
        </div>;
    }

    protected validateProps(props: IHotkeyProps) {
        if (props.global !== true && props.group == null) {
            throw new Error("non-global <Hotkey>s must define a group");
        }
    }
}
