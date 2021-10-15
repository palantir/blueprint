/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
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

import * as React from "react";

import { AnchorButton, Button, Classes, Code, Dialog, DialogProps, H5, Switch } from "@blueprintjs/core";
import { Example, handleBooleanChange, IExampleProps } from "@blueprintjs/docs-theme";
import { Tooltip2 } from "@blueprintjs/popover2";

import { IBlueprintExampleData } from "../../tags/types";

export interface DialogExampleState {
    autoFocus: boolean;
    canEscapeKeyClose: boolean;
    canOutsideClickClose: boolean;
    enforceFocus: boolean;
    shouldReturnFocusOnClose: boolean;
    usePortal: boolean;
}

export class DialogExample extends React.PureComponent<IExampleProps<IBlueprintExampleData>, DialogExampleState> {
    public state: DialogExampleState = {
        autoFocus: true,
        canEscapeKeyClose: true,
        canOutsideClickClose: true,
        enforceFocus: true,
        shouldReturnFocusOnClose: true,
        usePortal: true,
    };

    private handleAutoFocusChange = handleBooleanChange(autoFocus => this.setState({ autoFocus }));

    private handleEnforceFocusChange = handleBooleanChange(enforceFocus => this.setState({ enforceFocus }));

    private handleEscapeKeyChange = handleBooleanChange(canEscapeKeyClose => this.setState({ canEscapeKeyClose }));

    private handleOutsideClickChange = handleBooleanChange(val => this.setState({ canOutsideClickClose: val }));

    private handleShouldReturnFocusOnCloseChange = handleBooleanChange(shouldReturnFocusOnClose =>
        this.setState({ shouldReturnFocusOnClose }),
    );

    private handleUsePortalChange = handleBooleanChange(usePortal => this.setState({ usePortal }));

    public render() {
        return (
            <Example options={this.renderOptions()} {...this.props}>
                <ButtonWithDialog
                    className={this.props.data.themeName}
                    buttonText="Show dialog"
                    {...this.state}
                    includeFooter={false}
                />
                <ButtonWithDialog
                    className={this.props.data.themeName}
                    icon="info-sign"
                    title="Palantir Foundry"
                    buttonText="Show dialog with title"
                    includeFooter={false}
                    {...this.state}
                />
                <ButtonWithDialog
                    className={this.props.data.themeName}
                    icon="info-sign"
                    title="Palantir Foundry"
                    buttonText="Show dialog with title and footer"
                    includeFooter={true}
                    {...this.state}
                />
            </Example>
        );
    }

    private renderOptions() {
        const {
            autoFocus,
            enforceFocus,
            canEscapeKeyClose,
            canOutsideClickClose,
            shouldReturnFocusOnClose,
            usePortal,
        } = this.state;
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
                <Switch
                    checked={shouldReturnFocusOnClose}
                    label="Return focus to previously active element upon closing"
                    onChange={this.handleShouldReturnFocusOnCloseChange}
                />
            </>
        );
    }
}

function ButtonWithDialog({
    buttonText,
    includeFooter,
    ...props
}: Omit<DialogProps, "isOpen"> & { buttonText: string; includeFooter: boolean }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const handleButtonClick = React.useCallback(() => setIsOpen(!isOpen), []);
    const handleClose = React.useCallback(() => setIsOpen(false), []);
    return (
        <>
            <Button onClick={handleButtonClick} text={buttonText} />
            <Dialog {...props} isOpen={isOpen} onClose={handleClose}>
                <DialogBody />
                {includeFooter ? (
                    <DialogFooter handleClose={handleClose} />
                ) : (
                    <div style={{ margin: "0 20px" }}>
                        <VisitFoundryWebsiteAnchorButton fill={true} />
                    </div>
                )}
            </Dialog>
        </>
    );
}

function DialogBody() {
    return (
        <div className={Classes.DIALOG_BODY}>
            <p>
                <strong>
                    Data integration is the seminal problem of the digital age. For over ten years, we’ve helped the
                    world’s premier organizations rise to the challenge.
                </strong>
            </p>
            <p>
                Palantir Foundry radically reimagines the way enterprises interact with data by amplifying and extending
                the power of data integration. With Foundry, anyone can source, fuse, and transform data into any shape
                they desire. Business analysts become data engineers — and leaders in their organization’s data
                revolution.
            </p>
            <p>
                Foundry’s back end includes a suite of best-in-class data integration capabilities: data provenance,
                git-style versioning semantics, granular access controls, branching, transformation authoring, and more.
                But these powers are not limited to the back-end IT shop.
            </p>
            <p>
                In Foundry, tables, applications, reports, presentations, and spreadsheets operate as data integrations
                in their own right. Access controls, transformation logic, and data quality flow from original data
                source to intermediate analysis to presentation in real time. Every end product created in Foundry
                becomes a new data source that other users can build upon. And the enterprise data foundation goes where
                the business drives it.
            </p>
            <p>Start the revolution. Unleash the power of data integration with Palantir Foundry.</p>
        </div>
    );
}

function DialogFooter(props: { handleClose: (e: React.MouseEvent) => void }) {
    return (
        <div className={Classes.DIALOG_FOOTER}>
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                <Tooltip2 content="This button is hooked up to close the dialog.">
                    <Button onClick={props.handleClose}>Close</Button>
                </Tooltip2>
                <VisitFoundryWebsiteAnchorButton />
            </div>
        </div>
    );
}

function VisitFoundryWebsiteAnchorButton(props: { fill?: boolean }) {
    return (
        <Tooltip2 content="Opens link in a new page" fill={props.fill}>
            <AnchorButton
                intent="primary"
                href="https://www.palantir.com/palantir-foundry/"
                target="_blank"
                icon="share"
                fill={props.fill}
            >
                Visit the Foundry website
            </AnchorButton>
        </Tooltip2>
    );
}
