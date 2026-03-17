import { Tag } from "@blueprintjs/core";

export default function TagBasic() {
    return (
        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
            <Tag>Design</Tag>
            <Tag>Engineering</Tag>
            <Tag>Research</Tag>
        </div>
    );
}
