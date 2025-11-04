import { Button } from "@blueprintjs/core";

export default function ButtonMinimal() {
    return (
        <div>
            <Button text="Minimal" minimal={true} />
            <Button text="Primary" minimal={true} intent="primary" />
            <Button text="Disabled" minimal={true} disabled={true} />
        </div>
    );
}
