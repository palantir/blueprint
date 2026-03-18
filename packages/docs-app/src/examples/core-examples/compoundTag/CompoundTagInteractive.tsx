import { CompoundTag } from "@blueprintjs/core";

export default function CompoundTagInteractive() {
    return (
        <div className="group">
            <CompoundTag leftContent="Filter" interactive={true}>
                Region
            </CompoundTag>
            <CompoundTag leftContent="Filter" interactive={true} intent="primary">
                Status
            </CompoundTag>
        </div>
    );
}
