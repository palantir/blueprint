import { CheckboxCard } from "@blueprintjs/core";

export default function CheckboxCardBasic() {
    return (
        <div className="docs-control-card-group-row">
            <CheckboxCard>Soup</CheckboxCard>
            <CheckboxCard>Salad</CheckboxCard>
            <CheckboxCard>Sandwich</CheckboxCard>
        </div>
    );
}
