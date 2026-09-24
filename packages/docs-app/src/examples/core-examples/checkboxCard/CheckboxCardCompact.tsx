import { CheckboxCard } from "@blueprintjs/core";

export default function CheckboxCardCompact() {
    return (
        <div className="docs-control-card-group-row">
            <CheckboxCard compact={true}>Soup</CheckboxCard>
            <CheckboxCard compact={true}>Salad</CheckboxCard>
            <CheckboxCard compact={true}>Sandwich</CheckboxCard>
        </div>
    );
}
