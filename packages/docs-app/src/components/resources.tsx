/*
 * Copyright 2019 Palantir Technologies, Inc. All rights reserved.
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
            {RESOURCES.map(resource => (
                <ResourceCard key={resource.fileName} {...resource} />
            ))}
        </div>
        <Callout title="Missing fonts?" intent="warning">
            Download Apple's San Francisco font directly from the source:{" "}
            <a href="https://developer.apple.com/fonts/" target="_blank" rel="noopener noreferrer">
                https://developer.apple.com/fonts/
            </a>
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
