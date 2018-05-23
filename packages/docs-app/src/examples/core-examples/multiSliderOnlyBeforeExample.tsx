/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Intent, ISliderHandleProps } from "@blueprintjs/core";
import { AbstractMultiSliderExample } from "./multiSliderExample";

type ConcreteHandleProps = Pick<ISliderHandleProps, "trackIntentBefore">;

// tslint:disable:object-literal-sort-keys
export class MultiSliderOnlyBeforeExample extends AbstractMultiSliderExample {
    protected getDefaultTrackIntent() {
        const { intent, tail } = this.state;
        if (tail === "lower" || tail === "neither") {
            return Intent.SUCCESS;
        }
        if (intent === "warning") {
            return Intent.WARNING;
        }
        return Intent.DANGER;
    }

    protected getDangerStartHandleProps(): ConcreteHandleProps {
        return { trackIntentBefore: Intent.DANGER };
    }

    protected getWarningStartHandleProps(): ConcreteHandleProps {
        return { trackIntentBefore: Intent.WARNING };
    }

    protected getWarningEndHandleProps(): ConcreteHandleProps {
        return { trackIntentBefore: Intent.SUCCESS };
    }

    protected getDangerEndHandleProps(): ConcreteHandleProps {
        const { intent } = this.state;
        return { trackIntentBefore: intent === "danger" ? Intent.SUCCESS : Intent.WARNING };
    }
}
