/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { Intent } from "../../src/common/intent";
import * as React from "react";

const INTENTS = ["Primary", "Success", "Warning", "Danger"].map((label) => (
    { label, value: (Intent as any)[label.toUpperCase()] }
));
INTENTS.unshift({ label: "None", value: "-1" });

export interface IIntentSelectProps {
    intent: Intent;
    onChange: React.FormEventHandler<HTMLSelectElement>;
}

export const IntentSelect: React.SFC<IIntentSelectProps> = (props) => (
    <label className="pt-label">
        Intent
        <div className="pt-select">
            <select value={Intent[props.intent]} onChange={props.onChange}>
                {INTENTS.map((opt, i) => <option key={i} value={opt.value}>{opt.label}</option>)}
            </select>
        </div>
    </label>
);
