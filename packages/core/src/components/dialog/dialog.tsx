/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
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
import { useMemo, useRef } from "react";

import { type IconName, IconSize, SmallCross } from "@blueprintjs/icons";

import { Classes, DISPLAYNAME_PREFIX, type MaybeElement, mergeRefs, type Props } from "../../common";
import * as Errors from "../../common/errors";
import { uniqueId } from "../../common/utils";
import { useValidateProps } from "../../hooks/useValidateProps";
import { Button } from "../button/buttons";
import { H2 } from "../html/html";
import { Icon } from "../icon/icon";
import type { BackdropProps, OverlayableProps } from "../overlay/overlayProps";
import { Overlay2 } from "../overlay2/overlay2";

export interface DialogProps extends OverlayableProps, BackdropProps, Props {
    /** Dialog contents. */
    children?: React.ReactNode;

    /**
     * Ref attached to the `Classes.DIALOG_CONTAINER` element.
     */
    containerRef?: React.Ref<HTMLDivElement>;

    /**
     * Toggles the visibility of the overlay and its children.
     * This prop is required because the component is controlled.
     *
     * @default false
     */
    isOpen?: boolean;

    /**
     * Dialog always has a backdrop so this prop cannot be overriden.
     */
    hasBackdrop?: never;

    /**
     * Name of a Blueprint UI icon (or an icon element) to render in the
     * dialog's header. Note that the header will only be rendered if `title` is
     * not null or undefined.
     */
    icon?: IconName | MaybeElement;

    /**
     * Whether to show the close button in the dialog's header.
     * Note that the header will only be rendered if `title` is not null or undefined.
     *
     * @default true
     */
    isCloseButtonShown?: boolean;

    /**
     * @default "dialog"
     */
    role?: Extract<React.AriaRole, "dialog" | "alertdialog">;

    /**
     * CSS styles to apply to the dialog.
     *
     * @default {}
     */
    style?: React.CSSProperties;

    /**
     * Title of the dialog. If not null or undefined, an element with `Classes.DIALOG_HEADER`
     * will be rendered inside the dialog before any children elements.
     * An empty string `""` will render the header without a visible title (useful for
     * showing the close button without a title).
     */
    title?: React.ReactNode;

    /**
     * HTML heading component to use for the dialog title.
     *
     * @default H2
     */
    titleTagName?: React.ElementType<React.HTMLAttributes<HTMLElement>>;

    /**
     * Name of the transition for internal `CSSTransition`. Providing your own
     * name here will require defining new CSS transition properties.
     */
    transitionName?: string;

    /**
     * ID of the element that contains title or label text for this dialog.
     *
     * By default, if the `title` prop is supplied, this component will generate
     * a unique ID for the `<H5>` title element and use that ID here.
     */
    "aria-labelledby"?: string;

    /**
     * ID of an element that contains description text inside this dialog.
     */
    "aria-describedby"?: string;
}

/**
 * Dialog component.
 *
 * @see https://blueprintjs.com/docs/#core/components/dialog
 */
export const Dialog: React.FC<DialogProps> & { displayName?: string } = props => {
    const {
        canOutsideClickClose = true,
        children,
        className,
        containerRef,
        icon,
        isCloseButtonShown,
        isOpen = false,
        onClose,
        role = "dialog",
        style,
        title,
        titleTagName: TitleTagName = H2,
        ...overlayProps
    } = props;
    const childRef = useRef<HTMLDivElement>(null);
    const titleId = useMemo(() => `title-${uniqueId("bp-dialog")}`, []);

    useValidateProps(() => {
        if (title == null) {
            if (props.icon != null) {
                console.warn(Errors.DIALOG_WARN_NO_HEADER_ICON);
            }
            if (props.isCloseButtonShown != null) {
                console.warn(Errors.DIALOG_WARN_NO_HEADER_CLOSE_BUTTON);
            }
        }
    }, [title, props.icon, props.isCloseButtonShown]);

    return (
        <Overlay2
            {...overlayProps}
            isOpen={isOpen}
            canOutsideClickClose={canOutsideClickClose}
            className={Classes.OVERLAY_SCROLL_CONTAINER}
            childRef={childRef}
            hasBackdrop={true}
            onClose={onClose}
        >
            <div className={Classes.DIALOG_CONTAINER} ref={mergeRefs(containerRef, childRef)}>
                <div
                    aria-describedby={overlayProps["aria-describedby"]}
                    aria-labelledby={overlayProps["aria-labelledby"] || (title != null ? titleId : undefined)}
                    aria-modal={overlayProps.enforceFocus ?? true}
                    className={classNames(Classes.DIALOG, className)}
                    role={role}
                    style={style}
                >
                    {title != null && (
                        <div className={Classes.DIALOG_HEADER}>
                            <Icon icon={icon} size={IconSize.STANDARD} aria-hidden={true} tabIndex={-1} />
                            <TitleTagName id={titleId}>{title}</TitleTagName>
                            {isCloseButtonShown !== false && (
                                <Button
                                    aria-label="Close"
                                    className={Classes.DIALOG_CLOSE_BUTTON}
                                    icon={<SmallCross size={IconSize.STANDARD} />}
                                    onClick={onClose}
                                    variant="minimal"
                                />
                            )}
                        </div>
                    )}
                    {children}
                </div>
            </div>
        </Overlay2>
    );
};

Dialog.displayName = `${DISPLAYNAME_PREFIX}.Dialog`;
