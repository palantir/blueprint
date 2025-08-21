import { Card } from "@blueprintjs/core";

export default function CardCompact() {
    return (
        <div className="stack">
            <Card>This card has default padding.</Card>
            <Card compact={true}>This card is more compact.</Card>
        </div>
    );
}
