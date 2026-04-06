import { EditableText } from "@blueprintjs/core";

export default function EditableTextDisabled() {
    return <EditableText disabled={true} defaultValue="This text cannot be edited" />;
}
