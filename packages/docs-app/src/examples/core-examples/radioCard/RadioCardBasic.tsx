import { useState } from "react";

import { RadioCard, RadioGroup } from "@blueprintjs/core";

export default function RadioCardBasic() {
    const [selectedValue, setSelectedValue] = useState<string | undefined>();

    return (
        <RadioGroup
            className="docs-control-card-group-row"
            selectedValue={selectedValue}
            onChange={event => setSelectedValue(event.currentTarget.value)}
        >
            <RadioCard label="Soup" value="soup" />
            <RadioCard label="Salad" value="salad" />
            <RadioCard label="Sandwich" value="sandwich" />
        </RadioGroup>
    );
}
