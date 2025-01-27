/*
 * Copyright 2024 Palantir Technologies, Inc. All rights reserved.
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

import { Alert, Button, H5, Intent, OverlayToaster, Switch } from "@blueprintjs/core";
import { Example, type ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";
import { IconNames } from "@blueprintjs/icons";

import type { BlueprintExampleData } from "../../tags/types";

export const AlertExample: React.FC<ExampleProps<BlueprintExampleData>> = props => {
    const [canEscapeKeyCancel, setCanEscapeKeyCancel] = React.useState(false);
    const [canOutsideClickCancel, setCanOutsideClickCancel] = React.useState(false);
    const [willLoad, setWillLoad] = React.useState(false);

    const options = (
        <>
            <H5>Props</H5>
            <Switch
                checked={canEscapeKeyCancel}
                label="Can escape key cancel"
                onChange={handleBooleanChange(setCanEscapeKeyCancel)}
            />
            <Switch
                checked={canOutsideClickCancel}
                label="Can outside click cancel"
                onChange={handleBooleanChange(setCanOutsideClickCancel)}
            />
            <Switch
                checked={willLoad}
                label="Does alert use loading state"
                onChange={handleBooleanChange(setWillLoad)}
            />
        </>
    );

    return (
        <Example options={options} {...props}>
            <FileErrorAlert
                canEscapeKeyCancel={canEscapeKeyCancel}
                canOutsideClickCancel={canOutsideClickCancel}
                themeName={props.data.themeName}
                willLoad={willLoad}
            />
            <FileDeletionAlert
                canEscapeKeyCancel={canEscapeKeyCancel}
                canOutsideClickCancel={canOutsideClickCancel}
                themeName={props.data.themeName}
                willLoad={willLoad}
            />
        </Example>
    );
};

interface AlertExampleProps {
    canEscapeKeyCancel: boolean;
    canOutsideClickCancel: boolean;
    themeName: BlueprintExampleData["themeName"];
    willLoad: boolean;
}

const FileErrorAlert: React.FC<AlertExampleProps> = ({
    canEscapeKeyCancel,
    canOutsideClickCancel,
    themeName,
    willLoad,
}) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [isOpen, setIsOpen] = React.useState(false);

    const handleClick = React.useCallback(() => setIsOpen(true), []);

    const handleClose = React.useCallback(() => {
        const close = () => {
            setIsOpen(false);
            setIsLoading(false);
        };
        if (willLoad) {
            setIsLoading(true);
            setTimeout(close, 2000);
        } else {
            close();
        }
    }, [willLoad]);

    return (
        <>
            <Button onClick={handleClick} text="Open file error alert" />
            <Alert
                canEscapeKeyCancel={canEscapeKeyCancel}
                canOutsideClickCancel={canOutsideClickCancel}
                className={themeName}
                confirmButtonText="Okay"
                isOpen={isOpen}
                loading={isLoading}
                onClose={handleClose}
            >
                <p>
                    Couldn't create the file because the containing folder doesn't exist anymore. You will be redirected
                    to your user folder.
                </p>
            </Alert>
        </>
    );
};

const FileDeletionAlert: React.FC<AlertExampleProps> = ({
    canEscapeKeyCancel,
    canOutsideClickCancel,
    themeName,
    willLoad,
}) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [isOpen, setIsOpen] = React.useState(false);

    const toaster = OverlayToaster.createAsync({ className: themeName });

    const handleClick = React.useCallback(() => setIsOpen(true), []);

    const handleCancel = React.useCallback(() => setIsOpen(false), []);

    const handleConfirm = React.useCallback(() => {
        const close = async () => {
            setIsOpen(false);
            setIsLoading(false);
            (await toaster).show({ message: TOAST_MESSAGE });
        };
        if (willLoad) {
            setIsLoading(true);
            setTimeout(close, 2000);
        } else {
            close();
        }
    }, [toaster, willLoad]);

    return (
        <>
            <Button onClick={handleClick} text="Open file deletion alert" />
            <Alert
                cancelButtonText="Cancel"
                canEscapeKeyCancel={canEscapeKeyCancel}
                canOutsideClickCancel={canOutsideClickCancel}
                className={themeName}
                confirmButtonText="Move to Trash"
                icon={IconNames.TRASH}
                intent={Intent.DANGER}
                isOpen={isOpen}
                loading={isLoading}
                onCancel={handleCancel}
                onConfirm={handleConfirm}
            >
                <p>
                    Are you sure you want to move <b>filename</b> to Trash? You will be able to restore it later, but it
                    will become private to you.
                </p>
            </Alert>
        </>
    );
};

const TOAST_MESSAGE = (
    <div>
        <strong>filename</strong> was moved to Trash
    </div>
);
