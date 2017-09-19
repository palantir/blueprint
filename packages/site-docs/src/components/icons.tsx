/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as React from "react";

import { smartSearch } from "@blueprintjs/docs";

import { DocsIcon, IDocsIconProps as IIcon } from "./docsIcon";

const ICONS_PER_ROW = 5;

type GroupedIcons = Record<string, IIcon[]>;

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
        icons: require<IIcon[]>("@blueprintjs/core/resources/icons/icons.json"),
    };

    public state: IIconsState = {
        filter: "",
    };

    private iconGroups: GroupedIcons;

    public constructor(props?: IIconsProps, context?: any) {
        super(props, context);

        this.iconGroups = props.icons.reduce<GroupedIcons>((groups, icon: IIcon) => {
            if (groups[icon.group] == null) {
                groups[icon.group] = [];
            }
            groups[icon.group].push(icon);
            return groups;
        }, {});
        for (const group of Object.keys(this.iconGroups)) {
            this.iconGroups[group].sort((a, b) => a.name.localeCompare(b.name));
        }
    }

    public render() {
        const groupElements = Object.keys(this.iconGroups)
            .sort()
            .map(this.maybeRenderIconGroup, this)
            .filter(group => group != null);
        return (
            <div className="docs-icons">
                <div className="pt-input-group pt-large pt-fill">
                    <span className="pt-icon pt-icon-search" />
                    <input
                        className="pt-input pt-fill"
                        dir="auto"
                        onChange={this.handleFilterChange}
                        placeholder="Search for icons..."
                        type="search"
                        value={this.state.filter}
                    />
                </div>
                {groupElements.length > 0 ? groupElements : this.renderZeroState()}
            </div>
        );
    }

    private maybeRenderIconGroup(groupName: string, index: number) {
        const icons = this.iconGroups[groupName];
        const { iconFilter, iconRenderer } = this.props;
        const iconElements = icons.filter(icon => iconFilter(this.state.filter, icon)).map(iconRenderer);

        if (iconElements.length > 0) {
            let padIndex = icons.length;
            while (iconElements.length % ICONS_PER_ROW > 0) {
                iconElements.push(<div className="docs-placeholder" key={padIndex++} />);
            }
            return (
                <div className="docs-icon-group" key={index}>
                    <h3>{groupName}</h3>
                    {iconElements}
                </div>
            );
        }

        return undefined;
    }

    private renderZeroState() {
        return <div className="pt-running-text pt-text-muted icons-zero-state">No icons found.</div>;
    }

    private handleFilterChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
        const filter = (e.target as HTMLInputElement).value;
        this.setState({ filter });
    };
}

function isIconFiltered(query: string, icon: IIcon) {
    return smartSearch(query, icon.name, icon.className, icon.tags, icon.group);
}

function renderIcon(icon: IIcon, index: number) {
    return <DocsIcon {...icon} key={index} />;
}
