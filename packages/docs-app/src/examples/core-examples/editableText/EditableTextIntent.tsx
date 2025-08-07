import { EditableText } from "@blueprintjs/core";

export default function EditableTextIntent() {
    return (
        <div className="stack">
            <EditableText intent="primary" placeholder="Primary text..." />
            <EditableText intent="success" placeholder="Success text..." />
            <EditableText intent="warning" placeholder="Warning text..." />
            <EditableText intent="danger" placeholder="Danger text..." />
        </div>
    );
}
