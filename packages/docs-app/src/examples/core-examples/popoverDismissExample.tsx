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

import { useCallback, useEffect, useRef, useState } from "react";

import { Button, Callout, Classes, Intent, Popover, Switch } from "@blueprintjs/core";
import { Example, type ExampleProps } from "@blueprintjs/docs-theme";

export const PopoverDismissExample: React.FC<ExampleProps> = props => {
    const [captureDismiss, setCaptureDismiss] = useState(true);
    const [isPopoverOpen, setIsPopoverOpen] = useState(true);

    const timeoutId = useRef<number>();

    useEffect(() => {
        return () => {
            if (timeoutId.current) {
                window.clearTimeout(timeoutId.current);
            }
        };
    }, []);

    const handleDismissChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setCaptureDismiss(event.target.checked);
    }, []);

    const reopen = useCallback(() => {
        window.clearTimeout(timeoutId.current);
        timeoutId.current = window.setTimeout(() => setIsPopoverOpen(true), 150);
    }, []);

    return (
        <Example options={false} {...props}>
            <Popover
                // don't autofocus or enforce focus because it is open by default on the page,
                // and that will make unexpectedly users scroll to this example
                autoFocus={false}
                content={
                    <>
                        {POPOVER_CONTENTS}
                        <div>
                            <Switch
                                checked={captureDismiss}
                                inline={true}
                                label="Capture dismiss"
                                onChange={handleDismissChange}
                            />
                            <Popover
                                autoFocus={false}
                                captureDismiss={captureDismiss}
                                content={POPOVER_CONTENTS}
                                enforceFocus={false}
                                placement="right"
                                renderTarget={({ isOpen, ...rest }) => (
                                    <Button {...rest} active={isOpen} endIcon="caret-right" text="Nested" />
                                )}
                                usePortal={false}
                            />
                        </div>
                    </>
                }
                enforceFocus={false}
                inheritDarkTheme={false}
                isOpen={isPopoverOpen}
                onClosed={reopen}
                onInteraction={setIsPopoverOpen}
                placement="right"
                renderTarget={({ isOpen, ...rest }) => (
                    <Button {...rest} active={isOpen} intent={Intent.PRIMARY} text="Try it out" />
                )}
                usePortal={false}
            />
            <p className="docs-reopen-message">
                <em className={Classes.TEXT_MUTED}>Popover will reopen...</em>
            </p>
        </Example>
    );
};

const POPOVER_CONTENTS = (
    <>
        <div>
            <Button text="Default" />
            <Button className={Classes.POPOVER_DISMISS} intent={Intent.DANGER} text="Dismiss" />
            <Button className={Classes.POPOVER_DISMISS} disabled={true} intent={Intent.DANGER} text="No dismiss" />
        </div>
        <Callout intent={Intent.WARNING} className={Classes.POPOVER_DISMISS}>
            <p>Click callout to dismiss.</p>
            <div>
                <Button className={Classes.POPOVER_DISMISS_OVERRIDE} intent={Intent.SUCCESS} text="Dismiss override" />
                <Button disabled={true} text="Nope" />
            </div>
        </Callout>
    </>
);
