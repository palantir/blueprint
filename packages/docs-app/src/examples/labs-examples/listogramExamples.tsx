/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { CodeExample, type ExampleProps } from "@blueprintjs/docs-theme";

import ListogramBasic from "./listogram/ListogramBasic";
import listogramBasicPreview from "./listogram/ListogramBasic.tsx.preview?raw";
import listogramBasicCode from "./listogram/ListogramBasic.tsx?raw";
import ListogramCountTotal from "./listogram/ListogramCountTotal";
import listogramCountTotalPreview from "./listogram/ListogramCountTotal.tsx.preview?raw";
import listogramCountTotalCode from "./listogram/ListogramCountTotal.tsx?raw";
import ListogramDisabledItems from "./listogram/ListogramDisabledItems";
import listogramDisabledItemsPreview from "./listogram/ListogramDisabledItems.tsx.preview?raw";
import listogramDisabledItemsCode from "./listogram/ListogramDisabledItems.tsx?raw";
import ListogramPopover from "./listogram/ListogramPopover";
import listogramPopoverPreview from "./listogram/ListogramPopover.tsx.preview?raw";
import listogramPopoverCode from "./listogram/ListogramPopover.tsx?raw";
import ListogramSelectionIntent from "./listogram/ListogramSelectionIntent";
import listogramSelectionIntentPreview from "./listogram/ListogramSelectionIntent.tsx.preview?raw";
import listogramSelectionIntentCode from "./listogram/ListogramSelectionIntent.tsx?raw";
import ListogramSelectionMultiple from "./listogram/ListogramSelectionMultiple";
import listogramSelectionMultiplePreview from "./listogram/ListogramSelectionMultiple.tsx.preview?raw";
import listogramSelectionMultipleCode from "./listogram/ListogramSelectionMultiple.tsx?raw";
import ListogramSelectionSingle from "./listogram/ListogramSelectionSingle";
import listogramSelectionSinglePreview from "./listogram/ListogramSelectionSingle.tsx.preview?raw";
import listogramSelectionSingleCode from "./listogram/ListogramSelectionSingle.tsx?raw";
import ListogramSelectionToggle from "./listogram/ListogramSelectionToggle";
import listogramSelectionTogglePreview from "./listogram/ListogramSelectionToggle.tsx.preview?raw";
import listogramSelectionToggleCode from "./listogram/ListogramSelectionToggle.tsx?raw";
import ListogramSelectionToggleBackground from "./listogram/ListogramSelectionToggleBackground";
import listogramSelectionToggleBackgroundPreview from "./listogram/ListogramSelectionToggleBackground.tsx.preview?raw";
import listogramSelectionToggleBackgroundCode from "./listogram/ListogramSelectionToggleBackground.tsx?raw";
import ListogramSelectionToggleCheckbox from "./listogram/ListogramSelectionToggleCheckbox";
import listogramSelectionToggleCheckboxPreview from "./listogram/ListogramSelectionToggleCheckbox.tsx.preview?raw";
import listogramSelectionToggleCheckboxCode from "./listogram/ListogramSelectionToggleCheckbox.tsx?raw";
import ListogramSelectionToggleRadio from "./listogram/ListogramSelectionToggleRadio";
import listogramSelectionToggleRadioPreview from "./listogram/ListogramSelectionToggleRadio.tsx.preview?raw";
import listogramSelectionToggleRadioCode from "./listogram/ListogramSelectionToggleRadio.tsx?raw";
import ListogramShowBars from "./listogram/ListogramShowBars";
import listogramShowBarsPreview from "./listogram/ListogramShowBars.tsx.preview?raw";
import listogramShowBarsCode from "./listogram/ListogramShowBars.tsx?raw";
import ListogramSorting from "./listogram/ListogramSorting";
import listogramSortingPreview from "./listogram/ListogramSorting.tsx.preview?raw";
import listogramSortingCode from "./listogram/ListogramSorting.tsx?raw";
import ListogramValueFormatter from "./listogram/ListogramValueFormatter";
import listogramValueFormatterPreview from "./listogram/ListogramValueFormatter.tsx.preview?raw";
import listogramValueFormatterCode from "./listogram/ListogramValueFormatter.tsx?raw";
import ListogramVisibleItemLimit from "./listogram/ListogramVisibleItemLimit";
import listogramVisibleItemLimitPreview from "./listogram/ListogramVisibleItemLimit.tsx.preview?raw";
import listogramVisibleItemLimitCode from "./listogram/ListogramVisibleItemLimit.tsx?raw";

