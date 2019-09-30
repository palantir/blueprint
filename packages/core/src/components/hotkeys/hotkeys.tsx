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
import { polyfill } from "react-lifecycles-compat";
import { AbstractPureComponent2, Classes, DISPLAYNAME_PREFIX, IProps } from "../../common";
import { HOTKEYS_HOTKEY_CHILDREN } from "../../common/errors";
import { isElementOfType } from "../../common/utils";
import { H4 } from "../html/html";
import { Hotkey, IHotkeyProps } from "./hotkey";

export { Hotkey, IHotkeyProps } from "./hotkey";
export { KeyCombo, IKeyComboProps } from "./keyCombo";
export { HotkeysTarget, IHotkeysTargetComponent } from "./hotkeysTarget";
export { IKeyCombo, comboMatches, getKeyCombo, getKeyComboString, parseKeyCombo } from "./hotkeyParser";
export { IHotkeysDialogProps, hideHotkeysDialog, setHotkeysDialogProps } from "./hotkeysDialog";

export interface IHotkeysProps extends IProps {
    /**
     * In order to make local hotkeys work on elements that are not normally
     * focusable, such as `<div>`s or `<span>`s, we add a `tabIndex` attribute
     * to the hotkey target, which makes it focusable. By default, we use `0`,
     * but you can override this value to change the tab navigation behavior
     * of the component. You may even set this value to `null`, which will omit
     * the `tabIndex` from the component decorated by `HotkeysTarget`.
     */
    tabIndex?: number;
}

@polyfill
export class Hotkeys extends AbstractPureComponent2<IHotkeysProps, {}, {}> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Hotkeys`;

    public static defaultProps = {
        tabIndex: 0,
    };

    public render() {
        const hotkeys = React.Children.map(
            this.props.children,
            (child: React.ReactElement<IHotkeyProps>) => child.props,
        );

        // sort by group label alphabetically, prioritize globals
        hotkeys.sort((a, b) => {
            if (a.global === b.global) {
                return a.group.localeCompare(b.group);
            }
            return a.global ? -1 : 1;
        });

        let lastGroup = null as string;
        const elems = [] as JSX.Element[];
        for (const hotkey of hotkeys) {
            const groupLabel = hotkey.group;
            if (groupLabel !== lastGroup) {
                elems.push(<H4 key={`group-${elems.length}`}>{groupLabel}</H4>);
                lastGroup = groupLabel;
            }
            elems.push(<Hotkey key={elems.length} {...hotkey} />);
        }
        const rootClasses = classNames(Classes.HOTKEY_COLUMN, this.props.className);
        return <div className={rootClasses}>{elems}</div>;
    }

    protected validateProps(props: IHotkeysProps & { children: React.ReactNode }) {
        React.Children.forEach(props.children, (child: JSX.Element) => {
            if (!isElementOfType(child, Hotkey)) {
                throw new Error(HOTKEYS_HOTKEY_CHILDREN);
            }
        });
    }
}
