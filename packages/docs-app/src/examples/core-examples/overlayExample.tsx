/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";

import { Button, Classes, Code, H3, H5, Intent, Overlay, Switch } from "@blueprintjs/core";
import { Example, handleBooleanChange, IExampleProps } from "@blueprintjs/docs-theme";
import { IBlueprintExampleData } from "../../tags/reactExamples";

const OVERLAY_EXAMPLE_CLASS = "docs-overlay-example-transition";

export interface IOverlayExampleState {
    autoFocus: boolean;
    canEscapeKeyClose: boolean;
    canOutsideClickClose: boolean;
    enforceFocus: boolean;
    hasBackdrop: boolean;
    isOpen: boolean;
    usePortal: boolean;
}

export class OverlayExample extends React.PureComponent<IExampleProps<IBlueprintExampleData>, IOverlayExampleState> {
    public state: IOverlayExampleState = {
        autoFocus: true,
        canEscapeKeyClose: true,
        canOutsideClickClose: true,
        enforceFocus: true,
        hasBackdrop: true,
        isOpen: false,
        usePortal: true,
    };

    private button: HTMLButtonElement;
    private refHandlers = {
        button: (ref: HTMLButtonElement) => (this.button = ref),
    };

    private handleAutoFocusChange = handleBooleanChange(autoFocus => this.setState({ autoFocus }));
    private handleBackdropChange = handleBooleanChange(hasBackdrop => this.setState({ hasBackdrop }));
    private handleEnforceFocusChange = handleBooleanChange(enforceFocus => this.setState({ enforceFocus }));
    private handleEscapeKeyChange = handleBooleanChange(canEscapeKeyClose => this.setState({ canEscapeKeyClose }));
    private handleUsePortalChange = handleBooleanChange(usePortal => this.setState({ usePortal }));
    private handleOutsideClickChange = handleBooleanChange(val => this.setState({ canOutsideClickClose: val }));

    public render() {
        const classes = classNames(Classes.CARD, Classes.ELEVATION_4, OVERLAY_EXAMPLE_CLASS, this.props.data.themeName);

        return (
            <Example options={this.renderOptions()} {...this.props}>
                <Button elementRef={this.refHandlers.button} onClick={this.handleOpen} text="Show overlay" />
                <Overlay onClose={this.handleClose} className={Classes.OVERLAY_SCROLL_CONTAINER} {...this.state}>
                    <div className={classes}>
                        <H3>I'm an Overlay!</H3>
                        <p>
                            This is a simple container with some inline styles to position it on the screen. Its CSS
                            transitions are customized for this example only to demonstrate how easily custom
                            transitions can be implemented.
                        </p>
                        <p>
                            Click the right button below to transfer focus to the "Show overlay" trigger button outside
                            of this overlay. If persistent focus is enabled, focus will be constrained to the overlay.
                            Use the <Code>tab</Code> key to move to the next focusable element to illustrate this
                            effect.
                        </p>
                        <br />
                        <Button intent={Intent.DANGER} onClick={this.handleClose}>
                            Close
                        </Button>
                        <Button onClick={this.focusButton} style={{ float: "right" }}>
                            Focus button
                        </Button>
                    </div>
                </Overlay>
            </Example>
        );
    }

    private renderOptions() {
        const { autoFocus, enforceFocus, canEscapeKeyClose, canOutsideClickClose, hasBackdrop, usePortal } = this.state;
        return (
            <>
                <H5>Props</H5>
                <Switch checked={autoFocus} label="Auto focus" onChange={this.handleAutoFocusChange} />
                <Switch checked={enforceFocus} label="Enforce focus" onChange={this.handleEnforceFocusChange} />
                <Switch checked={usePortal} onChange={this.handleUsePortalChange}>
                    Use <Code>Portal</Code>
                </Switch>
                <Switch
                    checked={canOutsideClickClose}
                    label="Click outside to close"
                    onChange={this.handleOutsideClickChange}
                />
                <Switch checked={canEscapeKeyClose} label="Escape key to close" onChange={this.handleEscapeKeyChange} />
                <Switch checked={hasBackdrop} label="Has backdrop" onChange={this.handleBackdropChange} />
            </>
        );
    }

    private handleOpen = () => this.setState({ isOpen: true });
    private handleClose = () => this.setState({ isOpen: false });

    private focusButton = () => this.button.focus();
}
