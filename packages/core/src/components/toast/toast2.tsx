/*
 * Copyright 2024 Palantir Technologies, Inc. All rights reserved.
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

import { Cross } from "@blueprintjs/icons";

import { Classes } from "../../common";
import { DISPLAYNAME_PREFIX } from "../../common/props";
import { useTimeout } from "../../hooks/useTimeout";
import { ButtonGroup } from "../button/buttonGroup";
import { AnchorButton, Button } from "../button/buttons";
import { Icon } from "../icon/icon";

import type { ToastProps } from "./toastProps";

/**
 * Toast2 component.
 *
 * Compared to the deprecated `Toast` component, this is a function component which forwards DOM
 * refs and is thus compatible with `Overlay2`.
 *
 * @see https://blueprintjs.com/docs/#core/components/toast2
 */
export const Toast2 = React.forwardRef<HTMLDivElement, ToastProps>((props, ref) => {
    const { action, className, icon, intent, isCloseButtonShown = true, message, onDismiss, timeout = 5000 } = props;

    const [isTimeoutStarted, setIsTimeoutStarted] = React.useState(false);
    const startTimeout = React.useCallback(() => setIsTimeoutStarted(true), []);
    const clearTimeout = React.useCallback(() => setIsTimeoutStarted(false), []);

    // Per docs: "Providing a value less than or equal to 0 will disable the timeout (this is discouraged)."
    const isTimeoutEnabled = timeout != null && timeout > 0;

    // timeout is triggered & cancelled by updating `isTimeoutStarted` state
    useTimeout(
        () => {
            triggerDismiss(true);
        },
        isTimeoutStarted && isTimeoutEnabled ? timeout : null,
    );

    // start timeout on mount or change, cancel on unmount
    React.useEffect(() => {
        if (isTimeoutEnabled) {
            startTimeout();
        } else {
            clearTimeout();
        }
        return clearTimeout;
    }, [clearTimeout, startTimeout, isTimeoutEnabled, timeout]);

    const triggerDismiss = React.useCallback(
        (didTimeoutExpire: boolean) => {
            clearTimeout();
            onDismiss?.(didTimeoutExpire);
        },
        [clearTimeout, onDismiss],
    );

    const handleCloseClick = React.useCallback(() => triggerDismiss(false), [triggerDismiss]);

    const handleActionClick = React.useCallback(
        (e: React.MouseEvent<HTMLElement>) => {
            action?.onClick?.(e);
            triggerDismiss(false);
        },
        [action, triggerDismiss],
    );

    return (
        <div
            className={classNames(Classes.TOAST, Classes.intentClass(intent), className)}
            // Pause timeouts if users are hovering over or click on the toast. The toast may have
            // actions the user wants to click. It'd be a poor experience to "pull the toast" out
            // from under them.
            onBlur={startTimeout}
            onFocus={clearTimeout}
            onMouseEnter={clearTimeout}
            onMouseLeave={startTimeout}
            ref={ref}
            tabIndex={0}
        >
            <Icon icon={icon} />
            <span className={Classes.TOAST_MESSAGE} role="alert">
                {message}
            </span>
            <ButtonGroup variant="minimal">
                {action && <AnchorButton {...action} intent={undefined} onClick={handleActionClick} />}
                {isCloseButtonShown && <Button aria-label="Close" icon={<Cross />} onClick={handleCloseClick} />}
            </ButtonGroup>
        </div>
    );
});
Toast2.displayName = `${DISPLAYNAME_PREFIX}.Toast2`;
