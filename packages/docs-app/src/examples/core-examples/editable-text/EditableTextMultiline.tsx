import { EditableText } from "@blueprintjs/core";

export default function EditableTextMultiline() {
    return (
        <EditableText
            multiline={true}
            minLines={3}
            maxLines={5}
            placeholder="Click to edit multiple lines..."
        />
    );
}
