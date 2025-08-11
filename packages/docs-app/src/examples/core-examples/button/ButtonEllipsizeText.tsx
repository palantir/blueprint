import { Button } from "@blueprintjs/core";

export default function ButtonEllipsizeText() {
    return (
        <div style={{ display: "flex", maxWidth: 300 }}>
            <Button ellipsizeText={true}>
                This is a very long button label that will be truncated
            </Button>
        </div>
    );
}
