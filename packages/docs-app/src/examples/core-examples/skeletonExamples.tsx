/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { CodeExample, type ExampleProps } from "@blueprintjs/docs-theme";

import SkeletonBasic from "./skeleton/SkeletonBasic";
import skeletonBasicPreview from "./skeleton/SkeletonBasic.tsx.preview?raw";
import skeletonBasicCode from "./skeleton/SkeletonBasic.tsx?raw";
import SkeletonInteractive from "./skeleton/SkeletonInteractive";
import skeletonInteractivePreview from "./skeleton/SkeletonInteractive.tsx.preview?raw";
import skeletonInteractiveCode from "./skeleton/SkeletonInteractive.tsx?raw";
import SkeletonText from "./skeleton/SkeletonText";
import skeletonTextPreview from "./skeleton/SkeletonText.tsx.preview?raw";
import skeletonTextCode from "./skeleton/SkeletonText.tsx?raw";
import SkeletonWithCard from "./skeleton/SkeletonWithCard";
import skeletonWithCardPreview from "./skeleton/SkeletonWithCard.tsx.preview?raw";
import skeletonWithCardCode from "./skeleton/SkeletonWithCard.tsx?raw";

export const SkeletonBasicExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample previewCode={skeletonBasicPreview} sourceCode={skeletonBasicCode} {...props}>
            <SkeletonBasic />
        </CodeExample>
    );
};

export const SkeletonTextExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample previewCode={skeletonTextPreview} sourceCode={skeletonTextCode} {...props}>
            <SkeletonText />
        </CodeExample>
    );
};

export const SkeletonInteractiveExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={skeletonInteractivePreview}
            sourceCode={skeletonInteractiveCode}
            {...props}
        >
            <SkeletonInteractive />
        </CodeExample>
    );
};

export const SkeletonWithCardExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={skeletonWithCardPreview}
            sourceCode={skeletonWithCardCode}
            {...props}
        >
            <SkeletonWithCard />
        </CodeExample>
    );
};