export const ListogramBasicExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample previewCode={listogramBasicPreview} sourceCode={listogramBasicCode} {...props}>
            <ListogramBasic />
        </CodeExample>
    );
};

export const ListogramCountTotalExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={listogramCountTotalPreview}
            sourceCode={listogramCountTotalCode}
            {...props}
        >
            <ListogramCountTotal />
        </CodeExample>
    );
};

export const ListogramDisabledItemsExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={listogramDisabledItemsPreview}
            sourceCode={listogramDisabledItemsCode}
            {...props}
        >
            <ListogramDisabledItems />
        </CodeExample>
    );
};

export const ListogramPopoverExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={listogramPopoverPreview}
            sourceCode={listogramPopoverCode}
            {...props}
        >
            <ListogramPopover />
        </CodeExample>
    );
};

export const ListogramSelectionIntentExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={listogramSelectionIntentPreview}
            sourceCode={listogramSelectionIntentCode}
            {...props}
        >
            <ListogramSelectionIntent />
        </CodeExample>
    );
};

export const ListogramSelectionMultipleExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={listogramSelectionMultiplePreview}
            sourceCode={listogramSelectionMultipleCode}
            {...props}
        >
            <ListogramSelectionMultiple />
        </CodeExample>
    );
};

export const ListogramSelectionSingleExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={listogramSelectionSinglePreview}
            sourceCode={listogramSelectionSingleCode}
            {...props}
        >
            <ListogramSelectionSingle />
        </CodeExample>
    );
};

export const ListogramSelectionToggleExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={listogramSelectionTogglePreview}
            sourceCode={listogramSelectionToggleCode}
            {...props}
        >
            <ListogramSelectionToggle />
        </CodeExample>
    );
};

export const ListogramSelectionToggleBackgroundExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={listogramSelectionToggleBackgroundPreview}
            sourceCode={listogramSelectionToggleBackgroundCode}
            {...props}
        >
            <ListogramSelectionToggleBackground />
        </CodeExample>
    );
};

export const ListogramSelectionToggleCheckboxExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={listogramSelectionToggleCheckboxPreview}
            sourceCode={listogramSelectionToggleCheckboxCode}
            {...props}
        >
            <ListogramSelectionToggleCheckbox />
        </CodeExample>
    );
};

export const ListogramSelectionToggleRadioExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={listogramSelectionToggleRadioPreview}
            sourceCode={listogramSelectionToggleRadioCode}
            {...props}
        >
            <ListogramSelectionToggleRadio />
        </CodeExample>
    );
};

export const ListogramShowBarsExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={listogramShowBarsPreview}
            sourceCode={listogramShowBarsCode}
            {...props}
        >
            <ListogramShowBars />
        </CodeExample>
    );
};

export const ListogramSortingExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={listogramSortingPreview}
            sourceCode={listogramSortingCode}
            {...props}
        >
            <ListogramSorting />
        </CodeExample>
    );
};

export const ListogramValueFormatterExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={listogramValueFormatterPreview}
            sourceCode={listogramValueFormatterCode}
            {...props}
        >
            <ListogramValueFormatter />
        </CodeExample>
    );
};

export const ListogramVisibleItemLimitExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={listogramVisibleItemLimitPreview}
            sourceCode={listogramVisibleItemLimitCode}
            {...props}
        >
            <ListogramVisibleItemLimit />
        </CodeExample>
    );
};
