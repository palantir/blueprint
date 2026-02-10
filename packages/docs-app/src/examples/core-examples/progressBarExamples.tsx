/* !
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

import { CodeExample, type ExampleProps } from "@blueprintjs/docs-theme";

import ProgressBarAnimate from "./progressBar/ProgressBarAnimate";
import progressBarAnimatePreview from "./progressBar/ProgressBarAnimate.tsx.preview?raw";
import progressBarAnimateCode from "./progressBar/ProgressBarAnimate.tsx?raw";
import ProgressBarBasic from "./progressBar/ProgressBarBasic";
import progressBarBasicPreview from "./progressBar/ProgressBarBasic.tsx.preview?raw";
import progressBarBasicCode from "./progressBar/ProgressBarBasic.tsx?raw";
import ProgressBarIntent from "./progressBar/ProgressBarIntent";
import progressBarIntentPreview from "./progressBar/ProgressBarIntent.tsx.preview?raw";
import progressBarIntentCode from "./progressBar/ProgressBarIntent.tsx?raw";
import ProgressBarStripes from "./progressBar/ProgressBarStripes";
import progressBarStripesPreview from "./progressBar/ProgressBarStripes.tsx.preview?raw";
import progressBarStripesCode from "./progressBar/ProgressBarStripes.tsx?raw";
import ProgressBarValue from "./progressBar/ProgressBarValue";
import progressBarValuePreview from "./progressBar/ProgressBarValue.tsx.preview?raw";
import progressBarValueCode from "./progressBar/ProgressBarValue.tsx?raw";

export const ProgressBarBasicExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={progressBarBasicPreview}
            sourceCode={progressBarBasicCode}
            {...props}
        >
            <ProgressBarBasic />
        </CodeExample>
    );
};

export const ProgressBarValueExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={progressBarValuePreview}
            sourceCode={progressBarValueCode}
            {...props}
        >
            <ProgressBarValue />
        </CodeExample>
    );
};

export const ProgressBarIntentExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={progressBarIntentPreview}
            sourceCode={progressBarIntentCode}
            {...props}
        >
            <ProgressBarIntent />
        </CodeExample>
    );
};

export const ProgressBarStripesExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={progressBarStripesPreview}
            sourceCode={progressBarStripesCode}
            {...props}
        >
            <ProgressBarStripes />
        </CodeExample>
    );
};

export const ProgressBarAnimateExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={progressBarAnimatePreview}
            sourceCode={progressBarAnimateCode}
            {...props}
        >
            <ProgressBarAnimate />
        </CodeExample>
    );
};
