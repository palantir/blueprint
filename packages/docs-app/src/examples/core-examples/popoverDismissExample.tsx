/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Button, Callout, Classes, Popover } from "@blueprintjs/core";
import { Example, IExampleProps } from "@blueprintjs/docs-theme";

export class PopoverDismissExample extends React.PureComponent<IExampleProps, { isOpen: boolean }> {
    public state = { isOpen: true };
    private timeoutId: number;

    public componentWillUnmount() {
        window.clearTimeout(this.timeoutId);
    }

    public render() {
        return (
            <Example options={false} {...this.props}>
                <Popover
                    isOpen={this.state.isOpen}
                    onInteraction={this.handleInteraction}
                    onClosed={this.reopen}
                    position="right"
                    usePortal={false}
                >
                    <Button intent="primary" text="Try it out" />
                    <>
                        <div>
                            <Button text="Default" />
                            <Button className={Classes.POPOVER_DISMISS} intent="danger" text="Dismiss" />
                            <Button
                                className={Classes.POPOVER_DISMISS}
                                intent="danger"
                                text="No dismiss"
                                disabled={true}
                            />
                        </div>
                        <Callout intent="warning" className={Classes.POPOVER_DISMISS}>
                            <p>Click callout to dismiss.</p>
                            <div>
                                <Button
                                    className={Classes.POPOVER_DISMISS_OVERRIDE}
                                    intent="success"
                                    text="Dismiss override"
                                />
                                <Button disabled={true} text="Nope" />
                            </div>
                        </Callout>
                    </>
                </Popover>
                <p className="docs-reopen-message">
                    <em className={Classes.TEXT_MUTED}>Popover will reopen...</em>
                </p>
            </Example>
        );
    }

    private handleInteraction = (isOpen: boolean) => this.setState({ isOpen });

    private reopen = () => {
        window.clearTimeout(this.timeoutId);
        this.timeoutId = window.setTimeout(() => this.setState({ isOpen: true }), 150);
    };
}
