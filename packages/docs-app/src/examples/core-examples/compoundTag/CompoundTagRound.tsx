import { CompoundTag } from "@blueprintjs/core";

export default function CompoundTagRound() {
    return (
        <div className="group">
            <CompoundTag leftContent="City" round={true}>
                London
            </CompoundTag>
            <CompoundTag leftContent="City" round={true} intent="success">
                New York
            </CompoundTag>
        </div>
    );
}
