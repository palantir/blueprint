import { memo } from "react";

import { Classes, Tooltip } from "@blueprintjs/core";

import { HeadlessComparisonCard } from "./HeadlessComparisonCard";
import { TooltipHeadlessBaseUI, TooltipHeadlessRadix } from "@blueprintjs/core";

export const TooltipComparison = memo(() => {
    // using JSX instead of strings for all content so the tooltips will re-render
    // with every update for dark theme inheritance.
    const lotsOfText = (
        <span>
            In facilisis scelerisque dui vel dignissim. Sed nunc orci, ultricies congue vehicula quis, facilisis a orci.
        </span>
    );

    const jsxContent = (
        <em>
            This tooltip contains an <strong>em</strong> tag.
        </em>
    );

    return (
        <HeadlessComparisonCard label="Tooltip" width={400}>
            <Tooltip className={Classes.TOOLTIP_INDICATOR} content={<span>Regular tooltip</span>}>
                Regular target
            </Tooltip>
            <TooltipHeadlessBaseUI content={<span>Headless BaseUI tooltip</span>} className={Classes.TOOLTIP_INDICATOR}>
                <span>Headless BaseUI target</span>
            </TooltipHeadlessBaseUI>
            <TooltipHeadlessRadix content={<span>Headless Radix tooltip</span>} className={Classes.TOOLTIP_INDICATOR}>
                <span>Headless Radix target</span>
            </TooltipHeadlessRadix>
            <div>
                Inline text can have{" "}
                <Tooltip className={Classes.TOOLTIP_INDICATOR} content={jsxContent}>
                    a tooltip.
                </Tooltip>
            </div>
            <div>
                Headless BaseUI inline text can have{" "}
                <TooltipHeadlessBaseUI className={Classes.TOOLTIP_INDICATOR} content={jsxContent}>
                    a tooltip.
                </TooltipHeadlessBaseUI>
            </div>
            <div>
                Headless Radix inline text can have{" "}
                <TooltipHeadlessRadix className={Classes.TOOLTIP_INDICATOR} content={jsxContent}>
                    a tooltip.
                </TooltipHeadlessRadix>
            </div>
            <div>
                <Tooltip content={lotsOfText}>Or, hover anywhere over this whole line.</Tooltip>
            </div>
            <div>
                <TooltipHeadlessBaseUI content={lotsOfText}>
                    Or, hover anywhere over this whole headless BaseUI line.
                </TooltipHeadlessBaseUI>
            </div>
            <div>
                <TooltipHeadlessRadix content={lotsOfText}>
                    Or, hover anywhere over this whole headless Radix line.
                </TooltipHeadlessRadix>
            </div>
            <div>
                This line's tooltip{" "}
                <Tooltip className={Classes.TOOLTIP_INDICATOR} content={<span>disabled</span>} disabled={true}>
                    is disabled.
                </Tooltip>
            </div>
            <div>
                This line's headless BaseUI tooltip{" "}
                <TooltipHeadlessBaseUI
                    className={Classes.TOOLTIP_INDICATOR}
                    content={<span>disabled</span>}
                    disabled={true}
                >
                    is disabled.
                </TooltipHeadlessBaseUI>
            </div>
            <div>
                This line's headless Radix tooltip{" "}
                <TooltipHeadlessRadix
                    className={Classes.TOOLTIP_INDICATOR}
                    content={<span>disabled</span>}
                    disabled={true}
                >
                    is disabled.
                </TooltipHeadlessRadix>
            </div>
            <div>
                This line's tooltip{" "}
                <Tooltip
                    className={Classes.TOOLTIP_INDICATOR}
                    content={<span>This tooltip has the minimal style applied!</span>}
                    minimal={true}
                >
                    is minimal.
                </Tooltip>
            </div>
            <div>
                This line's headless BaseUI tooltip{" "}
                <TooltipHeadlessBaseUI
                    className={Classes.TOOLTIP_INDICATOR}
                    content={<span>This tooltip has the minimal style applied!</span>}
                    minimal={true}
                >
                    is minimal.
                </TooltipHeadlessBaseUI>
            </div>
            <div>
                This line's headless Radix tooltip{" "}
                <TooltipHeadlessRadix
                    className={Classes.TOOLTIP_INDICATOR}
                    content={<span>This tooltip has the minimal style applied!</span>}
                    minimal={true}
                >
                    is minimal.
                </TooltipHeadlessRadix>
            </div>
            {/* <div>
                This line's tooltip{" "}
                <TooltipHeadlessBaseUI
                    compact={true}
                    content={
                        <span>
                            Use <Code>{`compact={true}`}</Code> in data-dense UIs
                        </span>
                    }
                    isOpen={true}
                >
                    is controlled by external state.
                </TooltipHeadlessBaseUI>
                <Switch
                    checked={isOpen}
                    label="Open"
                    onChange={e => {
                        setIsOpen(e.currentTarget.checked);
                    }}
                    style={{ display: "inline-block", marginBottom: 0, marginLeft: 20 }}
                />
            </div> */}
            <div>
                <Tooltip
                    className={Classes.TOOLTIP_INDICATOR}
                    content="primary"
                    intent="primary"
                    placement="left"
                    usePortal={false}
                >
                    Available
                </Tooltip>{" "}
                <Tooltip
                    className={Classes.TOOLTIP_INDICATOR}
                    content="success"
                    intent="success"
                    placement="top"
                    usePortal={false}
                >
                    in the full
                </Tooltip>{" "}
                <Tooltip
                    className={Classes.TOOLTIP_INDICATOR}
                    content="warning"
                    intent="warning"
                    placement="bottom"
                    usePortal={false}
                >
                    range of
                </Tooltip>{" "}
                <Tooltip
                    className={Classes.TOOLTIP_INDICATOR}
                    content="danger"
                    intent="danger"
                    placement="right"
                    usePortal={false}
                >
                    visual intents!
                </Tooltip>
            </div>
            <div>
                <TooltipHeadlessBaseUI
                    className={Classes.TOOLTIP_INDICATOR}
                    content="primary"
                    intent="primary"
                    placement="left"
                    usePortal={false}
                >
                    Headless BaseUI available
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
            <div>
                <TooltipHeadlessRadix
                    className={Classes.TOOLTIP_INDICATOR}
                    content="primary"
                    intent="primary"
                    placement="left"
                    usePortal={false}
                >
                    Headless Radix available
                </TooltipHeadlessRadix>{" "}
                <TooltipHeadlessRadix
                    className={Classes.TOOLTIP_INDICATOR}
                    content="success"
                    intent="success"
                    placement="top"
                    usePortal={false}
                >
                    in the full
                </TooltipHeadlessRadix>{" "}
                <TooltipHeadlessRadix
                    className={Classes.TOOLTIP_INDICATOR}
                    content="warning"
                    intent="warning"
                    placement="bottom"
                    usePortal={false}
                >
                    range of
                </TooltipHeadlessRadix>{" "}
                <TooltipHeadlessRadix
                    className={Classes.TOOLTIP_INDICATOR}
                    content="danger"
                    intent="danger"
                    placement="right"
                    usePortal={false}
                >
                    visual intents!
                </TooltipHeadlessRadix>
            </div>
        </HeadlessComparisonCard>
    );
});
