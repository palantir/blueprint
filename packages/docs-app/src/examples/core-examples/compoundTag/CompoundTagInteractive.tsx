import { CompoundTag } from "@blueprintjs/core";

export default function CompoundTagInteractive() {
    return (
        <div className="group">
            <CompoundTag leftContent="Filter" interactive={true}>
                Region: US East
            </CompoundTag>
            <CompoundTag leftContent="Filter" interactive={true} intent="primary">
                Status: Active
            </CompoundTag>
        </div>
    );
}
