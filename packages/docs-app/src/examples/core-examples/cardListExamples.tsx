/* !
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

import { CodeExample, type ExampleProps } from "@blueprintjs/docs-theme";

import CardListBasic from "./card-list/CardListBasic";
import cardListBasicPreview from "./card-list/CardListBasic.tsx.preview?raw";
import cardListBasicCode from "./card-list/CardListBasic.tsx?raw";
import CardListBordered from "./card-list/CardListBordered";
import cardListBorderedPreview from "./card-list/CardListBordered.tsx.preview?raw";
import cardListBorderedCode from "./card-list/CardListBordered.tsx?raw";
import CardListCompact from "./card-list/CardListCompact";
import cardListCompactPreview from "./card-list/CardListCompact.tsx.preview?raw";
import cardListCompactCode from "./card-list/CardListCompact.tsx?raw";
import CardListSection from "./card-list/CardListSection";
import cardListSectionPreview from "./card-list/CardListSection.tsx.preview?raw";
import cardListSectionCode from "./card-list/CardListSection.tsx?raw";

export const CardListBasicExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample previewCode={cardListBasicPreview} sourceCode={cardListBasicCode} {...props}>
            <CardListBasic />
        </CodeExample>
    );
};

export const CardListBorderedExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={cardListBorderedPreview}
            sourceCode={cardListBorderedCode}
            {...props}
        >
            <CardListBordered />
        </CodeExample>
    );
};

export const CardListCompactExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={cardListCompactPreview}
            sourceCode={cardListCompactCode}
            {...props}
        >
            <CardListCompact />
        </CodeExample>
    );
};

export const CardListSectionExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={cardListSectionPreview}
            sourceCode={cardListSectionCode}
            {...props}
        >
            <CardListSection />
        </CodeExample>
    );
};
