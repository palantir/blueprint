/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import classNames from "classnames";

import { Classes } from "@blueprintjs/core";

import { TooltipComparison } from "./TooltipComparison";

export const HeadlessComparison: React.FC = () => {
    return (
        <div className="headless-comparison-root">
            <HeadlessComparisonContainer />
            <HeadlessComparisonContainer isDark={true} />
        </div>
    );
};

HeadlessComparison.displayName = "DemoApp.HeadlessComparison";

const HeadlessComparisonContainer: React.FC<{ isDark?: boolean }> = ({ isDark = false }) => {
    const className = isDark ? Classes.DARK : undefined;
    return (
        <div className={classNames("headless-comparison-container", className)}>
            <TooltipComparison />
        </div>
    );
};

HeadlessComparisonContainer.displayName = "DemoApp.HeadlessComparisonContainer";
