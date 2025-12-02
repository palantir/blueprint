/*
 * Copyright 2025 Palantir Technologies, Inc. All rights reserved.
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

import { useState } from "react";

import {
    Button,
    ButtonGroup,
    Classes,
    Code,
    H1,
    Popover,
    Switch,
    TooltipHeadlessBaseUI,
} from "@blueprintjs/core";
import { Example, type ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";

export const TooltipHeadlessBaseUIExample: React.FC<ExampleProps> = props => {
    const [isOpen, setIsOpen] = useState(false);

    // using JSX instead of strings for all content so the tooltips will re-render
    // with every update for dark theme inheritance.
    const lotsOfText = (
        <span>
            In facilisis scelerisque dui vel dignissim. Sed nunc orci, ultricies congue vehicula
            quis, facilisis a orci.
        </span>
    );

    const jsxContent = (
        <em>
            This tooltip contains an <strong>em</strong> tag.
        </em>
    );

    return (
        <Example options={false} {...props}>
            <div>
                Inline text can have{" "}
                <TooltipHeadlessBaseUI className={Classes.TOOLTIP_INDICATOR} content={jsxContent}>
                    a tooltip.
                </TooltipHeadlessBaseUI>
            </div>
            <div>
                <TooltipHeadlessBaseUI content={lotsOfText}>
                    Or, hover anywhere over this whole line.
                </TooltipHeadlessBaseUI>
            </div>
            <div>
                This line's tooltip{" "}
                <TooltipHeadlessBaseUI
                    className={Classes.TOOLTIP_INDICATOR}
                    content={<span>disabled</span>}
                    disabled={true}
                >
                    is disabled.
                </TooltipHeadlessBaseUI>
            </div>
            <div>
                This line's tooltip{" "}
                <TooltipHeadlessBaseUI
                    className={Classes.TOOLTIP_INDICATOR}
                    content={<span>This tooltip has the minimal style applied!</span>}
                    minimal={true}
                >
                    is minimal.
                </TooltipHeadlessBaseUI>
            </div>
            <div>
                This line's tooltip{" "}
                <TooltipHeadlessBaseUI
                    compact={true}
                    content={
                        <span>
                            Use <Code>{`compact={true}`}</Code> in data-dense UIs
                        </span>
                    }
                    isOpen={isOpen}
                >
                    is controlled by external state.
                </TooltipHeadlessBaseUI>
                <Switch
                    checked={isOpen}
                    label="Open"
                    onChange={handleBooleanChange(setIsOpen)}
                    style={{ display: "inline-block", marginBottom: 0, marginLeft: 20 }}
                />
            </div>
            <div>
                <TooltipHeadlessBaseUI
                    className={Classes.TOOLTIP_INDICATOR}
                    content="primary"
                    intent="primary"
                    placement="left"
                    usePortal={false}
                >
                    Available
                </TooltipHeadlessBaseUI>{" "}
                <TooltipHeadlessBaseUI
                    className={Classes.TOOLTIP_INDICATOR}
                    content="success"
                    intent="success"
                    placement="top"
                    usePortal={false}
                >
                    in the full
                </TooltipHeadlessBaseUI>{" "}
                <TooltipHeadlessBaseUI
                    className={Classes.TOOLTIP_INDICATOR}
                    content="warning"
                    intent="warning"
                    placement="bottom"
                    usePortal={false}
                >
                    range of
                </TooltipHeadlessBaseUI>{" "}
                <TooltipHeadlessBaseUI
                    className={Classes.TOOLTIP_INDICATOR}
                    content="danger"
                    intent="danger"
                    placement="right"
                    usePortal={false}
                >
                    visual intents!
                </TooltipHeadlessBaseUI>
            </div>
            <br />
            <Popover
                content={<H1>Popover!</H1>}
                placement="right"
                popoverClassName={Classes.POPOVER_CONTENT_SIZING}
            >
                <TooltipHeadlessBaseUI
                    content={<span>This button also has a popover!</span>}
                    openOnTargetFocus={false}
                    placement="right"
                    usePortal={false}
                >
                    <Button intent="success" text="Hover and click me" />
                </TooltipHeadlessBaseUI>
            </Popover>
            <br />

            <ButtonGroup>
                <TooltipHeadlessBaseUI content="Each" placement="bottom">
                    <Button intent="primary" text="Group" />
                </TooltipHeadlessBaseUI>
                <TooltipHeadlessBaseUI content="has" placement="bottom">
                    <Button intent="primary" text="of" />
                </TooltipHeadlessBaseUI>
                <TooltipHeadlessBaseUI content="a tooltip" placement="bottom">
                    <Button intent="primary" text="buttons" />
                </TooltipHeadlessBaseUI>
            </ButtonGroup>
        </Example>
    );
};
