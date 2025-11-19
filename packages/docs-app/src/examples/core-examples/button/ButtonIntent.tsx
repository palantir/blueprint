import { Button } from "@blueprintjs/core";

export default function ButtonIntent() {
    return (
        <div className="group">
            <Button intent="primary">Primary</Button>
            <Button intent="success">Success</Button>
            <Button intent="warning">Warning</Button>
            <Button intent="danger">Danger</Button>
        </div>
    );
}
