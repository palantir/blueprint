import { useState } from "react";

import { RadioCard, RadioGroup } from "@blueprintjs/core";

export default function RadioCardAlignIndicator() {
    const [selectedValue, setSelectedValue] = useState<string | undefined>();

    return (
        <RadioGroup
            className="docs-control-card-group-row"
            selectedValue={selectedValue}
            onChange={event => setSelectedValue(event.currentTarget.value)}
        >
            <RadioCard alignIndicator="start" label="Start-aligned" value="start" />
            <RadioCard alignIndicator="end" label="End-aligned" value="end" />
        </RadioGroup>
    );
}
