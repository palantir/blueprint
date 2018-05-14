/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Classes, H3, InputGroup, NonIdealState } from "@blueprintjs/core";
import { smartSearch } from "@blueprintjs/docs-theme";

import classNames from "classnames";
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
        // tslint:disable-next-line:no-submodule-imports
        icons: require("@blueprintjs/icons/resources/icons/icons.json"),
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
    }

    public render() {
        const groupElements = Object.keys(this.iconGroups)
            .sort()
            .map(this.maybeRenderIconGroup, this)
            .filter(group => group != null);
        return (
            <div className="docs-icons">
                <InputGroup
                    className={classNames(Classes.LARGE, Classes.FILL)}
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
                    <H3>{groupName}</H3>
                    {iconElements}
                </div>
            );
        }

        return undefined;
    }

    private renderZeroState() {
        return <NonIdealState className={Classes.TEXT_MUTED} icon="zoom-out" description="No icons found" />;
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
