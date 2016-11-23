/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as React from "react";
import * as ReactDOM from "react-dom";

import { Classes } from "../../common";
import { Dialog, IDialogProps } from "../../components";
import { Hotkey, IHotkeyProps } from "./hotkey";
import { Hotkeys } from "./hotkeys";

export interface IHotkeysDialogProps extends IDialogProps {
    /**
     * This string displayed as the group name in the hotkeys dialog for all
     * global hotkeys.
     */
    globalHotkeysGroup?: string;
}

class HotkeysDialog {
    public hotkeysDialogProps = {
        globalHotkeysGroup: "Global hotkeys",
    } as any as IHotkeysDialogProps;
    public showing = false;
    private hotkeysQueue = [] as IHotkeyProps[][];
    private timeoutToken = 0;
    private container: HTMLElement;

    public render(node: React.ReactElement<any>) {
        return ReactDOM.render(node, this.getContainer());
    }

    public unmount = () => {
        this.showing = false;
        return ReactDOM.unmountComponentAtNode(this.getContainer());
    }

    public destroy = () => {
        this.showing = false;
        if (this.container != null) {
            ReactDOM.unmountComponentAtNode(this.container);
            this.container.remove();
            delete this.container;
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
        clearTimeout(this.timeoutToken);
        this.timeoutToken = setTimeout(this.renderHotkeysDialog, 10);
    }

    private getContainer() {
        if (this.container == null) {
            this.container = document.createElement("div");
            this.container.classList.add(Classes.PORTAL);
            document.body.appendChild(this.container);
        }
        return this.container;
    }

    private renderHotkeysDialog = () => {
        this.showing = true;
        this.render(
            <Dialog
                {...this.hotkeysDialogProps}
                className={classNames(this.hotkeysDialogProps.className, "pt-hotkey-dialog")}
                inline
                isOpen
                onClose={this.unmount}
            >
                <div className={Classes.DIALOG_BODY}>{this.renderHotkeys()}</div>
            </Dialog>,
        );
    }

    private renderHotkeys() {
        const hotkeys = this.emptyHotkeyQueue();
        const elements = hotkeys.map((hotkey, index) => {
            const group = (hotkey.global === true && hotkey.group == null) ?
                this.hotkeysDialogProps.globalHotkeysGroup : hotkey.group;

            return <Hotkey key={index} {...hotkey} group={group} />;
        });

        return <Hotkeys>{elements}</Hotkeys>;
    }

    private emptyHotkeyQueue() {
        // flatten then empty the hotkeys queue
        const hotkeys = this.hotkeysQueue.reduce(((arr, queued) => arr.concat(queued)), []);
        this.hotkeysQueue.length = 0;
        return hotkeys;
    }
}

// singleton instance
const HOTKEYS_DIALOG = new HotkeysDialog();

export function isHotkeysDialogShowing() {
    return HOTKEYS_DIALOG.showing;
}

export function setHotkeysDialogProps(props: IHotkeysDialogProps) {
    for (const key in props) {
        if (props.hasOwnProperty(key)) {
            (HOTKEYS_DIALOG.hotkeysDialogProps as any)[key] = (props as any)[key];
        }
    }
}

export function showHotkeysDialog(hotkeys: IHotkeyProps[]) {
    HOTKEYS_DIALOG.enqueueHotkeysForDisplay(hotkeys);
}

export function hideHotkeysDialog() {
    HOTKEYS_DIALOG.unmount();
}
