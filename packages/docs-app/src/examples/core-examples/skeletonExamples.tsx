/* !
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

import { CodeExample, type ExampleProps } from "@blueprintjs/docs-theme";

import SkeletonBasic from "./skeleton/SkeletonBasic";
import skeletonBasicPreview from "./skeleton/SkeletonBasic.tsx.preview?raw";
import skeletonBasicCode from "./skeleton/SkeletonBasic.tsx?raw";
import SkeletonCard from "./skeleton/SkeletonCard";
import skeletonCardPreview from "./skeleton/SkeletonCard.tsx.preview?raw";
import skeletonCardCode from "./skeleton/SkeletonCard.tsx?raw";
import SkeletonDisabled from "./skeleton/SkeletonDisabled";
import skeletonDisabledPreview from "./skeleton/SkeletonDisabled.tsx.preview?raw";
import skeletonDisabledCode from "./skeleton/SkeletonDisabled.tsx?raw";
import SkeletonText from "./skeleton/SkeletonText";
import skeletonTextPreview from "./skeleton/SkeletonText.tsx.preview?raw";
import skeletonTextCode from "./skeleton/SkeletonText.tsx?raw";

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

export const SkeletonCardExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample previewCode={skeletonCardPreview} sourceCode={skeletonCardCode} {...props}>
            <SkeletonCard />
        </CodeExample>
    );
};

export const SkeletonDisabledExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample previewCode={skeletonDisabledPreview} sourceCode={skeletonDisabledCode} {...props}>
            <SkeletonDisabled />
        </CodeExample>
    );
};
