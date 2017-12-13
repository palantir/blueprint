/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as classNames from "classnames";
import * as React from "react";
import * as ReactDOM from "react-dom";

import { AbstractPureComponent } from "../../common/abstractPureComponent";
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
    isDarkTheme?: boolean;
    menu?: JSX.Element;
    offset?: IOffset;
    onClose?: () => void;
}

const TETHER_OPTIONS = {
    constraints: [{ attachment: "together", pin: true, to: "window" }],
};
const TRANSITION_DURATION = 100;

/* istanbul ignore next */
class ContextMenu extends AbstractPureComponent<{}, IContextMenuState> {
    public state: IContextMenuState = {
        isOpen: false,
    };

    public render() {
        // prevent right-clicking in a context menu
        const content = <div onContextMenu={this.cancelContextMenu}>{this.state.menu}</div>;
        const popoverClassName = classNames(Classes.MINIMAL, { [Classes.DARK]: this.state.isDarkTheme });
        return (
            <Popover
                backdropProps={{ onContextMenu: this.handleBackdropContextMenu }}
                content={content}
                enforceFocus={false}
                isModal={true}
                isOpen={this.state.isOpen}
                onInteraction={this.handlePopoverInteraction}
                position={Position.RIGHT_TOP}
                popoverClassName={popoverClassName}
                useSmartArrowPositioning={false}
                tetherOptions={TETHER_OPTIONS}
                transitionDuration={TRANSITION_DURATION}
            >
                <div className={Classes.CONTEXT_MENU_POPOVER_TARGET} style={this.state.offset} />
            </Popover>
        );
    }

    public show(menu: JSX.Element, offset: IOffset, onClose?: () => void, isDarkTheme?: boolean) {
        this.setState({ isOpen: true, menu, offset, onClose, isDarkTheme });
    }

    public hide() {
        safeInvoke(this.state.onClose);
        this.setState({ isOpen: false, onClose: undefined });
    }

    private cancelContextMenu = (e: React.SyntheticEvent<HTMLDivElement>) => e.preventDefault();

    private handleBackdropContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
        // React function to remove from the event pool, useful when using a event within a callback
        e.persist();
        e.preventDefault();
        // wait for backdrop to disappear so we can find the "real" element at event coordinates.
        // timeout duration is equivalent to transition duration so we know it's animated out.
        this.setTimeout(() => {
            // retrigger context menu event at the element beneath the backdrop.
            // if it has a `contextmenu` event handler then it'll be invoked.
            // if it doesn't, no native menu will show (at least on OSX) :(
            const newTarget = document.elementFromPoint(e.clientX, e.clientY);
            newTarget.dispatchEvent(new MouseEvent("contextmenu", e));
        }, TRANSITION_DURATION);
    };

    private handlePopoverInteraction = (nextOpenState: boolean) => {
        if (!nextOpenState) {
            // delay the actual hiding till the event queue clears
            // to avoid flicker of opening twice
            requestAnimationFrame(() => this.hide());
        }
    };
}

let contextMenu: ContextMenu;

/**
 * Show the given menu element at the given offset from the top-left corner of the viewport.
 * The menu will appear below-right of this point and will flip to below-left if there is not enough
 * room onscreen. The optional callback will be invoked when this menu closes.
 */
export function show(menu: JSX.Element, offset: IOffset, onClose?: () => void, isDarkTheme?: boolean) {
    if (contextMenu == null) {
        const contextMenuElement = document.createElement("div");
        contextMenuElement.classList.add(Classes.CONTEXT_MENU);
        document.body.appendChild(contextMenuElement);
        contextMenu = ReactDOM.render(<ContextMenu />, contextMenuElement) as ContextMenu;
    }

    contextMenu.show(menu, offset, onClose, isDarkTheme);
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
