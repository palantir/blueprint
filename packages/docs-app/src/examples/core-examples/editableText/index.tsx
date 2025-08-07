/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { buildConfig, createBasePath, createExamples } from "../../../utils/exampleUtils";

import EditableTextBasic from "./EditableTextBasic";
import editableTextBasicPreview from "./EditableTextBasic.tsx.preview?raw";
import editableTextBasicCode from "./EditableTextBasic.tsx?raw";
import EditableTextIntent from "./EditableTextIntent";
import editableTextIntentPreview from "./EditableTextIntent.tsx.preview?raw";
import editableTextIntentCode from "./EditableTextIntent.tsx?raw";
import EditableTextMultiline from "./EditableTextMultiline";
import editableTextMultilinePreview from "./EditableTextMultiline.tsx.preview?raw";
import editableTextMultilineCode from "./EditableTextMultiline.tsx?raw";
import EditableTextSelect from "./EditableTextSelect";
import editableTextSelectPreview from "./EditableTextSelect.tsx.preview?raw";
import editableTextSelectCode from "./EditableTextSelect.tsx?raw";

const BASE_PATH = createBasePath(import.meta.url);

export const {
    EditableTextBasicExample,
    EditableTextIntentExample,
    EditableTextMultilineExample,
    EditableTextSelectExample,
} = createExamples({
    EditableTextBasic: buildConfig(
        EditableTextBasic,
        editableTextBasicPreview,
        editableTextBasicCode,
        BASE_PATH,
    ),
    EditableTextIntent: buildConfig(
        EditableTextIntent,
        editableTextIntentPreview,
        editableTextIntentCode,
        BASE_PATH,
    ),
    EditableTextMultiline: buildConfig(
        EditableTextMultiline,
        editableTextMultilinePreview,
        editableTextMultilineCode,
        BASE_PATH,
    ),
    EditableTextSelect: buildConfig(
        EditableTextSelect,
        editableTextSelectPreview,
        editableTextSelectCode,
        BASE_PATH,
    ),
});
