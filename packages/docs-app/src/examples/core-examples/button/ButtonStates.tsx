import { Button } from "@blueprintjs/core";

export default function ButtonStates() {
    return (
        <div className="group">
            <Button>Default</Button>
            <Button active={true}>Active</Button>
            <Button disabled={true}>Disabled</Button>
            <Button loading={true}>Loading...</Button>
        </div>
    );
}
