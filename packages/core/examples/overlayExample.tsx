/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import * as classNames from "classnames";
import * as React from "react";

import BaseExample, { handleBooleanChange } from "./common/baseExample";
import {
    Button,
    Classes,
    IBackdropProps,
    IOverlayableProps,
    Intent,
    Overlay,
    Switch,
} from "@blueprintjs/core";

const OVERLAY_EXAMPLE_CLASS = "docs-overlay-example-transition";

export interface IOverlayExampleState extends IOverlayableProps, IBackdropProps {
    isOpen?: boolean;
}

export class OverlayExample extends BaseExample<IOverlayExampleState> {
    public state: IOverlayExampleState = {
        autoFocus: true,
        canEscapeKeyClose: true,
        canOutsideClickClose: true,
        enforceFocus: true,
        hasBackdrop: true,
        inline: false,
        isOpen: false,
    };

    private button: HTMLButtonElement;
    private refHandlers = {
        button: (ref: HTMLButtonElement) => this.button = ref,
    };

    private handleAutoFocusChange    = handleBooleanChange((autoFocus) => this.setState({ autoFocus }));
    private handleBackdropChange     = handleBooleanChange((hasBackdrop) => this.setState({ hasBackdrop }));
    private handleEnforceFocusChange = handleBooleanChange((enforceFocus) => this.setState({ enforceFocus }));
    private handleEscapeKeyChange    = handleBooleanChange((canEscapeKeyClose) => this.setState({ canEscapeKeyClose }));
    private handleInlineChange       = handleBooleanChange((inline) => this.setState({ inline }));
    private handleOutsideClickChange = handleBooleanChange((val) => this.setState({ canOutsideClickClose: val }));

    protected renderExample() {
        const classes = classNames(
            Classes.CARD,
            Classes.ELEVATION_4,
            OVERLAY_EXAMPLE_CLASS,
            this.props.getTheme(),
        );

        return (
            <div className="docs-dialog-example">
                <button className="pt-button" onClick={this.handleOpen} ref={this.refHandlers.button}>
                    Show overlay
                </button>
                <Overlay onClose={this.handleClose} {...this.state}>
                    <div className={classes}>
                        <h3>I'm an Overlay!</h3>
                        <p>
                            This is a simple container with some inline styles to position it on the screen.
                            Its CSS transitions are customized for this example only to demonstrate how
                            easily custom transitions can be implemented.
                        </p>
                        <p>
                            Click the right button below to transfer focus to the "Show Overlay" trigger
                            button outside of this overlay. If persistent focus is enabled, focus will
                            be constrained to the overlay. Use the <code>tab</code> key to move to the
                            next focusable element to illustrate this effect.
                        </p>
                        <br />
                        <Button intent={Intent.DANGER} onClick={this.handleClose}>Close</Button>
                        <Button onClick={this.focusButton} style={{ float: "right" }}>Focus button</Button>
                    </div>
                </Overlay>
            </div>
        );
    }

    protected renderOptions() {
        const { hasBackdrop, inline } = this.state;
        return [
            [
                <Switch
                    checked={this.state.autoFocus}
                    key="autoFocus"
                    label="Auto focus"
                    onChange={this.handleAutoFocusChange}
                />,
                <Switch
                    checked={this.state.enforceFocus}
                    key="enforceFocus"
                    label="Enforce focus"
                    onChange={this.handleEnforceFocusChange}
                />,
                <Switch
                    checked={inline}
                    key="inline"
                    label="Render inline"
                    onChange={this.handleInlineChange}
                />,
            ], [
                <Switch
                    checked={this.state.canOutsideClickClose}
                    key="click"
                    label="Click outside to close"
                    onChange={this.handleOutsideClickChange}
                />,
                <Switch
                    checked={this.state.canEscapeKeyClose}
                    key="escape"
                    label="Escape key to close"
                    onChange={this.handleEscapeKeyChange}
                />,
                <Switch
                    checked={hasBackdrop}
                    key="backdrop"
                    label="Has backdrop"
                    onChange={this.handleBackdropChange}
                />,
            ],
        ];
    }

    protected handleOpen  = () => this.setState({ isOpen: true });
    protected handleClose = () => this.setState({ isOpen: false });

    private focusButton = () => this.button.focus()
}
