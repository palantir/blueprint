/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import * as React from "react";
import * as ReactDOM from "react-dom";

import * as Classes from "../../common/classes";
import { Position } from "../../common/position";
import { safeInvoke } from "../../common/utils";
import { Popover } from "../popover/popover";

export interface IOffset {
    left: number;
    top: number;
}

interface IContextMenuState {
    isOpen?: boolean;
    menu?: JSX.Element;
    offset?: IOffset;
    onClose?: () => void;
}

const CONSTRAINTS = [ { attachment: "together", pin: true, to: "window" } ];
const TRANSITION_DURATION = 100;

class ContextMenu extends React.Component<{}, IContextMenuState> {
    public state: IContextMenuState = {
        isOpen: false,
    };

    public render() {
        // prevent right-clicking in a context menu
        const content = <div onContextMenu={this.cancelContextMenu}>{this.state.menu}</div>;
        return (
            <Popover
                backdropProps={{ onContextMenu: this.handleBackdropContextMenu }}
                constraints={CONSTRAINTS}
                content={content}
                enforceFocus={false}
                isModal={true}
                isOpen={this.state.isOpen}
                onInteraction={this.handlePopoverInteraction}
                position={Position.RIGHT_TOP}
                popoverClassName={Classes.MINIMAL}
                useSmartArrowPositioning={false}
                transitionDuration={TRANSITION_DURATION}
            >
                <div className={Classes.CONTEXT_MENU_POPOVER_TARGET} style={this.state.offset} />
            </Popover>
        );
    }

    public show(menu: JSX.Element, offset: IOffset, onClose?: () => void) {
        this.setState({ isOpen: true, menu, offset, onClose });
    }

    public hide() {
        const { onClose } = this.state;
        this.setState({ isOpen: false, onClose: null });
        safeInvoke(onClose);
    }

    private cancelContextMenu = (e: React.SyntheticEvent<HTMLDivElement>) => e.preventDefault();

    private handleBackdropContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
        // HACKHACK: React function to remove from the event pool (not sure why it's not in typings #66)
        (e as any).persist();
        e.preventDefault();
        // wait for backdrop to disappear so we can find the "real" element at event coordinates.
        // timeout duration is equivalent to transition duration so we know it's animated out.
        setTimeout(() => {
            // retrigger context menu event at the element beneath the backdrop.
            // if it has a `contextmenu` event handler then it'll be invoked.
            // if it doesn't, no native menu will show (at least on OSX) :(
            const newTarget = document.elementFromPoint(e.clientX, e.clientY);
            newTarget.dispatchEvent(new MouseEvent("contextmenu", e));
        }, TRANSITION_DURATION);
    }

    private handlePopoverInteraction = (nextOpenState: boolean) => {
        if (!nextOpenState) {
            this.hide();
        }
    }
}

let contextMenu: ContextMenu;

/**
 * Show the given menu element at the given offset from the top-left corner of the viewport.
 * The menu will appear below-right of this point and will flip to below-left if there is not enough
 * room onscreen. The optional callback will be invoked when this menu closes.
 */
export function show(menu: JSX.Element, offset: IOffset, onClose?: () => void) {
    if (contextMenu == null) {
        const contextMenuElement = document.createElement("div");
        contextMenuElement.classList.add(Classes.CONTEXT_MENU);
        document.body.appendChild(contextMenuElement);
        contextMenu = ReactDOM.render(<ContextMenu />, contextMenuElement) as ContextMenu;
    }

    contextMenu.show(menu, offset, onClose);
}

/** Hide the open context menu. */
export function hide() {
    if (contextMenu != null) {
        contextMenu.hide();
    }
}

/** Return whether a context menu is currently open. */
export function isOpen() {
    return contextMenu != null && contextMenu.state.isOpen;
}
