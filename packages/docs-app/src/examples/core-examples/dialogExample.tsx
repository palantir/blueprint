/*
 * Copyright 2025 Palantir Technologies, Inc. All rights reserved.
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

import { useCallback, useState } from "react";

import {
    AnchorButton,
    Button,
    Code,
    Dialog,
    DialogBody,
    DialogFooter,
    type DialogProps,
    H5,
    Icon,
    Intent,
    Switch,
    Tooltip,
} from "@blueprintjs/core";
import { Example, type ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";
import { IconNames } from "@blueprintjs/icons";

import type { BlueprintExampleData } from "../../tags/types";

export const DialogExample: React.FC<ExampleProps<BlueprintExampleData>> = props => {
    const [autoFocus, setAutoFocus] = useState(true);
    const [canEscapeKeyClose, setCanEscapeKeyClose] = useState(true);
    const [canOutsideClickClose, setCanOutsideClickClose] = useState(true);
    const [enforceFocus, setEnforceFocus] = useState(true);
    const [shouldReturnFocusOnClose, setShouldReturnFocusOnClose] = useState(true);
    const [usePortal, setUsePortal] = useState(true);

    const options = (
        <>
            <H5>Props</H5>
            <Switch checked={autoFocus} label="Auto focus" onChange={handleBooleanChange(setAutoFocus)} />
            <Switch checked={enforceFocus} label="Enforce focus" onChange={handleBooleanChange(setEnforceFocus)} />
            <Switch checked={usePortal} onChange={handleBooleanChange(setUsePortal)}>
                Use <Code>Portal</Code>
            </Switch>
            <Switch
                checked={canOutsideClickClose}
                label="Click outside to close"
                onChange={handleBooleanChange(setCanOutsideClickClose)}
            />
            <Switch
                checked={canEscapeKeyClose}
                label="Escape key to close"
                onChange={handleBooleanChange(setCanEscapeKeyClose)}
            />
            <Switch
                checked={shouldReturnFocusOnClose}
                label="Return focus to previously active element upon closing"
                onChange={handleBooleanChange(setShouldReturnFocusOnClose)}
            />
        </>
    );

    const dialogProps: Omit<DialogProps, "isOpen"> = {
        autoFocus,
        canEscapeKeyClose,
        canOutsideClickClose,
        enforceFocus,
        shouldReturnFocusOnClose,
        usePortal,
    };

    return (
        <Example options={options} {...props}>
            <ButtonWithDialog
                {...dialogProps}
                buttonText="Show dialog"
                className={props.data.themeName}
                footerStyle="none"
            />
            <ButtonWithDialog
                {...dialogProps}
                buttonText="Show dialog with title"
                className={props.data.themeName}
                footerStyle="none"
                icon={<Icon icon={IconNames.INFO_SIGN} intent={Intent.PRIMARY} />}
                title="Palantir Foundry"
            />
            <ButtonWithDialog
                {...dialogProps}
                buttonText="Show dialog with title and footer"
                className={props.data.themeName}
                footerStyle="default"
                icon={IconNames.INFO_SIGN}
                title="Palantir Foundry"
            />
            <ButtonWithDialog
                {...dialogProps}
                buttonText="Show dialog with title and minimal footer"
                className={props.data.themeName}
                footerStyle="minimal"
                icon={IconNames.INFO_SIGN}
                title="Palantir Foundry"
            />
        </Example>
    );
};

interface ButtonWithDialogProps extends Omit<DialogProps, "isOpen"> {
    buttonText: string;
    footerStyle: "default" | "minimal" | "none";
}

const ButtonWithDialog: React.FC<ButtonWithDialogProps> = ({
    buttonText,
    footerStyle,
    ...props
}: Omit<DialogProps, "isOpen"> & { buttonText: string; footerStyle: "default" | "minimal" | "none" }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = useCallback(() => setIsOpen(value => !value), []);

    const handleClose = useCallback(() => setIsOpen(false), []);

    const footerActions = (
        <>
            <Tooltip content="This button is hooked up to close the dialog.">
                <Button onClick={handleClose}>Close</Button>
            </Tooltip>
            <VisitFoundryWebsiteAnchorButton />
        </>
    );

    return (
        <>
            <Button onClick={handleClick} text={buttonText} />
            <Dialog {...props} isOpen={isOpen} onClose={handleClose}>
                <DialogBody useOverflowScrollContainer={footerStyle === "minimal" ? false : undefined}>
                    <p>
                        <strong>
                            Data integration is the seminal problem of the digital age. For over ten years, we've helped
                            the world's premier organizations rise to the challenge.
                        </strong>
                    </p>
                    <p>
                        Palantir Foundry radically reimagines the way enterprises interact with data by amplifying and
                        extending the power of data integration. With Foundry, anyone can source, fuse, and transform
                        data into any shape they desire. Business analysts become data engineers — and leaders in their
                        organization's data revolution.
                    </p>
                    <p>
                        Foundry's back end includes a suite of best-in-class data integration capabilities: data
                        provenance, git-style versioning semantics, granular access controls, branching, transformation
                        authoring, and more. But these powers are not limited to the back-end IT shop.
                    </p>
                    <p>
                        In Foundry, tables, applications, reports, presentations, and spreadsheets operate as data
                        integrations in their own right. Access controls, transformation logic, and data quality flow
                        from original data source to intermediate analysis to presentation in real time. Every end
                        product created in Foundry becomes a new data source that other users can build upon. And the
                        enterprise data foundation goes where the business drives it.
                    </p>
                    <p>Start the revolution. Unleash the power of data integration with Palantir Foundry.</p>
                </DialogBody>
                {footerStyle === "default" && <DialogFooter actions={footerActions}>All checks passed</DialogFooter>}
                {footerStyle === "minimal" && <DialogFooter actions={footerActions} minimal={true} />}
            </Dialog>
        </>
    );
};

const VisitFoundryWebsiteAnchorButton: React.FC<{ fill?: boolean }> = props => (
    <Tooltip content="Opens link in a new page" fill={props.fill}>
        <AnchorButton
            fill={props.fill}
            href="https://www.palantir.com/palantir-foundry/"
            icon="share"
            intent="primary"
            target="_blank"
        >
            Visit the Foundry website
        </AnchorButton>
    </Tooltip>
);
