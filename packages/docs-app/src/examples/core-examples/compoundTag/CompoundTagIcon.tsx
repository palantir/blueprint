import { CompoundTag } from "@blueprintjs/core";

export default function CompoundTagIcon() {
    return (
        <div className="group">
            <CompoundTag leftContent="City" icon="globe">
                London
            </CompoundTag>
            <CompoundTag leftContent="City" endIcon="map-marker">
                Seattle
            </CompoundTag>
            <CompoundTag leftContent="City" icon="globe" endIcon="map-marker">
                New York
            </CompoundTag>
        </div>
    );
}
