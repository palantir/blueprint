import { useState } from "react";

import { RadioCard, RadioGroup } from "@blueprintjs/core";

export default function RadioCardDisabled() {
    const [selectedValue, setSelectedValue] = useState<string | undefined>();

    return (
        <RadioGroup
            className="docs-control-card-group-row"
            selectedValue={selectedValue}
            onChange={event => setSelectedValue(event.currentTarget.value)}
        >
            <RadioCard disabled={true} label="Soup" value="soup" />
            <RadioCard disabled={true} label="Salad" value="salad" />
            <RadioCard disabled={true} label="Sandwich" value="sandwich" />
        </RadioGroup>
    );
}
