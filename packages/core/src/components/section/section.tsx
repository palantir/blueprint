/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
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

import { IconName, IconNames } from "@blueprintjs/icons";

import { Classes, Elevation } from "../../common";
import { DISPLAYNAME_PREFIX, MaybeElement, Props } from "../../common/props";
import { Card, CardProps } from "../card/card";
import { Divider } from "../divider/divider";
import { H6 } from "../html/html";
import { Icon } from "../icon/icon";
import { Tab, TabId, TabProps } from "../tabs/tab";
import { Tabs, TabsProps } from "../tabs/tabs";

export interface SectionProps
    extends Props,
        Omit<CardProps, "interactive" | "onClick" | "elevation" | "title">,
        Omit<React.RefAttributes<HTMLDivElement>, "title"> {
    /**
     * Name of a Blueprint UI icon (or an icon element) to render in the
     * section's header. Note that the header will only be rendered if `sectionTitle` is
     * provided.
     */
    icon?: IconName | MaybeElement;

    /**
     * Title of the section.
     */
    title?: JSX.Element | string;

    /**
     * Sub-title of the section.
     * Note that the header will only be rendered if `sectionTitle` is provided.
     */
    subtitle?: JSX.Element | string;

    /**
     * Use tabs to define the content. If enabled, children will be ignored.
     */
    tabDefinitions?: TabProps[];

    tabsProps?: Omit<TabsProps, "vertical" | "children" | "large" | "fill" | "id">;

    /**
     * Element to render on the right side of the section header
     */
    rightItem?: JSX.Element;

    /** Whether this section should use small styles. */
    small?: boolean;

    collapsible?: boolean;

    collapsedByDefault?: boolean;
}

/**
 * Section component.
 *
 * @see https://blueprintjs.com/docs/#core/components/section
 */
export const Section: React.FC<SectionProps> = React.forwardRef((props, ref) => {
    const {
        className,
        icon,
        title,
        rightItem,
        subtitle,
        children,
        tabDefinitions,
        tabsProps,
        small,
        collapsible,
        collapsedByDefault,
        ...cardProps
    } = props;
    const classes = classNames(Classes.SECTION, { [Classes.SMALL]: small }, className);

    const controlledSelectedTabId = tabsProps?.selectedTabId;
    const [selectedTabId, setSelectedTabId] = React.useState<TabId | undefined>(tabsProps?.defaultSelectedTabId);

    const [collapsed, setCollapsed] = React.useState<boolean | undefined>(collapsedByDefault ?? false);
    const toggleCollapsed = React.useCallback(() => setCollapsed(!collapsed), [collapsed]);
    const showContent = React.useMemo(() => {
        if (collapsible && collapsed) {
            return false;
        }

        return true;
    }, [collapsible, collapsed]);

    const maybeActieTabPanel: JSX.Element | undefined = tabDefinitions?.find(tab =>
        controlledSelectedTabId != null ? tab.id === controlledSelectedTabId : tab.id === selectedTabId,
    )?.panel;

    return (
        <Card elevation={Elevation.ZERO} className={classes} ref={ref} {...cardProps}>
            <div
                role={collapsible != null ? "button" : undefined}
                aria-pressed={collapsible != null ? collapsed : undefined}
                className={classNames(Classes.SECTION_HEADER, {
                    [Classes.INTERACTIVE]: collapsible,
                    [Classes.COLLAPSED]: !showContent,
                })}
                onClick={collapsible != null ? toggleCollapsed : undefined}
            >
                {(title != null || icon != null || subtitle != null) && (
                    <>
                        <div className={Classes.SECTION_HEADER_LEFT}>
                            {title && icon && (
                                <Icon icon={icon} aria-hidden={true} tabIndex={-1} className={Classes.TEXT_MUTED} />
                            )}

                            <div>
                                {title && <H6 className={Classes.SECTION_HEADER_TITLE}>{title}</H6>}
                                {title && subtitle && (
                                    <div className={classNames(Classes.TEXT_MUTED, Classes.SECTION_HEADER_SUB_TITLE)}>
                                        {subtitle}
                                    </div>
                                )}
                            </div>
                        </div>

                        {tabDefinitions && <Divider className={Classes.SECTION_HEADER_DIVIDER} />}
                    </>
                )}

                {tabDefinitions && (
                    <div style={{ alignSelf: "stretch" }}>
                        <Tabs selectedTabId={selectedTabId} onChange={setSelectedTabId} fill={true} {...tabsProps}>
                            {tabDefinitions.map(tabDefinition => (
                                <Tab key={tabDefinition.id} {...tabDefinition} panel={undefined} />
                            ))}
                        </Tabs>
                    </div>
                )}

                {rightItem && <div className={Classes.SECTION_HEADER_RIGHT}>{rightItem}</div>}

                {collapsible && (
                    <Icon
                        className={Classes.TEXT_MUTED}
                        icon={collapsed ? IconNames.CHEVRON_DOWN : IconNames.CHEVRON_UP}
                    />
                )}
            </div>
            {showContent && (maybeActieTabPanel != null ? maybeActieTabPanel : children)}
        </Card>
    );
});
Section.defaultProps = {};
Section.displayName = `${DISPLAYNAME_PREFIX}.Section`;
