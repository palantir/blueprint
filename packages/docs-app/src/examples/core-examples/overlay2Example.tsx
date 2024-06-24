/*
 * Copyright 2024 Palantir Technologies, Inc. All rights reserved.
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

import classNames from "classnames";
import * as React from "react";

import { Button, Classes, Code, H3, H5, Intent, Overlay2, Switch } from "@blueprintjs/core";
import { Example, type ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";

import type { BlueprintExampleData } from "../../tags/types";

const OVERLAY_EXAMPLE_CLASS = "docs-overlay-example-transition";
const OVERLAY_TALL_CLASS = "docs-overlay-example-tall";

export const Overlay2Example: React.FC<ExampleProps<BlueprintExampleData>> = props => {
    const [autoFocus, setAutoFocus] = React.useState(true);
    const [canEscapeKeyClose, setCanEscapeKeyClose] = React.useState(true);
    const [canOutsideClickClose, setCanOutsideClickClose] = React.useState(true);
    const [enforceFocus, setEnforceFocus] = React.useState(true);
    const [hasBackdrop, setHasBackdrop] = React.useState(true);
    const [isOpen, setIsOpen] = React.useState(false);
    const [usePortal, setUsePortal] = React.useState(true);
    const [useTallContent, setUseTallContent] = React.useState(false);

    const buttonRef = React.useRef<HTMLButtonElement>(null);

    const handleOpen = React.useCallback(() => setIsOpen(true), [setIsOpen]);

    const handleClose = React.useCallback(() => {
        setIsOpen(false);
        setUseTallContent(false);
    }, [setIsOpen, setUseTallContent]);

    const focusButton = React.useCallback(() => buttonRef.current?.focus(), [buttonRef]);

    const toggleScrollButton = React.useCallback(() => setUseTallContent(use => !use), [setUseTallContent]);

    const classes = classNames(Classes.CARD, Classes.ELEVATION_4, OVERLAY_EXAMPLE_CLASS, props.data.themeName, {
        [OVERLAY_TALL_CLASS]: useTallContent,
    });

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
            <Switch checked={hasBackdrop} label="Has backdrop" onChange={handleBooleanChange(setHasBackdrop)} />
        </>
    );

    return (
        <Example options={options} {...props}>
            <React.StrictMode>
                <Button ref={buttonRef} onClick={handleOpen} text="Show overlay" />
                <Overlay2
                    onClose={handleClose}
                    className={Classes.OVERLAY_SCROLL_CONTAINER}
                    {...{
                        autoFocus,
                        canEscapeKeyClose,
                        canOutsideClickClose,
                        enforceFocus,
                        hasBackdrop,
                        isOpen,
                        usePortal,
                    }}
                >
                    <div className={classes}>
                        <H3>I'm an Overlay!</H3>
                        <p>
                            This is a simple container with some inline styles to position it on the screen. Its CSS
                            transitions are customized for this example only to demonstrate how easily custom
                            transitions can be implemented.
                        </p>
                        <p>
                            Click the "Focus button" below to transfer focus to the "Show overlay" trigger button
                            outside of this overlay. If persistent focus is enabled, focus will be constrained to the
                            overlay. Use the <Code>tab</Code> key to move to the next focusable element to illustrate
                            this effect.
                        </p>
                        <p>
                            Click the "Make me scroll" button below to make this overlay's content really tall, which
                            will make the overlay's container (but not the page) scrollable
                        </p>
                        <br />
                        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                            <Button intent={Intent.DANGER} onClick={handleClose} style={{ margin: "" }}>
                                Close
                            </Button>
                            <Button onClick={focusButton} style={{ margin: "" }}>
                                Focus button
                            </Button>
                            <Button
                                onClick={toggleScrollButton}
                                icon="double-chevron-down"
                                rightIcon="double-chevron-down"
                                active={useTallContent}
                                style={{ margin: "" }}
                            >
                                Make me scroll
                            </Button>
                        </div>
                    </div>
                </Overlay2>
            </React.StrictMode>
        </Example>
    );
};
