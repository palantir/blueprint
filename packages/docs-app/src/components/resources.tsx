/*
 * Copyright 2019 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Callout, Card } from "@blueprintjs/core";
import download from "downloadjs";
import * as React from "react";

const URL_BASE = "https://raw.githubusercontent.com/palantir/blueprint/develop/resources/sketch";

const RESOURCES: IResourceProps[] = [
    { fileName: "blueprint-core-kit.sketch", lastUpdated: "August 22, 2018" },
    { fileName: "blueprint-colors.sketchpalette", lastUpdated: "March 22, 2016" },
];

export const Resources: React.SFC = () => (
    <>
        <div className="blueprint-resources">
            {RESOURCES.map(resource => <ResourceCard key={resource.fileName} {...resource} />)}
        </div>
        <Callout title="Missing fonts?" intent="warning">
            Download Apple's San Francisco font directly from the source:{" "}
            <a href="https://developer.apple.com/fonts/" target="_blank" rel="noopener noreferrer">https://developer.apple.com/fonts/</a>
        </Callout>
    </>
);

interface IResourceProps {
    fileName: string;
    lastUpdated: string;
}

class ResourceCard extends React.PureComponent<IResourceProps> {
    public render() {
        return (
            <Card className="blueprint-resource" interactive={true} onClick={this.handleClick}>
                <div className="blueprint-resource-title">{this.props.fileName}</div>
                <small>Last updated {this.props.lastUpdated}</small>
            </Card>
        );
    }

    private handleClick = () => download(`${URL_BASE}/${encodeURI(this.props.fileName)}`);
}
