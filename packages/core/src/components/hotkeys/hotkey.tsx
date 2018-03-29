/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";

import { AbstractPureComponent, Classes, IProps } from "../../common";
import { KeyCombo } from "./keyCombo";

export interface IHotkeyProps extends IProps {
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

export class Hotkey extends AbstractPureComponent<IHotkeyProps, {}> {
    public static defaultProps = {
        allowInInput: false,
        disabled: false,
        global: false,
        preventDefault: false,
        stopPropagation: false,
    };

    public render() {
        const { label, className, ...spreadableProps } = this.props;

        const rootClasses = classNames(Classes.HOTKEY, className);
        return (
            <div className={rootClasses}>
                <div className={Classes.HOTKEY_LABEL}>{label}</div>
                <KeyCombo {...spreadableProps} />
            </div>
        );
    }

    protected validateProps(props: IHotkeyProps) {
        if (props.global !== true && props.group == null) {
            throw new Error("non-global <Hotkey>s must define a group");
        }
    }
}
