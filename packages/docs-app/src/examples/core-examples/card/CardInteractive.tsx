import { Card } from "@blueprintjs/core";

export default function CardInteractive() {
    return (
        <div className="stack">
            <Card interactive={true} onClick={() => console.log("clicked card")}>
                This card is interactive. Hover and click it.
            </Card>
            <Card interactive={true} selected={true}>
                This card is selected.
            </Card>
        </div>
    );
}
