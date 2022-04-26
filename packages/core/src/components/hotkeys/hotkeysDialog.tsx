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
import * as ReactDOM from "react-dom";

import { Classes } from "../../common";
import { Dialog, DialogProps } from "../../components";
import { Hotkey, IHotkeyProps } from "./hotkey";
import { Hotkeys } from "./hotkeys";

export interface IHotkeysDialogProps extends DialogProps {
    /**
     * This string displayed as the group name in the hotkeys dialog for all
     * global hotkeys.
     */
    globalHotkeysGroup?: string;
}

/**
 * The delay before showing or hiding the dialog. Should be long enough to
 * allow all registered hotkey listeners to execute first.
 */
const DELAY_IN_MS = 10;

class HotkeysDialog {
    public componentProps = {
        globalHotkeysGroup: "Global hotkeys",
    } as any as IHotkeysDialogProps;

    private container: HTMLElement | null = null;

    private hotkeysQueue = [] as IHotkeyProps[][];

    private isDialogShowing = false;

    private showTimeoutToken?: number;

    private hideTimeoutToken?: number;

    public render() {
        if (this.container == null) {
            this.container = this.getContainer();
        }
        ReactDOM.render(this.renderComponent(), this.container);
    }

    public unmount() {
        if (this.container != null) {
            ReactDOM.unmountComponentAtNode(this.container);
            this.container.remove();
            this.container = null;
        }
    }

    /**
     * Because hotkeys can be registered globally and locally and because
     * event ordering cannot be guaranteed, we use this debouncing method to
     * allow all hotkey listeners to fire and add their hotkeys to the dialog.
     *
     * 10msec after the last listener adds their hotkeys, we render the dialog
     * and clear the queue.
     */
    public enqueueHotkeysForDisplay(hotkeys: IHotkeyProps[]) {
        this.hotkeysQueue.push(hotkeys);

        // reset timeout for debounce
        window.clearTimeout(this.showTimeoutToken);
        this.showTimeoutToken = window.setTimeout(this.show, DELAY_IN_MS);
    }

    public hideAfterDelay() {
        window.clearTimeout(this.hideTimeoutToken);
        this.hideTimeoutToken = window.setTimeout(this.hide, DELAY_IN_MS);
    }

    public show = () => {
        this.isDialogShowing = true;
        this.render();
    };

    public hide = () => {
        this.isDialogShowing = false;
        this.render();
    };

    public isShowing() {
        return this.isDialogShowing;
    }

    private getContainer() {
        if (this.container == null) {
            this.container = document.createElement("div");
            this.container.classList.add(Classes.PORTAL);
            document.body.appendChild(this.container);
        }
        return this.container;
    }

    private renderComponent() {
        return (
            <Dialog
                {...this.componentProps}
                className={classNames(Classes.HOTKEY_DIALOG, this.componentProps.className)}
                isOpen={this.isDialogShowing}
                onClose={this.hide}
            >
                <div className={Classes.DIALOG_BODY}>{this.renderHotkeys()}</div>
            </Dialog>
        );
    }

    private renderHotkeys() {
        const hotkeys = this.emptyHotkeyQueue();
        const elements = hotkeys.map((hotkey, index) => {
            const group =
                hotkey.global === true && hotkey.group == null ? this.componentProps.globalHotkeysGroup : hotkey.group;

            return <Hotkey key={index} {...hotkey} group={group} />;
        });

        return <Hotkeys>{elements}</Hotkeys>;
    }

    private emptyHotkeyQueue() {
        // flatten then empty the hotkeys queue
        const hotkeys = this.hotkeysQueue.reduce((arr, queued) => arr.concat(queued), []);
        this.hotkeysQueue.length = 0;
        return hotkeys;
    }
}

// singleton instance
const HOTKEYS_DIALOG = new HotkeysDialog();

export function isHotkeysDialogShowing() {
    return HOTKEYS_DIALOG.isShowing();
}

export function setHotkeysDialogProps(props: Partial<IHotkeysDialogProps>) {
    for (const key in props) {
        if (props.hasOwnProperty(key)) {
            (HOTKEYS_DIALOG.componentProps as any)[key] = (props as any)[key];
        }
    }
}

export function showHotkeysDialog(hotkeys: IHotkeyProps[]) {
    HOTKEYS_DIALOG.enqueueHotkeysForDisplay(hotkeys);
}

export function hideHotkeysDialog() {
    HOTKEYS_DIALOG.hide();
}

/**
 * Use this function instead of `hideHotkeysDialog` if you need to ensure that all hotkey listeners
 * have time to execute with the dialog in a consistent open state. This can avoid flickering the
 * dialog between open and closed states as successive listeners fire.
 */
export function hideHotkeysDialogAfterDelay() {
    HOTKEYS_DIALOG.hideAfterDelay();
}
