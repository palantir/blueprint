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

import { IconName } from "@blueprintjs/icons";

import { Classes, Elevation } from "../../common";
import { SECTION_HEADER } from "../../common/classes";
import { DISPLAYNAME_PREFIX, MaybeElement, Props } from "../../common/props";
import { Card, CardProps } from "../card/card";
import { H6 } from "../html/html";
import { Icon } from "../icon/icon";

export interface SectionProps
    extends Props,
        Omit<CardProps, "interactive" | "onClick" | "elevation">,
        React.RefAttributes<HTMLDivElement> {
    /**
     * Name of a Blueprint UI icon (or an icon element) to render in the
     * section's header. Note that the header will only be rendered if `sectionTitle` is
     * provided.
     */
    icon?: IconName | MaybeElement;

    /**
     * Title of the section.
     */
    sectionTitle?: JSX.Element | string;

    /**
     * Sub-title of the section.
     * Note that the header will only be rendered if `sectionTitle` is provided.
     */
    subtitle?: JSX.Element | string;

    /**
     * Element to render on the right side of the section header
     */
    rightItem?: JSX.Element;

    /** Whether this section should use small styles. */
    small?: boolean;
}

/**
 * Section component.
 *
 * @see https://blueprintjs.com/docs/#core/components/section
 */
export const Section: React.FC<SectionProps> = React.forwardRef((props, ref) => {
    const { className, icon, sectionTitle, rightItem, subtitle, children, small, ...cardProps } = props;
    const classes = classNames(Classes.SECTION, { [Classes.SMALL]: small }, className);
    return (
        <Card elevation={Elevation.ZERO} className={classes} ref={ref} {...cardProps}>
            <div className={SECTION_HEADER}>
                <div className={Classes.SECTION_HEADER_LEFT}>
                    {sectionTitle && icon && (
                        <Icon icon={icon} aria-hidden={true} tabIndex={-1} className={Classes.TEXT_MUTED} />
                    )}
                    <div>
                        {sectionTitle && <H6 className={Classes.SECTION_HEADER_TITLE}>{sectionTitle}</H6>}
                        {sectionTitle && subtitle && (
                            <div className={classNames(Classes.TEXT_MUTED, Classes.SECTION_HEADER_SUB_TITLE)}>
                                {subtitle}
                            </div>
                        )}
                    </div>
                </div>
                {rightItem && <div className={Classes.SECTION_HEADER_LEFT}>{rightItem}</div>}
            </div>

            {children}
        </Card>
    );
});
Section.defaultProps = {};
Section.displayName = `${DISPLAYNAME_PREFIX}.Section`;
