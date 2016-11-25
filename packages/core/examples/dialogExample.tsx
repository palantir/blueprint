/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as React from "react";

import { Button, Classes, Dialog, Tooltip } from "@blueprintjs/core";
import { OverlayExample } from "./overlayExample";

export class DialogExample extends OverlayExample {
    protected renderExample() {
        return (
            <div className="docs-dialog-example">
                <Button onClick={this.handleOpen}>Show dialog</Button>
                <Dialog
                    className={this.props.getTheme()}
                    iconName="inbox"
                    onClose={this.handleClose}
                    title="Dialog Header"
                    {...this.state}
                >
                    <div className={Classes.DIALOG_BODY}>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt
                        ut labore et dolore magna alqua.
                    </div>
                    <div className={Classes.DIALOG_FOOTER}>
                        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                            <Button>Secondary</Button>
                            <Tooltip content="This button is hooked up to close the dialog." inline>
                                <Button className="pt-intent-primary" onClick={this.handleClose}>Primary</Button>
                            </Tooltip>
                        </div>
                    </div>
                </Dialog>
            </div>
        );
    }

    protected renderOptions() {
        const options = super.renderOptions();
        // delete "hasBackdrop" switch from option controls
        options[1].splice(2, 1);
        return options;
    }
}
