/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

import { CodeExample, type ExampleProps } from "@blueprintjs/docs-theme";

import EntityTitleBasic from "./entityTitle/EntityTitleBasic";
import entityTitleBasicPreview from "./entityTitle/EntityTitleBasic.tsx.preview?raw";
import entityTitleBasicCode from "./entityTitle/EntityTitleBasic.tsx?raw";
import EntityTitleFill from "./entityTitle/EntityTitleFill";
import entityTitleFillPreview from "./entityTitle/EntityTitleFill.tsx.preview?raw";
import entityTitleFillCode from "./entityTitle/EntityTitleFill.tsx?raw";
import EntityTitleLoading from "./entityTitle/EntityTitleLoading";
import entityTitleLoadingPreview from "./entityTitle/EntityTitleLoading.tsx.preview?raw";
import entityTitleLoadingCode from "./entityTitle/EntityTitleLoading.tsx?raw";
import EntityTitleSubtitle from "./entityTitle/EntityTitleSubtitle";
import entityTitleSubtitlePreview from "./entityTitle/EntityTitleSubtitle.tsx.preview?raw";
import entityTitleSubtitleCode from "./entityTitle/EntityTitleSubtitle.tsx?raw";
import EntityTitleTags from "./entityTitle/EntityTitleTags";
import entityTitleTagsPreview from "./entityTitle/EntityTitleTags.tsx.preview?raw";
import entityTitleTagsCode from "./entityTitle/EntityTitleTags.tsx?raw";
import EntityTitleTitleUrl from "./entityTitle/EntityTitleTitleUrl";
import entityTitleTitleUrlPreview from "./entityTitle/EntityTitleTitleUrl.tsx.preview?raw";
import entityTitleTitleUrlCode from "./entityTitle/EntityTitleTitleUrl.tsx?raw";

export const EntityTitleBasicExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={entityTitleBasicPreview}
            sourceCode={entityTitleBasicCode}
            {...props}
        >
            <EntityTitleBasic />
        </CodeExample>
    );
};

export const EntityTitleTitleUrlExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={entityTitleTitleUrlPreview}
            sourceCode={entityTitleTitleUrlCode}
            {...props}
        >
            <EntityTitleTitleUrl />
        </CodeExample>
    );
};

export const EntityTitleLoadingExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={entityTitleLoadingPreview}
            sourceCode={entityTitleLoadingCode}
            {...props}
        >
            <EntityTitleLoading />
        </CodeExample>
    );
};

export const EntityTitleFillExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={entityTitleFillPreview}
            sourceCode={entityTitleFillCode}
            {...props}
        >
            <EntityTitleFill />
        </CodeExample>
    );
};

export const EntityTitleSubtitleExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={entityTitleSubtitlePreview}
            sourceCode={entityTitleSubtitleCode}
            {...props}
        >
            <EntityTitleSubtitle />
        </CodeExample>
    );
};

export const EntityTitleTagsExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={entityTitleTagsPreview}
            sourceCode={entityTitleTagsCode}
            {...props}
        >
            <EntityTitleTags />
        </CodeExample>
    );
};
