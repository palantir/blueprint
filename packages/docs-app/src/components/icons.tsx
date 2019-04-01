/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
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

import { Classes, H3, InputGroup, NonIdealState } from "@blueprintjs/core";
import { smartSearch } from "@blueprintjs/docs-theme";
import * as React from "react";
import { DocsIcon, IDocsIconProps as IIcon } from "./docsIcon";

const ICONS_PER_ROW = 5;

export interface IIconsState {
    filter: string;
}

export interface IIconsProps {
    iconFilter?: (query: string, icon: IIcon) => boolean;
    iconRenderer?: (icon: IIcon, index: number) => JSX.Element;
    icons?: IIcon[];
}

export class Icons extends React.PureComponent<IIconsProps, IIconsState> {
    public static defaultProps: IIconsProps = {
        iconFilter: isIconFiltered,
        iconRenderer: renderIcon,
        // tslint:disable-next-line:no-submodule-imports
        icons: require("@blueprintjs/icons/resources/icons/icons.json"),
    };

    public state: IIconsState = {
        filter: "",
    };

    private iconGroups = initIconGroups(this.props.icons);

    public render() {
        const groupElements = Object.keys(this.iconGroups)
            .sort()
            .map(this.maybeRenderIconGroup, this)
            .filter(group => group != null);
        return (
            <div className="docs-icons">
                <InputGroup
                    autoFocus={true}
                    className={Classes.FILL}
                    large={true}
                    leftIcon="search"
                    placeholder="Search for icons..."
                    onChange={this.handleFilterChange}
                    type="search"
                    value={this.state.filter}
                />
                {groupElements.length > 0 ? groupElements : this.renderZeroState()}
            </div>
        );
    }

    private maybeRenderIconGroup(groupName: string, index: number) {
        const { iconRenderer } = this.props;
        const iconElements = this.getFilteredIcons(groupName).map(iconRenderer);
        if (iconElements.length === 0) {
            return null;
        }

        let padIndex = iconElements.length;
        while (iconElements.length % ICONS_PER_ROW > 0) {
            iconElements.push(<div className="docs-placeholder" key={`pad-${padIndex++}`} />);
        }
        return (
            <div className="docs-icon-group" key={index}>
                <H3>{groupName}</H3>
                {iconElements}
            </div>
        );
    }

    private renderZeroState() {
        return <NonIdealState className={Classes.TEXT_MUTED} icon="zoom-out" description="No icons found" />;
    }

    private getFilteredIcons(groupName: string) {
        const icons = this.iconGroups[groupName];
        if (this.state.filter === "") {
            return icons;
        }
        const { iconFilter } = this.props;
        return icons.filter(icon => iconFilter(this.state.filter, icon));
    }

    private handleFilterChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
        const filter = (e.target as HTMLInputElement).value;
        this.setState({ filter });
    };
}

function isIconFiltered(query: string, icon: IIcon) {
    return smartSearch(query, icon.displayName, icon.iconName, icon.tags, icon.group);
}

function renderIcon(icon: IIcon, index: number) {
    return <DocsIcon {...icon} key={index} />;
}

function initIconGroups(icons: IIcon[]) {
    const groups: Record<string, IIcon[]> = {};
    // group icons by group name
    for (const icon of icons) {
        if (groups[icon.group] == null) {
            groups[icon.group] = [];
        }
        groups[icon.group].push(icon);
    }
    // sort each group
    for (const group of Object.keys(groups)) {
        groups[group].sort((a, b) => a.iconName.localeCompare(b.iconName));
    }
    return groups;
}
