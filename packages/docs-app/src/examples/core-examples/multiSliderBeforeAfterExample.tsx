/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Intent } from "@blueprintjs/core";
import { AbstractMultiSliderExample, ConcreteHandleProps } from "./abstractMultiSliderExample";

// tslint:disable:object-literal-sort-keys
export class MultiSliderBeforeAfterExample extends AbstractMultiSliderExample {
    protected getDefaultTrackIntent() {
        return Intent.SUCCESS;
    }

    protected getDangerStartHandleProps(): ConcreteHandleProps {
        return { trackIntentBefore: Intent.DANGER };
    }

    protected getWarningStartHandleProps(): ConcreteHandleProps {
        return { trackIntentBefore: Intent.WARNING };
    }

    protected getWarningEndHandleProps(): ConcreteHandleProps {
        return { trackIntentAfter: Intent.WARNING };
    }

    protected getDangerEndHandleProps(): ConcreteHandleProps {
        return { trackIntentAfter: Intent.DANGER };
    }
}
