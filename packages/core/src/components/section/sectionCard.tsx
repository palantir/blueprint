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
import { forwardRef } from "react";

import { Classes } from "../../common";
import { DISPLAYNAME_PREFIX, type HTMLDivProps, type Props } from "../../common/props";

export interface SectionCardProps extends Props, HTMLDivProps, React.RefAttributes<HTMLDivElement> {
    /**
     * Whether to render a bottom border below this card, separating it from the next sibling SectionCard.
     * When omitted, border visibility is inherited from the parent Section's `bordered` prop.
     */
    bordered?: boolean;

    /**
     * Whether to apply visual padding inside the content container element.
     *
     * @default true
     */
    padded?: boolean;
}

/**
 * Section card component.
 *
 * @see https://blueprintjs.com/docs/#core/components/section.section-card
 */
export const SectionCard: React.FC<SectionCardProps> = forwardRef((props, ref) => {
    const { bordered, className, children, padded = true, ...htmlProps } = props;
    const classes = classNames(
        Classes.SECTION_CARD,
        {
            [Classes.PADDED]: padded,
            [Classes.SECTION_CARD_BORDERED]: bordered === true,
            [Classes.SECTION_CARD_NOT_BORDERED]: bordered === false,
        },
        className,
    );
    return (
        <div className={classes} ref={ref} {...htmlProps}>
            {children}
        </div>
    );
});
SectionCard.displayName = `${DISPLAYNAME_PREFIX}.SectionCard`;
