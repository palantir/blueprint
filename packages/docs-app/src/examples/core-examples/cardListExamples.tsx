/* !
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

import { CodeExample, type ExampleProps } from "@blueprintjs/docs-theme";

import CardListBasic from "./card-list/CardListBasic";
import cardListBasicPreview from "./card-list/CardListBasic.tsx.preview?raw";
import CardListBordered from "./card-list/CardListBordered";
import cardListBorderedPreview from "./card-list/CardListBordered.tsx.preview?raw";
import CardListCompact from "./card-list/CardListCompact";
import cardListCompactPreview from "./card-list/CardListCompact.tsx.preview?raw";
import CardListSection from "./card-list/CardListSection";
import cardListSectionPreview from "./card-list/CardListSection.tsx.preview?raw";

export const CardListBasicExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample code={cardListBasicPreview} {...props}>
            <CardListBasic />
        </CodeExample>
    );
};

export const CardListBorderedExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample code={cardListBorderedPreview} {...props}>
            <CardListBordered />
        </CodeExample>
    );
};

export const CardListCompactExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample code={cardListCompactPreview} {...props}>
            <CardListCompact />
        </CodeExample>
    );
};

export const CardListSectionExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample code={cardListSectionPreview} {...props}>
            <CardListSection />
        </CodeExample>
    );
};
