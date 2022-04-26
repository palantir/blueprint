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

import * as React from "react";

import { Button, Callout, Classes as CoreClasses, Switch } from "@blueprintjs/core";
import { Example, IExampleProps } from "@blueprintjs/docs-theme";
import { Classes, Popover2 } from "@blueprintjs/popover2";

export class Popover2DismissExample extends React.PureComponent<
    IExampleProps,
    { captureDismiss: boolean; isOpen: boolean }
> {
    public static displayName = "Popover2DismissExample";

    public state = { captureDismiss: true, isOpen: true };

    private timeoutId: number;

    public componentWillUnmount() {
        window.clearTimeout(this.timeoutId);
    }

    public render() {
        return (
            <Example options={false} {...this.props}>
                <Popover2
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
                                <Popover2
                                    autoFocus={false}
                                    enforceFocus={false}
                                    captureDismiss={this.state.captureDismiss}
                                    content={POPOVER_CONTENTS}
                                    placement="right"
                                    usePortal={false}
                                    renderTarget={({ isOpen, ref, ...p }) => (
                                        <Button
                                            {...p}
                                            active={isOpen}
                                            elementRef={ref}
                                            text="Nested"
                                            rightIcon="caret-right"
                                        />
                                    )}
                                />
                            </div>
                        </>
                    }
                    renderTarget={({ isOpen, ref, ...p }) => (
                        <Button {...p} active={isOpen} elementRef={ref} intent="primary" text="Try it out" />
                    )}
                />
                <p className="docs-reopen-message">
                    <em className={CoreClasses.TEXT_MUTED}>Popover will reopen...</em>
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
            <Button className={Classes.POPOVER2_DISMISS} intent="danger" text="Dismiss" />
            <Button className={Classes.POPOVER2_DISMISS} intent="danger" text="No dismiss" disabled={true} />
        </div>
        <Callout intent="warning" className={Classes.POPOVER2_DISMISS}>
            <p>Click callout to dismiss.</p>
            <div>
                <Button className={Classes.POPOVER2_DISMISS_OVERRIDE} intent="success" text="Dismiss override" />
                <Button disabled={true} text="Nope" />
            </div>
        </Callout>
    </>
);
