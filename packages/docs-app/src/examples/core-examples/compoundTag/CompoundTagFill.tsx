import { CompoundTag } from "@blueprintjs/core";

export default function CompoundTagFill() {
    return (
        <div style={{ width: "100%" }}>
            <CompoundTag leftContent="Region" fill={true}>
                US East (N. Virginia)
            </CompoundTag>
        </div>
    );
}
