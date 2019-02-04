/*
 * Copyright 2019 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Card } from "@blueprintjs/core";
import download from "downloadjs";
import * as React from "react";

const URL_BASE = "https://github.palantir.build/design/blueprint/blob/develop/resources/sketch";

const RESOURCES: IResourceProps[] = [
    { fileName: "Core Kit.sketch", lastUpdated: "August 22, 2018" },
    { fileName: "Blueprint Colors.sketchpalette", lastUpdated: "March 22, 2016" },
];

export const Resources: React.SFC = () => (
    <>{RESOURCES.map(resource => <ResourceCard key={resource.fileName} {...resource} />)}</>
);

interface IResourceProps {
    fileName: string;
    lastUpdated: string;
}

class ResourceCard extends React.PureComponent<IResourceProps> {
    public render() {
        return (
            <Card className="blueprint-resource" interactive={true} onClick={this.handleClick}>
                <span>{this.props.fileName}</span>
                <small>Last updated {this.props.lastUpdated}</small>
            </Card>
        );
    }

    private handleClick = () => download(`${URL_BASE}/${this.props.fileName}`);
}
