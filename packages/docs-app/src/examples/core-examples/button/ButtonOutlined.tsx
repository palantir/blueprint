import { Button } from "@blueprintjs/core";

export default function ButtonOutlined() {
    return (
        <div className="group">
            <Button text="Outlined" outlined={true} />
            <Button text="Primary" outlined={true} intent="primary" />
            <Button text="Disabled" outlined={true} disabled={true} />
        </div>
    );
}
