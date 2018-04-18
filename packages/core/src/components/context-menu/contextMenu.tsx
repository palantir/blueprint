/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";
import * as ReactDOM from "react-dom";

import { AbstractPureComponent } from "../../common/abstractPureComponent";
import * as Classes from "../../common/classes";
import { Position } from "../../common/position";
import { safeInvoke } from "../../common/utils";
import { Popover, PopperModifiers } from "../popover/popover";

export interface IOffset {
    left: number;
    top: number;
}

interface IContextMenuProps {
    /** Callback invoked after the menu has finished transitioning to a closed state. */
    didClose: () => void;
}

interface IContextMenuState {
    isOpen: boolean;
    isDarkTheme: boolean;
    menu: JSX.Element;
    offset: IOffset;
    onClose?: () => void;
}

const POPPER_MODIFIERS: PopperModifiers = {
    preventOverflow: { boundariesElement: "viewport" },
};
const TRANSITION_DURATION = 100;

/* istanbul ignore next */
class ContextMenu extends AbstractPureComponent<IContextMenuProps, IContextMenuState> {
    public state: IContextMenuState = {
        isDarkTheme: false,
        isOpen: false,
        menu: null,
        offset: null,
    };

    public render() {
        // prevent right-clicking in a context menu
        const content = <div onContextMenu={this.cancelContextMenu}>{this.state.menu}</div>;
        const popoverClassName = classNames({ [Classes.DARK]: this.state.isDarkTheme });

        // wrap the popover in a positioned div to make sure it is properly
        // offset on the screen.
        return (
            <div className={Classes.CONTEXT_MENU_POPOVER_TARGET} style={this.state.offset}>
                <Popover
                    backdropProps={{ onContextMenu: this.handleBackdropContextMenu }}
                    content={content}
                    enforceFocus={false}
                    hasBackdrop={true}
                    isOpen={this.state.isOpen}
                    minimal={true}
                    modifiers={POPPER_MODIFIERS}
                    onInteraction={this.handlePopoverInteraction}
                    position={Position.RIGHT_TOP}
                    popoverClassName={popoverClassName}
                    popoverDidClose={this.props.didClose}
                    target={<div />}
                    transitionDuration={TRANSITION_DURATION}
                />
            </div>
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

let contextMenuElement: HTMLElement;
let contextMenu: ContextMenu;

/**
 * Show the given menu element at the given offset from the top-left corner of the viewport.
 * The menu will appear below-right of this point and will flip to below-left if there is not enough
 * room onscreen. The optional callback will be invoked when this menu closes.
 */
export function show(menu: JSX.Element, offset: IOffset, onClose?: () => void, isDarkTheme?: boolean) {
    if (contextMenuElement == null) {
        contextMenuElement = document.createElement("div");
        contextMenuElement.classList.add(Classes.CONTEXT_MENU);
        document.body.appendChild(contextMenuElement);
        contextMenu = ReactDOM.render(<ContextMenu didClose={remove} />, contextMenuElement) as ContextMenu;
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

function remove() {
    if (contextMenuElement != null) {
        ReactDOM.unmountComponentAtNode(contextMenuElement);
        contextMenuElement.remove();
        contextMenuElement = null;
        contextMenu = null;
    }
}
