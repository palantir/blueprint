/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Card, H4, Icon, IconName } from "@blueprintjs/core";

export class Welcome extends React.PureComponent {
    public render() {
        return (
            <div className="blueprint-welcome">
                <WelcomeCard href="#blueprint/getting-started" icon="star" title="Getting started" sameTab={true} />
                <WelcomeCard href="https://github.com/palantir/blueprint" icon="git-repo" title="palantir/blueprint" />
                <WelcomeCard href="https://codesandbox.io/s/nko3k41y60" icon="code-block" title="Code Sandbox" />
                <WelcomeCard
                    href="https://github.com/palantir/blueprint#contributing"
                    icon="git-merge"
                    title="Contributing"
                />
            </div>
        );
    }
}

const WelcomeCard: React.SFC<{ icon: IconName; title: string; href: string; sameTab?: boolean }> = props => (
    <a href={props.href} target={props.sameTab ? "" : "_blank"}>
        <Card interactive={true}>
            <Icon icon={props.icon} iconSize={40} />
            <H4>{props.title}</H4>
            {props.children}
        </Card>
    </a>
);
