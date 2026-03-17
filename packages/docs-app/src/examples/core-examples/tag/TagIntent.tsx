import { Tag } from "@blueprintjs/core";

export default function TagIntent() {
    return (
        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
            <Tag>None</Tag>
            <Tag intent="primary">Primary</Tag>
            <Tag intent="success">Success</Tag>
            <Tag intent="warning">Warning</Tag>
            <Tag intent="danger">Danger</Tag>
        </div>
    );
}
