/* !
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

import * as React from "react";

import { Tag, Text } from "@blueprintjs/core";

interface IMultiSelectCustomTargetProps {
    count: number;
}

export const MultiSelectCustomTarget: React.FC<IMultiSelectCustomTargetProps> = ({ count }) => {
    return (
        <Tag
            large={true}
            round={true}
            minimal={true}
            interactive={true}
            intent={"primary"}
            className="docs-custom-target"
        >
            <div className="docs-custom-target-content">
                <Text className={"docs-custom-target-text"}>Custom Target</Text>
                <Tag intent={"primary"} round={true}>
                    {count}
                </Tag>
            </div>
        </Tag>
    );
};
