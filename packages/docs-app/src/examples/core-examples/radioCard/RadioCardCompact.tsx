import { useState } from "react";

import { RadioCard, RadioGroup } from "@blueprintjs/core";

export default function RadioCardCompact() {
    const [selectedValue, setSelectedValue] = useState<string | undefined>();

    return (
        <RadioGroup
            className="docs-control-card-group-row"
            selectedValue={selectedValue}
            onChange={event => setSelectedValue(event.currentTarget.value)}
        >
            <RadioCard compact={true} label="Soup" value="soup" />
            <RadioCard compact={true} label="Salad" value="salad" />
            <RadioCard compact={true} label="Sandwich" value="sandwich" />
        </RadioGroup>
    );
}
