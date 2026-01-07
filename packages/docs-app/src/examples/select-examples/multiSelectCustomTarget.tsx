/* !
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

import { Tag, Text } from "@blueprintjs/core";

interface IMultiSelectCustomTargetProps {
    count: number;
}

export const MultiSelectCustomTarget: React.FC<IMultiSelectCustomTargetProps> = ({ count }) => {
    return (
        <Tag
            className="docs-custom-target"
            intent={"primary"}
            interactive={true}
            minimal={true}
            round={true}
            size="large"
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
