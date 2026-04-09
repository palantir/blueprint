import { CompoundTag } from "@blueprintjs/core";

export default function CompoundTagSize() {
    return (
        <div className="group center">
            <CompoundTag leftContent="Size">Medium</CompoundTag>
            <CompoundTag leftContent="Size" size="large">
                Large
            </CompoundTag>
        </div>
    );
}
