/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
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

import { Classes, Keys } from "../../common";
import { DISPLAYNAME_PREFIX, removeNonHTMLProps } from "../../common/props";

interface AccessibleButtonProps {
    /** Tag name used to render button */
    tagName?: keyof JSX.IntrinsicElements;

    /**
     * prevents onClick from firing and hooks up not-allowed cursor,
     * consumer is responsible for applying other disabled styling
     */
    disabled?: boolean;

    className?: string;

    /** event may be mouse event or keyboard event if triggered by enter or space key when focused */
    onClick: (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent) => void;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = props => {
    const { disabled, tagName = "span", className, onClick: onClickFromProps, children, ...htmlProps } = props;

    const NS = Classes.getClassNamespace();

    const onClick = React.useCallback(
        (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent) => {
            if (disabled) {
                return;
            }

            if (onClickFromProps) {
                onClickFromProps(event);
            }
        },
        [disabled, onClickFromProps],
    );

    const onKeyDown = React.useCallback(
        (event: React.KeyboardEvent) => {
            if (Keys.isKeyboardClick(event.keyCode)) {
                event.preventDefault();
                onClick(event);
            }
        },
        [onClick],
    );

    return React.createElement(
        tagName,
        {
            tabIndex: 0,
            ...removeNonHTMLProps(htmlProps),
            // below props should not be overridden
            onClick,
            onKeyDown,
            className: classNames(className, `${NS}-accessible-button`, { [Classes.DISABLED]: disabled }),
            role: "button",
            "aria-disabled": disabled,
        },
        children,
    );
};

AccessibleButton.displayName = `${DISPLAYNAME_PREFIX}.AccessibleButton`;
