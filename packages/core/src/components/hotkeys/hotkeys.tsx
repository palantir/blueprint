/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { Children, ReactElement } from "react";
import * as React from "react";
import { AbstractComponent, IProps } from "../../common";

import { Hotkey, IHotkeyProps } from "./hotkey";

export { Hotkey, IHotkeyProps } from "./hotkey";
export { KeyCombo, IKeyComboProps } from "./keyCombo";
export { HotkeysTarget, IHotkeysTarget } from "./hotkeysTarget";
export { IKeyCombo, comboMatches, getKeyCombo, getKeyComboString, parseKeyCombo } from "./hotkeyParser";
export { IHotkeysDialogProps, hideHotkeysDialog, setHotkeysDialogProps } from "./hotkeysDialog";

export interface IHotkeysProps extends IProps {
    /**
     * In order to make local hotkeys work on elements that are not normally
     * focusable, such as `<div>`s or `<span>`s, we add a `tabIndex` attribute
     * to the hotkey target, which makes it focusable. By default, we use `0`,
     * but you can override this value to change the tab navigation behavior
     * of the component. You may even set this value to `null`, which will omit
     * the tabIndex from the component decorated by `HotkeysTarget`.
     */
    tabIndex?: number;
}

export class Hotkeys extends AbstractComponent<IHotkeysProps, {}> {
    public static defaultProps = {
        tabIndex: 0,
    };

    public render() {
        const hotkeys = Children.map(this.props.children, (child: ReactElement<IHotkeyProps>) => child.props);

        // sort by group label alphabetically, globals first
        hotkeys.sort((a, b) => {
            if (a.global) { return b.global ? 0 : -1; }
            if (b.global) { return 1; }
            return a.group.localeCompare(b.group);
        });

        let lastGroup = null as string;
        const elems = [] as JSX.Element[];
        for (const hotkey of hotkeys) {
            const groupLabel = hotkey.group;
            if (groupLabel !== lastGroup) {
                elems.push(<h4 key={`group-${elems.length}`} className="pt-hotkey-group">{groupLabel}</h4>);
                lastGroup = groupLabel;
            }
            elems.push(<Hotkey key={elems.length} {...hotkey} />);
        }

        return <div className="pt-hotkey-column">{elems}</div>;
    }

    protected validateProps(props: IHotkeysProps & { children: React.ReactNode }) {
        Children.forEach(props.children, (child) => {
            if (typeof child !== "object" || !Hotkey.isInstance(child)) {
                throw new Error("Hotkeys only accepts <Hotkey> children");
            }
        });
    }
}
