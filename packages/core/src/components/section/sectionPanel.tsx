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

import { Classes } from "../../common";
import { DISPLAYNAME_PREFIX, HTMLDivProps, Props } from "../../common/props";

export interface SectionPanelProps extends Props, HTMLDivProps, React.RefAttributes<HTMLDivElement> {
    /**
     * Whether to apply visual padding inside the content container element.
     *
     * @default true
     */
    padded?: boolean;
}

/**
 * Section panel component.
 *
 * @see https://blueprintjs.com/docs/#core/components/section.section-panel
 */
export const SectionPanel: React.FC<SectionPanelProps> = React.forwardRef((props, ref) => {
    const { className, children, padded, ...htmlProps } = props;
    const classes = classNames(Classes.SECTION_PANEL, { [Classes.PADDED]: padded }, className);
    return (
        <div className={classes} ref={ref} {...htmlProps}>
            {children}
        </div>
    );
});
SectionPanel.defaultProps = {
    padded: true,
};
SectionPanel.displayName = `${DISPLAYNAME_PREFIX}.SectionPanel`;
