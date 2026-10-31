import { SwitchCard } from "@blueprintjs/core";

export default function SwitchCardAlignIndicator() {
    return (
        <div className="docs-control-card-group-row">
            <SwitchCard alignIndicator="start">Start-aligned</SwitchCard>
            <SwitchCard alignIndicator="end">End-aligned</SwitchCard>
        </div>
    );
}
