import { CompoundTag } from "@blueprintjs/core";

export default function CompoundTagMinimal() {
    return (
        <div className="group">
            <CompoundTag leftContent="Env" minimal={true}>
                Production
            </CompoundTag>
            <CompoundTag leftContent="Env" minimal={true} intent="primary">
                Staging
            </CompoundTag>
        </div>
    );
}
