/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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

import classNames from "classnames";
import * as React from "react";

import {
    Boundary,
    Classes,
    CollapsibleList,
    H5,
    IMenuItemProps,
    Label,
    MenuItem,
    RadioGroup,
    Slider,
} from "@blueprintjs/core";
import { Example, handleStringChange, IExampleProps } from "@blueprintjs/docs-theme";

export interface ICollapsibleListExampleState {
    collapseFrom?: Boundary;
    visibleItemCount?: number;
}

const COLLAPSE_FROM_RADIOS = [
    { label: "Start", value: Boundary.START.toString() },
    { label: "End", value: Boundary.END.toString() },
];

export class CollapsibleListExample extends React.PureComponent<IExampleProps, ICollapsibleListExampleState> {
    public state: ICollapsibleListExampleState = {
        collapseFrom: Boundary.START,
        visibleItemCount: 3,
    };

    private handleChangeCollapse = handleStringChange((collapseFrom: Boundary) => this.setState({ collapseFrom }));

    public render() {
        const options = (
            <>
                <H5>Props</H5>
                <Label>Visible items</Label>
                <Slider
                    max={6}
                    onChange={this.handleChangeCount}
                    showTrackFill={false}
                    value={this.state.visibleItemCount}
                />
                <RadioGroup
                    name="collapseFrom"
                    inline={true}
                    label="Collapse from"
                    onChange={this.handleChangeCollapse}
                    options={COLLAPSE_FROM_RADIOS}
                    selectedValue={this.state.collapseFrom.toString()}
                />
            </>
        );

        return (
            <Example options={options} {...this.props}>
                <CollapsibleList
                    {...this.state}
                    className={Classes.BREADCRUMBS}
                    dropdownTarget={<span className={Classes.BREADCRUMBS_COLLAPSED} />}
                    visibleItemRenderer={this.renderBreadcrumb}
                >
                    <MenuItem icon="folder-close" text="All files" href="#" />
                    <MenuItem icon="folder-close" text="Users" href="#" />
                    <MenuItem icon="folder-close" text="Jane Person" href="#" />
                    <MenuItem icon="folder-close" text="My documents" href="#" />
                    <MenuItem icon="folder-close" text="Classy dayjob" href="#" />
                    <MenuItem icon="document" text="How to crush it" />
                </CollapsibleList>
            </Example>
        );
    }

    private renderBreadcrumb(props: IMenuItemProps) {
        if (props.href != null) {
            return <a className={Classes.BREADCRUMB}>{props.text}</a>;
        } else {
            return <span className={classNames(Classes.BREADCRUMB, Classes.BREADCRUMB_CURRENT)}>{props.text}</span>;
        }
    }

    private handleChangeCount = (visibleItemCount: number) => this.setState({ visibleItemCount });
}
