/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import React, { useCallback, useState } from "react";

import {
    AnchorButton,
    Classes,
    Icon,
    Intent,
    Menu,
    MenuItem,
    Popover,
    PopoverInteractionKind,
    PopoverPosition,
    Tag,
    Tooltip,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

export function OverlayFocusExample() {
    const [isTooltipOpen, setIsTooltipOpen] = useState(true);

    const handleTooltipClose = useCallback(() => {
        setIsTooltipOpen(false);
    }, []);

    return (
        <div className="overlay-example">
            <Popover
                content={<Warning />}
                enforceFocus={false}
                isOpen={isTooltipOpen}
                autoFocus={true}
                position={PopoverPosition.BOTTOM}
            >
                <Popover content={<MenuContainer />} position={PopoverPosition.BOTTOM_LEFT} minimal={true}>
                    <Tooltip content="Warnings" hoverOpenDelay={500} position={PopoverPosition.TOP}>
                        <AnchorButton
                            active={true}
                            aria-label="warnings"
                            icon={IconNames.WARNING_SIGN}
                            intent={Intent.WARNING}
                            outlined={true}
                            onClick={handleTooltipClose}
                        />
                    </Tooltip>
                </Popover>
            </Popover>
        </div>
    );
}

function Warning() {
    return (
        <div className="warning">
            <Icon icon={IconNames.WARNING_SIGN} />
            <strong>Warning:</strong> Here be dragons!
        </div>
    );
}

function MenuContainer() {
    return (
        <div className="menu">
            <div className="heading">
                <div className={Classes.TEXT_MUTED}>WARNINGS</div>
                <Tag minimal={true}>3</Tag>
            </div>
            <Popover
                content={<div>Etc..</div>}
                interactionKind={PopoverInteractionKind.HOVER}
                openOnTargetFocus={true}
                position={PopoverPosition.RIGHT_BOTTOM}
                minimal={true}
            >
                <div className="item">
                    Preferences
                    <Icon icon={IconNames.CaretRight} />
                </div>
            </Popover>
            <Menu className="warnings-menu">
                <MenuItem
                    icon={<Icon icon={IconNames.SYMBOL_CIRCLE} intent={Intent.WARNING} size={12} />}
                    text="Warning 1"
                    labelElement={<Icon icon={IconNames.ARROW_RIGHT} />}
                />
                <MenuItem
                    icon={<Icon icon={IconNames.SYMBOL_CIRCLE} intent={Intent.WARNING} size={12} />}
                    text="Warning 2"
                    labelElement={<Icon icon={IconNames.ARROW_RIGHT} />}
                />
                <MenuItem
                    icon={<Icon icon={IconNames.SYMBOL_CIRCLE} intent={Intent.WARNING} size={12} />}
                    text="Warning 3"
                    labelElement={<Icon icon={IconNames.ARROW_RIGHT} />}
                />
            </Menu>
        </div>
    );
}
