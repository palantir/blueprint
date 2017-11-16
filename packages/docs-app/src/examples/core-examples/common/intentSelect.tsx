/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Classes, Intent } from "@blueprintjs/core";
import * as React from "react";

const INTENTS = [
    { label: "None", value: Intent.NONE },
    { label: "Primary", value: Intent.PRIMARY },
    { label: "Success", value: Intent.SUCCESS },
    { label: "Warning", value: Intent.WARNING },
    { label: "Danger", value: Intent.DANGER },
];

export interface IIntentSelectProps {
    intent: Intent;
    onChange: React.FormEventHandler<HTMLSelectElement>;
}

export const IntentSelect: React.SFC<IIntentSelectProps> = props => (
    <label className={Classes.LABEL}>
        Intent
        <div className={Classes.SELECT}>
            <select value={props.intent} onChange={props.onChange}>
                {INTENTS.map((opt, i) => (
                    <option key={i} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    </label>
);
