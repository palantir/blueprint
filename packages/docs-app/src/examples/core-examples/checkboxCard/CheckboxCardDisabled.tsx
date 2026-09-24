import { CheckboxCard } from "@blueprintjs/core";

export default function CheckboxCardDisabled() {
    return (
        <div className="docs-control-card-group-row">
            <CheckboxCard disabled={true}>Soup</CheckboxCard>
            <CheckboxCard disabled={true}>Salad</CheckboxCard>
            <CheckboxCard disabled={true}>Sandwich</CheckboxCard>
        </div>
    );
}
