/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Classes, Icon, MenuItem, Slider } from "@blueprintjs/core";
import { BaseExample, handleStringChange } from "@blueprintjs/docs-theme";
import { IconClasses, IconName } from "@blueprintjs/icons";
import { ItemRenderer, Suggest } from "@blueprintjs/select";
import * as classNames from "classnames";

export interface IIconExampleState {
    iconName: IconName;
    iconSize: number;
    query: string;
}

export class IconExample extends BaseExample<IIconExampleState> {
    public state: IIconExampleState = {
        iconName: "calendar",
        iconSize: Icon.SIZE_STANDARD,
        query: "calendar",
    };

    protected renderExample() {
        return (
            <div className="docs-icon-example" style={{ height: MAX_ICON_SIZE, width: MAX_ICON_SIZE }}>
                <Icon {...this.state} />
            </div>
        );
    }

    protected renderOptions() {
        const { iconName, iconSize, query } = this.state;
        const suggestInputProps = {
            leftIconName: query === iconName ? iconName : "blank",
            // control suggest value so it can have initial value from state
            onChange: this.handleQueryChange,
            value: query,
        };
        return [
            [
                <label className={Classes.LABEL} key="icon-name-label">
                    Icon name
                </label>,
                <IconSuggest
                    key="icon-name"
                    inputProps={suggestInputProps}
                    items={ICON_NAMES.filter(item => item.indexOf(query) >= 0)}
                    itemRenderer={renderIconItem}
                    inputValueRenderer={this.renderIconValue}
                    noResults={<MenuItem disabled={true} text="No results" />}
                    onItemSelect={this.handleIconNameChange}
                    popoverProps={{ minimal: true }}
                />,
            ],
            [
                <label className={Classes.LABEL} key="icon-size-label">
                    Icon size
                </label>,
                <Slider
                    key="icon-size"
                    labelStepSize={MAX_ICON_SIZE / 5}
                    min={0}
                    max={MAX_ICON_SIZE}
                    showTrackFill={false}
                    value={iconSize}
                    onChange={this.handleIconSizeChange}
                />,
            ],
        ];
    }

    private renderIconValue(icon: IconName) {
        return icon;
    }

    private handleIconSizeChange = (iconSize: number) => this.setState({ iconSize });

    private handleIconNameChange = (iconName: IconName) => this.setState({ iconName, query: iconName });

    // tslint:disable-next-line:member-ordering
    private handleQueryChange = handleStringChange((query: string) => this.setState({ query }));
}

const IconSuggest = Suggest.ofType<IconName>();
const ICON_NAMES = Object.keys(IconClasses).map(
    (name: keyof typeof IconClasses) => IconClasses[name].replace("pt-icon-", "") as IconName,
);
const MAX_ICON_SIZE = 100;

const renderIconItem: ItemRenderer<IconName> = (icon, { handleClick, modifiers: { active } }) => {
    const classes = classNames({
        [Classes.ACTIVE]: active,
        [Classes.INTENT_PRIMARY]: active,
    });
    return <MenuItem className={classes} iconName={icon} key={icon} onClick={handleClick} text={icon} />;
};
