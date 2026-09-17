import { KeyComboTag } from "@blueprintjs/core";

export default function KeyComboTagModifiers() {
    return (
        <div className="group">
            <KeyComboTag combo="cmd" />
            <KeyComboTag combo="ctrl" />
            <KeyComboTag combo="shift" />
            <KeyComboTag combo="alt" />
            <KeyComboTag combo="mod + s" />
        </div>
    );
}
