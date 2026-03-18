import { CompoundTag } from "@blueprintjs/core";

export default function CompoundTagIntent() {
    return (
        <div className="group">
            <CompoundTag leftContent="Status" intent="primary">
                Active
            </CompoundTag>
            <CompoundTag leftContent="Status" intent="success">
                Healthy
            </CompoundTag>
            <CompoundTag leftContent="Status" intent="warning">
                Degraded
            </CompoundTag>
            <CompoundTag leftContent="Status" intent="danger">
                Down
            </CompoundTag>
        </div>
    );
}
