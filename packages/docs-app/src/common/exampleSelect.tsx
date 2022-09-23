/* !
 * (c) Copyright 2022 Palantir Technologies Inc. All rights reserved.
 */

import React from "react";

import { Button, MenuItem } from "@blueprintjs/core";
import { ItemRendererProps, Select2 } from "@blueprintjs/select";

const Test = () => {
    const items = ["foo", "bar"];
    const [selectedItem, setSelectedItem] = React.useState<string | undefined>();
    const renderItem = React.useCallback((item: string, { handleClick, modifiers }: ItemRendererProps) => {
        return <MenuItem text={item} active={modifiers.active} onClick={handleClick} />;
    }, []);

    return (
        <Select2<string> items={items} itemRenderer={renderItem} onItemSelect={setSelectedItem}>
            <Button text={selectedItem} />
        </Select2>
    );
};
