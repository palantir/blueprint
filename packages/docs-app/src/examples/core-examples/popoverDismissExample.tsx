/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
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

import React from "react";

import { Button, Callout, Classes, Popover, Switch } from "@blueprintjs/core";
import { Example, ExampleProps } from "@blueprintjs/docs-theme";

export class PopoverDismissExample extends React.PureComponent<
    ExampleProps,
    { captureDismiss: boolean; isOpen: boolean }
> {
    public static displayName = "PopoverDismissExample";

    public state = { captureDismiss: true, isOpen: true };

    private timeoutId: number;

    public componentWillUnmount() {
        window.clearTimeout(this.timeoutId);
    }

    public render() {
        return (
            <Example options={false} {...this.props}>
                <Popover
                    inheritDarkTheme={false}
                    // don't autofocus or enforce focus because it is open by default on the page,
                    // and that will make unexpectedly users scroll to this example
                    autoFocus={false}
                    enforceFocus={false}
                    isOpen={this.state.isOpen}
                    onInteraction={this.handleInteraction}
                    onClosed={this.reopen}
                    placement="right"
                    usePortal={false}
                    content={
                        <>
                            {POPOVER_CONTENTS}
                            <div>
                                <Switch
                                    checked={this.state.captureDismiss}
                                    inline={true}
                                    label="Capture dismiss"
                                    onChange={this.handleDismissChange}
                                />
                                <Popover
                                    autoFocus={false}
                                    enforceFocus={false}
                                    captureDismiss={this.state.captureDismiss}
                                    content={POPOVER_CONTENTS}
                                    placement="right"
                                    usePortal={false}
                                    // tslint:disable-next-line jsx-no-lambda
                                    renderTarget={({ isOpen, ...p }) => (
                                        <Button {...p} active={isOpen} text="Nested" rightIcon="caret-right" />
                                    )}
                                />
                            </div>
                        </>
                    }
                    // tslint:disable-next-line jsx-no-lambda
                    renderTarget={({ isOpen, ...p }) => (
                        <Button {...p} active={isOpen} intent="primary" text="Try it out" />
                    )}
                />
                <p className="docs-reopen-message">
                    <em className={Classes.TEXT_MUTED}>Popover will reopen...</em>
                </p>
            </Example>
        );
    }

    private handleInteraction = (isOpen: boolean) => this.setState({ isOpen });

    private handleDismissChange = (event: React.ChangeEvent<HTMLInputElement>) =>
        this.setState({ captureDismiss: event.target.checked });

    private reopen = () => {
        window.clearTimeout(this.timeoutId);
        this.timeoutId = window.setTimeout(() => this.setState({ isOpen: true }), 150);
    };
}

const POPOVER_CONTENTS = (
    <>
        <div>
            <Button text="Default" />
            <Button className={Classes.POPOVER_DISMISS} intent="danger" text="Dismiss" />
            <Button className={Classes.POPOVER_DISMISS} intent="danger" text="No dismiss" disabled={true} />
        </div>
        <Callout intent="warning" className={Classes.POPOVER_DISMISS}>
            <p>Click callout to dismiss.</p>
            <div>
                <Button className={Classes.POPOVER_DISMISS_OVERRIDE} intent="success" text="Dismiss override" />
                <Button disabled={true} text="Nope" />
            </div>
        </Callout>
    </>
);
