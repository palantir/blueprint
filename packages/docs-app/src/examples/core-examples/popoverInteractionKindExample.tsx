/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import {
    Button,
    IButtonProps,
    Intent,
    IPopoverProps,
    Popover,
    PopoverInteractionKind,
    Position,
    Toaster,
} from "@blueprintjs/core";
import { BaseExample } from "@blueprintjs/docs";
import { FileMenu } from "./common/fileMenu";

export class PopoverInteractionKindExample extends BaseExample<{}> {
    protected className = "docs-popover-interaction-kind-example";

    private toaster: Toaster;
    private refHandlers = {
        toaster: (ref: Toaster) => (this.toaster = ref),
    };

    protected renderExample() {
        return (
            <div>
                {this.renderPopover("HOVER", PopoverInteractionKind.HOVER)}
                {this.renderPopover("HOVER_TARGET_ONLY", PopoverInteractionKind.HOVER_TARGET_ONLY)}
                {this.renderPopover("CLICK", PopoverInteractionKind.CLICK)}
                {this.renderPopover(
                    "CLICK_TARGET_ONLY",
                    PopoverInteractionKind.CLICK_TARGET_ONLY,
                    { onClick: this.handleClickTargetOnlyButtonClick },
                    { popoverWillClose: this.handleClickTargetOnlyPopoverWillClose },
                )}
                <Toaster {...this.state} ref={this.refHandlers.toaster} />
            </div>
        );
    }

    private renderPopover(
        buttonLabel: string,
        interactionKind: PopoverInteractionKind,
        buttonProps?: IButtonProps,
        popoverProps?: IPopoverProps,
    ) {
        // MenuItem's default shouldDismissPopover={true} behavior is confusing
        // in this example, since it introduces an additional way popovers can
        // close. set it to false here for clarity.
        return (
            <Popover
                {...popoverProps}
                content={<FileMenu shouldDismissPopover={false} />}
                inline={true}
                position={Position.BOTTOM_LEFT}
                interactionKind={interactionKind}
            >
                <Button intent={Intent.PRIMARY} {...buttonProps}>
                    {buttonLabel}
                </Button>
            </Popover>
        );
    }

    private handleClickTargetOnlyButtonClick = () => {
        this.toaster.show({
            iconName: "info-sign",
            intent: Intent.PRIMARY,
            message: (
                <>
                    Click the <code>CLICK_TARGET_ONLY</code> button again to close the popover and regain interactivity
                    in the rest of the app.
                </>
            ),
            timeout: -1,
        });
    };

    private handleClickTargetOnlyPopoverWillClose = () => {
        this.toaster.clear();
    };
}
