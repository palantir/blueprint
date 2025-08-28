import { Button } from "@blueprintjs/core";

export default function ButtonVariant() {
    return (
        <div className="group">
            <Button>Default</Button>
            <Button variant="minimal">Minimal</Button>
            <Button variant="outlined">Outlined</Button>
        </div>
    );
}
