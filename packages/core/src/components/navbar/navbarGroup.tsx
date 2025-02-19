/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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

import { Alignment, Classes } from "../../common";
import { NAVBAR_GROUP_ALIGN_CENTER } from "../../common/errors";
import { DISPLAYNAME_PREFIX, type HTMLDivProps, type Props } from "../../common/props";
import { useValidateProps } from "../../hooks/useValidateProps";

export interface NavbarGroupProps extends Props, HTMLDivProps {
    /**
     * The side of the navbar on which the group should appear.
     * The `Alignment` enum provides constants for these values.
     *
     * @default Alignment.START
     */
    align?: Alignment;

    children?: React.ReactNode;
}

// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */

export const NavbarGroup: React.FC<NavbarGroupProps> = ({
    align = Alignment.START,
    children,
    className,
    ...htmlProps
}) => {
    const classes = classNames(Classes.NAVBAR_GROUP, Classes.alignmentClass(align), className);

    useValidateProps(() => {
        if (align === Alignment.CENTER) {
            console.warn(NAVBAR_GROUP_ALIGN_CENTER);
        }
    }, [align]);

    return (
        <div className={classes} {...htmlProps}>
            {children}
        </div>
    );
};

NavbarGroup.displayName = `${DISPLAYNAME_PREFIX}.NavbarGroup`;
