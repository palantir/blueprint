import { CheckboxCard } from "@blueprintjs/core";

export default function CheckboxCardAlignIndicator() {
    return (
        <div className="docs-control-card-group-row">
            <CheckboxCard alignIndicator="start">Start-aligned</CheckboxCard>
            <CheckboxCard alignIndicator="end">End-aligned</CheckboxCard>
        </div>
    );
}
