/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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

import { Button, Callout, Classes, Popover, Switch } from "@blueprintjs/core";
import { Example, IExampleProps } from "@blueprintjs/docs-theme";

export class PopoverDismissExample extends React.PureComponent<
    IExampleProps,
    { captureDismiss: boolean; isOpen: boolean }
> {
    public state = { captureDismiss: true, isOpen: true };

    private timeoutId: number;

    public componentWillUnmount() {
        window.clearTimeout(this.timeoutId);
    }

    public render() {
        /* eslint-disable deprecation/deprecation */
        return (
            <Example options={false} {...this.props}>
                <Popover
                    autoFocus={false}
                    enforceFocus={false}
                    isOpen={this.state.isOpen}
                    onInteraction={this.handleInteraction}
                    onClosed={this.reopen}
                    position="right"
                    usePortal={false}
                >
                    <Button intent="primary" text="Try it out" />
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
                                captureDismiss={this.state.captureDismiss}
                                content={POPOVER_CONTENTS}
                                position="right"
                                usePortal={false}
                            >
                                <Button text="Nested" rightIcon="caret-right" />
                            </Popover>
                        </div>
                    </>
                </Popover>
                <p className="docs-reopen-message">
                    <em className={Classes.TEXT_MUTED}>Popover will reopen...</em>
                </p>
            </Example>
        );
        /* eslint-enable deprecation/deprecation */
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
