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
                    className={this.props.themeName}
                    iconName="inbox"
                    onClose={this.handleClose}
                    title="Dialog header"
                    {...this.state}
                >
                    <div className={Classes.DIALOG_BODY}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sagittis odio neque, eget aliquam
                        eros consectetur in. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per
                        inceptos himenaeos. Nulla consequat justo in enim aliquam, eget convallis nibh gravida. Nunc
                        quis consectetur enim. Curabitur tincidunt vestibulum pulvinar. Suspendisse vel libero justo. Ut
                        feugiat pharetra commodo. Morbi ullamcorper enim nec dolor aliquam, eu maximus turpis elementum.
                        Morbi tristique laoreet ipsum. Nulla sit amet nisl posuere, sollicitudin ex eget, faucibus
                        neque. Cras malesuada nisl vel lectus vehicula fringilla. Fusce vel facilisis tellus. Integer
                        porta mollis nibh, nec viverra magna cursus non. Nulla consectetur dui nec fringilla dignissim.
                        Praesent in tempus odio. Donec sollicitudin sit amet eros eu sollicitudin. Etiam convallis ex
                        felis, nec pharetra felis sagittis ut. Suspendisse aliquam purus sed sollicitudin aliquet. Duis
                        sollicitudin risus sed orci elementum dignissim. Phasellus sed erat fermentum, laoreet mi
                        posuere, mollis quam. Ut vestibulum dictum lorem, vel faucibus libero varius id. Donec iaculis
                        efficitur nisl. Aliquam a lectus ac massa suscipit commodo.
                    </div>
                    <div className={Classes.DIALOG_FOOTER}>
                        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                            <Button>Secondary</Button>
                            <Tooltip content="This button is hooked up to close the dialog." inline={true}>
                                <Button className="pt-intent-primary" onClick={this.handleClose}>
                                    Primary
                                </Button>
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
